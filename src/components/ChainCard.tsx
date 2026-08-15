"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/components/icons";
import { SuiIcon, ArweaveIcon, BaseIcon } from "@/components/icons";
import type { ChainInfo, ChainId } from "@/lib/chains";

// 從 chain.id 拿到對應的 SVG icon component
// 這層 mapping 是必要的,因為 React component 不能被 serialize 到 server payload
const CHAIN_ICON_MAP = {
  sui: SuiIcon,
  arweave: ArweaveIcon,
  base: BaseIcon,
} as const;

interface Props {
  chain: ChainInfo;
  index?: number;
}

// ChainCard: 主鏈選擇卡
// 設計重點:
//   - SVG logo 替代字母 S/A/B (ui-ux-pro-max checklist: no emoji as icons)
//   - hover 時 elevation + glow + arrow 滑入
//   - 進入時 stagger 動畫(配合 index 計算 delay)
export function ChainCard({ chain, index = 0 }: Props) {
  const Icon = CHAIN_ICON_MAP[chain.id as ChainId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      whileHover={{ y: -4 }}
      whileFocus={{ y: -4 }}
      className="h-full"
    >
      <a
        href={`/upload/${chain.id}`}
        className="card-shimmer group block relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity ${chain.glowClass}`}
        />

        <div className="relative flex flex-col h-full">
          {/* Logo + label */}
          <div className="flex items-start justify-between mb-5">
            <div
              className={`relative inline-flex w-14 h-14 rounded-xl items-center justify-center bg-gradient-to-br ${chain.logoBg} ring-1 ring-white/10 text-white shadow-lg`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
              {chain.id}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`text-2xl font-bold tracking-tight ${chain.gradientClass}`}
          >
            {chain.name}
          </h3>

          {/* Tagline */}
          <p className="mt-2 text-sm text-white/60 leading-relaxed min-h-[2.5rem] line-clamp-2">
            {chain.tagline}
          </p>

          {/* Spacer to push CTA down */}
          <div className="flex-1" />

          {/* Storage layer + CTA */}
          <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-white/40 truncate">{chain.storage}</span>
            <span className="inline-flex items-center gap-1 text-white/50 group-hover:text-white group-hover:gap-2 transition-all">
              開始上傳
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
