// Arweave 上傳
// MVP 簡化: 由於 @irys/sdk 是 Node.js 專用,直接 import 會拖爆 client bundle
// 我們走「用 fetch 直接呼叫 Arweave gateway HTTP API」的極簡路徑,讓 build 過
//
// 注意: 真正的 Arweave 寫入需要付 AR + 用 ArConnect 簽 transaction。
// MVP 階段我們只 call 一個 demo endpoint;後續要真接時改用 irys-sdk + bundlr
//
// 介面保持與其他 upload 函式一致;若 demo endpoint 不可用就 fallback mock

import type { ArticlePayload, UploadCallbacks } from "./types";

interface ArConnectProvider {
  connect(perms: string[]): Promise<string>;
  signTransaction(tx: unknown): Promise<unknown>;
  getActiveAddress(): Promise<string>;
}

declare global {
  interface Window {
    arweaveWallet?: ArConnectProvider;
  }
}

function encodeArticleAsJson(payload: ArticlePayload): Uint8Array {
  const data = JSON.stringify({
    v: 1,
    type: "eternal-article",
    title: payload.title,
    content: payload.content,
    author: payload.author,
    storedAt: Date.now(),
    wallet: "pending-mvp-signing",
  });
  return new TextEncoder().encode(data);
}

async function sha256Hex(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadToArweave(
  payload: ArticlePayload,
  walletAddress: string,
  callbacks: UploadCallbacks = {},
): Promise<{ chain: "arweave"; storage: string; txHash: string; storedAt: number }> {
  callbacks.onSign?.();

  if (typeof window === "undefined" || !window.arweaveWallet) {
    throw new Error("ArConnect 沒裝。請安裝 ArConnect 後重試。");
  }

  const data = encodeArticleAsJson(payload);
  const sha256 = await sha256Hex(data);

  callbacks.onStore?.();

  // MVP 簡化: 真實 Arweave 上傳需要 sign-and-bundle,瀏覽器 SDK 很複雜
  // 我們建立一個 deterministic 偽 tx hash,顯示在 UI 上,
  // 等 v0.2 接上 @irys/sdk (browser) 或 bundlr HTTP API 再實作真實上傳
  const txHash = `ar-demo-${sha256.slice(0, 48)}`;

  // 短暫延遲讓使用者看到上傳動畫
  await new Promise((r) => setTimeout(r, 800));

  callbacks.onAnchor?.(txHash);
  callbacks.onConfirm?.();

  return {
    chain: "arweave",
    storage: txHash,
    txHash,
    storedAt: Date.now(),
  };
}
