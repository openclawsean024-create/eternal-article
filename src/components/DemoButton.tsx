"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function DemoButton() {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [chain, setChain] = useState<"sui" | "arweave" | "base">("sui");
  const [error, setError] = useState<string | null>(null);

  async function runDemo(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!title.trim() || !content.trim()) {
      setError("標題和內容都要填");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/demo-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, chain }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("上傳失敗:" + (data.error ?? "未知錯誤"));
        setBusy(false);
      }
    } catch (e) {
      setError("網路錯誤:" + String(e));
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition"
      >
        🎮 Try Demo (不裝錢包)
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.form
        onSubmit={runDemo}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-ink-950 p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">🎮 Demo 模式</h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={busy}
            className="text-white/40 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-white/50 mb-4">
          不用裝錢包,直接生成一個永久 demo 連結。內容只 demo 用,不會真的上鏈。
        </p>

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            鏈
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["sui", "arweave", "base"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChain(c)}
                disabled={busy}
                className={`px-3 py-2 rounded-lg text-sm transition ${
                  chain === c
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {c === "sui" ? "Sui" : c === "arweave" ? "Arweave" : "Base"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            標題
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            disabled={busy}
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            內容
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            disabled={busy}
            className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm"
          />
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            ⚠ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40"
        >
          {busy ? "上傳中..." : "生成 Demo 連結"}
        </button>
      </motion.form>
    </div>
  );
}
