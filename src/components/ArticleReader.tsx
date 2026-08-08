"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CHAINS, type ChainInfo } from "@/lib/chains";

interface ArticleData {
  title: string;
  content: string;
  author: string;
  storedAt: number;
  ref: {
    chain: "sui" | "arweave" | "base";
    storage: string;
    txHash: string;
    storedAt: number;
  };
  mock?: boolean;
}

export function ArticleReader({ id }: { id: string }) {
  const [data, setData] = useState<ArticleData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/article/${id}`)
      .then((r) => r.json())
      .then((d: ArticleData | { error: string }) => {
        if ("error" in d) {
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch((e) => setError(String(e)));
  }, [id]);

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="text-5xl mb-4">😢</div>
        <h1 className="text-2xl font-bold mb-2">讀不到這篇文章</h1>
        <p className="text-white/60">{error}</p>
        <Link href="/" className="inline-block mt-8 text-white/60 hover:text-white underline text-sm">
          ← 回首頁
        </Link>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24">
        <div className="space-y-3">
          <div className="h-8 bg-white/5 rounded animate-pulse w-2/3" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-1/3" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
        </div>
      </main>
    );
  }

  const chain: ChainInfo = CHAINS[data.ref.chain];
  const explorerUrl = chain.explorer + "/tx/" + data.ref.txHash.replace(/^walrus:/, "");
  const gatewayUrl =
    chain.id === "arweave"
      ? `https://arweave.net/${data.ref.storage}`
      : chain.id === "base" && !data.ref.storage.startsWith("mock-")
        ? `https://ipfs.io/ipfs/${data.ref.storage}`
        : chain.id === "sui" && !data.ref.storage.startsWith("walrus:")
          ? `https://aggregator.walrus.mainnet.walrus.space/v1/${data.ref.storage}`
          : null;

  const date = new Date(data.storedAt || data.ref.storedAt);
  const dateStr = date.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      {/* chain badge */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-8 text-sm text-white/40 hover:text-white/70"
      >
        ← Eternal Article
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${chain.logoBg} ring-1 ring-white/10 flex items-center justify-center font-bold`}
          >
            {chain.name[0]}
          </div>
          <div>
            <div className={`text-lg font-bold ${chain.gradientClass}`}>
              Anchored on {chain.name}
            </div>
            <div className="text-xs text-white/40 font-mono">{dateStr}</div>
          </div>
        </div>

        {data.mock && (
          <div className="mb-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            ⚠ 這是 demo 模式(MVP 測試用),實際內容未儲存在區塊鏈上。
          </div>
        )}

        <article className="prose prose-invert max-w-none">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">
            {data.title}
          </h1>
          {data.author && data.author !== "anonymous" && (
            <div className="text-white/50 text-sm mb-8">by {data.author}</div>
          )}
          <div className="border-t border-white/10 pt-8 mt-8">
            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-white/85">
              {data.content}
            </pre>
          </div>
        </article>

        <div className="mt-16 rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
          <div className="text-xs uppercase tracking-widest text-white/40">
            鏈上記錄(任何人皆可驗證)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-white/40 text-xs mb-1">Transaction</div>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-white/80 hover:text-white underline break-all"
              >
                {data.ref.txHash}
              </a>
            </div>
            <div>
              <div className="text-white/40 text-xs mb-1">Storage Layer</div>
              <div className="font-mono text-xs text-white/80 break-all">
                {data.ref.storage}
              </div>
            </div>
          </div>

          {gatewayUrl && (
            <div className="pt-3 border-t border-white/5">
              <a
                href={gatewayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 hover:text-white"
              >
                在原始 storage 查看 →
              </a>
            </div>
          )}

          <div className="pt-3 border-t border-white/5 flex gap-3">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70"
            >
              複製連結
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${data.title} — anchored on ${chain.name}`,
              )}&url=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.href : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70"
            >
              分享到 X
            </a>
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-md bg-white text-black hover:bg-white/90 ml-auto"
            >
              我也要存一篇
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
