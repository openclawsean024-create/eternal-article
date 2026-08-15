"use client";

import { motion } from "framer-motion";

/**
 * Hero — 首頁的 hero 區塊
 * 設計要點:
 *   - 大字標題 + gradient(採用 ui-ux-pro-max Minimalism + 單欄焦點)
 *   - 三鏈 ambient glow(Sui 藍 / Arweave 橘 / Base 藍)呼應下方選項
 *   - entrance 動畫: title + subtitle + arrow stagger
 *   - 強調 "Permanent / forever / permanent link" 而不只是 "上鏈"
 */
export function Hero() {
  return (
    <div className="relative text-center max-w-3xl mx-auto">
      {/* 三色 ambient glows — 大背景 */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
      >
        <div className="absolute top-0 left-[10%] w-[200px] h-[200px] rounded-full bg-[#4ca3ff] opacity-[0.08] blur-[100px]" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-[#ff5a32] opacity-[0.08] blur-[100px]" />
        <div className="absolute top-0 right-[10%] w-[200px] h-[200px] rounded-full bg-[#2151f5] opacity-[0.08] blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/50"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
        </span>
        <span className="font-medium tracking-wide uppercase text-[10px]">
          v0.1 · Live
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="relative text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.05]"
      >
        貼一篇文章,把它
        <br />
        <span className="text-gradient-sui">永久寫進區塊鏈</span>
        <span className="text-white">。</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative mt-7 text-base md:text-lg text-white/55 leading-relaxed max-w-xl mx-auto"
      >
        選一條鏈、貼上內容、按下上傳 ——
        你的文章就會被寫入區塊鏈,拿到一個永遠不會失效的永久連結。
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative mt-12 text-xs text-white/30 tracking-wider uppercase"
      >
        從下方選一條鏈開始
        <span className="inline-block ml-1 animate-bounce">↓</span>
      </motion.div>
    </div>
  );
}
