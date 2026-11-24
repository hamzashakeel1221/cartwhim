import { ImageResponse } from "next/og";
import { Brand, ogSize } from "@/lib/og";

export const alt = "CartWhim: Online shopping in Pakistan with Cash on Delivery";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #1c1a2e 0%, #3b1f2b 60%, #f2622e 140%)" }}>
        <Brand />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, color: "#fff", lineHeight: 1.05 }}>Everything you want,</div>
          <div style={{ fontSize: 84, fontWeight: 800, color: "#ff8a5c", lineHeight: 1.05 }}>on a whim.</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["Cash on Delivery", "Delivery all over Pakistan", "7 day returns"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "12px 24px", borderRadius: 999, background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 28 }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
