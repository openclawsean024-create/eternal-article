"use client";

import { motion } from "framer-motion";

export interface ProgressStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done" | "error";
  detail?: string;
}

interface Props {
  steps: ProgressStep[];
}

export function UploadProgress({ steps }: Props) {
  return (
    <div className="space-y-2">
      {steps.map((step, idx) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`progress-step ${step.status === "active" ? "active" : ""} ${
            step.status === "done" ? "done" : ""
          }`}
        >
          <div className="shrink-0 w-5 h-5 flex items-center justify-center">
            {step.status === "pending" && (
              <div className="w-2 h-2 rounded-full bg-white/20" />
            )}
            {step.status === "active" && (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            )}
            {step.status === "done" && (
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {step.status === "error" && (
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xs">!</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={`text-sm ${
                step.status === "pending"
                  ? "text-white/40"
                  : step.status === "active"
                    ? "text-white"
                    : step.status === "done"
                      ? "text-white/60"
                      : "text-red-300"
              }`}
            >
              {step.label}
            </div>
            {step.detail && (
              <div className="font-mono text-[10px] text-white/40 truncate mt-0.5">
                {step.detail}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
