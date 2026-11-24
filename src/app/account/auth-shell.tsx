import { Banknote, Heart, PackageCheck, Zap } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container-x grid max-w-5xl gap-8 pt-8 lg:grid-cols-2 lg:pt-14">
      <div className="hidden flex-col justify-between rounded-[2rem] bg-ink p-10 text-white lg:flex">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">Your CartWhim account</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight">Shop faster, track everything.</h2>
        </div>
        <ul className="space-y-4 text-stone-300">
          {[
            [Zap, "One-tap checkout with your saved address"],
            [PackageCheck, "All your orders and their status in one place"],
            [Heart, "Wishlist that remembers what you love"],
            [Banknote, "Still Cash on Delivery, always"],
          ].map(([I, t]) => {
            const C = I as typeof Zap;
            return <li key={t as string} className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><C className="h-4 w-4 text-brand-200" /></span>{t as string}</li>;
          })}
        </ul>
      </div>
      <div className="rounded-[2rem] bg-white p-6 ring-1 ring-stone-200/70 sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
