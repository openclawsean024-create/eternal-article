// 三條主鏈的資料 — 用這個當 single source of truth
// 為了避免 hydration mismatch,所有 client 邏輯都用 lazy import

export type ChainId = "sui" | "arweave" | "base";

export interface ChainInfo {
  id: ChainId;
  name: string;
  tagline: string;
  description: string;
  storage: string;
  explorer: string;
  walletUrl: string;
  walletName: string;
  gradientClass: string; // tailwind class for hero text
  glowClass: string; // tailwind class for ambient glow
  ringClass: string; // tailwind class for hover ring
  /** 鏈的官方 logo 路徑(若有的話);MVP 階段先用 SVG */
  logoBg: string;
}

export const CHAINS: Record<ChainId, ChainInfo> = {
  sui: {
    id: "sui",
    name: "Sui",
    tagline: "Move 語言 · 並行執行 · 毫秒級確認",
    description:
      "由 Mysten Labs 打造的高效能 L1,Walrus 提供去中心化儲存層。文章經 Walrus 編碼後,雜湊錨定在 Sui 主鏈,真正屬於你。",
    storage: "Walrus (去中心化儲存)",
    explorer: "https://suiscan.xyz/mainnet",
    walletUrl: "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhnajoaobchodhnplh",
    walletName: "Sui Wallet",
    gradientClass: "text-gradient-sui",
    glowClass: "bg-radial-sui",
    ringClass: "ring-sui/40",
    logoBg: "from-[#4ca3ff] to-[#0f1b3a]",
  },
  arweave: {
    id: "arweave",
    name: "Arweave",
    tagline: "永久儲存 · 一次付費 · 100 年保證",
    description:
      "Arweave 是為永久儲存而生的 L1,只需支付一次費用,你的文章就會被礦工永久備份。透過 Turbo SDK 上傳,體驗流暢。",
    storage: "Arweave (原生永久層)",
    explorer: "https://viewblock.io/arweave",
    walletUrl: "https://arconnect.io",
    walletName: "ArConnect",
    gradientClass: "text-gradient-arweave",
    glowClass: "bg-radial-arweave",
    ringClass: "ring-arweave/40",
    logoBg: "from-[#ff5a32] to-[#0a0a0a]",
  },
  base: {
    id: "base",
    name: "Base",
    tagline: "Coinbase L2 · 低費用 · IPFS 永久",
    description:
      "Base 是 Coinbase 的 OP Stack L2,文章本體上 IPFS,雜湊錨定到 Base 主網。MetaMask 就能用,最低摩擦。",
    storage: "IPFS (透過 Pinata 釘選)",
    explorer: "https://basescan.org",
    walletUrl: "https://metamask.io/download/",
    walletName: "MetaMask",
    gradientClass: "text-gradient-base",
    glowClass: "bg-radial-base",
    ringClass: "ring-base/40",
    logoBg: "from-[#2151f5] to-[#0a1226]",
  },
};

export const CHAIN_ORDER: ChainId[] = ["sui", "arweave", "base"];
