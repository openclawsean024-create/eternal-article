"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 在 production 環境下報到 console,讓我們能看到
    if (process.env.NODE_ENV === "production") {
      console.error("[Eternal Article] Caught error:", error);
    }
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="text-5xl mb-4">😵</div>
      <h1 className="text-3xl font-bold mb-2">發生了一點錯誤</h1>
      <p className="text-white/60 mb-4">
        別擔心,文章沒丟。如果有資料要保存,重新整理後再試。
      </p>
      {error.digest && (
        <p className="text-xs text-white/30 font-mono mb-6">
          error id: {error.digest}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90"
        >
          重試
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white"
        >
          回首頁
        </Link>
      </div>
    </main>
  );
}
