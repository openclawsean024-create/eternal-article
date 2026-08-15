"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckIcon } from "@/components/icons";

export interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  detail?: string;
}

interface Props {
  steps: ProgressStep[];
}

/**
 * UploadProgress — 4-step stepper with connector lines
 * 設計重點 (per ui-ux-pro-max):
 *   - 進度視覺化(步驟條 + connecting line)
 *   - prefers-reduced-motion: 移除 fill 動畫,只保留顏色 transition
 *   - aria-live="polite" — 螢幕閱讀器會宣告進度
 *   - 步驟完成有 CheckIcon(不用 emoji)
 */
export function UploadProgress({ steps }: Props) {
  const reduced = useReducedMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="上傳進度"
      className="stepper"
    >
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        return (
          <div
            key={step.id}
            className={`stepper-step ${step.status}`}
            aria-current={step.status === "active" ? "step" : undefined}
          >
            <div
              className={`stepper-circle ${
                step.status === "active"
                  ? "active"
                  : step.status === "done"
                    ? "done"
                    : step.status === "error"
                      ? "error"
                      : ""
              }`}
              aria-hidden="true"
            >
              {step.status === "done" ? (
                <CheckIcon className="w-4 h-4" />
              ) : step.status === "error" ? (
                "!"
              ) : reduced ? (
                // reduced motion: 不顯示 spinner,改用靜態數字
                idx + 1
              ) : (
                // default: spinner
                <motion.span
                  className="block w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </div>

            <div className="stepper-label">{step.label}</div>

            {step.detail && (
              <div
                className="mt-1 font-mono text-[10px] text-white/40 truncate max-w-full px-1"
                title={step.detail}
              >
                {step.detail}
              </div>
            )}

            {!isLast && (
              <div
                className={`stepper-connector ${
                  step.status === "done" ? "done" : step.status === "active" ? "active" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
