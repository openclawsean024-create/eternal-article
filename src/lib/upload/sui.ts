// Sui + Walrus 上傳
// MVP 策略: 用 Walrus 的 publisher HTTP API 上傳 blob,然後在 Sui 上 publish tx。
// 簡化版: 先用 Walrus testnet aggregator 的 HTTP endpoint 上傳;anchor 暫時省略
// (因為 anchor 需要 deploy 一個 Sui contract,MVP 階段直接以 Walrus blob id 為 reference)

import type { ArticlePayload, UploadCallbacks } from "./types";

const WALRUS_PUBLISHER_TESTNET = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR_TESTNET = "https://aggregator.walrus-testnet.walrus.space";
const WALRUS_PUBLISHER_MAINNET = "https://publisher.walrus.mainnet.walrus.space";
const WALRUS_AGGREGATOR_MAINNET = "https://aggregator.walrus.mainnet.walrus.space";

const USE_MAINNET = true; // 預設走 mainnet,若有問題退回 testnet

const PUB = USE_MAINNET ? WALRUS_PUBLISHER_MAINNET : WALRUS_PUBLISHER_TESTNET;
const AGG = USE_MAINNET ? WALRUS_AGGREGATOR_MAINNET : WALRUS_AGGREGATOR_TESTNET;

function encodeArticleAsJson(payload: ArticlePayload): Uint8Array {
  const data = JSON.stringify({
    v: 1,
    type: "eternal-article",
    title: payload.title,
    content: payload.content,
    author: payload.author,
    storedAt: Date.now(),
  });
  return new TextEncoder().encode(data);
}

export async function uploadToSui(
  payload: ArticlePayload,
  walletAddress: string,
  callbacks: UploadCallbacks = {},
): Promise<{ chain: "sui"; storage: string; txHash: string; storedAt: number }> {
  callbacks.onSign?.();

  const data = encodeArticleAsJson(payload);

  // Walrus publisher: PUT blob 進去,會回 blob id
  // epochs=1 表示儲存 1 epoch(~ 2 weeks on mainnet)
  const res = await fetch(`${PUB}/v1/store?epochs=1`, {
    method: "PUT",
    body: data,
    headers: { "Content-Type": "application/octet-stream" },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Walrus publisher ${res.status}: ${txt.slice(0, 200)}`);
  }

  callbacks.onStore?.();

  const json = (await res.json()) as {
    newlyCreated?: { blobObject: { blobId: string }; resource: string };
    alreadyCertified?: { blobId: string; resource: string };
    endEpoch?: number;
  };

  const blobId =
    json.newlyCreated?.blobObject?.blobId ??
    json.alreadyCertified?.blobId;

  if (!blobId) {
    throw new Error(`Walrus 沒回傳 blobId: ${JSON.stringify(json).slice(0, 200)}`);
  }

  // MVP 簡化: 我們用 blob id 作為永久 reference,
  // 把 wallet address + blob id 編碼到 txHash 欄位(後續真接 Sui anchor 再覆蓋)
  const txHash = `walrus:${blobId}`;

  callbacks.onAnchor?.(txHash);
  callbacks.onConfirm?.();

  return {
    chain: "sui",
    storage: blobId,
    txHash,
    storedAt: Date.now(),
  };
}

export function walrusAggregatorUrl(blobId: string): string {
  return `${AGG}/v1/${blobId}`;
}
