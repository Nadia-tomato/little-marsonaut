export const MOCK_MARS_FACTS = [
  '任務示範資料：火星表面有許多由火山活動形成的岩石。',
  '任務示範資料：探測車可以幫助科學家研究無法直接抵達的地形。',
  '任務示範資料：火星的一天稱為 Sol，長度與地球的一天相近。',
]

// 這些文字是教育說明，不代表某次遊戲抽樣就是 NASA 的真實發現。
export const SAMPLE_EDUCATION = Object.freeze({
  none: '沒有找到樣本也是科學結果，探測車可以在下一個 Sol 繼續觀察。',
  basalt: '玄武岩是常見的火山岩，由冷卻的熔岩形成；火星上也有大量火山岩。',
  ironMineral: '火星塵土中的鐵礦物氧化後會呈現紅色，這也是火星看起來偏紅的原因之一。',
  waterMineral: '含水礦物的結構中可能保存過水的線索，但它不等於可以直接開採的水冰。',
  specialGeology: '特殊地質樣本可以幫助科學家了解火星曾經歷過的火山、風化與沉積作用。',
  majorDiscovery: '這是虛構的遊戲情節，不是 NASA 已證實的外星生命或真實重大發現。',
})

// API 無法連線時使用的有來源備援：NASA MSL weather feed 的歷史紀錄（擷取日期見 sourceSnapshotDate）。
export const FALLBACK_WEATHER = Object.freeze([
  { sol: '4995', terrestrialDate: '2026-08-25', minTemp: '-71', maxTemp: '-5', pressure: '777', windSpeed: '--', sourceSnapshotDate: '2026-11-14' },
  { sol: '4994', terrestrialDate: '2026-08-24', minTemp: '-72', maxTemp: '-6', pressure: '778', windSpeed: '--', sourceSnapshotDate: '2026-11-14' },
])

// API 無法連線時使用的有來源備援圖片；URL 與 metadata 來自 NASA Images and Video Library。
export const FALLBACK_MARS_IMAGES = Object.freeze([
  {
    nasaId: 'PIA16018', title: 'Gravel-Covered Martian Surface', dateCreated: '2012-08-08', mission: 'Mars Science Laboratory / Curiosity',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA16018/PIA16018~medium.jpg', sourceUrl: 'https://images.nasa.gov/details/PIA16018', credit: 'NASA/JPL-Caltech/MSSS',
    education: '這張照片顯示 Curiosity 著陸後看到的火星礫石表面。科學家可以從岩石與土壤的形狀研究火星環境。',
  },
  {
    nasaId: 'PIA15991', title: 'Curiosity Color Close-Up upon Landing', dateCreated: '2012-08-07', mission: 'Mars Science Laboratory / Curiosity',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA15991/PIA15991~thumb.jpg', sourceUrl: 'https://images.nasa.gov/details/PIA15991', credit: 'NASA/JPL-Caltech/MSSS',
    education: 'Curiosity 會拍攝周圍地面，讓團隊知道探測車的位置與附近的岩石地形。',
  },
  {
    nasaId: 'PIA16019', title: 'A Better Look of the Martian Surface', dateCreated: '2012-08-08', mission: 'Mars Science Laboratory / Curiosity',
    imageUrl: 'https://images-assets.nasa.gov/image/PIA16019/PIA16019~small.jpg', sourceUrl: 'https://images.nasa.gov/details/PIA16019', credit: 'NASA/JPL-Caltech/MSSS/University of Arizona',
    education: '從高處看火星地表，可以幫助科學家規劃安全又有科學價值的探測路線。',
  },
])
