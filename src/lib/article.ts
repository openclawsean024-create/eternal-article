// 工具: 內容大小驗證
export const MAX_CONTENT_BYTES = 200 * 1024; // 200 KB

export function validateContent(title: string, content: string): string | null {
  if (!title.trim()) return "請輸入標題";
  if (!content.trim()) return "請輸入內容";
  if (title.length > 200) return "標題過長(最多 200 字元)";
  const totalBytes = new TextEncoder().encode(title + content).length;
  if (totalBytes > MAX_CONTENT_BYTES) {
    return `內容過大(${Math.round(totalBytes / 1024)}KB,上限 200KB)。請縮短或分段上傳。`;
  }
  return null;
}

// 工具: 從鏈上 ID 拆出 storage + tx hash
export interface ArticleRef {
  chain: "sui" | "arweave" | "base";
  storage: string; // blob id / ar:// tx / ipfs cid
  txHash: string; // onchain anchor tx
  storedAt: number; // timestamp ms
}

export function encodeArticleRef(ref: ArticleRef): string {
  return Buffer.from(JSON.stringify(ref)).toString("base64url");
}

export function decodeArticleRef(s: string): ArticleRef | null {
  try {
    const json = Buffer.from(s, "base64url").toString("utf8");
    return JSON.parse(json) as ArticleRef;
  } catch {
    return null;
  }
}

// 工具: 取 IPFS / Arweave / Walrus 的 HTTP gateway URL
export function gatewayUrl(ref: ArticleRef): string {
  switch (ref.chain) {
    case "arweave":
      return `https://arweave.net/${ref.storage}`;
    case "base":
      return `https://ipfs.io/ipfs/${ref.storage}`;
    case "sui":
      return `https://walrus.tusky.io/blob/${ref.storage}`;
  }
}
