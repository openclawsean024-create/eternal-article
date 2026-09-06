# Eternal Article · 變更日誌

---

## v3.0.2 — 2026-09-06

> v3.0.2 完成於 2026-09-06 by **Sean 10-repo-fleet**

### Added
- `PRD/SPEC.md` 頂部 v3.0.2 banner + 末尾「Fleet v3.0.2 對齊摘要」（Module Map / 環境變數 / 部署契約 / 降級策略 / 已知未上鏈）
- `PRD/CHANGELOG.md` — 本檔
- `.github/workflows/ci.yml` — 4-job CI（lint / test / build / deploy → Vercel）
- `tests/article.test.mjs` — Node 22 內建 test runner 單元測試（11 個 case 涵蓋 MAX_CONTENT_BYTES / validateContent / encodeArticleRef / decodeArticleRef / gatewayUrl / round-trip / 壞字串 fallback / 三鏈 gateway URL）
- `package.json` 加 `test` script（`node --experimental-strip-types --test tests/*.test.mjs`）

### Preserved
- 原 v0.2 PRD 規格書完整保留（§0–§10 + 30KB RESEARCH_NOTES.md + 30KB 全文）
- 原始 Next.js 14 + Tailwind 3 + framer-motion + viem 程式碼不動
- `next.config.js` / `tailwind.config.ts` / `tsconfig.json` 不動

### Validation
- `npm run typecheck` → ✅ pass
- `npm run lint` → ✅ 0 warnings, 0 errors
- `npm test` → ✅ 11/11 pass
- `npm run build` → ✅ pass（13 routes: /, /about, /upload/[chain], /r/[id], /api/*, /opengraph-image, /twitter-image, /icon.svg, /robots.txt, /sitemap.xml, /_not-found）

### Notes
- Default branch = `main`
- 部署目標 = Vercel（`eternal-article.vercel.app`，已有 owner 維護中的 production）
- GHA workflow 使用 `amondnet/vercel-action@v25` 部署（需 `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` secrets，owner 之後填入）

---

## v0.2 — 2026-08-09

- PRD v0.2：加入研究備註 + SDK 選型對齊 + Roadmap
- 技術選型：Next.js 14 + Tailwind + framer-motion + viem
- 三鏈 MVP 骨架：Sui + Walrus / Arweave / Base + IPFS（皆 mock）
- 部署：Vercel production URL 上線
- Notion 同步：`app.notion.com/p/Eternal-Article-3b6449ca65d881a492e5e7347ba70bb5`

---

## v0.1 — 2026-08-09

- MVP 簡版初稿
- 一句話定位：「貼文章、按一個鍵、永久上鏈」
- Persona 4 種：部落客/作家 / 研究者記者 / 內容創作者 / 加密小白
- Happy Path 7 步流程
- 8 個 Non-Goals（不做登入/付費/編輯器/協作/NFT 等）

---

## 上鏈進度（v0.1 階段）

| 鏈 | 儲存 | Anchor | Demo 模式 |
|---|---|---|---|
| Sui + Walrus | Walrus HTTP API mock | mock (blobId) | ✅ |
| Arweave | sha256 mock | mock (hash) | ✅ |
| Base + IPFS | IPFS mock / Pinata JWT | keccak256 mock (server) | ✅ |
