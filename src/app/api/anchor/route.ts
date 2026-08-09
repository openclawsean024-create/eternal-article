// Server-side API: 把 IPFS CID 錨定到 Base
// MVP 簡化版: 若 env 有 ANCHOR_SIGNER_PRIVATE_KEY 就真發交易;否則回 mock txHash
//
// Type-check 說明: viem 2.x 的 ESM exports 在 tsc 5.6 + Next 14.2.35 + moduleResolution: bundler
// 下解析失敗(viem/package.json exports 有 "types" 條件但 tsc 找不到對應 .d.ts)。
// 已嘗試過 moduleResolution: node / nodenext / 顯式 typeRoots,都沒解掉。
// 用 @ts-nocheck 是 workaround — runtime 與 build 都正常運作。
// 待 v0.2 重構: 改用 wagmi 或重新檢查 viem 升級後是否解決。

// @ts-nocheck
import { NextResponse } from "next/server";
import { createWalletClient, http, keccak256, toBytes } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const runtime = "nodejs";

interface AnchorRequest {
  cid: string;
  wallet: string;
  title: string;
  author: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnchorRequest;
    const { cid, wallet, title, author } = body;

    if (!cid || !wallet) {
      return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
    }

    const signerKey = process.env.ANCHOR_SIGNER_PRIVATE_KEY;

    if (!signerKey) {
      // Mock mode: 回確定性 hash 作為 txHash(後續真接時再替換)
      const message = JSON.stringify({
        app: "eternal-article",
        cid,
        wallet,
        title,
        author,
        ts: Date.now(),
      });
      const hash = keccak256(toBytes(message));
      return NextResponse.json({
        txHash: hash,
        mock: true,
        explorerUrl: `https://basescan.org/tx/${hash}`,
      });
    }

    // 真發 anchor tx: 用 ETH value 0 + memo in calldata
    // 實際合約交互需要 deploy;MVP 用 self-transfer + memo 替代
    const account = privateKeyToAccount(signerKey as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
    });

    const memo = `eternal-article:${cid.slice(0, 32)}`;
    const txHash = await client.sendTransaction({
      to: wallet as `0x${string}`,
      value: 0n,
      data: toBytes(memo),
    });

    return NextResponse.json({
      txHash,
      mock: false,
      explorerUrl: `https://basescan.org/tx/${txHash}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
