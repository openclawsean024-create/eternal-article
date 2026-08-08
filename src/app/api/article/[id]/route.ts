// 文章讀取 API:根據鏈別從 storage 拉內容
// 因為這個網站沒有 DB,文章內容是從鏈上的 storage layer 拉的

import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface Ref {
  chain: "sui" | "arweave" | "base";
  storage: string;
  txHash: string;
  storedAt: number;
}

function gatewayUrl(ref: Ref): string {
  switch (ref.chain) {
    case "arweave":
      return `https://arweave.net/${ref.storage}`;
    case "base":
      return ref.storage.startsWith("mock-")
        ? "" // mock 沒有 URL,前端會 fallback
        : `https://ipfs.io/ipfs/${ref.storage}`;
    case "sui": {
      // Walrus mainnet aggregator
      return ref.storage.startsWith("walrus:")
        ? ""
        : `https://aggregator.walrus.mainnet.walrus.space/v1/${ref.storage}`;
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // 從 base64url 編碼解出 ref
    let json: string;
    try {
      json = Buffer.from(params.id, "base64url").toString("utf8");
    } catch {
      return NextResponse.json({ error: "ID 格式錯誤" }, { status: 400 });
    }

    let ref: Ref;
    try {
      ref = JSON.parse(json);
    } catch {
      return NextResponse.json({ error: "ID 解析失敗" }, { status: 400 });
    }

    const url = gatewayUrl(ref);

    // mock 模式: 回一個 placeholder
    if (!url) {
      return NextResponse.json({
        ref,
        mock: true,
        title: "(Mock Article)",
        content:
          "這是一篇在 demo 模式下上傳的文章。真實環境中,內容會從 IPFS / Walrus / Arweave 拉取。\n\n請在 .env 設定 NEXT_PUBLIC_PINATA_JWT 等服務以啟用真實上傳。",
        author: "anonymous",
      });
    }

    // 從 storage layer 拉 JSON
    const res = await fetch(url, {
      // IPFS / Arweave 都要時間,給 30 秒
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Storage ${res.status}: 無法取得內容` },
        { status: 502 },
      );
    }

    const article = (await res.json()) as {
      title: string;
      content: string;
      author: string;
      storedAt: number;
    };

    return NextResponse.json({ ref, ...article });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
