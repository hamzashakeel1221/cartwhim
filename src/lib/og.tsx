// Shared artwork for social share images (WhatsApp, Facebook, X previews).
export const ogSize = { width: 1200, height: 630 };

export function CartIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.2 10.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.4-1l1.8-6H6.2" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}

export function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", width: 72, height: 72, borderRadius: 20, background: "#f2622e", alignItems: "center", justifyContent: "center" }}>
        <CartIcon size={44} />
      </div>
      <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "#fff" }}>
        Cart<span style={{ color: "#ff8a5c" }}>Whim</span>
      </div>
    </div>
  );
}
