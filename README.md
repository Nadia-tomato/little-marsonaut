# MARS CREW

MARS CREW 是參加 NASA Space Apps Challenge 2026「Build a Junior Astronaut Mission Trainer」的單人教育遊戲原型。

目前為 Phase 1：完成 React + Vite 基礎架構、首頁、遊戲設計文件與開發進度紀錄。完整遊戲邏輯將在後續階段依 [docs/GDD.md](./docs/GDD.md) 開發。

## 啟動專案

```bash
npm install
npm run dev
```

瀏覽器開啟終端機顯示的本機網址即可查看首頁。建置檢查使用 `npm run build`。

## 專案結構

- `src/components/`：React UI 元件
- `src/game/`：遊戲狀態與規則邏輯（後續階段）
- `src/config/`：遊戲平衡參數（後續階段）
- `src/data/`：NASA 資料與科普內容（後續階段）
- `src/services/`：NASA API 服務（後續階段）
- `docs/`：設計文件與開發進度

## 重要原則

本專案是單人、手機優先的教育遊戲；遊戲模擬參數會與真實 NASA 資料清楚區分。請先閱讀 GDD 再進行後續開發。
