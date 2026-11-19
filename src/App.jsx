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
      const [rottenPlants, setRottenPlants] = useState([false, false, false, false]);
      const ripeTimersRef = useRef([0, 0, 0, 0]);
      const wateredPlantsRef = useRef(wateredPlants);
      wateredPlantsRef.current = wateredPlants;
      const rottenPlantsRef = useRef(rottenPlants);
      rottenPlantsRef.current = rottenPlants;
      const todayTempOptionRef = useRef(todayTempOption);
      todayTempOptionRef.current = todayTempOption;
      const [isPaused, setIsPaused] = useState(false);

      const [roverStatus, setRoverStatus] = useState('READY');
      const [damageSolLeft, setDamageSolLeft] = useState(0);
      const [pendingExpedition, setPendingExpedition] = useState(null);
      const [roverSecondsLeft, setRoverSecondsLeft] = useState(0);

      const [totalMissions, setTotalMissions] = useState(0);
      const [deepDrillMissions, setDeepDrillMissions] = useState(0);
      const [braveMissions, setBraveMissions] = useState(0);
      const [dustStormSurvived, setDustStormSurvived] = useState(0);
      const [perfectSolarGames, setPerfectSolarGames] = useState(0);
      const [totalSolarCaught, setTotalSolarCaught] = useState(0);
      const [totalWaterSpent, setTotalWaterSpent] = useState(0);

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
      const [showRandomScienceFactModal, setShowRandomScienceFactModal] = useState(false);
      const [currentRandomFact, setCurrentRandomFact] = useState(null);
      const [dailyReport, setDailyReport] = useState([]);
      const [pendingConfirmAction, setPendingConfirmAction] = useState(null);
      const [ending, setEnding] = useState(null);
      const [abortReason, setAbortReason] = useState('');
      const [specialDiscoveryPending, setSpecialDiscoveryPending] = useState(null);
      const [roverResultUnread, setRoverResultUnread] = useState(false);
      const [seenSupplySols, setSeenSupplySols] = useState(() => new Set());
      const [collectedSupplySols, setCollectedSupplySols] = useState(() => new Set());
      const [showTutorial, setShowTutorial] = useState(false);
      const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
      const hasCompletedTutorialRef = useRef(hasCompletedTutorial);
      hasCompletedTutorialRef.current = hasCompletedTutorial;

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

      const handleOpenRandomScienceFact = () => {
        if (typeof SCIENCE_FACTS_DATABASE !== "undefined" && SCIENCE_FACTS_DATABASE.length > 0) {
          const available = currentRandomFact
            ? SCIENCE_FACTS_DATABASE.filter((f) => f.id !== currentRandomFact.id)
            : SCIENCE_FACTS_DATABASE;
          const pool = available.length > 0 ? available : SCIENCE_FACTS_DATABASE;
          const picked = pool[Math.floor(Math.random() * pool.length)];
          setCurrentRandomFact(picked);
          setShowRandomScienceFactModal(true);
        }
      };

      const handleNextRandomFact = () => {
        if (typeof SCIENCE_FACTS_DATABASE !== "undefined" && SCIENCE_FACTS_DATABASE.length > 0) {
          const available = currentRandomFact
            ? SCIENCE_FACTS_DATABASE.filter((f) => f.id !== currentRandomFact.id)
            : SCIENCE_FACTS_DATABASE;
          const pool = available.length > 0 ? available : SCIENCE_FACTS_DATABASE;
          const picked = pool[Math.floor(Math.random() * pool.length)];
          setCurrentRandomFact(picked);
        }
      };
      const settlingRef = useRef(false);
      const justDamagedInCurrentSolRef = useRef(false);
      const currentSolRatesRef = useRef({ power: 12, oxygen: 10, water: 6, food: 16 });
      const deductedInCurrentSolRef = useRef({ power: 0, oxygen: 0, water: 0, food: 0 });

      const lastTickTimeRef = useRef(Date.now());
      const [smoothNightFactor, setSmoothNightFactor] = useState(0);
      const nightFactor = smoothNightFactor;
      const isNightPhase = smoothNightFactor >= 0.60;

      useEffect(() => {
        if (showCoverPage || showLaunchTransition || ending || specialDiscoveryPending || showMorningBriefing || showRandomScienceFactModal || loadingNasa || isPaused || showTutorial) return;
        const frameInterval = setInterval(() => {
          const elapsed = DAY_DURATION_SECONDS - secondsLeftInDay;
          const subSec = Math.min(1000, Math.max(0, Date.now() - lastTickTimeRef.current)) / 1000;
          const preciseElapsed = Math.max(0, Math.min(DAY_DURATION_SECONDS, elapsed + subSec));
          setSmoothNightFactor(preciseElapsed / DAY_DURATION_SECONDS);
        }, 60);
        return () => clearInterval(frameInterval);
      }, [showCoverPage, showLaunchTransition, ending, specialDiscoveryPending, showMorningBriefing, showRandomScienceFactModal, loadingNasa, isPaused, showTutorial, secondsLeftInDay]);

      const handleCollectSupply = (targetSol) => {
        if (collectedSupplySols.has(targetSol)) return;
        const pkg = targetSol === 16 ? { water: 30, food: 20 } : { water: 40, food: 30 };
        setResources((r) => ({
          ...r,
          water: Math.min(100, r.water + pkg.water),
          food: Math.min(100, r.food + pkg.food),
        }));
        setCollectedSupplySols((prev) => new Set(prev).add(targetSol));
        setSeenSupplySols((prev) => new Set(prev).add(targetSol));
        setDailyReport((prev) => [
          ...prev,
          `📦 Collected supplies from Earth rocket: +${pkg.water} Water & +${pkg.food} Food!`,
        ]);
      };

      const loadWeatherForSol = async (targetSol) => {
        setLoadingNasa(true);
        const env = await NasaService.generateDailyMarsEnvironment(targetSol);
        setWeather(env);
        setLoadingNasa(false);
        if (targetSol > 1 || hasCompletedTutorialRef.current) {
          setShowMorningBriefing(true);
        }
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
          food: Math.max(15, c.foodCost),
        };
      }, [weather, roverStatus]);

      const totalScore = SAMPLE_CATALOG.reduce((sum, item) => {
        if (item.id === 'NONE' || item.id === 'ANCIENT_BIOSIGNATURE') return sum;
        return sum + samples[item.id] * item.points;
      }, 0);

      const showPowerDot = !solarCollectedToday;
      const hasRipeTomatoes = tomatoProgresses.some((p, i) => p >= MAX_TOMATO_GROWTH && !(rottenPlants && rottenPlants[i]));
      const hasRottenTomatoes = Boolean(rottenPlants && rottenPlants.some(Boolean));
      const showGreenhouseDot =
        tomatoProgresses.some((p, i) => (p >= MAX_TOMATO_GROWTH && !rottenPlants[i]) || (!rottenPlants[i] && p < MAX_TOMATO_GROWTH && !wateredPlants[i])) ||
        rottenPlants.some(Boolean) ||
        !todayTempOption;
      const showRoverDot =
        roverResultUnread || (roverStatus === 'READY' && !pendingExpedition);

      const handleCompleteSolarGame = (caughtCount, totalResolved) => {
        const gainedPower = GameLogicModule.calculateSolarGameReward(caughtCount, weather?.isDustStorm, sol, totalResolved);
        setShowSolarGameModal(false);
        setResources((r) => ({ ...r, power: Math.min(100, r.power + gainedPower) }));
        setSolarCollectedToday(true);
        setTotalSolarCaught((c) => c + caughtCount);
        if (caughtCount >= 14) setPerfectSolarGames((c) => c + 1);
        const msg = gainedPower > 0
          ? `☀️ Caught ${caughtCount} sunbeams and made +${gainedPower} Power!`
          : `⚠️ Missed all sunbeams—no power made.`;
        setDailyReport((prev) => [...prev, msg]);
      };

      const handleRequestElectrolysis = () => {
        if (resources.water < 10 || resources.power < 10) return;
        setPendingConfirmAction({
          icon: '🫧',
          title: 'Make Breathable Air (Oxygen)',
          costText: '-10 💧 Water, -10 ⚡ Power',
          gainText: '+20 🫧 Oxygen',
          note: 'We use electricity to split water into hydrogen gas and oxygen gas (electrolysis) so our astronauts have fresh air to breathe!',
          onExecute: () => {
            setResources((r) => ({
              ...r,
              water: Math.max(0, r.water - 10),
              power: Math.max(0, r.power - 10),
              oxygen: Math.min(100, r.oxygen + 20),
            }));
            setTotalWaterSpent((w) => w + 10);
            setDailyReport((prev) => [...prev, '🫧 Split water with electricity: -10 Water, -10 Power → +20 Oxygen!']);
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

      const handleRequestWaterDrill = () => {
        if (resources.power < 10 || resources.water >= 100) return;
        setPendingConfirmAction({
          icon: '💧',
          title: 'Mine Local Water from Well',
          costText: '-10 ⚡ Power',
          gainText: '+20 💧 Water',
          note: 'We pump power to the underground Mars well heater to melt subsurface ice and filter fresh water for our base!',
          onExecute: () => {
            setResources((r) => ({
              ...r,
              power: Math.max(0, r.power - 10),
              water: Math.min(100, r.water + 20),
            }));
            setDailyReport((prev) => [...prev, '💧 Extracted local water from the well: -10 Power → +20 Water!']);
          },
        });
      };

      const handleWaterSinglePlant = (idx) => {
        if (wateredPlants[idx] || (rottenPlants && rottenPlants[idx]) || tomatoProgresses[idx] >= MAX_TOMATO_GROWTH || resources.water < 2) return;
        setResources((r) => ({ ...r, water: Math.max(0, r.water - 2) }));
        setTotalWaterSpent((w) => w + 2);
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
        setRottenPlants([false, false, false, false]);
        ripeTimersRef.current = [0, 0, 0, 0];
        setDailyReport((prev) => [...prev, '🌱 Seeds planted.']);
      };

      const handleClearRottenPlant = (idx) => {
        setRottenPlants((prev) => {
          const next = [...prev];
          next[idx] = false;
          return next;
        });
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
        ripeTimersRef.current[idx] = 0;
        setDailyReport((prev) => [...prev, `🥀 Cleared spoiled plant #${idx + 1} and planted fresh seedling.`]);
      };

      const handleHarvestSinglePlant = (idx) => {
        if (rottenPlants[idx]) {
          handleClearRottenPlant(idx);
          return;
        }
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
        ripeTimersRef.current[idx] = 0;
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
          const sampleList = report.samples || (report.sample ? [report.sample] : []);
          sampleList.forEach((s) => {
            if (s && s.id !== 'NONE') {
              setSamples((prev) => ({ ...prev, [s.id]: (prev[s.id] || 0) + 1 }));
              if (s.id === 'ANCIENT_BIOSIGNATURE') {
                setSpecialDiscoveryPending(report);
              }
            }
          });
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
          gainText: `${OUR_ROVER_NAME} drives out & returns automatically!`,
          note: weather.isDustStorm
            ? `🌪️ Dust Storm Warning: Sending ${OUR_ROVER_NAME} out in a dust storm has a high chance of wheel damage! (${mode.desc})`
            : mode.desc,
          onExecute: () => {
            if (barsCost === 3) setDeepDrillMissions((c) => c + 1);
            setResources((r) => ({ ...r, power: Math.max(0, r.power - powerCost) }));
            setRoverStatus('OUT_ON_MISSION');
            setTotalMissions((m) => m + 1);

            const tripDuration = mode.durationSeconds || 110;
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
              `🛸 "${OUR_ROVER_NAME}" drove out of the garage (-${powerCost} Power)!`,
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
            exp.isDustStorm || Boolean(weather?.isDustStorm),
            Math.max(exp.radiationLevel || 1, weather?.radiationLevel || 1)
          );

          if (hazardEval.isDamaged) {
            setRoverStatus(hazardEval.damagedSols === 2 ? 'DAMAGED_2_SOL' : 'DAMAGED_1_SOL');
            setDamageSolLeft(hazardEval.damagedSols);
            justDamagedInCurrentSolRef.current = true;
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
              `⚠️ ${OUR_ROVER_NAME} returned to the garage with damage (${hazardEval.reasonText})! Requires ${hazardEval.damagedSols} Sol(s) repair.`,
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
              samples: found.samples || [found],
              collectedToVault: false,
            };
            setExpeditionLogs((prev) => [...prev, record]);
            setYesterdayReport(record);
            setLatestRoverReport(record);
            setRoverResultUnread(true);
            const returnMsg = found.isDoubleDiscovery
              ? `🛸 ${OUR_ROVER_NAME} returned with TWO mineral specimens! Tap it in the Rover Garage!`
              : `🛸 ${OUR_ROVER_NAME} returned to the garage with findings! Tap it in the Rover Garage!`;
            setDailyReport((prev) => [
              ...prev,
              returnMsg,
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
        const dailyFoodCost = Math.max(15, consumption.foodCost);

        const deducted = deductedInCurrentSolRef.current;
        const remPower = Math.max(0, consumption.powerCost - (deducted.power || 0));
        const remOxygen = Math.max(0, consumption.oxygenCost - (deducted.oxygen || 0));
        const remWater = Math.max(0, consumption.waterCost - (deducted.water || 0));
        const remFood = Math.max(0, dailyFoodCost - (deducted.food || 0));

        const nextPower = Math.min(100, Math.max(0, resources.power + passiveSolar - remPower));
        const nextOxygen = Math.min(100, Math.max(0, resources.oxygen - remOxygen));
        const nextWater = Math.min(100, Math.max(0, resources.water - remWater));
        const nextFood = Math.min(100, Math.max(0, resources.food - remFood));

        const totalRipe = tomatoProgresses.filter((p, i) => p >= MAX_TOMATO_GROWTH && !rottenPlants[i]).length;
        const totalRotten = rottenPlants.filter(Boolean).length;
        const totalGrowing = tomatoProgresses.filter((p, i) => p < MAX_TOMATO_GROWTH && wateredPlants[i] && !rottenPlants[i]).length;
        if (totalRotten > 0) {
          logs.push(`⚠️ ${totalRotten} tomato plant(s) spoiled from being unharvested! Tap them to clear.`);
        }
        if (totalRipe > 0) {
          logs.push(`🍅 ${totalRipe} ripe tomato plant(s) waiting in Greenhouse.`);
        } else if (totalGrowing > 0) {
          logs.push(`🌱 ${totalGrowing} watered tomato plant(s) growing well.`);
        }

        if (nextPower <= 0 || nextOxygen <= 0 || nextWater <= 0 || nextFood <= 0) {
          const reason =
            nextPower <= 0
              ? 'Base completely ran out of electrical power'
              : nextOxygen <= 0
              ? 'Ran out of air (oxygen)'
              : nextWater <= 0
              ? 'Ran out of water'
              : 'Ran out of food';
          setResources({ oxygen: nextOxygen, power: nextPower, water: nextWater, food: nextFood });
          setAbortReason(reason);
          setEnding('EMERGENCY_ABORT');
          return;
        }

        let nextRoverStatus = roverStatus;
        let nextDamageLeft = damageSolLeft;

        if (!pendingExpedition && damageSolLeft > 0) {
          if (justDamagedInCurrentSolRef.current) {
            justDamagedInCurrentSolRef.current = false;
            logs.push(`🔧 Rover "${OUR_ROVER_NAME}" is undergoing repairs in the garage (${damageSolLeft} Sol(s) remaining).`);
          } else {
            nextDamageLeft = damageSolLeft - 1;
            if (nextDamageLeft === 0) {
              nextRoverStatus = 'READY';
              logs.push(`🛠️ Rover "${OUR_ROVER_NAME}" repairs finished in the garage!`);
            } else {
              logs.push(`🔧 Rover "${OUR_ROVER_NAME}" repairs continuing in the garage (${nextDamageLeft} Sol(s) remaining).`);
            }
          }
        }

        if (sol >= 20) {
          const uncollected = latestRoverReport || yesterdayReport;
          if (uncollected && !uncollected.collectedToVault) {
            if (uncollected.photo) {
              setDailyPhotoAlbum((prev) => [...prev, { sol: uncollected.sol, photo: uncollected.photo }]);
            }
            const sampleList = uncollected.samples || (uncollected.sample ? [uncollected.sample] : []);
            sampleList.forEach((s) => {
              if (s && s.id !== 'NONE') {
                setSamples((prev) => ({ ...prev, [s.id]: (prev[s.id] || 0) + 1 }));
              }
            });
          }
          setResources({ oxygen: nextOxygen, power: nextPower, water: nextWater, food: nextFood });
          setEnding('NORMAL_20_SOL');
          return;
        }

        const nextSol = sol + 1;
        let finalWater = nextWater;
        let finalFood = nextFood;

        // If player didn't click rocket before Sol rollover, base crew retrieves cargo overnight
        if ((sol === 6 || sol === 12 || sol === 16) && !collectedSupplySols.has(sol)) {
          const pkg = sol === 16 ? { water: 30, food: 20 } : { water: 40, food: 30 };
          finalWater = Math.min(100, finalWater + pkg.water);
          finalFood = Math.min(100, finalFood + pkg.food);
          logs.push(`📦 [Sol ${sol} Supplies Stored] Base crew retrieved the uncollected rocket cargo (+${pkg.water} Water, +${pkg.food} Food)!`);
          setCollectedSupplySols((prev) => new Set(prev).add(sol));
        }

        if (nextSol === 6 || nextSol === 12 || nextSol === 16) {
          logs.push(`📦 [Sol ${nextSol} Supply Rocket Landed!] Tap the rocket outside to collect supplies!`);
        }

        setResources({ oxygen: nextOxygen, power: nextPower, water: finalWater, food: finalFood });
        setRoverStatus(nextRoverStatus);
        setDamageSolLeft(nextDamageLeft);
        setYesterdayConsumption(consumption);
        setSol(nextSol);
        setSecondsLeftInDay(DAY_DURATION_SECONDS);
        lastTickTimeRef.current = Date.now();
        setSmoothNightFactor(0);
        deductedInCurrentSolRef.current = { power: 0, oxygen: 0, water: 0, food: 0 };
        setSolarCollectedToday(false);
        setTodayTempOption(null);
        setDailyReport(logs);
        await loadWeatherForSol(nextSol);
      };

      executeEndSolRef.current = executeEndSol;

      useEffect(() => {
        if (showCoverPage || showLaunchTransition || ending || specialDiscoveryPending || showMorningBriefing || showRandomScienceFactModal || loadingNasa || isPaused || showTutorial) return;
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

          // Continuous real-time tomato growth (100s full growth cycle) & 70s rot timer
          const lampBonus = todayTempOptionRef.current
            ? (todayTempOptionRef.current.id === 'TEMP_WARM' ? 0.06 : 0.0225)
            : 0;
          const baseGrowthRate = 0.09; // Exactly 100s unboosted, 80s with ECO (+0.0225), 60s with WARM (+0.06)
          const growthRate = baseGrowthRate + lampBonus;

          setTomatoProgresses((prevProgresses) => {
            let changed = false;
            const nextProgresses = [...prevProgresses];
            const currentWatered = wateredPlantsRef.current;
            const currentRotten = rottenPlantsRef.current;

            for (let i = 0; i < 4; i++) {
              if (currentRotten && currentRotten[i]) {
                continue;
              }
              if (nextProgresses[i] >= MAX_TOMATO_GROWTH) {
                ripeTimersRef.current[i] = (ripeTimersRef.current[i] || 0) + 1;
                if (ripeTimersRef.current[i] >= 70 && !(currentRotten && currentRotten[i])) {
                  setRottenPlants((prevR) => {
                    if (prevR[i]) return prevR;
                    const nextR = [...prevR];
                    nextR[i] = true;
                    return nextR;
                  });
                }
              } else if (currentWatered && currentWatered[i]) {
                const nextVal = Math.min(MAX_TOMATO_GROWTH, Number((nextProgresses[i] + growthRate).toFixed(2)));
                if (nextVal !== nextProgresses[i]) {
                  nextProgresses[i] = nextVal;
                  changed = true;
                  if (nextVal >= MAX_TOMATO_GROWTH) {
                    ripeTimersRef.current[i] = 0;
                    setWateredPlants((prevW) => {
                      if (!prevW[i]) return prevW;
                      const nextW = [...prevW];
                      nextW[i] = false;
                      return nextW;
                    });
                  }
                }
              }
            }

            return changed ? nextProgresses : prevProgresses;
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

                if (nextRes.power <= 0 || nextRes.oxygen <= 0 || nextRes.water <= 0 || nextRes.food <= 0) {
                  const reason =
                    nextRes.power <= 0
                      ? 'Base completely ran out of electrical power'
                      : nextRes.oxygen <= 0
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

            lastTickTimeRef.current = Date.now();
            return nextSec;
          });
        }, 1000);
        return () => clearInterval(interval);
      }, [showCoverPage, showLaunchTransition, ending, specialDiscoveryPending, showMorningBriefing, showRandomScienceFactModal, loadingNasa, isPaused, showTutorial]);

      const handleRestart = () => {
        deductedInCurrentSolRef.current = { power: 0, oxygen: 0, water: 0, food: 0 };
        currentSolRatesRef.current = { power: 12, oxygen: 10, water: 6, food: 16 };
        justDamagedInCurrentSolRef.current = false;
        setSol(1);
        setSecondsLeftInDay(DAY_DURATION_SECONDS);
        setResources(INITIAL_RESOURCES);
        setCurrentScene('EXTERIOR');
        setSolarCollectedToday(false);
        setTodayTempOption(null);
        setWateredPlants([false, false, false, false]);
        setRottenPlants([false, false, false, false]);
        ripeTimersRef.current = [0, 0, 0, 0];
        setIsPaused(false);
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
        setTotalSolarCaught(0);
        setTotalWaterSpent(0);
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
        setSeenSupplySols(new Set());
        setCollectedSupplySols(new Set());
        lastTickTimeRef.current = Date.now();
        setSmoothNightFactor(0);
        setShowGuidePage(false);
        setShowTutorial(false);
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
              if (!hasCompletedTutorial) {
                setShowMorningBriefing(false);
                setShowTutorial(true);
              } else {
                setShowMorningBriefing(true);
              }
            }}
            onComplete={() => {
              setShowLaunchTransition(false);
              if (!hasCompletedTutorial) {
                setShowMorningBriefing(false);
                setShowTutorial(true);
              } else {
                setShowMorningBriefing(true);
              }
            }}
          />
        );
      }

      if (ending) {
        // 4-Category Tiered Badges: Power, Water-Saving, Tomato Growing, Survival Days
        const getPowerBadge = () => {
          if (totalSolarCaught >= 80) return { category: 'Power', tier: 'Gold', icon: '⚡', title: 'Solar Master', desc: `Caught ${totalSolarCaught} sunbeams on Mars!` };
          if (totalSolarCaught >= 45) return { category: 'Power', tier: 'Silver', icon: '☀️', title: 'Sun Catcher Pro', desc: `Caught ${totalSolarCaught} sunbeams (Gold at 80)` };
          if (totalSolarCaught >= 15) return { category: 'Power', tier: 'Bronze', icon: '🔋', title: 'Power Starter', desc: `Caught ${totalSolarCaught} sunbeams (Silver at 45)` };
          return { category: 'Power', tier: 'Locked', icon: '⚡', title: 'Power Badge', desc: 'Catch 15+ sunbeams to unlock Bronze' };
        };

        const avgWaterPerSol = totalWaterSpent / Math.max(1, sol);
        const getWaterBadge = () => {
          if (sol >= 5 && resources.water >= 65 && avgWaterPerSol <= 5) {
            return { category: 'Water-Saving', tier: 'Gold', icon: '💧', title: 'Hydro Guardian', desc: `Saved ${resources.water}% water with ultra-low usage!` };
          }
          if (sol >= 3 && resources.water >= 45 && avgWaterPerSol <= 7) {
            return { category: 'Water-Saving', tier: 'Silver', icon: '🌊', title: 'Smart Water Saver', desc: `Kept ${resources.water}% water reserve (Gold: 65%+ & ≤5/Sol)` };
          }
          if (resources.water >= 25) {
            return { category: 'Water-Saving', tier: 'Bronze', icon: '🚰', title: 'Water Keeper', desc: `Ended with ${resources.water}% water (Silver: 45%+)` };
          }
          return { category: 'Water-Saving', tier: 'Locked', icon: '💧', title: 'Water-Saving Badge', desc: 'Keep 25%+ water reserve to unlock Bronze' };
        };

        const getTomatoBadge = () => {
          if (harvestCount >= 6) return { category: 'Tomatoes', tier: 'Gold', icon: '🍅', title: 'Master Mars Farmer', desc: `Harvested ${harvestCount} ripe tomato crops!` };
          if (harvestCount >= 3) return { category: 'Tomatoes', tier: 'Silver', icon: '🌿', title: 'Greenhouse Gardener', desc: `Harvested ${harvestCount} crops (Gold at 6)` };
          if (harvestCount >= 1) return { category: 'Tomatoes', tier: 'Bronze', icon: '🌱', title: 'Sprout Caretaker', desc: `Harvested ${harvestCount} crop (Silver at 3)` };
          return { category: 'Tomatoes', tier: 'Locked', icon: '🍅', title: 'Tomato Badge', desc: 'Harvest 1+ ripe tomato plant to unlock Bronze' };
        };

        const getSurvivalBadge = () => {
          if (sol >= 20 && ending !== 'EMERGENCY_ABORT') {
            return { category: 'Survival', tier: 'Gold', icon: '🏅', title: '20-Sol Mars Hero', desc: 'Survived all 20 Sols on Mars!' };
          }
          if (sol >= 12) {
            return { category: 'Survival', tier: 'Silver', icon: '🚀', title: 'Seasoned Astronaut', desc: `Survived ${sol} Sols on Mars (Gold at 20 Sols)` };
          }
          if (sol >= 5) {
            return { category: 'Survival', tier: 'Bronze', icon: '🧑‍🚀', title: 'Mars Pioneer', desc: `Survived ${sol} Sols on Mars (Silver at 12 Sols)` };
          }
          return { category: 'Survival', tier: 'Locked', icon: '🏅', title: 'Survival Badge', desc: 'Survive 5+ Sols on Mars to unlock Bronze' };
        };

        const unlockedBadges = [
          getPowerBadge(),
          getWaterBadge(),
          getTomatoBadge(),
          getSurvivalBadge(),
        ];

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
                <div className="bg-white border-2 border-[#e6d5bc] rounded-2xl px-3.5 py-1.5 shadow-sm flex items-center gap-2.5" data-tour="clock">
                  <span className="text-base">{isNightPhase ? '🌙' : '☀️'}</span>
                  <span className="font-black text-sm md:text-base text-[#4a3525]">{`Sol ${sol}`}</span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 notranslate ${
                      isNightPhase ? 'bg-indigo-950 border-indigo-400' : 'bg-amber-100 border-amber-500'
                    }`}
                    title="Sol Progress Clock"
                    translate="no"
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
                  Weather
                </button>
                <button
                  onClick={() => { setCurrentScene('EXTERIOR'); setShowTutorial(true); }}
                  className="bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 rounded-2xl px-3 py-1.5 text-xs font-black text-amber-950 shadow-sm"
                  title="新手操作引導教學"
                >
                  Tour
                </button>
                <button
                  onClick={() => { setShowGuidePage(true); setShowCoverPage(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-2xl px-3 py-1.5 text-xs font-black shadow-sm"
                >
                  Guide
                </button>
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className={`rounded-2xl px-3 py-1.5 text-xs font-black shadow-sm border-2 transition active:scale-95 ${
                    isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 animate-pulse'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300'
                  }`}
                  title={isPaused ? 'Resume Mission' : 'Pause Mission'}
                >
                  {isPaused ? '▶ Resume' : 'Pause'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full items-stretch notranslate" translate="no" data-tour="resources">
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
                hasRipeTomatoes={hasRipeTomatoes}
                hasRottenTomatoes={hasRottenTomatoes}
                seenSupplySols={seenSupplySols}
                collectedSupplySols={collectedSupplySols}
                onDismissSupplyAlert={(targetSol) => setSeenSupplySols((prev) => new Set(prev).add(targetSol))}
                onCollectSupply={handleCollectSupply}
                onEnterRoom={(room) => setCurrentScene(room)}
                onOpenRandomScienceFact={handleOpenRandomScienceFact}
              />
            )}

            {currentScene === 'POWER' && (
              <PowerRoomModule
                resources={resources}
                nightFactor={nightFactor}
                solarCollectedToday={solarCollectedToday}
                seenTopics={seenTopics}
                onOpenTopic={handleOpenTopic}
                onBack={() => setCurrentScene('EXTERIOR')}
                onOpenSolarGame={() => setShowSolarGameModal(true)}
                onRequestElectrolysis={handleRequestElectrolysis}
                onRequestWaterDrill={handleRequestWaterDrill}
              />
            )}

            {currentScene === 'GREENHOUSE' && (
              <GreenhouseRoomModule
                resources={resources}
                weather={weather}
                tomatoProgress={tomatoProgress}
                tomatoProgresses={tomatoProgresses}
                wateredPlants={wateredPlants}
                rottenPlants={rottenPlants}
                todayTempOption={todayTempOption}
                seenTopics={seenTopics}
                onOpenTopic={handleOpenTopic}
                onBack={() => setCurrentScene('EXTERIOR')}
                onWaterSinglePlant={handleWaterSinglePlant}
                onPlantSeeds={handlePlantSeeds}
                onHarvestSinglePlant={handleHarvestSinglePlant}
                onClearRottenPlant={handleClearRottenPlant}
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
                latestRoverResult={latestRoverReport || yesterdayReport}
                roverResultUnread={roverResultUnread}
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

          {showRandomScienceFactModal && (
            <RandomScienceFactModal
              fact={currentRandomFact}
              onNextRandomFact={handleNextRandomFact}
              onClose={() => setShowRandomScienceFactModal(false)}
            />
          )}

          <MorningBriefingModule
            visible={showMorningBriefing && !loadingNasa && !showTutorial}
            sol={sol}
            weather={weather}
            yesterdayConsumption={yesterdayConsumption}
            onConfirm={() => setShowMorningBriefing(false)}
          />

          <TutorialWalkthroughModal
            visible={showTutorial}
            sol={sol}
            onComplete={() => {
              setShowTutorial(false);
              const wasFirstTime = !hasCompletedTutorial;
              setHasCompletedTutorial(true);
              if (wasFirstTime || sol === 1) {
                setShowMorningBriefing(true);
              }
            }}
            onSkip={() => {
              setShowTutorial(false);
              const wasFirstTime = !hasCompletedTutorial;
              setHasCompletedTutorial(true);
              if (wasFirstTime || sol === 1) {
                setShowMorningBriefing(true);
              }
            }}
          />

          {/* Pause Modal Overlay */}
          {isPaused && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#fff9ef] border-4 border-amber-600 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-200 text-amber-950 text-xs font-black tracking-wider uppercase">
                  Game Paused
                </span>
                <h3 className="text-2xl font-black text-amber-950">Mission Paused</h3>
                <p className="text-sm font-bold text-amber-800 pb-3">
                  Mars base operations and timers are paused.
                </p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="w-full py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-base shadow-lg border-2 border-amber-600 active:scale-95 transition cursor-pointer"
                >
                  Resume Mission
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      componentDidCatch(error, info) {
        console.warn('ErrorBoundary captured translation or rendering error:', error, info);
      }
      render() {
        if (this.state.hasError) {
          return (
            <div className="min-h-screen bg-[#fdf6e9] flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-white border-2 border-[#e6d5bc] rounded-3xl p-6 max-w-sm shadow-xl space-y-3">
                <span className="text-3xl">🚀</span>
                <h2 className="text-xl font-black text-[#4a3525]">LITTLE MARSONAUT</h2>
                <p className="text-xs text-amber-800 font-bold leading-relaxed">
                  Display refreshed after browser translation.
                  <br />（瀏覽器翻譯已作用，點擊下方即可恢復畫面）
                </p>
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full py-3 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-sm shadow cursor-pointer border-2 border-amber-600 active:scale-95 transition"
                >
                  Resume / 繼續遊戲
                </button>
              </div>
            </div>
          );
        }
        return this.props.children;
      }
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
