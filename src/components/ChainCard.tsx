"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ChainInfo } from "@/lib/chains";

export function ChainCard({ chain }: { chain: ChainInfo }) {
  return (
    <Link href={`/upload/${chain.id}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`card-shimmer relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden ${chain.glowClass}`}
      >
        {/* glow */}
        <div
          aria-hidden
          className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-40 ${chain.glowClass}`}
        />

        {/* Logo box */}
        <div
          className={`relative inline-flex w-14 h-14 rounded-xl items-center justify-center text-xl font-bold bg-gradient-to-br ${chain.logoBg} ring-1 ring-white/10`}
        >
          {chain.name[0]}
        </div>

        <div className="relative mt-5">
          <div className="flex items-baseline justify-between">
            <h3 className={`text-2xl font-bold tracking-tight ${chain.gradientClass}`}>
              {chain.name}
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              {chain.id}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {chain.tagline}
          </p>
        </div>

        <div className="relative mt-5 pt-5 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-white/40">{chain.storage}</span>
          <span className="text-white/50 group-hover:text-white transition">
            開始上傳 →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
