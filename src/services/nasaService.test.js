import assert from 'node:assert/strict'
import test from 'node:test'
import { FALLBACK_MARS_IMAGES, FALLBACK_WEATHER } from '../data/mockMissionData.js'
import {
  fetchMarsImages,
  fetchMarsWeather,
  fetchSpaceWeather,
  getRadiationRisk,
  selectScienceForSol,
} from './nasaService.js'

const response = (body, ok = true) => ({ ok, status: ok ? 200 : 503, json: async () => body })

test('normalises live NASA Images API results', async () => {
  const result = await fetchMarsImages({ forceRefresh: true, fetchImpl: async () => response({ collection: { items: [{ data: [{ nasa_id: 'PIA-test', title: 'Mars surface', date_created: '2020-01-02T00:00:00Z', keywords: ['Mars Science Laboratory MSL'], secondary_creator: 'NASA/JPL' }], links: [{ rel: 'preview', href: 'http://images-assets.nasa.gov/test.jpg' }] }] } }) })
  assert.equal(result.source, 'live')
  assert.equal(result.records[0].nasaId, 'PIA-test')
  assert.equal(result.records[0].imageUrl, 'https://images-assets.nasa.gov/test.jpg')
  assert.equal(result.records[0].mission, 'Mars Science Laboratory / Curiosity')
})

test('falls back to sourced Mars images when NASA Images API fails', async () => {
  const result = await fetchMarsImages({ forceRefresh: true, fetchImpl: async () => { throw new Error('offline') } })
  assert.equal(result.source, 'fallback')
  assert.deepEqual(result.records, FALLBACK_MARS_IMAGES)
  assert.match(result.records[0].sourceUrl, /images\.nasa\.gov/)
})

test('preserves missing weather fields as unavailable data', async () => {
  const result = await fetchMarsWeather({ forceRefresh: true, fetchImpl: async () => response({ soles: { latest: { sol: '10', terrestrial_date: '2024-01-01', min_temp: '--', max_temp: '-5', pressure: '700', wind_speed: '--' } } }) })
  assert.equal(result.source, 'live')
  assert.equal(result.records[0].minTemp, '--')
  assert.equal(result.records[0].windSpeed, '--')
})

test('falls back to sourced historical weather when weather API fails', async () => {
  const result = await fetchMarsWeather({ forceRefresh: true, fetchImpl: async () => response({}, false) })
  assert.equal(result.source, 'fallback')
  assert.deepEqual(result.records, FALLBACK_WEATHER)
})

test('maps DONKI response to an adjustable five-level game risk', async () => {
  const result = await fetchSpaceWeather({ forceRefresh: true, now: new Date('2026-11-14T00:00:00Z'), fetchImpl: async () => response([{}, {}, {}, {}]) })
  assert.equal(result.source, 'live')
  assert.equal(getRadiationRisk(result.events).level, 4)
  assert.equal(getRadiationRisk([]).label, '很低')
})

test('selects cached content by Sol without another API call', () => {
  const content = { images: { records: [{ nasaId: 'a' }, { nasaId: 'b' }] }, weather: { records: [{ sol: '1' }, { sol: '2' }] }, spaceWeather: { events: [], source: 'live' } }
  assert.equal(selectScienceForSol(content, 3).image.nasaId, 'a')
  assert.equal(selectScienceForSol(content, 2).weather.sol, '2')
})
