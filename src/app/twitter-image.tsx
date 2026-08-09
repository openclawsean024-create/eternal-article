// Twitter card variant — same as OG image but with summary_large_image sizing
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eternal Article — 文章永久上鏈";
export const size = { width: 1200, height: 675 }; // Twitter standard 1.91:1
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#060709",
          padding: "60px 80px",
          position: "relative",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(76,163,255,0.25), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "white",
            marginTop: 30,
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            貼一篇文章,
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              background:
                "linear-gradient(135deg, #4ca3ff 0%, #6fb1ff 50%, #ffffff 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            永久寫進區塊鏈。
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "rgba(255,255,255,0.6)",
            fontSize: 26,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          支援 Sui + Walrus、Arweave、Base + IPFS
        </div>
      </div>
    ),
    { ...size },
  );
}
