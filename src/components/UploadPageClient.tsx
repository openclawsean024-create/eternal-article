"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ChainInfo } from "@/lib/chains";
import { UploadForm } from "@/components/UploadForm";
import { WalletConnect } from "@/components/WalletConnect";

export function UploadPageClient({ chain }: { chain: ChainInfo }) {
  const [walletAddr, setWalletAddr] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      {/* breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-white/40">
        <Link href="/" className="hover:text-white/70">
          首頁
        </Link>
        <span>/</span>
        <span className="text-white/60">{chain.name}</span>
      </div>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div
          aria-hidden
          className={`absolute -top-10 -left-10 w-72 h-72 rounded-full blur-3xl opacity-30 ${chain.glowClass}`}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${chain.logoBg} ring-1 ring-white/10 flex items-center justify-center font-bold`}
            >
              {chain.name[0]}
            </div>
            <span className="text-xs uppercase tracking-widest text-white/40">
              {chain.id}
            </span>
          </div>

          <h1
            className={`text-3xl md:text-5xl font-bold tracking-tighter leading-tight ${chain.gradientClass}`}
          >
            上傳到 {chain.name}
          </h1>
          <p className="mt-3 text-white/60 leading-relaxed">{chain.description}</p>
        </div>
      </motion.div>

      {/* wallet connect */}
      <div className="mt-10">
        <WalletConnect chain={chain} onConnected={setWalletAddr} />
      </div>

      {/* upload form */}
      <div className="mt-10">
        <UploadForm chain={chain} walletAddress={walletAddr} />
      </div>

      <div className="mt-12 text-xs text-white/30 text-center">
        文章一旦上鏈即不可修改、不可刪除。
        <br />
        請確認內容無誤再上傳。
      </div>
    </main>
  );
}
