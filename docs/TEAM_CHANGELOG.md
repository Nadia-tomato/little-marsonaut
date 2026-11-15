# MARS CREW — 團隊多人協作修改日誌 (Team Collaboration Changelog)

> 本文件詳細記錄本次修改內容、新增檔案、異動行數與 Git 協作指南，確保在與組員共同開發時能順利同步、避免衝突 (merge conflicts)。

---

## 📌 本次修改功能清單 (Features & Changes)

### 1. 遊戲起始封面頁文案優化 (`src/components/TitleCoverPage.jsx`)
- **移除任務目標副標題**：刪除了 `Send {OUR_ROVER_NAME} on longer trips to discover rare crystals, layered stones, and ancient life clues!`，讓任務目標更簡潔醒目。
- **移除頁尾年齡標註**：刪除了右下角 `Ages 7–12 Science Mission` 標註，維持簡潔視覺。

### 2. 基地主畫面右上角新增「?」科普按鈕 (`src/scenes/BaseExteriorScene.jsx`)
- 在火星基地主畫面右上角新增清晰的小型 `? Science Fact` 按鈕。
- 配色（底色 `#fdf6e9`、邊框 `#d9c2a3`、文字 `#5a3e28`、圓形金黃色徽章）與左上角的地標膠囊完全一致。
- 支援行動裝置（隱藏文字保留圓形圖示）與電腦端完整顯示。
- 不改動既有基地設施布局、四座建築點擊區與頂部 HUD。

### 3. 官方 NASA / CSA 查證科普資料庫 (`src/data/scienceFactsDatabase.js`)
- 查證並收錄 **25 則** 真實太空科學科普，專門依據 NASA Space Apps Challenge 2026 官方資源建立：
  1. **Mars & Geology**：
     - `geo_olympus_mons`（太陽系最高火山奧林帕斯山，PIA15443）
     - `geo_valles_marineris`（火星大峽谷水手號峽谷，PIA02005）
     - `geo_gale_crater`（蓋爾撞擊坑古代湖泊沉積岩，PIA16058）
     - `geo_jezero_delta`（耶澤羅撞擊坑古代三角洲，PIA24331）
     - `geo_dust_devils`（火星旋風塵捲風，PIA06334）
  2. **Rovers & Exploration**：
     - `rov_curiosity_drill`（好奇號岩石鑽孔粉末，PIA19140）
     - `rov_perseverance_moxie`（毅力號 MOXIE 原位製氧機，PIA24176）
     - `rov_ingenuity_helicopter`（機智號火星直升機首飛，PIA23882）
     - `rov_curiosity_selfie`（好奇號機械手臂自拍原理，PIA19920）
     - `rov_sample_tubes`（密封火星樣品管與封存計畫，PIA24744）
  3. **Solar Storms & Space Weather**：
     - `sol_solar_flare`（太陽閃焰爆發與光速傳播，PIA22244）
     - `sol_coronal_mass_ejection`（日冕物質拋射 CME 電漿雲，PIA21836）
     - `sol_mars_magnetic_field`（火星缺乏全域磁場保護與大氣剝離，PIA24836）
     - `sol_donki_tracking`（NASA DONKI 太陽高能粒子監測網路）
     - `sol_dust_storm_dimming`（全球級沙塵暴阻擋 90% 太陽能，PIA01167）
  4. **Space Farming & Food**：
     - `farm_veggie_tomatoes`（國際太空站 Veggie 矮生紅番茄，iss068e045298）
     - `farm_chile_peppers`（太空微重力種植綠辣椒，iss065e434038）
     - `farm_csa_food_toolkit`（加拿大太空總署 CSA 太空食品挑戰與極地農業，jsc2024e055706）
     - `farm_led_light_recipes`（紅藍 LED 光譜精確配方，iss068e025551）
     - `farm_water_recycling`（太空封閉水循環與植物蒸散回收，KSC-06pd1292）
  5. **Astronauts & Space Science**：
     - `astro_exercise_bones`（微重力骨質對抗與每日阻抗運動，iss009e19798）
     - `astro_radiation_vest`（個人輕量化防輻射背心研究，iss053e238888）
     - `astro_osdr_biology`（NASA OSDR 開放科學生物數據庫，iss053e238891）
     - `astro_mars_spacesuit`（加壓火星太空衣與生命維持，PIA24203）
     - `astro_fluid_shifts`（太空微重力體液上湧現象，iss007e08023）
