import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/auth";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "../forms";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCustomer()) redirect(next ?? "/account");
  return (
    <AuthShell title="Welcome back" subtitle="Log in with your email or mobile number.">
      <LoginForm next={next} />
    </AuthShell>
  );
}
