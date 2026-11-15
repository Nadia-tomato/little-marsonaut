// Module 6C: Tomato Greenhouse & Watering Can
// [Module 8: Greenhouse Interactive Scene Module]
    // =========================================================================
    function GreenhouseRoomModule({
      resources,
      weather,
      tomatoProgress,
      tomatoProgresses = [1, 1, 1, 1],
      wateredPlants = [false, false, false, false],
      todayTempOption,
      seenTopics,
      onOpenTopic,
      onBack,
      onWaterSinglePlant,
      onPlantSeeds,
      onHarvestSinglePlant,
      onRequestSelectTempOption,
    }) {
      const plantList = Array.isArray(tomatoProgresses)
        ? tomatoProgresses
        : [tomatoProgress, tomatoProgress, tomatoProgress, tomatoProgress];
      const [flyingTomatoes, setFlyingTomatoes] = useState([false, false, false, false]);
      const [activeWaterPlantIdx, setActiveWaterPlantIdx] = useState(null);
      const [isHoldingCan, setIsHoldingCan] = useState(false);
      const [isDraggingCan, setIsDraggingCan] = useState(false);
      const [showLampModal, setShowLampModal] = useState(false);

      const safeTempMin = weather && typeof weather.tempMin === 'number' ? weather.tempMin : -75;
      const greenhouseConfig = GameLogicModule.getGreenhouseSeparateOptions(safeTempMin);

      const anyRipe = plantList.some((p) => p >= MAX_TOMATO_GROWTH);
      const needsWater = plantList.some((p, i) => p < MAX_TOMATO_GROWTH && !wateredPlants[i]);
      const allWatered = plantList.every((p, i) => p >= MAX_TOMATO_GROWTH || wateredPlants[i]);

      const applyWaterToPlant = (idx) => {
        const prog = plantList[idx];
        if (!wateredPlants[idx] && resources.water >= 2 && prog < MAX_TOMATO_GROWTH) {
          onWaterSinglePlant(idx);
          setActiveWaterPlantIdx(idx);
          setTimeout(() => setActiveWaterPlantIdx(null), 700);
        }
      };

      const handlePlantClick = (idx) => {
        const prog = plantList[idx];
        if (prog >= MAX_TOMATO_GROWTH) {
          setFlyingTomatoes((prev) => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          setTimeout(() => {
            setFlyingTomatoes((prev) => {
              const next = [...prev];
              next[idx] = false;
              return next;
            });
          }, 800);
          if (onHarvestSinglePlant) onHarvestSinglePlant(idx);
        }
      };

      const renderLeaf = (x, y, scale, rotate) => (
        <g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}>
          <path
            d="M0,0 C-10,-6 -22,-4 -28,2 C-21,6 -12,8 0,4 C12,8 21,6 28,2 C22,-4 10,-6 0,0 Z"
            fill="#22c55e"
            stroke="#15803d"
            strokeWidth="2"
          />
          <path d="M-22,1 L22,1 M-10,-2 L-6,1 M10,-2 L6,1" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );

      const renderTomatoFruit = (x, y, r) => (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx="0" cy="2" r={r} fill="#ef4444" stroke="#991b1b" strokeWidth="2.2" />
          <ellipse cx={-r * 0.32} cy={-r * 0.15} rx={r * 0.22} ry={r * 0.35} transform="rotate(-25)" fill="#fca5a5" opacity="0.85" />
          <polygon
            points={`0,${-r + 1} -5,${-r - 5} -2,${-r + 3} -9,${-r + 4} -2,${-r + 6} 0,${-r + 9} 2,${-r + 6} 9,${-r + 4} 2,${-r + 3} 5,${-r - 5}`}
            fill="#16a34a"
            stroke="#14532d"
            strokeWidth="1.2"
          />
        </g>
      );

      return (
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-4 border-[#d9c2a3] shadow-xl bg-[#e6f4ea]">
          <svg viewBox="0 0 1000 625" className="w-full h-full object-cover block">
            <rect width="1000" height="470" fill="#dff2e4" />
            <polygon points="0,470 1000,470 1000,625 0,625" fill="#e9d8be" />
            <path d="M50,470 C50,80 950,80 950,470" fill="none" stroke="#9ac4a6" strokeWidth="8" />
            <line x1="300" y1="120" x2="300" y2="470" stroke="#b6d9bf" strokeWidth="5" />
            <line x1="700" y1="120" x2="700" y2="470" stroke="#b6d9bf" strokeWidth="5" />

            {[275, 455, 635].map((lx, i) => (
              <g key={i} transform={`translate(${lx - 45}, 115)`}>
                <line x1="45" y1="-35" x2="45" y2="10" stroke="#6b7280" strokeWidth="5" />
                <path
                  d="M10,35 C10,10 80,10 80,35 Z"
                  fill={todayTempOption ? '#f59e0b' : '#cbd5e1'}
                  stroke="#5a4636"
                  strokeWidth="4"
                />
                <polygon
                  points="15,35 75,35 98,165 -8,165"
                  fill="#fef08a"
                  opacity={todayTempOption ? (todayTempOption.id === 'TEMP_WARM' ? '0.58' : '0.38') : '0.12'}
                />
              </g>
            ))}

            <g transform="translate(45, 330)">
              <rect x="0" y="70" width="130" height="20" rx="6" fill="#c88a55" stroke="#6e4726" strokeWidth="4" />
              <line x1="25" y1="90" x2="25" y2="160" stroke="#6e4726" strokeWidth="6" />
              <line x1="105" y1="90" x2="105" y2="160" stroke="#6e4726" strokeWidth="6" />
            </g>

            <g transform="translate(215, 290)">
              <rect x="0" y="95" width="510" height="95" rx="14" fill="#c88a55" stroke="#6e4726" strokeWidth="6" />
              <line x1="10" y1="126" x2="500" y2="126" stroke="#8c5832" strokeWidth="3" />
              <line x1="10" y1="158" x2="500" y2="158" stroke="#8c5832" strokeWidth="3" />
              <rect x="15" y="80" width="480" height="24" rx="8" fill="#6b4423" />
              <line x1="25" y1="86" x2="485" y2="86" stroke="#38bdf8" strokeWidth="5" strokeDasharray="10 6" />

              {[75, 195, 315, 435].map((px, idx) => {
                const prog = plantList[idx];
                const visualStage =
                  prog >= MAX_TOMATO_GROWTH
                    ? 3
                    : prog >= 6
                    ? 2
                    : prog >= 2
                    ? 1
                    : 0;

                return (
                  <g key={idx} transform={`translate(${px}, 84)`}>
                    {wateredPlants[idx] && (
                      <ellipse cx="0" cy="8" rx="35" ry="8" fill="#0284c7" opacity="0.45" />
                    )}

                    {visualStage === 0 ? (
                      <g>
                        <path d="M0,0 L0,-24" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
                        {renderLeaf(0, -22, 0.75, -8)}
                      </g>
                    ) : visualStage === 1 ? (
                      <g>
                        <path d="M0,0 L0,-62 M0,-25 L-24,-42 M0,-38 L24,-54" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
                        {renderLeaf(-22, -40, 0.95, -25)}
                        {renderLeaf(22, -52, 0.95, 25)}
                        {renderLeaf(0, -64, 0.9, 0)}
                      </g>
                    ) : visualStage === 2 ? (
                      <g>
                        <path d="M0,0 L0,-86 M0,-28 L-30,-48 M0,-46 L30,-66 M0,-62 L-22,-80" stroke="#15803d" strokeWidth="7" strokeLinecap="round" />
                        {renderLeaf(-28, -46, 1.1, -25)}
                        {renderLeaf(28, -64, 1.1, 25)}
                        {renderLeaf(-20, -78, 0.95, -15)}
                        {renderLeaf(0, -88, 1.0, 5)}
                        <circle cx="-18" cy="-36" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                        <circle cx="20" cy="-52" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
                      </g>
                    ) : (
                      <g>
                        <path d="M0,0 L0,-98 M0,-30 L-34,-52 M0,-48 L34,-70 M0,-68 L-26,-88" stroke="#14532d" strokeWidth="7.5" strokeLinecap="round" />
                        {renderLeaf(-32, -50, 1.15, -25)}
                        {renderLeaf(32, -68, 1.15, 25)}
                        {renderLeaf(-24, -86, 1.0, -18)}
                        {renderLeaf(0, -100, 1.05, 0)}
                        {renderTomatoFruit(-26, -35, 14)}
                        {renderTomatoFruit(26, -50, 15)}
                        {renderTomatoFruit(-4, -68, 13)}
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            <g transform="translate(745, 445)">
              <rect x="65" y="25" width="135" height="80" rx="12" fill="#d99b66" stroke="#6e4726" strokeWidth="5" />
              <line x1="65" y1="52" x2="200" y2="52" stroke="#6e4726" strokeWidth="4" />
              <line x1="65" y1="78" x2="200" y2="78" stroke="#6e4726" strokeWidth="4" />
              {renderTomatoFruit(105, 22, 12)}
              {renderTomatoFruit(135, 20, 13)}
              {renderTomatoFruit(165, 23, 12)}
            </g>
          </svg>

          {[0, 1, 2, 3].map((idx) =>
            flyingTomatoes[idx] ? (
              <div
                key={idx}
                style={{
                  left: `${[29.0, 41.0, 53.0, 65.0][idx]}%`,
                  top: '52%',
                  transform: 'translateX(-50%)',
                }}
                className="absolute text-4xl animate-tomato-harvest pointer-events-none z-30 select-none flex flex-col items-center"
              >
                <span>🍅</span>
                <span className="text-xs font-black text-amber-950 bg-amber-300 px-2 py-0.5 rounded-full shadow border-2 border-white -mt-1 whitespace-nowrap">
                  +6 Food!
                </span>
              </div>
            ) : null
          )}

          {anyRipe && (
            <div className="top-[35%] left-1/2 -translate-x-1/2 z-30 absolute pointer-events-none whitespace-nowrap">
              <span className="animate-float px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs md:text-sm border-2 border-white shadow-xl flex items-center gap-1.5">
                <span>🍅</span>
                <span>Tap Ripe Tomato Plant to Harvest!</span>
              </span>
            </div>
          )}

          <div className="top-3 left-3 z-20 absolute">
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-full bg-[#fdf6e9]/95 hover:bg-emerald-200 border-2 border-[#d9c2a3] font-black text-xs text-[#4a3525] shadow-md flex items-center gap-1 active:scale-95 transition"
            >
              <span className="text-base leading-none">‹</span>
              <span>Back</span>
            </button>
          </div>

          <div
            style={{ right: '3%', top: '16%', width: '21%' }}
            className="absolute z-30 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1.5">
              <QuestionMarkButton
                topicKey="TOMATO_GROWTH"
                seenTopics={seenTopics}
                onOpenTopic={onOpenTopic}
              />
            </div>
            <button
              onClick={() => !todayTempOption && setShowLampModal(true)}
              disabled={Boolean(todayTempOption)}
              className={`w-full rounded-2xl border-2 p-2.5 shadow-lg transition cursor-pointer flex flex-col items-center text-center gap-1 ${
                todayTempOption
                  ? 'bg-emerald-600 border-white text-white'
                  : 'bg-[#fffaf0]/95 hover:bg-amber-100 border-amber-400 text-[#4a3525] animate-float'
              }`}
              title="Turn on Grow Lamps & Heater to boost tomato growth!"
            >
              <span className="text-2xl leading-none">💡</span>
              <span className="text-[11px] font-black leading-tight">
                {todayTempOption
                  ? `On: ${todayTempOption.title}`
                  : 'Grow Lamps & Heater'}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  todayTempOption ? 'bg-emerald-700 text-emerald-100' : 'bg-amber-300 text-amber-950'
                }`}
              >
                {todayTempOption ? '✓ Active' : 'Tap to Set ⚡'}
              </span>
            </button>
          </div>

          <div
            draggable={needsWater}
            onDragStart={(event) => {
              event.dataTransfer.setData('text/plain', 'watering_can');
              setIsDraggingCan(true);
              setIsHoldingCan(true);
            }}
            onDragEnd={() => {
              setIsDraggingCan(false);
            }}
            onClick={() => setIsHoldingCan((prev) => !prev)}
            style={{ left: '5.5%', top: '48%', width: '96px', height: '96px' }}
            className={`absolute z-30 rounded-2xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-center transition-transform ${
              isHoldingCan ? 'scale-110 ring-4 ring-sky-400' : 'hover:scale-105'
            }`}
            title="Drag watering can to water tomato plants (-2 Water each)"
          >
            <svg viewBox="0 0 80 80" className="w-20 h-20 drop-shadow-md">
              <path d="M 22 35 C 5 35 5 62 22 62" fill="none" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="38" cy="48" rx="20" ry="17" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
              <ellipse cx="38" cy="33" rx="10" ry="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
              <path d="M 52 48 L 70 30" stroke="#0284c7" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="72" cy="28" rx="6" ry="10" transform="rotate(-35 72 28)" fill="#facc15" stroke="#ca8a04" strokeWidth="3" />
              <circle cx="72" cy="28" r="1.5" fill="#78350f" />
              <circle cx="70" cy="25" r="1.5" fill="#78350f" />
              <circle cx="74" cy="31" r="1.5" fill="#78350f" />
              <path d="M 38 42 C 38 42 32 50 32 53 C 32 56 35 58 38 58 C 41 58 44 56 44 53 C 44 50 38 42 38 42 Z" fill="#ffffff" opacity="0.9" />
            </svg>

            {needsWater && (
              <span className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center animate-alert-pulse">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-7 w-7 bg-red-600 border-2 border-white shadow text-white font-black text-lg leading-none items-center justify-center">
                  !
                </span>
              </span>
            )}
            {needsWater && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                <span className="animate-float px-2.5 py-0.5 rounded-full bg-sky-500 text-white font-black text-[10px] shadow border border-white">
                  Drag to Water! 💧
                </span>
              </div>
            )}
            {allWatered && !anyRipe && (
              <span className="absolute -top-1 -right-1 inline-flex rounded-full h-6 w-6 bg-emerald-500 border-2 border-white shadow text-white font-black text-xs items-center justify-center">
                ✓
              </span>
            )}
          </div>

          <div
            className="absolute left-[21.5%] top-[42%] w-[51%] h-[38%] z-20 flex"
            onTouchMove={(e) => {
              if (!isHoldingCan && !isDraggingCan) return;
              const touch = e.touches[0];
              const el = document.elementFromPoint(touch.clientX, touch.clientY);
              const plantEl = el?.closest('[data-plant-idx]');
              if (plantEl) {
                const idx = Number(plantEl.getAttribute('data-plant-idx'));
                if (!isNaN(idx) && !wateredPlants[idx] && plantList[idx] < MAX_TOMATO_GROWTH) {
                  applyWaterToPlant(idx);
                }
              }
            }}
          >
            {[0, 1, 2, 3].map((idx) => {
              const isWatered = wateredPlants[idx];
              const isRipe = plantList[idx] >= MAX_TOMATO_GROWTH;
              return (
                <div
                  key={idx}
                  data-plant-idx={idx}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!isWatered && !isRipe) {
                      applyWaterToPlant(idx);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!isRipe) applyWaterToPlant(idx);
                  }}
                  onMouseEnter={() => {
                    if (isDraggingCan && !isWatered && !isRipe) {
                      applyWaterToPlant(idx);
                    }
                  }}
                  onPointerEnter={() => {
                    if (isDraggingCan && !isWatered && !isRipe) {
                      applyWaterToPlant(idx);
                    }
                  }}
                  onClick={() => handlePlantClick(idx)}
                  className={`flex-1 h-full cursor-pointer relative flex flex-col items-center justify-end pb-3 rounded-2xl transition hover:bg-emerald-300/20 active:scale-95 ${
                    !isWatered && !isRipe ? 'ring-2 ring-sky-400/50' : ''
                  }`}
                  title={
                    isRipe
                      ? 'Tap this plant to pick ripe tomatoes (+6 Food)'
                      : isWatered
                      ? 'Plant watered!'
                      : 'Drag watering can onto plant to water (-2 Water)'
                  }
                >
                  {activeWaterPlantIdx === idx && (
                    <div className="absolute top-2 text-2xl animate-water-drop pointer-events-none">
                      💧
                    </div>
                  )}

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black border shadow-sm transition ${
                      isRipe
                        ? 'bg-red-600 text-white border-white animate-bounce'
                        : isWatered
                        ? 'bg-sky-500 text-white border-sky-300'
                        : 'bg-white/95 text-sky-900 border-sky-300'
                    }`}
                  >
                    {isRipe
                      ? '🍅 Pick (+6)'
                      : isWatered
                      ? '💧 Watered'
                      : '💧 -2 Water'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute left-[12%] right-[12%] bottom-2.5 z-20 flex justify-center pointer-events-none">
            {anyRipe ? (
              <div className="bg-red-600 border-2 border-white text-white px-5 py-1.5 rounded-full text-xs font-black shadow-xl animate-bounce flex items-center justify-center gap-1.5">
                <span>🧺</span>
                <span>Tap ripe plant to harvest (+6 Food each)!</span>
              </div>
            ) : needsWater ? (
              <div className="bg-[#fdf6e9]/95 border border-[#d9c2a3] px-3.5 py-1 rounded-full text-[11px] font-black text-[#5a3e28] shadow">
                🌱 Drag watering can over dry plants (-2 Water each) &amp; set Grow Lamps on the right!
              </div>
            ) : (
              <div className="bg-emerald-100/95 border border-emerald-400 px-3.5 py-1 rounded-full text-[11px] font-black text-emerald-900 shadow">
                ✨ All growing plants watered! {todayTempOption ? 'Grow lamps are shining!' : 'Tap Grow Lamps on the right for extra growth!'}
              </div>
            )}
          </div>

          {tomatoProgress === 0 && (
            <div
              draggable
              onDragStart={(event) => event.dataTransfer.setData('text/plain', 'seed')}
              onClick={onPlantSeeds}
              className="absolute right-8 bottom-6 z-20 w-24 h-20 rounded-2xl border-2 border-amber-500 bg-amber-100 shadow-lg flex flex-col items-center justify-center cursor-grab hover:scale-105 active:scale-95 transition"
              title="Drag seeds or click to plant seedlings"
            >
              <span className="text-3xl">🌱</span>
              <span className="text-[11px] font-black text-amber-900">Plant Seeds</span>
            </div>
          )}

          {showLampModal && (
            <div className="inset-0 absolute bg-[#2d1e12]/70 flex items-center justify-center p-4 z-40">
              <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-md w-full p-5 space-y-3 shadow-2xl">
                <div className="flex justify-between items-center">
                  <span className="font-black text-base text-orange-900">
                    💡 Grow Lamps &amp; Heater ({greenhouseConfig.weatherTag})
                  </span>
                  <button
                    onClick={() => setShowLampModal(false)}
                    className="px-3 py-1 rounded-full bg-[#eadbc5] text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-[#5a3e28] bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-semibold leading-relaxed">
                  💡 <b>Why Shine Light on Tomatoes?</b> Plants use light to make their own food (photosynthesis), and heaters keep them from freezing at night on Mars!
                </p>

                {greenhouseConfig.tempOptions.map((opt) => {
                  const canAfford = resources.power >= opt.powerCost;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setShowLampModal(false);
                        onRequestSelectTempOption(opt);
                      }}
                      disabled={!canAfford}
                      className="w-full p-3.5 rounded-2xl bg-white hover:bg-orange-50 disabled:opacity-45 border-2 border-orange-300 text-left space-y-1 active:scale-95 transition shadow-sm"
                    >
                      <div className="flex justify-between items-center font-black text-orange-900 text-sm">
                        <span>{opt.title}</span>
                        <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                          Uses {opt.powerCost} ⚡
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    // =========================================================================
