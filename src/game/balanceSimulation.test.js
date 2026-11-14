import assert from 'node:assert/strict'
import test from 'node:test'
import {
  chargeRover,
  createInitialGameState,
  dispatchRover,
  electrolyzeWater,
  plantTomato,
  settleSol,
  waterTomato,
  harvestTomato,
} from './gameState.js'
import { SOL_CONFIG } from '../config/gameConfig.js'

const seededRandom = (seed) => {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 0x100000000
  }
}

function runSimulation(strategy, seed) {
  const random = seededRandom(seed)
  let state = createInitialGameState()
  const resourceBefore = { ...state.resources }
  let tomatoHarvests = 0
  let explorations = 0

  while (!state.ending && state.currentSol <= SOL_CONFIG.finalSol) {
    if (strategy === 'survival' || strategy === 'balanced') state = electrolyzeWater(state).state

    if (strategy !== 'novice' && !state.tomato.planted) state = plantTomato(state).state
    if (state.tomato.planted && state.tomato.growth < 3 && !state.tomato.wateredThisSol) {
      const watered = waterTomato(state)
      state = watered.state
    }
    if (state.tomato.growth >= 3) {
      const harvested = harvestTomato(state)
      if (harvested.event.type === 'tomato-harvested') tomatoHarvests += 1
      state = harvested.state
    }

    const shouldExplore = strategy === 'science'
      || (strategy === 'balanced' && state.currentSol % 2 === 0)
    if (shouldExplore) {
      const charged = chargeRover(state, strategy === 'science' ? 5 : 3)
      state = charged.state
      if (state.rover.battery > 0) {
        const dispatched = dispatchRover(state, random())
        if (dispatched.event.type === 'rover-dispatched') explorations += 1
        state = dispatched.state
      }
    }
    state = settleSol(state).state
  }

  const exhausted = state.ending === 'emergency-abort'
    ? Object.entries(state.resources).filter(([, value]) => value <= 0).map(([name]) => name)
    : []
  return {
    strategy,
    ending: state.ending,
    endSol: state.lastSettledSol,
    exhausted,
    score: state.samples.score,
    tomatoHarvests,
    explorations,
    resourceBefore,
  }
}

test('runs 400 deterministic strategy simulations and reports balance evidence', () => {
  const strategies = ['survival', 'science', 'balanced', 'novice']
  const results = strategies.flatMap((strategy, strategyIndex) => Array.from(
    { length: 100 },
    (_, index) => runSimulation(strategy, 20261114 + strategyIndex * 1000 + index),
  ))
  assert.equal(results.length, 400)
  assert.ok(results.some((result) => result.ending === 'normal-completion'))
  assert.ok(results.some((result) => result.ending === 'emergency-abort'))
  assert.ok(results.some((result) => result.explorations > 0))

  const report = Object.fromEntries(strategies.map((strategy) => {
    const group = results.filter((result) => result.strategy === strategy)
    const survivors = group.filter((result) => result.ending === 'normal-completion').length
    const failures = group.filter((result) => result.ending === 'emergency-abort')
    const failureSols = failures.map((result) => result.endSol).filter(Boolean)
    const resourceLosses = Object.fromEntries(['oxygen', 'power', 'water', 'food'].map((resource) => [
      resource,
      failures.filter((result) => result.exhausted.includes(resource)).length,
    ]))
    return [strategy, {
      runs: group.length,
      survivalRate: `${survivors}/${group.length}`,
      averageFailureSol: failureSols.length ? (failureSols.reduce((sum, sol) => sum + sol, 0) / failureSols.length).toFixed(2) : null,
      mostExhaustedResource: Object.entries(resourceLosses).sort(([, a], [, b]) => b - a)[0][0],
      averageScore: (group.reduce((sum, result) => sum + result.score, 0) / group.length).toFixed(2),
      averageTomatoHarvests: (group.reduce((sum, result) => sum + result.tomatoHarvests, 0) / group.length).toFixed(2),
      averageExplorations: (group.reduce((sum, result) => sum + result.explorations, 0) / group.length).toFixed(2),
      resourceLosses,
    }]
  }))
  console.log(`BALANCE_SIMULATION ${JSON.stringify(report)}`)
})
