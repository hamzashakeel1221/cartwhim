import { ImageResponse } from "next/og";
import { CartIcon } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f2622e" }}>
        <CartIcon size={110} />
      </div>
    ),
    size,
  );
}
