// Demo 模式上傳: 不需要錢包,用 placeholder 生成永久連結
// 用在「想要快速 demo 流程」的場景,所有內容用 SHA-256 mock,不真的上鏈
// 透過 URL 參數 ?demo=1 觸發

import { NextResponse } from "next/server";
import { encodeArticleRef } from "@/lib/article";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, author, chain = "sui" } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "缺少標題或內容" }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: "標題過長" }, { status: 400 });
    }
    if (new TextEncoder().encode(title + content).length > 200 * 1024) {
      return NextResponse.json({ error: "內容超過 200KB" }, { status: 400 });
    }

    // Build deterministic mock ref
    const data = JSON.stringify({
      v: 1,
      type: "eternal-article-demo",
      title,
      content,
      author: author || "anonymous",
      storedAt: Date.now(),
    });
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(data),
    );
    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    let txHash: string;
    let storage: string;
    switch (chain) {
      case "sui":
        txHash = `walrus:${hashHex.slice(0, 64)}`;
        storage = txHash;
        break;
      case "arweave":
        txHash = `ar-demo-${hashHex.slice(0, 48)}`;
        storage = txHash;
        break;
      case "base":
        txHash = `0x${hashHex.slice(0, 64)}`;
        storage = `mock-${hashHex.slice(0, 46)}`;
        break;
      default:
        txHash = `walrus:${hashHex.slice(0, 64)}`;
        storage = txHash;
    }

    const ref = {
      chain,
      storage,
      txHash,
      storedAt: Date.now(),
    };

    // Save to in-memory log so reader can find it (since storage is mock, reader API falls back to embedded mock anyway)
    const id = encodeArticleRef(ref);

    return NextResponse.json({
      id,
      ref,
      url: `/r/${id}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
