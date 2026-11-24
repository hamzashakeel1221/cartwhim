import Link from "next/link";

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="CartWhim home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 4h2l2.2 10.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.4-1l1.8-6H6.2" />
          <circle cx="9.5" cy="20" r="1.3" /><circle cx="17" cy="20" r="1.3" />
          <path d="M12.5 3.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor" strokeWidth={1} />
        </svg>
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Cart<span className="text-brand-500">Whim</span>
      </span>
    </Link>
  );
}
