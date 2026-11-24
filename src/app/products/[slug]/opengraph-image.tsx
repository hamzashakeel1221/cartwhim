import { ImageResponse } from "next/og";
import { getCategory, getProduct, products } from "@/lib/catalog";
import { discountPercent, formatPKR } from "@/lib/format";
import { Brand, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Product on CartWhim";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  const off = p ? discountPercent(p.price, p.compareAt) : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #1c1a2e 0%, #2a2340 70%, #f2622e 160%)" }}>
        <Brand />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#ffc4a8" }}>{p ? getCategory(p.category)?.name : ""}</div>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#fff", lineHeight: 1.08, maxWidth: 1000 }}>{p?.name ?? "CartWhim"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {p && <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "#fff" }}>{formatPKR(p.price)}</div>}
          {p?.compareAt && <div style={{ display: "flex", fontSize: 36, color: "#a8a29e", textDecoration: "line-through" }}>{formatPKR(p.compareAt)}</div>}
          {off && <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#f2622e", color: "#fff", fontSize: 32, fontWeight: 800 }}>-{off}%</div>}
          <div style={{ display: "flex", marginLeft: "auto", fontSize: 28, color: "#fff", padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,0.12)" }}>Cash on Delivery</div>
        </div>
      </div>
    ),
    size,
  );
}
