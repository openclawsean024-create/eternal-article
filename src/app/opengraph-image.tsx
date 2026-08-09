// Dynamic Open Graph image generator
// 在 build 時產一張 1200x630 的 PNG,用 ImageResponse
// 使用 Next.js 內建的 @vercel/og (透過 next/og)

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Eternal Article — 文章永久上鏈";
export const size = { width: 1200, height: 630 };
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
          padding: "80px 100px",
          position: "relative",
          fontFamily: "system-ui",
        }}
      >
        {/* subtle grid */}
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

        {/* glows */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(76,163,255,0.25), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 600,
            height: 600,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(255,90,50,0.18), transparent 70%)",
            display: "flex",
          }}
        />

        {/* badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999,
            background: "rgba(255,255,255,0.03)",
            width: 220,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#4ade80",
              display: "flex",
            }}
          />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>
            ETERNAL ARTICLE
          </div>
        </div>

        {/* hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 60,
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              display: "flex",
            }}
          >
            貼一篇文章,
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
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

        {/* sub */}
        <div
          style={{
            display: "flex",
            color: "rgba(255,255,255,0.6)",
            fontSize: 28,
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          支援 Sui + Walrus、Arweave、Base + IPFS。貼文章 → 一鍵上鏈。
        </div>

        {/* chains */}
        <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
          {[
            { name: "Sui + Walrus", color: "#4ca3ff" },
            { name: "Arweave", color: "#ff5a32" },
            { name: "Base + IPFS", color: "#2151f5" },
          ].map((c) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  background: c.color,
                  display: "flex",
                }}
              />
              <div style={{ color: "white", fontSize: 22, fontWeight: 600 }}>
                {c.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
