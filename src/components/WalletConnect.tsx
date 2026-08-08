"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ChainInfo } from "@/lib/chains";

interface Props {
  chain: ChainInfo;
  onConnected: (addr: string | null) => void;
}

interface WalletState {
  status: "idle" | "checking" | "not-installed" | "connecting" | "connected" | "error";
  address?: string;
  error?: string;
}

export function WalletConnect({ chain, onConnected }: Props) {
  const [state, setState] = useState<WalletState>({ status: "checking" });

  // 偵測錢包是否已安裝
  useEffect(() => {
    let cancelled = false;

    async function detect() {
      if (typeof window === "undefined") return;
      try {
        let installed = false;
        let addr: string | null = null;

        if (chain.id === "sui") {
          const suiWin = window as unknown as { suiWallet?: { hasPermissions: () => Promise<boolean> } };
          installed = !!(window as unknown as { sui?: unknown }).sui || !!suiWin.suiWallet;
          // 嘗試取得現有帳號(不觸發連線)
          const sui = (window as unknown as { sui?: { getAccounts?: () => Promise<string[]> } }).sui;
          if (sui?.getAccounts) {
            try {
              const accs = await sui.getAccounts();
              addr = accs?.[0] ?? null;
            } catch {
              // 沒權限,正常
            }
          }
        } else if (chain.id === "arweave") {
          installed = !!(window as unknown as { arweaveWallet?: unknown }).arweaveWallet;
        } else if (chain.id === "base") {
          installed = !!(window as unknown as { ethereum?: unknown }).ethereum;
        }

        if (cancelled) return;

        if (!installed) {
          setState({ status: "not-installed" });
          return;
        }

        if (addr) {
          setState({ status: "connected", address: addr });
          onConnected(addr);
        } else {
          setState({ status: "idle" });
        }
      } catch (err) {
        if (!cancelled) setState({ status: "error", error: String(err) });
      }
    }

    detect();
    return () => {
      cancelled = true;
    };
  }, [chain.id, onConnected]);

  async function connect() {
    setState((s) => ({ ...s, status: "connecting", error: undefined }));

    try {
      if (chain.id === "sui") {
        const sui = (window as unknown as { sui?: { requestPermissions: () => Promise<unknown> } }).sui;
        if (!sui) throw new Error("Sui Wallet 不可用");
        await sui.requestPermissions();
        const accs = await (window as unknown as { sui: { getAccounts: () => Promise<string[]> } }).sui.getAccounts();
        const addr = accs?.[0];
        if (!addr) throw new Error("沒拿到錢包地址");
        setState({ status: "connected", address: addr });
        onConnected(addr);
      } else if (chain.id === "arweave") {
        const w = (window as unknown as { arweaveWallet?: { connect: (p: { permissions: string[] }) => Promise<string> } }).arweaveWallet;
        if (!w) throw new Error("ArConnect 不可用");
        const addr = await w.connect({ permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION"] });
        setState({ status: "connected", address: addr });
        onConnected(addr);
      } else if (chain.id === "base") {
        const eth = (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
        if (!eth) throw new Error("MetaMask 不可用");
        const accs = await eth.request({ method: "eth_requestAccounts" });
        const addr = accs?.[0];
        if (!addr) throw new Error("沒拿到錢包地址");
        setState({ status: "connected", address: addr });
        onConnected(addr);
      }
    } catch (err) {
      setState({
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-2">
            錢包
          </div>

          {state.status === "checking" && (
            <div className="text-white/50 text-sm">偵測錢包中...</div>
          )}

          {state.status === "not-installed" && (
            <div className="space-y-2">
              <div className="text-white/80 text-sm">
                沒看到 {chain.walletName}
              </div>
              <a
                href={chain.walletUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs underline text-white/60 hover:text-white"
              >
                前往安裝 →
              </a>
            </div>
          )}

          {state.status === "idle" && (
            <div className="text-white/80 text-sm">
              點右邊按鈕連接 {chain.walletName}
            </div>
          )}

          {state.status === "connecting" && (
            <div className="text-white/60 text-sm">等待錢包確認...</div>
          )}

          {state.status === "connected" && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-sm text-white/90">
                {state.address?.slice(0, 6)}...{state.address?.slice(-4)}
              </span>
            </div>
          )}

          {state.status === "error" && (
            <div className="text-red-300 text-sm">{state.error}</div>
          )}
        </div>

        <button
          onClick={connect}
          disabled={
            state.status === "not-installed" ||
            state.status === "connecting" ||
            state.status === "checking" ||
            state.status === "connected"
          }
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            state.status === "connected"
              ? "bg-white/5 text-white/40 cursor-default"
              : "bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30"
          }`}
        >
          {state.status === "connected"
            ? "已連接"
            : state.status === "connecting"
              ? "連接中..."
              : `Connect ${chain.walletName}`}
        </button>
      </div>
    </motion.div>
  );
}
