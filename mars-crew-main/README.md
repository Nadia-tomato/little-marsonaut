# LITTLE MARSONAUT — 模組化專案結構

## 目錄架構
- `index.html`：主入口頁面（注意：因瀏覽器 CORS 限制載入本地 `<script type="text/babel" src="...">`，請透過本地 HTTP Server 開啟，例如 `npx serve .` 或 `python -m http.server 8000`）。
- `src/styles.css`：獨立出的 CSS keyframes 動畫與樣式。
- `src/constants.js`：遊戲常數、科學說明資料庫、火星冷知識、探測車任務模式、岩石圖鑑與歷史天氣表。
- `src/services/nasaService.js`：**NASA API 取用模組**（串接 NASA Image and Video Library API 與 NASA DONKI SEP 太空輻射事件 API，含快取與離線備援機制）。
- `src/logic/palette.js`：火星日夜光影漸層插值計算（`lerpHexColor`、`getDayNightPalette`）。
- `src/logic/gameLogic.js`：核心遊戲數值演算（探測車抽樣機率、風暴與輻射損壞判定、溫室選項、每日資源消耗、太陽能結算與稱號評級）。
- `src/components/`：共用元件（`SharedUI.jsx`、`TitleCoverPage.jsx`、`MarsLaunchTransition.jsx`）。
- `src/modals/`：彈窗模組（`ScienceExplanationModal.jsx`、`SolarMiniGameModal.jsx`、`MorningBriefingModal.jsx`、`EndGameModal.jsx`）。
- `src/scenes/`：五大互動場景模組（`BaseExteriorScene.jsx`、`PowerRoomScene.jsx`、`GreenhouseRoomScene.jsx`、`RoverRoomScene.jsx`、`MissionControlScene.jsx`）。
- `src/App.jsx`：主狀態控制器與 Sol 每日循環計時器。
