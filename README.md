# Eternal Article — 永久上鏈文章網站

> 貼文章 → 一鍵永久保存到區塊鏈
> MVP 三條主鏈: Sui + Walrus / Arweave / Base + IPFS
> Production: https://eternal-article.vercel.app

---

## 這是什麼

一個讓使用者把自己的文章(文字 / Markdown)永久保存到區塊鏈上的入口網站。
選擇一條鏈 → 連接對應錢包 → 貼上文章 → 按下「永久保存」 → 拿到一個永久連結。

### 三條主鏈的選擇

| 鏈 | 儲存層 | 特色 |
|---|---|---|
| **Sui + Walrus** | Walrus 去中心化儲存 | Move 語言、毫秒級確認 |
| **Arweave** | Arweave 原生永久層 | 「一次付費、200 年保證」 |
| **Base + IPFS** | IPFS via Pinata | Coinbase 生態、MetaMask 友善 |

> MVP 階段三條鏈都走 mock(確定性 SHA256 hash);真實鏈接待 v0.2。
> 不用裝錢包就能試完整流程:首頁「🎮 Try Demo」按鈕。

---

## 開發

### 環境需求

- Node.js 22+ (`brew install node@22` 或從 nodejs.org 下載)
- npm 10+
- macOS / Linux(已測過 macOS 26)

### 安裝與啟動

```bash
# 1. clone
git clone https://github.com/openclawsean024-create/eternal-article.git
cd eternal-article

# 2. 安裝依賴
npm install --legacy-peer-deps

# 3. 開發伺服器(localhost:3000)
npm run dev

# 4. Type check
npm run typecheck

# 5. Production build
npm run build
```

### 環境變數(可選)

把 `.env.local` 加在專案根目錄(沒設就走 demo / mock 模式):

```bash
# Pinata (Base + IPFS 用) — 沒設就 mock
NEXT_PUBLIC_PINATA_JWT=...

# Base anchor 真發交易用 — 沒設就 mock
ANCHOR_SIGNER_PRIVATE_KEY=0x...
BASE_RPC_URL=https://mainnet.base.org

# 用於 canonical URL + sitemap
NEXT_PUBLIC_BASE_URL=https://eternal-article.vercel.app
```

---

## 部署(已上 Vercel)

### 自動流程

1. `git push` → GitHub
2. Vercel GitHub App 自動 build + deploy
3. Production URL: https://eternal-article.vercel.app

### 手動觸發(用 Vercel CLI)

```bash
# 從 ~/.hermes/.env 或環境變數讀 VERCEL_TOKEN
node /Users/sean/.local/bin/vercel deploy --prod --yes
```

### 三向對齊(SOP)

```bash
bash /Volumes/MyDsik\(APFS\)/Hermes\ Agent/Hermes\ Project/sync-3way.sh \
  eternal-article --patch
```

會同時:
- 比對 local / GitHub / Vercel SHA
- PATCH Notion page `進度` 欄位
- 顯示 HTTP 健康狀態

---

## 檔案結構

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # 首頁(三鏈卡片 + Demo)
│   ├── about/              # 關於頁
│   ├── upload/[chain]/     # 上傳頁 (sui/arweave/base)
│   ├── r/[id]/             # 文章讀取頁(永久連結)
│   ├── api/                # API routes
│   │   ├── anchor/         # Base 真發 anchor tx
│   │   ├── article/[id]/   # 從 storage 拉內容
│   │   └── demo-upload/    # 不裝錢包的 demo 上傳
│   ├── icon.svg            # favicon
│   ├── opengraph-image.tsx # 動態 OG image
│   ├── twitter-image.tsx   # Twitter card
│   ├── robots.ts           # SEO robots.txt
│   ├── sitemap.ts          # SEO sitemap.xml
│   ├── error.tsx           # Error boundary
│   ├── global-error.tsx    # Root error boundary
│   └── not-found.tsx       # 404
├── components/
│   ├── Hero.tsx            # 首頁 hero 區塊
│   ├── ChainCard.tsx       # 主鏈選擇卡
│   ├── UploadForm.tsx      # 上傳表單
│   ├── WalletConnect.tsx   # 錢包偵測 + 連接
│   ├── UploadProgress.tsx  # 上傳進度條
│   ├── DemoButton.tsx      # Demo 模式按鈕
│   ├── ArticleReader.tsx   # 文章讀取 + 鏈上記錄
│   └── UploadPageClient.tsx
└── lib/
    ├── chains.ts           # 三條鏈的 metadata
    ├── article.ts          # ArticleRef + validation + gateway URL
    └── upload/
        ├── types.ts
        ├── sui.ts          # Sui + Walrus 上傳
        ├── arweave.ts      # Arweave 上傳(mock)
        └── base.ts         # Base + IPFS 上傳
PRD/
├── SPEC.md          # 完整 PRD v0.2
└── RESEARCH_NOTES.md # 主鏈/競品/SDK 研究報告
```

---

## 三向對齊狀態

| 表面 | 連結 |
|---|---|
| GitHub | https://github.com/openclawsean024-create/eternal-article |
| Vercel | https://eternal-article.vercel.app |
| Notion | https://app.notion.com/p/Eternal-Article-3b6449ca65d881a492e5e7347ba70bb5 |

`bash sync-3way.sh eternal-article --patch` 確認三處 SHA 一致。

---

## Roadmap

- **v0.1 (已上線)**: 骨架 + Demo + UI + 讀取頁
- **v0.2**: 真實 Arweave(Turbo SDK)+ Sui anchor contract + Base anchor 真發交易
- **v0.3**: 加 Solana(Metaplex Core)+ 自訂網域 + SEO 優化
- **v0.4**: WalletConnect v2 + RainbowKit 通用錢包

詳細見 `PRD/SPEC.md` §10。
