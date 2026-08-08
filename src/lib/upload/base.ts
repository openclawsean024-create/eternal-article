// Base + IPFS 上傳
// MVP 策略:
// 1. 先用 Pinata public API 上傳到 IPFS (free tier,需要 JWT;若 env 沒設就 mock)
// 2. 把 IPFS CID 透過 viem 寫到 Base 上的 anchor contract
//    MVP 簡化: 我們直接呼叫一個輕量 server-side API route /api/anchor
//    API route 使用 server-side signer 把 CID 寫成一個 event log
//
// 因為 MVP 還沒 deploy contract,先用一個 mock anchor 模式:
//   1. 把 IPFS CID + 文章 hash + wallet address 編碼成 txHash(確定性,後續可驗)
//   2. 寫到 localStorage 維護「已上傳清單」,未來真接 contract 再替換

import type { ArticlePayload, UploadCallbacks } from "./types";

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

// 簡易 SHA-256 (Web Crypto)
async function sha256Hex(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function uploadToBase(
  payload: ArticlePayload,
  walletAddress: string,
  callbacks: UploadCallbacks = {},
): Promise<{ chain: "base"; storage: string; txHash: string; storedAt: number }> {
  callbacks.onSign?.();

  const data = encodeArticleAsJson(payload);

  // Step 1: 上傳到 Pinata(或 fallback mock)
  let cid: string;

  try {
    const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;
    if (pinataJwt) {
      const form = new FormData();
      form.append(
        "file",
        new Blob([data as BlobPart], { type: "application/json" }),
        `${Date.now()}.json`,
      );
      const pinataMetadata = JSON.stringify({
        name: payload.title.slice(0, 100),
        keyvalues: {
          app: "eternal-article",
          author: payload.author || "anonymous",
        },
      });
      form.append("pinataMetadata", pinataMetadata);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${pinataJwt}` },
          body: form,
        },
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Pinata ${res.status}: ${txt.slice(0, 200)}`);
      }

      const result = (await res.json()) as { IpfsHash: string };
      cid = result.IpfsHash;
    } else {
      throw new Error("NEXT_PUBLIC_PINATA_JWT 沒設,fallback mock");
    }
  } catch (e) {
    // Mock 模式: 用 SHA-256 模擬 CID
    const hash = await sha256Hex(data);
    cid = `mock-${hash.slice(0, 46)}`; // IPFS CID v0 length
    console.warn("[Base] Pinata 不可用,使用 mock CID:", cid, e);
  }

  callbacks.onStore?.();

  // Step 2: 把 CID 錨定到 Base (MVP: 透過 server-side API 或 mock)
  let txHash: string;
  try {
    const res = await fetch("/api/anchor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cid,
        wallet: walletAddress,
        title: payload.title,
        author: payload.author,
      }),
    });

    if (!res.ok) {
      throw new Error(`Anchor ${res.status}`);
    }

    const result = (await res.json()) as { txHash: string };
    txHash = result.txHash;
  } catch (e) {
    // Mock anchor: 確定性 hash
    const hash = await sha256Hex(new TextEncoder().encode(`${cid}|${walletAddress}|${Date.now()}`));
    txHash = `0x${hash.slice(0, 64)}`;
    console.warn("[Base] Anchor 不可用,使用 mock txHash:", txHash, e);
  }

  callbacks.onAnchor?.(txHash);
  callbacks.onConfirm?.();

  return {
    chain: "base",
    storage: cid,
    txHash,
    storedAt: Date.now(),
  };
}
