"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ChainInfo } from "@/lib/chains";
import { validateContent, encodeArticleRef, type ArticleRef } from "@/lib/article";
import { uploadToSui } from "@/lib/upload/sui";
import { uploadToArweave } from "@/lib/upload/arweave";
import { uploadToBase } from "@/lib/upload/base";
import { UploadProgress, type ProgressStep } from "@/components/UploadProgress";

interface Props {
  chain: ChainInfo;
  walletAddress: string | null;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function UploadForm({ chain, walletAddress }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ProgressStep[]>([
    { id: "sign", label: "Sign in wallet", status: "pending" },
    { id: "store", label: "Upload to storage layer", status: "pending" },
    { id: "anchor", label: "Anchor hash on chain", status: "pending" },
    { id: "confirm", label: "Wait for confirmation", status: "pending" },
  ]);

  const canSubmit =
    state === "idle" &&
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    walletAddress !== null;

  async function handleSubmit() {
    if (!walletAddress) {
      setError("請先連接錢包");
      return;
    }

    const err = validateContent(title, content);
    if (err) {
      setError(err);
      return;
    }

    setError(null);
    setState("uploading");
    setSteps([
      { id: "sign", label: "Sign in wallet", status: "active" },
      { id: "store", label: "Upload to storage layer", status: "pending" },
      { id: "anchor", label: "Anchor hash on chain", status: "pending" },
      { id: "confirm", label: "Wait for confirmation", status: "pending" },
    ]);

    try {
      const payload = { title, content, author: author || "anonymous" };

      // 通用 helper: 更新某個 step 狀態
      const updateStep = (id: string, patch: Partial<ProgressStep>) => {
        setSteps((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        );
      };

      let ref: ArticleRef;
      if (chain.id === "sui") {
        ref = await uploadToSui(payload, walletAddress, {
          onSign: () => updateStep("sign", { status: "done" }),
          onStore: () => updateStep("store", { status: "active" }),
          onAnchor: (txHash) => {
            updateStep("store", { status: "done" });
            updateStep("anchor", { status: "active", detail: txHash });
          },
          onConfirm: () => {
            updateStep("anchor", { status: "done" });
            updateStep("confirm", { status: "active" });
          },
        });
      } else if (chain.id === "arweave") {
        ref = await uploadToArweave(payload, walletAddress, {
          onSign: () => updateStep("sign", { status: "done" }),
          onStore: () => updateStep("store", { status: "active" }),
          onAnchor: (txHash) => {
            updateStep("store", { status: "done" });
            updateStep("anchor", { status: "active", detail: txHash });
          },
          onConfirm: () => {
            updateStep("anchor", { status: "done" });
            updateStep("confirm", { status: "active" });
          },
        });
      } else {
        ref = await uploadToBase(payload, walletAddress, {
          onSign: () => updateStep("sign", { status: "done" }),
          onStore: () => updateStep("store", { status: "active" }),
          onAnchor: (txHash) => {
            updateStep("store", { status: "done" });
            updateStep("anchor", { status: "active", detail: txHash });
          },
          onConfirm: () => {
            updateStep("anchor", { status: "done" });
            updateStep("confirm", { status: "active" });
          },
        });
      }

      updateStep("confirm", { status: "done" });

      // 跳到成功頁(把 ref 編碼到 URL)
      const id = encodeArticleRef(ref);
      setTimeout(() => router.push(`/r/${id}`), 300);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : String(e));
      setSteps((prev) =>
        prev.map((s) => (s.status === "active" ? { ...s, status: "error" } : s)),
      );
    }
  }

  const byteSize = new TextEncoder().encode(title + content).length;
  const byteLimit = 200 * 1024;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            標題 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="給你的文章一個名字"
            disabled={state === "uploading"}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 transition"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
            作者 <span className="text-white/30">(選填)</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={100}
            placeholder="anonymous"
            disabled={state === "uploading"}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs uppercase tracking-widest text-white/40">
              內容 <span className="text-red-400">*</span>
              <span className="ml-2 normal-case tracking-normal text-white/30">
                支援 Markdown
              </span>
            </label>
            <span
              className={`text-xs font-mono ${
                byteSize > byteLimit
                  ? "text-red-400"
                  : byteSize > byteLimit * 0.8
                    ? "text-yellow-300"
                    : "text-white/40"
              }`}
            >
              {(byteSize / 1024).toFixed(1)} / 200 KB
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder={"# 我的第一篇永久文章\n\n這段文字會永遠留在區塊鏈上。"}
            disabled={state === "uploading"}
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/30 transition font-mono text-sm leading-relaxed resize-y"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            ⚠ {error}
          </div>
        )}

        {state === "idle" && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-4 rounded-lg text-base font-semibold transition ${
              canSubmit
                ? `bg-white text-black hover:bg-white/90`
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            {walletAddress
              ? `Upload to ${chain.name}`
              : `請先連接 ${chain.walletName}`}
          </button>
        )}

        {state === "uploading" && (
          <div>
            <UploadProgress steps={steps} />
            <div className="mt-3 text-xs text-white/40 text-center">
              不要關閉頁面...
            </div>
          </div>
        )}

        {state === "error" && (
          <button
            onClick={() => {
              setState("idle");
              setError(null);
            }}
            className="w-full py-4 rounded-lg text-base font-semibold bg-white/10 hover:bg-white/15 text-white transition"
          >
            重試(文章內容保留)
          </button>
        )}
      </div>
    </motion.div>
  );
}
