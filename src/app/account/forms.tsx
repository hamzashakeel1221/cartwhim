"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { pakistanCities } from "@/lib/store-config";
import { login, register, updateProfile, type FormState } from "./actions";

function FieldError({ state, name }: { state: FormState; name: string }) {
  const msg = state?.fields?.[name]?.[0];
  return msg ? <p className="mt-1 text-xs font-medium text-red-600">{msg}</p> : null;
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button disabled={pending} className="btn btn-primary w-full py-3.5 text-base disabled:opacity-70">
      {pending && <Loader2 className="h-5 w-5 animate-spin" />} {children}
    </button>
  );
}

function PasswordInput({ name, autoComplete }: { name: string; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1.5">
      <input name={name} type={show ? "text" : "password"} autoComplete={autoComplete} className="input pr-11" required />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? "/account"} />
      <label className="block">
        <span className="text-sm font-medium">Email or mobile number</span>
        <input name="login" defaultValue={state?.values?.login} autoComplete="username" className="input mt-1.5" placeholder="you@example.com or 0300 1234567" required />
        <FieldError state={state} name="login" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <PasswordInput name="password" autoComplete="current-password" />
        <FieldError state={state} name="password" />
      </label>
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      <Submit pending={pending}>Log in</Submit>
      <p className="text-center text-sm text-stone-500">
        New to CartWhim? <Link href={`/account/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-600">Create an account</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(register, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? "/account"} />
      <label className="block">
        <span className="text-sm font-medium">Full name</span>
        <input name="name" defaultValue={state?.values?.name} autoComplete="name" className="input mt-1.5" placeholder="Ali Raza" required />
        <FieldError state={state} name="name" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Mobile number</span>
          <input name="phone" defaultValue={state?.values?.phone} type="tel" inputMode="tel" autoComplete="tel" className="input mt-1.5" placeholder="0300 1234567" required />
          <FieldError state={state} name="phone" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input name="email" defaultValue={state?.values?.email} type="email" autoComplete="email" className="input mt-1.5" placeholder="you@example.com" required />
          <FieldError state={state} name="email" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <PasswordInput name="password" autoComplete="new-password" />
        <FieldError state={state} name="password" />
      </label>
      {state?.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      <Submit pending={pending}>Create account</Submit>
      <p className="text-center text-sm text-stone-500">
        Already have an account? <Link href={`/account/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand-600">Log in</Link>
      </p>
    </form>
  );
}

export function ProfileForm({ name, phone, city, address }: { name: string; phone: string; city: string | null; address: string | null }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2" noValidate>
      <label className="block">
        <span className="text-sm font-medium">Full name</span>
        <input name="name" defaultValue={state?.values?.name ?? name} autoComplete="name" className="input mt-1.5" />
        <FieldError state={state} name="name" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Mobile number</span>
        <input name="phone" defaultValue={state?.values?.phone ?? phone} type="tel" autoComplete="tel" className="input mt-1.5" />
        <FieldError state={state} name="phone" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium">City</span>
        <select name="city" defaultValue={city ?? ""} className="input mt-1.5">
          <option value="">Select your city</option>
          {pakistanCities.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-medium">Delivery address</span>
        <textarea name="address" defaultValue={address ?? ""} rows={3} autoComplete="street-address" className="input mt-1.5" placeholder="House #, street, block / area, nearby landmark" />
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={pending} className="btn btn-dark disabled:opacity-70">{pending && <Loader2 className="h-4 w-4 animate-spin" />} Save details</button>
        {state?.ok && <span className="text-sm font-medium text-emerald-600">{state.ok}</span>}
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
