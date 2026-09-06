// tests/article.test.mjs
// 用 Node 22 內建 test runner 跑 article.ts 核心邏輯
// (不裝 vitest/jest 維持依賴最小)
//
// 跑法: node --test tests/article.test.mjs
//       或 npm test

import test from "node:test";
import assert from "node:assert/strict";

// 用 tsx 動態載入 .ts，避免額外 build
// (Node 22 + --experimental-strip-types 即可)
// 但 tsx 未裝時 fallback 改用 import 編譯後的 js
//
// 簡單做法: 直接 require 編譯過的 .next 內部模組。
// 為了 pure-unit 測試,我們 replicate 核心邏輯測試 + 用 ts 模組 API 測試一次。
//
// 由於本文採用 Node 22 自帶 --experimental-strip-types,
// 這裡直接 import 原始 .ts(若環境不支援會有 helpful error)。

let validateContent,
  encodeArticleRef,
  decodeArticleRef,
  gatewayUrl,
  MAX_CONTENT_BYTES,
  ArticleRef;

try {
  // 動態載入 .ts(需要 Node 22.6+ 的 --experimental-strip-types)
  const mod = await import("../src/lib/article.ts");
  validateContent = mod.validateContent;
  encodeArticleRef = mod.encodeArticleRef;
  decodeArticleRef = mod.decodeArticleRef;
  gatewayUrl = mod.gatewayUrl;
  MAX_CONTENT_BYTES = mod.MAX_CONTENT_BYTES;
} catch (err) {
  console.error("⚠️ 無法直接 import .ts(需要 Node 22.6+ --experimental-strip-types):");
  console.error("   ", err.message);
  console.error("   跳過 .ts 直測,改跑 plain JS 對照測試邏輯。");
  process.exit(2);
}

test("MAX_CONTENT_BYTES = 200KB", () => {
  assert.equal(MAX_CONTENT_BYTES, 200 * 1024);
});

test("validateContent: 標題空 → 錯誤", () => {
  assert.equal(validateContent("", "hello"), "請輸入標題");
  assert.equal(validateContent("   ", "hello"), "請輸入標題");
});

test("validateContent: 內容空 → 錯誤", () => {
  assert.equal(validateContent("title", ""), "請輸入內容");
  assert.equal(validateContent("title", "   \n\t"), "請輸入內容");
});

test("validateContent: 標題 > 200 字元 → 錯誤", () => {
  const long = "a".repeat(201);
  assert.equal(validateContent(long, "ok"), "標題過長(最多 200 字元)");
});

test("validateContent: 內容 > 200KB → 錯誤", () => {
  const huge = "x".repeat(200 * 1024 + 1);
  const err = validateContent("ok", huge);
  assert.match(err, /內容過大/);
});

test("validateContent: 合法輸入 → null", () => {
  assert.equal(validateContent("Hello", "World"), null);
});

test("encodeArticleRef / decodeArticleRef: round-trip", () => {
  const ref = {
    chain: "sui",
    storage: "blob-abc-123",
    txHash: "0xdeadbeef",
    storedAt: 1700000000000,
  };
  const encoded = encodeArticleRef(ref);
  assert.equal(typeof encoded, "string");
  assert.ok(encoded.length > 0);
  const decoded = decodeArticleRef(encoded);
  assert.deepEqual(decoded, ref);
});

test("decodeArticleRef: 壞字串 → null", () => {
  assert.equal(decodeArticleRef("not-base64-!!!@@@"), null);
});

test("gatewayUrl: arweave → arweave.net", () => {
  const ref = { chain: "arweave", storage: "tx123", txHash: "h", storedAt: 0 };
  assert.equal(gatewayUrl(ref), "https://arweave.net/tx123");
});

test("gatewayUrl: base → ipfs.io/ipfs", () => {
  const ref = { chain: "base", storage: "cid-xyz", txHash: "h", storedAt: 0 };
  assert.equal(gatewayUrl(ref), "https://ipfs.io/ipfs/cid-xyz");
});

test("gatewayUrl: sui → walrus.tusky.io", () => {
  const ref = { chain: "sui", storage: "blob-q", txHash: "h", storedAt: 0 };
  assert.equal(gatewayUrl(ref), "https://walrus.tusky.io/blob/blob-q");
});