- 嚴格控制科普本文長度在 **15–35 個英文單字**，語氣適合 7–12 歲兒童理解。
- 完整包含官方真實來源欄位：`id`, `category`, `title`, `fact`, `imageUrl`, `imageAlt`, `imageCredit`, `sourceName`, `sourceUrl`, `imageSourceUrl`, `sourceDate`。

### 4. 隨機科普卡片彈窗 (`src/modals/RandomScienceFactModal.jsx`)
- 點擊主畫面 `?` 開啟隨機科普卡片。
- 具備三大按鈕操作：
  - `Source ↗`：可開啟對應官方研究與 NASA 頁面。
  - `Another Fact 🎲`：隨機抽取下一則未重複科普。
  - `Close / ×`：關閉卡片返回遊戲。
- 在科普卡片開啟期間，背景 Sol 計時自動暫停，方便孩子閱讀。

### 5. 系統架構整合與載入
- `index.html` 與 `game.html` 引入新模組。
- `src/App.jsx` 注入隨機科普狀態管理與抽取邏輯。

---

## 🗂️ 檔案異動對照表 (Changed Files)

| 檔案 | 狀態 | 說明 |
|---|---|---|
| `src/data/scienceFactsDatabase.js` | **新增** | 25 則 NASA/CSA 官方查證科普資料庫 |
| `src/modals/RandomScienceFactModal.jsx` | **新增** | 科普卡片彈窗元件 |
| `src/components/TitleCoverPage.jsx` | 修改 | 移除指定之冗長副標題與年齡標記 |
| `src/scenes/BaseExteriorScene.jsx` | 修改 | 右上角新增 `? Science Fact` 按鈕 |
| `src/App.jsx` | 修改 | 彈窗狀態、隨機抽取演算法與計時保護 |
| `index.html` | 修改 | 加入新模組的 script 標籤載入 |
| `game.html` | 修改 | 同步本地測試與即時預覽入口 |
| `docs/TEAM_CHANGELOG.md` | **新增** | 本協作日誌 |

---

## 🚀 團隊避免衝突的推送流程 (How to Push Without Conflicts)

若組員此時正在 GitHub 或其本機上修改其他檔案，請依下列步驟推送：

```bash
# 1. 將本地修改提交至 Git 倉庫
git add src/ docs/ index.html game.html
git commit -m "feat: add NASA/CSA science database, random fact card modal and HUD button"

# 2. 拉取組員的最新更新（使用 rebase 自動變基合併，避免衝突）
git pull --rebase origin main

# 3. 推送至遠端 GitHub
git push origin main
```

- 若組員修改的是溫室、能源室或探測車等獨立檔案，Git 會全自動合併，完全不衝突。
- 若組員剛好也修改了 `index.html`，Git 會清楚標示衝突區塊，只需確認保留雙方引入的 `<script>` 即可。

---

## 🎨 補充優化紀錄 (Modal Streamlining & Readability Updates)
1. **視窗精簡與單一關閉按鈕**：
   - 刪除底部重複的 `Close` 按鈕，保留右上角標準 `×` 關閉鍵，消除雙關閉按鈕的困惑。
   - 底部操作區簡化為 `[ 🎲 Another Fact ]` 與 `[ Source ↗ ]`，版面更聚焦、比例更緊湊 (`max-w-sm`)。
   - 移除頂部冗長的裝飾文字，僅保留類別徽章與短標題。
2. **圖片載入 100% 零失敗保障**：
   - 全數 25 筆圖片網址經過伺服器實測驗證（全部回傳 HTTP 200 OK）。
   - 修復了原先 `farm_led_light_recipes` 圖片 403 報錯問題，替換為 NASA 官方甘迺迪太空中心植物工廠實拍圖片 (`KSC-20190516-PH_KLS01_0011`)。
   - 加入圖片載入防禦回退機制（`onError` 自動無縫載入備用好奇號火星照片），杜絕破圖可能。
3. **英文母語國小生（7–10 歲）淺白易懂語氣**：
   - 全數 25 則科普短文改寫為國小 2–4 年級可輕鬆理解之短句（每則約 20–25 個單字）。
   - 替換艱澀專有名詞，使用生活化、生動口吻（例如「Space Tacos」、「Super Grand Canyon」、「Juicy Tomatoes」）。
