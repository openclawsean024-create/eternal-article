// 文章型別
export interface ArticlePayload {
  title: string;
  content: string;
  author: string;
}

// 上傳過程的 progress callback
export interface UploadCallbacks {
  onSign?: () => void;
  onStore?: () => void;
  onAnchor?: (txHash: string) => void;
  onConfirm?: () => void;
}

export interface UploadResult {
  storage: string; // 儲存層的 blob id / hash
  txHash: string; // 鏈上交易的 hash
  storedAt: number;
}
