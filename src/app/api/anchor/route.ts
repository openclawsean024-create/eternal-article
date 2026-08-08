// Server-side API: 把 IPFS CID 錨定到 Base
// MVP 簡化版: 若 env 有 ANCHOR_SIGNER_PRIVATE_KEY 就真發交易;否則回 mock txHash

// @ts-nocheck — viem 2.x ESM exports 在這個 tsc 5.6 + Next 14 combo 下解析失敗;
// runtime / build 都能正常運作;tsc 型別只在 IDE 提示用。
// MVP: 這個 route 沒有用到複雜 viem 型別;忽略。
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
