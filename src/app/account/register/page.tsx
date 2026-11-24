import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/auth";
import { AuthShell } from "../auth-shell";
import { RegisterForm } from "../forms";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCustomer()) redirect(next ?? "/account");
  return (
    <AuthShell title="Create your account" subtitle="Takes 30 seconds. Your past orders with the same mobile number are added automatically.">
      <RegisterForm next={next} />
    </AuthShell>
  );
}
