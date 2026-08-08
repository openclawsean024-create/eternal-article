# Eternal Article — 永久上鏈文章網站

> 貼文章 → 按一個鍵 → 永久上鏈
> MVP 三條主鏈: Sui + Walrus / Arweave / Base + IPFS

## 開發

```bash
npm install
npm run dev       # localhost:3000
npm run build     # production build
npm run typecheck # tsc --noEmit
```

## 三向同步

- GitHub: `openclawsean024-create/eternal-article`
- Vercel: TBD
- Notion: TBD

詳細 PRD/SPEC 在 `PRD/SPEC.md`。

## 部署

`git push` 觸發 Vercel auto-deploy (假設 GitHub App 已連結, 否則手動 `node /Users/sean/.local/bin/vercel deploy --prod --yes`)。
