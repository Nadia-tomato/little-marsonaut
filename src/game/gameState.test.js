import assert from 'node:assert/strict'
import test from 'node:test'
import {
  chargeRover,
  createInitialGameState,
  dispatchRover,
  advanceGameTime,
  launchRover,
  electrolyzeWater,
  getAdjustedSampleProbabilities,
  getScoreTitle,
  harvestTomato,
  plantTomato,
  settleSol,
  waterTomato,
} from './gameState.js'
import { BALANCE_CONFIG, RESOURCE_MAX, SOL_CONFIG } from '../config/gameConfig.js'

test('creates the GDD initial resources and Sol state', () => {
  const state = createInitialGameState()
  assert.deepEqual(state.resources, { oxygen: 70, power: 70, water: 100, food: 60 })
  assert.equal(state.currentSol, 1)
  assert.equal(state.rover.battery, 0)
})

test('electrolysis consumes water and power and increases oxygen', () => {
  const result = electrolyzeWater(createInitialGameState())
  assert.equal(result.event.type, 'electrolysis-complete')
  assert.equal(result.state.resources.water, 95)
  assert.equal(result.state.resources.power, 65)
  assert.equal(result.state.resources.oxygen, 78)
})

test('tomato can be planted, watered once per Sol, grown and harvested', () => {
  let state = plantTomato(createInitialGameState()).state
  state = waterTomato(state).state
  assert.equal(state.resources.water, 96)
  assert.equal(waterTomato(state).event.reason, 'already-watered-this-sol')
  state = advanceGameTime(state, 60, { solDurationSeconds: 120, random: () => 0.99 }).state
  assert.equal(state.tomato.growth, BALANCE_CONFIG.tomato.maxGrowth)
  const harvest = harvestTomato(state)
  assert.equal(harvest.event.type, 'tomato-harvested')
  assert.equal(harvest.state.resources.food, 60 - (BALANCE_CONFIG.dailyConsumption.food * 0.5) + BALANCE_CONFIG.tomato.foodYield)
  assert.equal(harvestTomato(harvest.state).event.reason, 'not-ready')
})

test('tomato spoils after one half-Sol of maturity if not harvested', () => {
  let state = plantTomato(createInitialGameState()).state
  state = advanceGameTime(state, 121, { solDurationSeconds: 120, random: () => 0.99 }).state
  assert.equal(state.tomato.growth, BALANCE_CONFIG.tomato.maxGrowth)
  assert.equal(state.tomato.spoiled, true)
  assert.equal(harvestTomato(state).event.reason, 'spoiled')
})

test('rover battery is discrete, costs power, and cannot dispatch at zero', () => {
  const initial = createInitialGameState()
  assert.equal(dispatchRover(initial, 0).event.reason, 'empty-battery')
  const charged = chargeRover(initial, 3).state
  assert.equal(charged.rover.battery, 3)
  assert.equal(charged.resources.power, 70 - (3 * BALANCE_CONFIG.rover.powerPerBatteryCell))
})

test('rover dispatches at most once per Sol and records sample score/count', () => {
  const charged = chargeRover(createInitialGameState(), 5).state
  const first = dispatchRover(charged, 0.65)
  assert.equal(first.event.type, 'rover-dispatched')
  assert.equal(first.state.samples.counts.ironMineral, 1)
  assert.equal(first.state.samples.score, 15)
  assert.equal(dispatchRover(first.state, 0.5).event.reason, 'already-explored-this-sol')
})

test('battery adjustment moves reduced discovery probability into no discovery', () => {
  const probabilities = getAdjustedSampleProbabilities(1)
  const total = probabilities.reduce((sum, sample) => sum + sample.probability, 0)
  assert.ok(Math.abs(total - 1) < 0.0000001)
  assert.ok(Math.abs(probabilities.find((sample) => sample.type === 'none').probability - 0.65) < 0.0000001)
  assert.equal(probabilities.find((sample) => sample.type === 'basalt').probability, 0.15)
  assert.equal(getAdjustedSampleProbabilities(0).find((sample) => sample.type === 'none').probability, 1)
})

test('major discovery is a special ending and is counted', () => {
  const charged = chargeRover(createInitialGameState(), 5).state
  const result = dispatchRover(charged, 0.999)
  assert.equal(result.state.ending, 'major-discovery')
  assert.equal(result.state.samples.counts.majorDiscovery, 1)
})

