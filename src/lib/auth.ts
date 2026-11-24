import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { db, last10 } from "./db";

// Email/phone + password accounts stored in D1.
// Passwords: PBKDF2-SHA256, 100k iterations (the maximum Cloudflare Workers allows), random 16 byte salt.
// Sessions: random 32 byte token in an httpOnly cookie, only its SHA-256 hash is stored.

export type Customer = { id: string; name: string; email: string; phone: string; city: string | null; address: string | null; created_at: string };

const COOKIE = "cw_session";
const SESSION_DAYS = 30;
const ITERATIONS = 100_000;

const enc = new TextEncoder();
const toHex = (b: ArrayBuffer | Uint8Array) =>
  Array.from(b instanceof Uint8Array ? b : new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => new Uint8Array((h.match(/.{2}/g) ?? []).map((x) => parseInt(x, 16)));

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256);
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return ["pbkdf2", ITERATIONS, toHex(salt), toHex(await pbkdf2(password, salt, ITERATIONS))].join(":");
}

export async function verifyPassword(password: string, stored: string) {
  const [, iter, salt, hash] = stored.split(":");
  const actual = new Uint8Array(await pbkdf2(password, fromHex(salt), Number(iter)));
  const expected = fromHex(hash);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}

async function sha256(s: string) {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}

export async function createSession(customerId: string) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await (await db())
    .prepare(`INSERT INTO sessions (token_hash, customer_id, expires_at, created_at) VALUES (?, ?, ?, ?)`)
    .bind(await sha256(token), customerId, expires.toISOString(), new Date().toISOString())
    .run();
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await (await db()).prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(await sha256(token)).run();
  jar.delete(COOKIE);
}

export const getCustomer = cache(async (): Promise<Customer | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return (await db())
    .prepare(
      `SELECT c.id, c.name, c.email, c.phone, c.city, c.address, c.created_at FROM sessions s
       JOIN customers c ON c.id = s.customer_id WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(await sha256(token), new Date().toISOString())
    .first<Customer>();
});

export async function findCustomerForLogin(login: string) {
  const isEmail = login.includes("@");
  return (await db())
    .prepare(`SELECT id, password_hash FROM customers WHERE ${isEmail ? "email = ?" : "phone_last10 = ?"} LIMIT 1`)
    .bind(isEmail ? login.trim().toLowerCase() : last10(login))
    .first<{ id: string; password_hash: string }>();
}

// Max 8 failed attempts per email/phone in 15 minutes.
export async function tooManyAttempts(key: string) {
  const since = new Date(Date.now() - 15 * 60_000).toISOString();
  const row = await (await db())
    .prepare(`SELECT COUNT(*) AS n FROM login_attempts WHERE key = ? AND at > ?`)
    .bind(key, since)
    .first<{ n: number }>();
  return (row?.n ?? 0) >= 8;
}

export async function recordFailedAttempt(key: string) {
  const d = await db();
  await d.batch([
    d.prepare(`INSERT INTO login_attempts (key, at) VALUES (?, ?)`).bind(key, new Date().toISOString()),
    d.prepare(`DELETE FROM login_attempts WHERE at < ?`).bind(new Date(Date.now() - 86400_000).toISOString()),
  ]);
}
