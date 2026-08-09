"use client";

// Root layout error boundary — 當整個 layout 自己炸掉時的 fallback
// 比 app/error.tsx 更外層(沒有 own layout 時用)

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-Hant">
      <body
        style={{
          background: "#060709",
          color: "#f5f6fa",
          fontFamily: "system-ui",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💥</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            嚴重錯誤
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: 24 }}>
            頁面發生致命錯誤,請重新整理。
          </p>
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              background: "white",
              color: "black",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            重新整理
          </button>
        </div>
      </body>
    </html>
  );
}