test('Sol 10 supply restores water and food to 100', () => {
  let state = createInitialGameState()
  state = { ...state, currentSol: SOL_CONFIG.supplySol, resources: { ...state.resources, water: 20, food: 10 } }
  const result = settleSol(state)
  assert.equal(result.event.type, 'sol-settled+supply-arrived')
  assert.equal(result.state.resources.water, RESOURCE_MAX)
  assert.equal(result.state.resources.food, RESOURCE_MAX)
  assert.equal(result.state.currentSol, SOL_CONFIG.supplySol + 1)
  const repeated = settleSol({ ...result.state, currentSol: SOL_CONFIG.supplySol })
  assert.equal(repeated.event.reason, 'sol-already-settled')
})

test('the same Sol cannot be settled twice', () => {
  const first = settleSol(createInitialGameState())
  const second = settleSol({ ...first.state, currentSol: 1 })
  assert.equal(second.event.reason, 'sol-already-settled')
  assert.deepEqual(second.state.resources, first.state.resources)
  assert.deepEqual(second.state.history, first.state.history)
})

test('normal completion occurs after Sol 20 if resources survive', () => {
  let state = createInitialGameState()
  for (let sol = 1; sol <= SOL_CONFIG.finalSol; sol += 1) {
    const result = settleSol(state, { electrolyze: true })
    state = result.state
  }
  assert.equal(state.ending, 'normal-completion')
  assert.equal(state.currentSol, SOL_CONFIG.finalSol)
  assert.equal(state.history.length, SOL_CONFIG.finalSol)
})

test('resource values never exceed 100 and empty survival resources abort', () => {
  let state = createInitialGameState()
  state = { ...state, resources: { ...state.resources, oxygen: 1, food: 1 } }
  const result = settleSol(state)
  assert.equal(result.state.ending, 'emergency-abort')
  for (const value of Object.values(result.state.resources)) assert.ok(value >= 0 && value <= RESOURCE_MAX)
})

test('each critical resource at zero causes an emergency ending without negative values', () => {
  for (const resource of ['oxygen', 'power', 'water', 'food']) {
    const state = createInitialGameState()
    const depleted = { oxygen: 100, power: 100, water: 100, food: 100, [resource]: 0 }
    const result = settleSol({ ...state, resources: depleted })
    if (resource === 'power') {
      assert.equal(result.state.ending, null, '太陽能可在每日結算時恢復已耗盡的電力')
    } else {
      assert.equal(result.state.ending, 'emergency-abort')
    }
    assert.ok(Object.values(result.state.resources).every((value) => value >= 0 && value <= RESOURCE_MAX))
  }
})

test('a complete mission uses one settlement per Sol and ends exactly at Sol 20', () => {
  let state = createInitialGameState()
  for (let index = 0; index < SOL_CONFIG.finalSol; index += 1) {
    state = settleSol(state, { electrolyze: true }).state
  }
  assert.equal(state.ending, 'normal-completion')
  assert.equal(state.history.length, SOL_CONFIG.finalSol)
  assert.equal(settleSol(state).event.reason, 'game-ended')
})

test('score titles follow the GDD thresholds', () => {
  assert.equal(getScoreTitle(0), '太空新手')
  assert.equal(getScoreTitle(30), '小小太空人')
  assert.equal(getScoreTitle(70), '火星探險家')
  assert.equal(getScoreTitle(120), '超級小小太空人')
  assert.equal(getScoreTitle(180), '火星科學大師')
})

test('continuous clock advances Sol once and pauses after an ending', () => {
  const first = advanceGameTime(createInitialGameState(), 120, { solDurationSeconds: 120, random: () => 0.99 })
  assert.equal(first.state.currentSol, 2)
  assert.deepEqual(first.state.history, [1])
  const ended = { ...first.state, ending: 'emergency-abort', status: 'ended' }
  const paused = advanceGameTime(ended, 120, { solDurationSeconds: 120 })
  assert.equal(paused.event.type, 'time-paused')
  assert.equal(paused.state.clock.elapsedSeconds, ended.clock.elapsedSeconds)
})

test('rover waits one Sol before returning and can enter repair', () => {
  let state = chargeRover(createInitialGameState(), 3).state
  state = launchRover(state).state
  assert.ok(state.rover.pending)
  state = advanceGameTime(state, 120, { solDurationSeconds: 120, random: () => 0 }).state
  assert.equal(state.rover.pending, null)
  assert.ok(state.rover.lastReturn)
})
