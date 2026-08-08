"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white/50"
      >
        v0.1 · MVP · 免費
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]"
      >
        貼一篇文章,把它
        <br />
        <span className="text-gradient-sui">永久寫進區塊鏈</span>。
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 text-base md:text-lg text-white/60 leading-relaxed"
      >
        支援 Sui + Walrus、Arweave、Base + IPFS。
        <br className="hidden md:block" />
        選一條鏈,連接錢包,按上傳——三步,完成。
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 text-xs text-white/30 tracking-wide"
      >
        從下方選一個鏈開始 ↓
      </motion.div>
    </div>
  );
}
