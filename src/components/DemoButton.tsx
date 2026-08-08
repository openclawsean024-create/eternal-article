"use client";

import { useState } from "react";

export function DemoButton() {
  const [busy, setBusy] = useState(false);

  async function runDemo() {
    if (busy) return;
    const title = prompt("Demo 模式 — 給你的文章一個標題:");
    if (!title) return;
    const content = prompt("現在貼上你的文章內容:");
    if (!content) return;
    setBusy(true);
    try {
      const res = await fetch("/api/demo-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, chain: "sui" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("上傳失敗:" + (data.error ?? "未知錯誤"));
        setBusy(false);
      }
    } catch (e) {
      alert("網路錯誤:" + String(e));
      setBusy(false);
    }
  }

  return (
    <button
      onClick={runDemo}
      disabled={busy}
      className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition disabled:opacity-50"
    >
      🎮 {busy ? "上傳中..." : "Try Demo (不裝錢包)"}
    </button>
  );
}
