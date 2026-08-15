"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ChainInfo, ChainId } from "@/lib/chains";
import { UploadForm } from "@/components/UploadForm";
import { WalletConnect } from "@/components/WalletConnect";
import { ArrowRightIcon, SuiIcon, ArweaveIcon, BaseIcon } from "@/components/icons";

const CHAIN_ICON_MAP = {
  sui: SuiIcon,
  arweave: ArweaveIcon,
  base: BaseIcon,
} as const;

export function UploadPageClient({ chain }: { chain: ChainInfo }) {
  const [walletAddr, setWalletAddr] = useState<string | null>(null);
  const Icon = CHAIN_ICON_MAP[chain.id as ChainId];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/40">
        <Link href="/" className="hover:text-white/70 transition-colors">
          首頁
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-white/60">{chain.name}</span>
      </nav>

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
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${chain.logoBg} ring-1 ring-white/10 flex items-center justify-center text-white shadow-lg`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              {chain.id}
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-tight ${chain.gradientClass}`}
          >
            上傳到 {chain.name}
          </h1>
          <p className="mt-4 text-white/55 leading-relaxed max-w-2xl">
            {chain.description}
          </p>
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

      {/* Footer note */}
      <div className="mt-12 flex items-center justify-center gap-1.5 text-xs text-white/30">
        <span>文章一旦上鏈即不可修改、不可刪除</span>
        <ArrowRightIcon className="w-3 h-3" />
        <span>請確認內容無誤再上傳</span>
      </div>
    </main>
  );
}
