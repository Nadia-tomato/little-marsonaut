const { useState, useEffect, useRef } = React;

// [Module 11: Main App Controller]
    // =========================================================================
    function App() {
      const [showCoverPage, setShowCoverPage] = useState(true);
      const [showGuidePage, setShowGuidePage] = useState(false);
      const [showLaunchTransition, setShowLaunchTransition] = useState(false);
      const [launchFact, setLaunchFact] = useState(MARS_FACTS[0]);
      const lastFactIdxRef = useRef(-1);

      const [sol, setSol] = useState(1);
      const [secondsLeftInDay, setSecondsLeftInDay] = useState(DAY_DURATION_SECONDS);
      const [resources, setResources] = useState(INITIAL_RESOURCES);

      const [currentScene, setCurrentScene] = useState('EXTERIOR');
      const [showSolarGameModal, setShowSolarGameModal] = useState(false);

      const [solarCollectedToday, setSolarCollectedToday] = useState(false);
      const [todayTempOption, setTodayTempOption] = useState(null);

      // 4 independent tomato plants
      const [tomatoProgresses, setTomatoProgresses] = useState([2, 2, 2, 2]);
      const tomatoProgress = Math.max(...tomatoProgresses);
      const [harvestCount, setHarvestCount] = useState(0);
      const [wateredPlants, setWateredPlants] = useState([false, false, false, false]);

      const [roverStatus, setRoverStatus] = useState('READY');
      const [damageSolLeft, setDamageSolLeft] = useState(0);
      const [pendingExpedition, setPendingExpedition] = useState(null);
      const [roverSecondsLeft, setRoverSecondsLeft] = useState(0);

      const [totalMissions, setTotalMissions] = useState(0);
      const [deepDrillMissions, setDeepDrillMissions] = useState(0);
      const [braveMissions, setBraveMissions] = useState(0);
      const [dustStormSurvived, setDustStormSurvived] = useState(0);
      const [perfectSolarGames, setPerfectSolarGames] = useState(0);

      const [samples, setSamples] = useState({
        BASALT: 0,
        IRON_OXIDE: 0,
        HYDRATED: 0,
        SPECIAL_GEO: 0,
        ANCIENT_BIOSIGNATURE: 0,
        NONE: 0,
      });

      const [expeditionLogs, setExpeditionLogs] = useState([]);
      const [dailyPhotoAlbum, setDailyPhotoAlbum] = useState([]);
      const [yesterdayReport, setYesterdayReport] = useState(null);
      const [latestRoverReport, setLatestRoverReport] = useState(null);
      const [yesterdayConsumption, setYesterdayConsumption] = useState(null);

      const [usedPhotoIds, setUsedPhotoIds] = useState(new Set());
      const [weather, setWeather] = useState(null);
      const [loadingNasa, setLoadingNasa] = useState(true);

      const [showMorningBriefing, setShowMorningBriefing] = useState(true);
      const [dailyReport, setDailyReport] = useState([]);
      const [pendingConfirmAction, setPendingConfirmAction] = useState(null);
      const [ending, setEnding] = useState(null);
      const [abortReason, setAbortReason] = useState('');
      const [specialDiscoveryPending, setSpecialDiscoveryPending] = useState(null);
      const [roverResultUnread, setRoverResultUnread] = useState(false);

      const [seenTopics, setSeenTopics] = useState(() => new Set());
      const [activeScienceTopic, setActiveScienceTopic] = useState(null);

      const handleOpenTopic = (topicKey) => {
        setSeenTopics((prev) => {
          const next = new Set(prev);
          next.add(topicKey);
          return next;
        });
        setActiveScienceTopic(topicKey);
      };

      const pickNextMarsFact = () => {
        let nextIdx = Math.floor(Math.random() * MARS_FACTS.length);
        if (MARS_FACTS.length > 1 && nextIdx === lastFactIdxRef.current) {
          nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (MARS_FACTS.length - 1))) % MARS_FACTS.length;
        }
        lastFactIdxRef.current = nextIdx;
        return MARS_FACTS[nextIdx];
      };

      const executeEndSolRef = useRef(null);
      const settlingRef = useRef(false);
      const currentSolRatesRef = useRef({ power: 12, oxygen: 10, water: 6, food: 12 });
      const deductedInCurrentSolRef = useRef({ power: 0, oxygen: 0, water: 0, food: 0 });

      const elapsedSeconds = DAY_DURATION_SECONDS - secondsLeftInDay;
      const nightFactor = Math.max(0, Math.min(1, elapsedSeconds / DAY_DURATION_SECONDS));
      const isNightPhase = nightFactor >= 0.55;

      const loadWeatherForSol = async (targetSol) => {
        setLoadingNasa(true);
        const env = await NasaService.generateDailyMarsEnvironment(targetSol);
        setWeather(env);
        setLoadingNasa(false);
        setShowMorningBriefing(true);
      };

      useEffect(() => {
        loadWeatherForSol(1);
      }, []);

      useEffect(() => {
        if (!weather) return;
        const c = GameLogicModule.calculateDailyResourceConsumption(weather, roverStatus);
        currentSolRatesRef.current = {
          power: c.powerCost,
          oxygen: c.oxygenCost,
          water: c.waterCost,
          food: Math.max(12, c.foodCost),
        };
      }, [weather, roverStatus]);

      const totalScore = SAMPLE_CATALOG.reduce((sum, item) => {
        if (item.id === 'NONE' || item.id === 'ANCIENT_BIOSIGNATURE') return sum;
        return sum + samples[item.id] * item.points;
      }, 0);

      const showPowerDot = !solarCollectedToday;
      const showGreenhouseDot =
        tomatoProgresses.some((p) => p >= MAX_TOMATO_GROWTH) ||
        tomatoProgresses.some((p, i) => p < MAX_TOMATO_GROWTH && !wateredPlants[i]) ||
        !todayTempOption;
      const showRoverDot =
        roverResultUnread || (roverStatus === 'READY' && !pendingExpedition);

      const handleCompleteSolarGame = (caughtCount) => {
        const gainedPower = GameLogicModule.calculateSolarGameReward(caughtCount, weather?.isDustStorm, sol);
        setShowSolarGameModal(false);
        setResources((r) => ({ ...r, power: Math.min(100, r.power + gainedPower) }));
        setSolarCollectedToday(true);
        if (caughtCount >= 14) setPerfectSolarGames((c) => c + 1);
        const msg = gainedPower > 0
          ? `☀️ Caught ${caughtCount} sunbeams and made +${gainedPower} Power!`
          : `⚠️ Missed all sunbeams—no power made.`;
        setDailyReport((prev) => [...prev, msg]);
      };

      const handleRequestElectrolysis = () => {
        if (resources.water < 10 || resources.power < 15) return;
        setPendingConfirmAction({
          icon: '🫧',
          title: 'Make Breathable Air (Oxygen)',
          costText: '-10 💧 Water, -15 ⚡ Power',
          gainText: '+22 🫧 Oxygen',
          note: 'We use electricity to split water into hydrogen gas and oxygen gas (electrolysis) so our astronauts have fresh air to breathe!',
          onExecute: () => {
            setResources((r) => ({
              ...r,
              water: Math.max(0, r.water - 10),
              power: Math.max(0, r.power - 15),
              oxygen: Math.min(100, r.oxygen + 22),
            }));
            setDailyReport((prev) => [...prev, '🫧 Split water with electricity: -10 Water, -15 Power → +22 Oxygen!']);
          },
        });
      };

      const handleRequestSelectTempOption = (opt) => {
        if (todayTempOption || resources.power < opt.powerCost) return;
        setPendingConfirmAction({
          icon: '💡',
          title: `Turn On: ${opt.title}`,
          costText: `-${opt.powerCost} ⚡ Power`,
          gainText: 'Shines light & warms tomatoes overnight',
          note: 'Tomato plants need bright light to make their own food and warm air so they do not freeze during the -80°C Mars night!',
          onExecute: () => {
            setResources((r) => ({ ...r, power: Math.max(0, r.power - opt.powerCost) }));
            setTodayTempOption(opt);
            setDailyReport((prev) => [...prev, `💡 Turned on "${opt.title}" (-${opt.powerCost} Power) for the tomatoes!`]);
          },
        });
      };

      const handleWaterSinglePlant = (idx) => {
        if (wateredPlants[idx] || tomatoProgresses[idx] >= MAX_TOMATO_GROWTH || resources.water < 2) return;
        setResources((r) => ({ ...r, water: Math.max(0, r.water - 2) }));
        setWateredPlants((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        setDailyReport((prev) => [...prev, `💧 Watered tomato plant #${idx + 1} (-2 Water).`]);
      };

      const handlePlantSeeds = () => {
        setTomatoProgresses([1, 1, 1, 1]);
        setWateredPlants([false, false, false, false]);
        setDailyReport((prev) => [...prev, '🌱 Seeds planted.']);
      };

      const handleHarvestSinglePlant = (idx) => {
        if (tomatoProgresses[idx] < MAX_TOMATO_GROWTH) return;
        setResources((r) => ({ ...r, food: Math.min(100, r.food + 6) }));
        setTomatoProgresses((prev) => {
          const next = [...prev];
          next[idx] = 1;
          return next;
        });
        setWateredPlants((prev) => {
          const next = [...prev];
          next[idx] = false;
          return next;
        });
        setHarvestCount((c) => c + 1);
        setDailyReport((prev) => [...prev, `🍅 Picked ripe tomatoes from plant #${idx + 1} (+6 Food)! Fresh seedling sprouted.`]);
      };

      const handleConfirmRoverReport = () => {
        setRoverResultUnread(false);
        const report = latestRoverReport || yesterdayReport;
        if (report && !report.collectedToVault) {
          report.collectedToVault = true;
          if (report.photo) {
            setDailyPhotoAlbum((prev) => [...prev, { sol: report.sol, photo: report.photo }]);
          }
          if (report.sample && report.sample.id !== 'NONE') {
            setSamples((prev) => ({ ...prev, [report.sample.id]: (prev[report.sample.id] || 0) + 1 }));
            if (report.sample.id === 'ANCIENT_BIOSIGNATURE') {
              setSpecialDiscoveryPending(report);
            }
          }
        }
      };

      const handleRequestDispatchRover = (barsCost) => {
        const powerCost = barsCost * ROVER_POWER_PER_BAR;
        if (pendingExpedition || roverStatus !== 'READY' || resources.power < powerCost || !weather) return;
        const mode = ROVER_DISPATCH_MODES[barsCost];
        setPendingConfirmAction({
          icon: '🚀',
          title: `Send "${OUR_ROVER_NAME}": ${mode.name}`,
          costText: `-${powerCost} ⚡ Power`,
          gainText: `${OUR_ROVER_NAME} drives out for ${mode.durationSeconds}s & returns automatically!`,
          note: weather.isDustStorm
            ? `🌪️ Dust Storm Warning: Sending ${OUR_ROVER_NAME} out in a dust storm has a high chance of wheel damage! (${mode.desc})`
            : mode.desc,
          onExecute: () => {
            if (barsCost === 3) setDeepDrillMissions((c) => c + 1);
            setResources((r) => ({ ...r, power: Math.max(0, r.power - powerCost) }));
            setRoverStatus('OUT_ON_MISSION');
            setTotalMissions((m) => m + 1);

            const tripDuration = mode.durationSeconds || 100;
            setRoverSecondsLeft(tripDuration);
            setPendingExpedition({
              dispatchedSol: sol,
              barsCost,
              totalDuration: tripDuration,
              isDustStorm: weather.isDustStorm,
              radiationLevel: weather.radiationLevel,
            });

            setDailyReport((prev) => [
              ...prev,
              `🛸 "${OUR_ROVER_NAME}" drove out of the garage (-${powerCost} Power, ${tripDuration}s trip)!`,
            ]);
          },
        });
      };

      const completeRoverExpeditionRef = useRef(null);
      const completingRoverRef = useRef(false);

      const completeRoverExpedition = async () => {
        if (!pendingExpedition || completingRoverRef.current) return;
        completingRoverRef.current = true;
        try {
          const exp = pendingExpedition;
          const photo = await NasaService.fetchNextCuriosityPhoto(usedPhotoIds);
          setUsedPhotoIds((prev) => new Set(prev).add(photo.id));

          const hazardEval = GameLogicModule.evaluateRoverReturnHazard(
            exp.isDustStorm,
            exp.radiationLevel
          );

          if (hazardEval.isDamaged) {
            setRoverStatus(hazardEval.damagedSols === 2 ? 'DAMAGED_2_SOL' : 'DAMAGED_1_SOL');
            setDamageSolLeft(hazardEval.damagedSols);
            const dmgReport = {
              sol: exp.dispatchedSol,
              damagedSols: hazardEval.damagedSols,
              damageReason: hazardEval.reasonText,
              photo,
              sample: null,
              collectedToVault: false,
            };
            setYesterdayReport(dmgReport);
            setLatestRoverReport(dmgReport);
            setRoverResultUnread(true);
            setDailyReport((prev) => [
              ...prev,
              `⚠️ ${OUR_ROVER_NAME} returned to the garage with wheel damage! Tap it in the garage to inspect.`,
            ]);
          } else {
            if (hazardEval.wasHazardous) setBraveMissions((b) => b + 1);
            setRoverStatus('READY');
            const found = GameLogicModule.rollRoverExplorationByCost(exp.barsCost);

            const record = {
              sol: exp.dispatchedSol,
              damagedSols: 0,
              damageReason: '',
              photo,
              sample: found,
              collectedToVault: false,
            };
            setExpeditionLogs((prev) => [...prev, record]);
            setYesterdayReport(record);
            setLatestRoverReport(record);
            setRoverResultUnread(true);
            setDailyReport((prev) => [
              ...prev,
              `🛸 ${OUR_ROVER_NAME} returned to the garage with findings! Tap it in the Rover Garage!`,
            ]);
          }
          setPendingExpedition(null);
          setRoverSecondsLeft(0);
        } finally {
          completingRoverRef.current = false;
        }
      };

      completeRoverExpeditionRef.current = completeRoverExpedition;

      const executeEndSol = async () => {
        if (!weather || ending) return;
        setPendingConfirmAction(null);
        setShowSolarGameModal(false);

        const logs = [];

        if (!solarCollectedToday) {
          logs.push('⚠️ Forgot to collect solar power today—backup panel saved +4 Power.');
        }
        const passiveSolar = solarCollectedToday ? 0 : 4;

        if (weather.isDustStorm) {
          setDustStormSurvived((c) => c + 1);
        }

        const consumption = GameLogicModule.calculateDailyResourceConsumption(weather, roverStatus);
        const dailyFoodCost = Math.max(12, consumption.foodCost);

        const deducted = deductedInCurrentSolRef.current;
        const remPower = Math.max(0, consumption.powerCost - (deducted.power || 0));
        const remOxygen = Math.max(0, consumption.oxygenCost - (deducted.oxygen || 0));
        const remWater = Math.max(0, consumption.waterCost - (deducted.water || 0));
        const remFood = Math.max(0, dailyFoodCost - (deducted.food || 0));

        const nextPower = Math.min(100, Math.max(0, resources.power + passiveSolar - remPower));
        const nextOxygen = Math.min(100, Math.max(0, resources.oxygen - remOxygen));
        const nextWater = Math.min(100, Math.max(0, resources.water - remWater));
        const nextFood = Math.min(100, Math.max(0, resources.food - remFood));

        const lampBonus = todayTempOption ? (todayTempOption.id === 'TEMP_WARM' ? 2 : 1) : 0;
        let nextTomatoProgresses = [...tomatoProgresses];
        let grewCount = 0;
        let newlyRipeCount = 0;

        for (let i = 0; i < 4; i++) {
          if (nextTomatoProgresses[i] >= MAX_TOMATO_GROWTH) {
            // Already ripe
          } else if (wateredPlants[i]) {
            const gain = 2 + lampBonus;
            nextTomatoProgresses[i] = Math.min(MAX_TOMATO_GROWTH, nextTomatoProgresses[i] + gain);
            grewCount++;
            if (nextTomatoProgresses[i] >= MAX_TOMATO_GROWTH) {
              newlyRipeCount++;
            }
          } else if (lampBonus > 0) {
            nextTomatoProgresses[i] = Math.min(MAX_TOMATO_GROWTH, nextTomatoProgresses[i] + 1);
            grewCount++;
            if (nextTomatoProgresses[i] >= MAX_TOMATO_GROWTH) {
              newlyRipeCount++;
            }
          }
        }

        const totalRipe = nextTomatoProgresses.filter((p) => p >= MAX_TOMATO_GROWTH).length;
        if (newlyRipeCount > 0) {
          logs.push(`🍅 ${newlyRipeCount} tomato plant(s) fully ripened! Tap each plant to harvest!`);
        } else if (totalRipe > 0) {
          logs.push(`🍅 ${totalRipe} ripe tomato plant(s) waiting in Greenhouse.`);
        } else if (grewCount > 0) {
          logs.push(`🌱 ${grewCount} tomato plant(s) grew overnight.`);
        } else {
          logs.push('💧 Unwatered tomato plants did not grow yesterday.');
        }

        if (nextOxygen <= 0 || nextWater <= 0 || nextFood <= 0) {
          const reason =
            nextOxygen <= 0 ? 'Ran out of air (oxygen)' : nextWater <= 0 ? 'Ran out of water' : 'Ran out of food';
          setResources({ oxygen: nextOxygen, power: nextPower, water: nextWater, food: nextFood });
          setAbortReason(reason);
          setEnding('EMERGENCY_ABORT');
          return;
        }

        let nextRoverStatus = roverStatus;
        let nextDamageLeft = damageSolLeft;

        if (!pendingExpedition && damageSolLeft > 0) {
          nextDamageLeft = damageSolLeft - 1;
          if (nextDamageLeft === 0) {
            nextRoverStatus = 'READY';
            logs.push(`🛠️ Rover "${OUR_ROVER_NAME}" repairs finished in the garage!`);
          }
        }

        if (sol >= 20) {
          const uncollected = latestRoverReport || yesterdayReport;
          if (uncollected && !uncollected.collectedToVault) {
            if (uncollected.photo) {
              setDailyPhotoAlbum((prev) => [...prev, { sol: uncollected.sol, photo: uncollected.photo }]);
            }
            if (uncollected.sample && uncollected.sample.id !== 'NONE') {
              setSamples((prev) => ({ ...prev, [uncollected.sample.id]: (prev[uncollected.sample.id] || 0) + 1 }));
            }
          }
          setResources({ oxygen: nextOxygen, power: nextPower, water: nextWater, food: nextFood });
          setEnding('NORMAL_20_SOL');
          return;
        }

        const nextSol = sol + 1;
        let finalWater = nextWater;
        let finalFood = nextFood;

        if (nextSol === 10) {
          finalWater = 100;
          finalFood = 100;
          logs.push('📦 [Day 10 Supply Rocket Landed!] Water and Food refilled to 100!');
        }

        setResources({ oxygen: nextOxygen, power: nextPower, water: finalWater, food: finalFood });
        setTomatoProgresses(nextTomatoProgresses);
        setWateredPlants([false, false, false, false]);
        setRoverStatus(nextRoverStatus);
        setDamageSolLeft(nextDamageLeft);
        setYesterdayConsumption(consumption);
        setSol(nextSol);
        setSecondsLeftInDay(DAY_DURATION_SECONDS);
        deductedInCurrentSolRef.current = { power: 0, oxygen: 0, water: 0, food: 0 };
        setSolarCollectedToday(false);
        setTodayTempOption(null);
        setDailyReport(logs);
        await loadWeatherForSol(nextSol);
      };

      executeEndSolRef.current = executeEndSol;

      useEffect(() => {
        if (showCoverPage || showLaunchTransition || ending || specialDiscoveryPending || showMorningBriefing || loadingNasa) return;
        const interval = setInterval(() => {
          setRoverSecondsLeft((prevRoverSec) => {
            if (prevRoverSec <= 0) return 0;
            if (prevRoverSec === 1) {
              if (completeRoverExpeditionRef.current) {
                completeRoverExpeditionRef.current();
              }
              return 0;
            }
            return prevRoverSec - 1;
          });

          setSecondsLeftInDay((prev) => {
            if (prev <= 1 && !settlingRef.current) {
              settlingRef.current = true;
              if (executeEndSolRef.current) {
                Promise.resolve(executeEndSolRef.current()).finally(() => {
                  settlingRef.current = false;
                });
              }
              return DAY_DURATION_SECONDS;
            }

            const nextSec = prev - 1;
            const elapsed = DAY_DURATION_SECONDS - nextSec;
            const rates = currentSolRatesRef.current;
            const deducted = deductedInCurrentSolRef.current;

            const targetPower = Math.min(rates.power, Math.floor((elapsed * rates.power) / DAY_DURATION_SECONDS));
            const targetOxygen = Math.min(rates.oxygen, Math.floor((elapsed * rates.oxygen) / DAY_DURATION_SECONDS));
            const targetWater = Math.min(rates.water, Math.floor((elapsed * rates.water) / DAY_DURATION_SECONDS));
            const targetFood = Math.min(rates.food, Math.floor((elapsed * rates.food) / DAY_DURATION_SECONDS));

            const deltaPower = Math.max(0, targetPower - deducted.power);
            const deltaOxygen = Math.max(0, targetOxygen - deducted.oxygen);
            const deltaWater = Math.max(0, targetWater - deducted.water);
            const deltaFood = Math.max(0, targetFood - deducted.food);

            if (deltaPower > 0 || deltaOxygen > 0 || deltaWater > 0 || deltaFood > 0) {
              deducted.power += deltaPower;
              deducted.oxygen += deltaOxygen;
              deducted.water += deltaWater;
              deducted.food += deltaFood;

              setResources((res) => {
                const nextRes = {
                  power: Math.max(0, res.power - deltaPower),
                  oxygen: Math.max(0, res.oxygen - deltaOxygen),
                  water: Math.max(0, res.water - deltaWater),
                  food: Math.max(0, res.food - deltaFood),
                };

                if (nextRes.oxygen <= 0 || nextRes.water <= 0 || nextRes.food <= 0) {
                  const reason =
                    nextRes.oxygen <= 0
                      ? 'Ran out of air (oxygen)'
                      : nextRes.water <= 0
                      ? 'Ran out of water'
                      : 'Ran out of food';
                  setAbortReason(reason);
                  setEnding('EMERGENCY_ABORT');
                }

                return nextRes;
              });
            }

            return nextSec;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [showCoverPage, showLaunchTransition, ending, specialDiscoveryPending, showMorningBriefing, loadingNasa]);

      const handleRestart = () => {
        deductedInCurrentSolRef.current = { power: 0, oxygen: 0, water: 0, food: 0 };
        currentSolRatesRef.current = { power: 12, oxygen: 10, water: 6, food: 12 };
        setSol(1);
        setSecondsLeftInDay(DAY_DURATION_SECONDS);
        setResources(INITIAL_RESOURCES);
        setCurrentScene('EXTERIOR');
        setSolarCollectedToday(false);
        setTodayTempOption(null);
        setWateredPlants([false, false, false, false]);
        setHarvestCount(0);
        setRoverStatus('READY');
        setDamageSolLeft(0);
        setPendingExpedition(null);
        setRoverSecondsLeft(0);
        setTotalMissions(0);
        setDeepDrillMissions(0);
        setBraveMissions(0);
        setDustStormSurvived(0);
        setPerfectSolarGames(0);
        setSamples({
          BASALT: 0,
          IRON_OXIDE: 0,
          HYDRATED: 0,
          SPECIAL_GEO: 0,
          ANCIENT_BIOSIGNATURE: 0,
          NONE: 0,
        });
        setExpeditionLogs([]);
        setDailyPhotoAlbum([]);
        setYesterdayReport(null);
        setLatestRoverReport(null);
        setYesterdayConsumption(null);
        setUsedPhotoIds(new Set());
        setDailyReport([]);
        setTomatoProgresses([2, 2, 2, 2]);
        setPendingConfirmAction(null);
        setEnding(null);
        setAbortReason('');
        setSpecialDiscoveryPending(null);
        setRoverResultUnread(false);
        setShowGuidePage(false);
        setShowCoverPage(true);
        loadWeatherForSol(1);
      };

      if (showCoverPage) {
        return (
          <TitleCoverPage
            isGuide={showGuidePage}
            onStartMission={() => {
              if (showGuidePage) {
                setShowGuidePage(false);
                setShowCoverPage(false);
              } else {
                setShowCoverPage(false);
                setLaunchFact(pickNextMarsFact());
                setShowMorningBriefing(false);
                setShowLaunchTransition(true);
              }
            }}
          />
        );
      }

      if (showLaunchTransition) {
        return (
          <MarsLaunchTransition
            fact={launchFact}
            onSkip={() => {
              setShowLaunchTransition(false);
              setShowMorningBriefing(true);
            }}
            onComplete={() => {
              setShowLaunchTransition(false);
              setShowMorningBriefing(true);
            }}
          />
        );
      }

      if (ending) {
        const unlockedBadges = [];
        if (sol >= 20 && ending !== 'EMERGENCY_ABORT') unlockedBadges.push({ icon: '🏅', title: 'Mars Survival Hero', desc: 'Lived all 20 days on Mars' });
        if (totalMissions >= 10) unlockedBadges.push({ icon: '🛸', title: 'Junior Explorer', desc: `Sent Rover "${OUR_ROVER_NAME}" out 10+ times` });
        if (deepDrillMissions >= 3) unlockedBadges.push({ icon: '⚡', title: 'Deep Dig Pro', desc: 'Did 3+ far 30-power rover trips' });
        if (perfectSolarGames >= 3) unlockedBadges.push({ icon: '☀️', title: 'Super Sun Catcher', desc: 'Caught 14+ sunbeams 3+ times' });
        if (harvestCount >= 2) unlockedBadges.push({ icon: '🍅', title: 'Mars Gardener', desc: 'Picked 2+ crops of ripe tomatoes' });
        if (harvestCount >= 4) unlockedBadges.push({ icon: '🧺', title: 'Master Tomato Farmer', desc: 'Picked 4+ crops of ripe tomatoes' });
        if (braveMissions >= 1) unlockedBadges.push({ icon: '☢️', title: 'Brave Storm Explorer', desc: 'Finished a rover trip during bad weather' });
        if (samples.BASALT > 0 && samples.IRON_OXIDE > 0 && samples.HYDRATED > 0 && samples.SPECIAL_GEO > 0) {
          unlockedBadges.push({ icon: '🪨', title: 'Rock Collector Pro', desc: 'Found all 4 main kinds of Mars rocks' });
        }
        if (dustStormSurvived >= 3 && ending !== 'EMERGENCY_ABORT') {
          unlockedBadges.push({ icon: '🌪️', title: 'Dust Storm Survivor', desc: 'Made it through 3+ big dust storms' });
        }
        if (ending === 'SPECIAL_DISCOVERY') {
          unlockedBadges.push({ icon: '🌟', title: 'Life-Clue Champion', desc: 'Found the mystery life-clue rock on Mars' });
        }

        return (
          <EndGameModule
            ending={ending}
            abortReason={abortReason}
            sol={sol}
            totalScore={totalScore}
            samples={samples}
            expeditionLogs={expeditionLogs}
            dailyPhotoAlbum={dailyPhotoAlbum}
            unlockedBadges={unlockedBadges}
            onRestart={handleRestart}
          />
        );
      }

      if (specialDiscoveryPending) {
        return (
          <>
            <div className="min-h-screen bg-[#fdf6e9]" />
            <SpecialDiscoveryModal
              record={specialDiscoveryPending}
              onReturnToEarth={() => {
                setSpecialDiscoveryPending(null);
                setEnding('SPECIAL_DISCOVERY');
              }}
            />
          </>
        );
      }

      const radInfo = RADIATION_LABELS[weather?.radiationLevel || 1];
      const clockProgress = Math.max(0, Math.min(1, (DAY_DURATION_SECONDS - secondsLeftInDay) / DAY_DURATION_SECONDS));
      const clockAngleDeg = clockProgress * 360;
      const roverTripProgress =
        pendingExpedition && pendingExpedition.totalDuration > 0
          ? Math.max(0, Math.min(1, (pendingExpedition.totalDuration - roverSecondsLeft) / pendingExpedition.totalDuration))
          : 0;

      return (
        <div className="min-h-screen bg-[#fdf6e9] text-[#4a3525] flex flex-col">
          <header className="px-3 md:px-6 pt-3 pb-2 max-w-5xl w-full mx-auto space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-white border-2 border-[#e6d5bc] rounded-2xl px-3.5 py-1.5 shadow-sm flex items-center gap-2.5">
                  <span className="text-base">{isNightPhase ? '🌙' : '☀️'}</span>
                  <span className="font-black text-sm md:text-base text-[#4a3525]">Day {sol}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                      isNightPhase ? 'bg-indigo-950 border-indigo-400' : 'bg-amber-100 border-amber-500'
                    }`}
                    title="Day Progress Clock"
                  >
                    <svg viewBox="0 0 32 32" className="w-6 h-6">
                      <circle
                        cx="16"
                        cy="16"
                        r="7"
                        fill="none"
                        stroke={isNightPhase ? '#6366f1' : '#fbbf24'}
                        strokeWidth="14"
                        strokeDasharray={`${(clockProgress * 44).toFixed(2)} 44`}
                        transform="rotate(-90 16 16)"
                        opacity="0.45"
                      />
                      <line x1="16" y1="2.5" x2="16" y2="5" stroke={isNightPhase ? '#c7d2fe' : '#92400e'} strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="29.5" y1="16" x2="27" y2="16" stroke={isNightPhase ? '#c7d2fe' : '#92400e'} strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="16" y1="29.5" x2="16" y2="27" stroke={isNightPhase ? '#c7d2fe' : '#92400e'} strokeWidth="1.8" strokeLinecap="round" />
                      <line x1="2.5" y1="16" x2="5" y2="16" stroke={isNightPhase ? '#c7d2fe' : '#92400e'} strokeWidth="1.8" strokeLinecap="round" />
                      <g
                        transform={`rotate(${clockAngleDeg} 16 16)`}
                        style={{ transition: 'transform 0.95s linear' }}
                      >
                        <line
                          x1="16"
                          y1="16"
                          x2="16"
                          y2="5.5"
                          stroke={isNightPhase ? '#fde047' : '#b45309'}
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                      </g>
                      <circle cx="16" cy="16" r="2.2" fill={isNightPhase ? '#fde047' : '#78350f'} />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setShowMorningBriefing(true)}
                  className="bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 rounded-2xl px-3 py-1.5 text-xs font-black text-amber-950 shadow-sm"
                >
                  📋 Weather
                </button>
                <button
                  onClick={() => { setShowGuidePage(true); setShowCoverPage(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-2xl px-3 py-1.5 text-xs font-black shadow-sm"
                >
                  ❓ Guide
                </button>
              </div>

              {weather && (
                <div className="bg-white border-2 border-[#e6d5bc] rounded-2xl px-3.5 py-1.5 shadow-sm flex items-center gap-2 text-xs font-bold">
                  <span>{weather.isDustStorm ? '🌪️ Dust Storm' : '🌤️ Clear'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-white ${radInfo.color}`}>
                    Rays: {radInfo.text}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full items-stretch">
              <TopResourcePill label="Air" value={resources.oxygen} barColor="bg-sky-400" icon="🫧" />
              <TopResourcePill label="Power" value={resources.power} barColor="bg-amber-400" icon="⚡" />
              <TopResourcePill label="Water" value={resources.water} barColor="bg-blue-500" icon="💧" />
              <TopResourcePill label="Food" value={resources.food} barColor="bg-red-500" icon="🍅" />
            </div>
          </header>

          <main className="flex-1 max-w-5xl w-full mx-auto px-3 md:px-6 pb-5 flex flex-col justify-center">
            {currentScene === 'EXTERIOR' && (
              <BaseExteriorModule
                sol={sol}
                weather={weather}
                nightFactor={nightFactor}
                tomatoProgress={tomatoProgress}
                showPowerDot={showPowerDot}
                showGreenhouseDot={showGreenhouseDot}
                showRoverDot={showRoverDot}
                roverResultUnread={roverResultUnread}
                onEnterRoom={(room) => setCurrentScene(room)}
              />
            )}

            {currentScene === 'POWER' && (
              <PowerRoomModule
                resources={resources}
                weather={weather}
                nightFactor={nightFactor}
                solarCollectedToday={solarCollectedToday}
                seenTopics={seenTopics}
                onOpenTopic={handleOpenTopic}
                onBack={() => setCurrentScene('EXTERIOR')}
                onOpenSolarGame={() => setShowSolarGameModal(true)}
                onRequestElectrolysis={handleRequestElectrolysis}
              />
            )}

            {currentScene === 'GREENHOUSE' && (
              <GreenhouseRoomModule
                resources={resources}
                weather={weather}
                tomatoProgress={tomatoProgress}
                tomatoProgresses={tomatoProgresses}
                wateredPlants={wateredPlants}
                todayTempOption={todayTempOption}
                seenTopics={seenTopics}
                onOpenTopic={handleOpenTopic}
                onBack={() => setCurrentScene('EXTERIOR')}
                onWaterSinglePlant={handleWaterSinglePlant}
                onPlantSeeds={handlePlantSeeds}
                onHarvestSinglePlant={handleHarvestSinglePlant}
                onRequestSelectTempOption={handleRequestSelectTempOption}
              />
            )}

            {currentScene === 'ROVER' && (
              <RoverRoomModule
                weather={weather}
                nightFactor={nightFactor}
                power={resources.power}
                roverStatus={roverStatus}
                damageSolLeft={damageSolLeft}
                pendingExpedition={pendingExpedition}
                roverTripProgress={roverTripProgress}
                roverSecondsLeft={roverSecondsLeft}
                latestRoverResult={latestRoverReport || yesterdayReport}
                roverResultUnread={roverResultUnread}
                samples={samples}
                seenTopics={seenTopics}
                onOpenTopic={handleOpenTopic}
                onBack={() => setCurrentScene('EXTERIOR')}
                onViewLatestResult={handleConfirmRoverReport}
                onRequestDispatchRover={handleRequestDispatchRover}
              />
            )}

            {currentScene === 'CONTROL' && (
              <MissionControlModule
                sol={sol}
                weather={weather}
                nightFactor={nightFactor}
                dailyReport={dailyReport}
                samples={samples}
                totalScore={totalScore}
                dailyPhotoAlbum={dailyPhotoAlbum}
                onBack={() => setCurrentScene('EXTERIOR')}
              />
            )}
          </main>

          <ActionConfirmModal
            pendingAction={pendingConfirmAction}
            onConfirm={() => {
              const fn = pendingConfirmAction?.onExecute;
              setPendingConfirmAction(null);
              if (fn) fn();
            }}
            onCancel={() => setPendingConfirmAction(null)}
          />

          <ScienceExplanationModal
            topicKey={activeScienceTopic}
            onClose={() => setActiveScienceTopic(null)}
          />

          {showSolarGameModal && (
            <SolarMiniGameModal
              sol={sol}
              isDustStorm={weather?.isDustStorm}
              onComplete={handleCompleteSolarGame}
              onClose={() => setShowSolarGameModal(false)}
            />
          )}

          <MorningBriefingModule
            visible={showMorningBriefing && !loadingNasa}
            sol={sol}
            weather={weather}
            yesterdayConsumption={yesterdayConsumption}
            onConfirm={() => setShowMorningBriefing(false)}
          />
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
