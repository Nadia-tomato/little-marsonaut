import { SCIENCE_CONFIG } from '../config/scienceConfig.js'
import { FALLBACK_MARS_IMAGES, FALLBACK_WEATHER } from '../data/mockMissionData.js'

const memoryCache = new Map()

function nasaApiKey() {
  return typeof import.meta !== 'undefined' && import.meta.env?.VITE_NASA_DONKI_API_KEY
    ? import.meta.env.VITE_NASA_DONKI_API_KEY
    : 'DEMO_KEY'
}

function cacheRead(key) {
  if (memoryCache.has(key)) return memoryCache.get(key)
  try {
    const saved = globalThis.localStorage?.getItem(key)
    if (saved) {
      const value = JSON.parse(saved)
      memoryCache.set(key, value)
      return value
    }
  } catch {
    // localStorage may be unavailable in private browsing or tests.
  }
  return null
}

function cacheWrite(key, value) {
  memoryCache.set(key, value)
  try { globalThis.localStorage?.setItem(key, JSON.stringify(value)) } catch { /* optional cache */ }
  return value
}

async function fetchJson(url, fetchImpl) {
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error(`NASA request failed: ${response.status}`)
  return response.json()
}

function pickImageUrl(item) {
  const link = item.links?.find(({ rel }) => rel === 'preview') ?? item.links?.find(({ render }) => render === 'image')
  return link?.href?.replace(/^http:/, 'https:') ?? null
}

function normaliseImage(item) {
  const metadata = item.data?.[0] ?? {}
  const nasaId = metadata.nasa_id ?? 'unknown'
  return {
    nasaId,
    title: metadata.title ?? 'NASA Mars image',
    dateCreated: metadata.date_created?.slice(0, 10) ?? '無資料',
    mission: metadata.keywords?.includes('Mars Science Laboratory MSL') ? 'Mars Science Laboratory / Curiosity' : 'NASA Mars mission',
    imageUrl: pickImageUrl(item),
    sourceUrl: `https://images.nasa.gov/details/${nasaId}`,
    credit: metadata.secondary_creator ?? metadata.center ?? 'NASA',
    education: '這張 NASA 火星影像讓我們可以觀察真實的火星地表與探測任務環境。',
  }
}

function normaliseWeather(record, sourceSnapshotDate = null) {
  return {
    sol: record.sol ?? '無資料',
    terrestrialDate: record.terrestrial_date ?? '無資料',
    minTemp: record.min_temp ?? '--',
    maxTemp: record.max_temp ?? '--',
    pressure: record.pressure ?? '--',
    windSpeed: record.wind_speed ?? '--',
    sourceSnapshotDate,
  }
}

export function getCachedScienceContent() {
  return cacheRead(SCIENCE_CONFIG.cacheKey)
}

export async function fetchMarsImages({ fetchImpl = globalThis.fetch, forceRefresh = false } = {}) {
  const cacheKey = `${SCIENCE_CONFIG.cacheKey}:images`
  if (!forceRefresh) {
    const cached = cacheRead(cacheKey)
    if (cached) return { records: cached, source: 'cache', error: null }
  }
  try {
    const payload = await fetchJson(SCIENCE_CONFIG.imageSearchUrl, fetchImpl)
    const records = (payload.collection?.items ?? []).map(normaliseImage).filter(({ imageUrl }) => imageUrl)
    if (!records.length) throw new Error('NASA Images API returned no usable images')
    cacheWrite(cacheKey, records)
    return { records, source: 'live', error: null }
  } catch (error) {
    return { records: FALLBACK_MARS_IMAGES, source: 'fallback', error: error.message }
  }
}

export async function fetchMarsWeather({ fetchImpl = globalThis.fetch, forceRefresh = false } = {}) {
  const cacheKey = `${SCIENCE_CONFIG.cacheKey}:weather`
  if (!forceRefresh) {
    const cached = cacheRead(cacheKey)
    if (cached) return { records: cached, source: 'cache', error: null }
  }
  try {
    const payload = await fetchJson(SCIENCE_CONFIG.weatherUrl, fetchImpl)
    const records = Object.values(payload.soles ?? {}).map((record) => normaliseWeather(record, new Date().toISOString().slice(0, 10)))
    if (!records.length) throw new Error('NASA MSL weather feed returned no records')
    cacheWrite(cacheKey, records)
    return { records, source: 'live', error: null }
  } catch (error) {
    return { records: FALLBACK_WEATHER, source: 'fallback', error: error.message }
  }
}

export async function fetchSpaceWeather({ fetchImpl = globalThis.fetch, forceRefresh = false, now = new Date() } = {}) {
  const cacheKey = `${SCIENCE_CONFIG.cacheKey}:space-weather`
  if (!forceRefresh) {
    const cached = cacheRead(cacheKey)
    if (cached) return { ...cached, source: 'cache', error: null }
  }
  const endDate = now.toISOString().slice(0, 10)
  const start = new Date(now.getTime() - SCIENCE_CONFIG.donkiLookbackDays * 86400000).toISOString().slice(0, 10)
  const url = `${SCIENCE_CONFIG.donkiSepBaseUrl}?startDate=${start}&endDate=${endDate}&api_key=${encodeURIComponent(nasaApiKey())}`
  try {
    const events = await fetchJson(url, fetchImpl)
    const value = { events: Array.isArray(events) ? events : [], source: 'live', error: null }
    cacheWrite(cacheKey, value)
    return value
  } catch (error) {
    return { events: [], source: 'fallback', error: error.message }
  }
}

export function getRadiationRisk(events = []) {
  return [...SCIENCE_CONFIG.radiationLevels].reverse().find(({ minimumEvents }) => events.length >= minimumEvents) ?? SCIENCE_CONFIG.radiationLevels[0]
}

export function selectScienceForSol(content, sol) {
  const imageRecords = content?.images?.records?.length ? content.images.records : FALLBACK_MARS_IMAGES
  const weatherRecords = content?.weather?.records?.length ? content.weather.records : FALLBACK_WEATHER
  return {
    image: imageRecords[(Math.max(sol, 1) - 1) % imageRecords.length],
    weather: weatherRecords[(Math.max(sol, 1) - 1) % weatherRecords.length],
    spaceWeather: content?.spaceWeather ?? { events: [], source: 'fallback', error: '尚未載入' },
  }
}

export async function fetchMissionContent(options = {}) {
  const cached = getCachedScienceContent()
  if (cached && !options.forceRefresh) return cached
  const [images, weather, spaceWeather] = await Promise.all([
    fetchMarsImages(options),
    fetchMarsWeather(options),
    fetchSpaceWeather(options),
  ])
  return cacheWrite(SCIENCE_CONFIG.cacheKey, { images, weather, spaceWeather, loadedAt: new Date().toISOString() })
}
