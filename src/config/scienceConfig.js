/**
 * 科學資料顯示與遊戲風險分級設定。
 * 風險等級是 MARS CREW 的教育遊戲解讀，不是火星表面輻射實測值。
 */
export const SCIENCE_CONFIG = Object.freeze({
  imageSearchUrl: 'https://images-api.nasa.gov/search?q=Curiosity%20Mars%20surface&media_type=image&page_size=20',
  weatherUrl: 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json',
  donkiSepBaseUrl: 'https://api.nasa.gov/DONKI/SEP',
  donkiLookbackDays: 30,
  cacheKey: 'mars-crew-science-content-v1',
  radiationLevels: Object.freeze([
    { level: 1, label: '很低', minimumEvents: 0, color: 'mint' },
    { level: 2, label: '低', minimumEvents: 1, color: 'blue' },
    { level: 3, label: '中等', minimumEvents: 2, color: 'gold' },
    { level: 4, label: '高', minimumEvents: 4, color: 'orange' },
    { level: 5, label: '極高', minimumEvents: 7, color: 'red' },
  ]),
})
