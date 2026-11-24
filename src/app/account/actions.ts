"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSession, destroySession, findCustomerForLogin, getCustomer, hashPassword,
  recordFailedAttempt, tooManyAttempts, verifyPassword,
} from "@/lib/auth";
import { db, last10 } from "@/lib/db";
import { loginSchema, profileSchema, registerSchema } from "@/lib/validation";

export type FormState = { error?: string; fields?: Record<string, string[] | undefined>; ok?: string; values?: Record<string, string> } | undefined;

// Echo back what the user typed (never the password) so the form keeps it after an error.
const keep = (form: FormData) => Object.fromEntries([...form.entries()].filter(([k, v]) => k !== "password" && typeof v === "string")) as Record<string, string>;

// Only allow redirects back into this site.
const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/account";
};

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors, values: keep(form) };
  const { name, email, phone, password } = parsed.data;
  const d = await db();

  const exists = await d.prepare(`SELECT 1 FROM customers WHERE email = ? OR phone_last10 = ?`).bind(email, last10(phone)).first();
  if (exists) return { error: "An account with this email or mobile number already exists. Try logging in.", values: keep(form) };

  const id = "cus_" + crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  await d
    .prepare(`INSERT INTO customers (id, name, email, phone, phone_last10, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, name, email, phone, last10(phone), await hashPassword(password), new Date().toISOString())
    .run();

  // Link earlier guest orders placed with the same mobile number.
  await d.prepare(`UPDATE orders SET customer_id = ? WHERE customer_id IS NULL AND phone_last10 = ?`).bind(id, last10(phone)).run();

  await createSession(id);
  redirect(safeNext(form.get("next")));
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors, values: keep(form) };
  const { login: who, password } = parsed.data;
  const key = who.toLowerCase();

  if (await tooManyAttempts(key)) return { error: "Too many attempts. Please wait 15 minutes and try again.", values: keep(form) };

  const customer = await findCustomerForLogin(who);
  if (!customer || !(await verifyPassword(password, customer.password_hash))) {
    await recordFailedAttempt(key);
    return { error: "Wrong email/mobile or password.", values: keep(form) };
  }
  await createSession(customer.id);
  redirect(safeNext(form.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const me = await getCustomer();
  if (!me) redirect("/account/login");
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors, values: keep(form) };
  const { name, phone, city, address } = parsed.data;
  await (await db())
    .prepare(`UPDATE customers SET name = ?, phone = ?, phone_last10 = ?, city = ?, address = ? WHERE id = ?`)
    .bind(name, phone, last10(phone), city || null, address || null, me.id)
    .run();
  revalidatePath("/account");
  return { ok: "Saved." };
}
