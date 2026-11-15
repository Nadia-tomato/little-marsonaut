// Module 6B: Power Lab & Oxygen Electrolysis
// [Module 7: Power Lab Interactive Scene Module]
    // =========================================================================
    function PowerRoomModule({
      resources,
      nightFactor,
      solarCollectedToday,
      seenTopics,
      onOpenTopic,
      onBack,
      onOpenSolarGame,
      onRequestElectrolysis,
      onRequestWaterDrill,
    }) {
      const palette = getDayNightPalette(nightFactor);
      const isNight = nightFactor >= 0.55;

      return (
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-4 border-[#d9c2a3] shadow-xl bg-[#dce6f2]">
          <svg viewBox="0 0 1000 625" className="w-full h-full object-cover block">
            <defs>
              <clipPath id="powerWindowClip">
                <rect x="244" y="59" width="512" height="182" rx="20" />
              </clipPath>
              <linearGradient id="powerWinSky" x1="0" y1="0" x2="0" y2="1" className="smooth-sky-grad">
                <stop offset="0%" stopColor={palette.skyTop} />
                <stop offset="100%" stopColor={palette.skyBot} />
              </linearGradient>
            </defs>

            <rect width="1000" height="450" fill="#cbd8e8" />
            <polygon points="0,450 1000,450 1000,625 0,625" fill="#9ba9bc" />
            <polygon points="140,470 860,470 920,605 80,605" fill="none" stroke="#facc15" strokeWidth="6" opacity="0.6" />

            {/* Centered Mars Observation Window */}
            <g clipPath="url(#powerWindowClip)">
              <rect x="240" y="55" width="520" height="190" fill="url(#powerWinSky)" />
              {palette.starOpacity > 0.01 && (
                <g opacity={palette.starOpacity} fill="#fef9c3">
                  <circle cx="280" cy="85" r="2" />
                  <circle cx="360" cy="78" r="2.5" />
                  <circle cx="500" cy="90" r="2" />
                  <circle cx="630" cy="75" r="2.2" />
                  <circle cx="710" cy="95" r="1.8" />
                </g>
              )}
              <polygon points="240,165 320,125 410,150 500,115 610,160 760,135 760,250 240,250" fill={palette.mountainFill} className="smooth-sky-fill" />
              <polygon points="240,175 760,165 760,250 240,250" fill={palette.groundTop} className="smooth-sky-fill" />

              <g transform="translate(280, 95)">
                <rect x="26" y="44" width="7" height="32" fill="#5a4636" />
                <polygon points="4,44 18,10 64,10 48,44" fill="#3b82f6" stroke="#fff" strokeWidth="2.2" />
                <line x1="11" y1="27" x2="56" y2="27" stroke="#bae6fd" strokeWidth="1.8" />
              </g>
              <g transform="translate(465, 88)">
                <rect x="26" y="44" width="7" height="32" fill="#5a4636" />
                <polygon points="4,44 18,10 64,10 48,44" fill="#3b82f6" stroke="#fff" strokeWidth="2.2" />
                <line x1="11" y1="27" x2="56" y2="27" stroke="#bae6fd" strokeWidth="1.8" />
              </g>
              <g transform="translate(650, 95)">
                <rect x="26" y="44" width="7" height="32" fill="#5a4636" />
                <polygon points="4,44 18,10 64,10 48,44" fill="#3b82f6" stroke="#fff" strokeWidth="2.2" />
                <line x1="11" y1="27" x2="56" y2="27" stroke="#bae6fd" strokeWidth="1.8" />
              </g>
            </g>

            <rect x="240" y="55" width="520" height="190" rx="24" fill="none" stroke="#5a4636" strokeWidth="8" />
            <rect x="246" y="61" width="508" height="178" rx="18" fill="none" stroke="#f5ede0" strokeWidth="3" />

            <path d="M120,375 L400,375" fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="round" />
            <path d="M600,375 L880,375" fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="round" />

            {/* Left-Center: O2 Electrolysis Generator */}
            <g transform="translate(230, 255)">
              <rect x="10" y="0" width="180" height="240" rx="55" fill="#e2e8f0" stroke="#5a4636" strokeWidth="6" />
              <rect x="28" y="42" width="144" height="138" rx="18" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
              <circle cx="58" cy="120" r="8" fill="#ffffff" opacity="0.75" />
              <circle cx="75" cy="78" r="11" fill="#ffffff" opacity="0.65" />
              <circle cx="130" cy="105" r="10" fill="#ffffff" opacity="0.75" />
              <circle cx="115" cy="150" r="7" fill="#ffffff" opacity="0.7" />
              <circle cx="100" cy="112" r="36" fill="#ffffff" stroke="#0284c7" strokeWidth="3.5" />
              <text x="100" y="122" textAnchor="middle" fill="#0369a1" fontSize="28" fontWeight="900">O₂</text>
              <rect x="30" y="228" width="140" height="20" rx="6" fill="#64748b" stroke="#334155" strokeWidth="3" />
            </g>

            {/* Right-Center: Local Water Well Pump & Ice Melter */}
            <g transform="translate(570, 255)">
              <rect x="10" y="0" width="180" height="240" rx="55" fill="#e2e8f0" stroke="#5a4636" strokeWidth="6" />
              <rect x="28" y="42" width="144" height="138" rx="18" fill="#0284c7" stroke="#0369a1" strokeWidth="4" />
              <path d="M 45,130 Q 75,115 100,130 T 155,130 L 155,170 L 45,170 Z" fill="#38bdf8" opacity="0.85" />
              <circle cx="100" cy="105" r="36" fill="#ffffff" stroke="#0369a1" strokeWidth="3.5" />
              <text x="100" y="116" textAnchor="middle" fill="#0284c7" fontSize="28" fontWeight="900">H₂O</text>
              <rect x="30" y="228" width="140" height="20" rx="6" fill="#64748b" stroke="#334155" strokeWidth="3" />
            </g>
          </svg>

          <div className="top-3 left-3 right-3 absolute flex justify-between items-center z-20 gap-2">
            <button
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-full bg-[#fdf6e9]/95 hover:bg-amber-200 border-2 border-[#d9c2a3] font-black text-xs text-[#4a3525] shadow-md flex items-center gap-1 active:scale-95 transition"
            >
              <span className="text-base leading-none">‹</span>
              <span>Back</span>
            </button>

          </div>

          <button
            onClick={onOpenSolarGame}
            disabled={solarCollectedToday || isNight}
            style={{ left: '24%', top: '9%', width: '52%', height: '30%' }}
            className="absolute rounded-2xl border-2 border-transparent hover:border-amber-300 hover:bg-amber-300/20 disabled:opacity-75 transition cursor-pointer flex flex-col items-center justify-end pb-2 z-10"
          >
            <span
              className={`${
                !solarCollectedToday && !isNight ? 'animate-float ring-2 ring-white/90' : ''
              } px-3 py-1.5 rounded-full ${
                isNight
                  ? 'bg-slate-800 text-slate-300 border-2 border-slate-600'
                  : solarCollectedToday
                  ? 'bg-emerald-600 text-white border-2 border-white'
                  : 'bg-amber-400 text-[#3b2514] border-2 border-white'
              } text-xs font-black shadow-md text-center max-w-full truncate`}
            >
              {isNight
                ? '🌙 Night: No Sunlight (Wait for Dawn)'
                : solarCollectedToday
                ? '✅ Solar Done for Today'
                : '☀️ Catch Sunbeams!'}
            </span>
          </button>

          <div style={{ left: '77%', top: '12%' }} className="absolute z-30">
            <QuestionMarkButton
              topicKey="SOLAR_POWER"
              seenTopics={seenTopics}
              onOpenTopic={onOpenTopic}
            />
          </div>

          <button
            onClick={onRequestElectrolysis}
            disabled={resources.water < 10 || resources.power < 15 || resources.oxygen >= 100}
            style={{ left: '21%', top: '41%', width: '24%', height: '42%' }}
            className="absolute rounded-2xl border-2 border-transparent hover:border-sky-300 hover:bg-sky-300/20 disabled:opacity-75 transition cursor-pointer flex flex-col items-center justify-end pb-3 px-1 z-10"
          >
            <span
              className={`${
                resources.oxygen < 100 && resources.water >= 10 && resources.power >= 15
                  ? 'animate-float ring-2 ring-white/90 shadow-xl'
                  : ''
              } px-3 py-1 rounded-full bg-sky-500 text-white border-2 border-white text-xs font-black shadow-lg text-center max-w-full`}
            >
              {resources.oxygen >= 100 ? '🫧 Oxygen Full (100%)' : '🫧 Make Oxygen'}
              <br />
              <span className="text-[10px] text-sky-100 font-extrabold">-10 Water, -15 Power</span>
            </span>
          </button>

          <div style={{ left: '44%', top: '42%' }} className="absolute z-30">
            <QuestionMarkButton
              topicKey="OXYGEN_ELECTROLYSIS"
              seenTopics={seenTopics}
              onOpenTopic={onOpenTopic}
            />
          </div>

          <button
            onClick={onRequestWaterDrill}
            disabled={resources.power < 12 || resources.water >= 100}
            style={{ left: '55%', top: '41%', width: '24%', height: '42%' }}
            className="absolute rounded-2xl border-2 border-transparent hover:border-blue-300 hover:bg-blue-300/20 disabled:opacity-75 transition cursor-pointer flex flex-col items-center justify-end pb-3 px-1 z-10"
          >
            <span
              className={`${
                resources.water < 100 && resources.power >= 12
                  ? 'animate-float ring-2 ring-white/90 shadow-xl'
                  : ''
              } px-3 py-1 rounded-full bg-blue-600 text-white border-2 border-white text-xs font-black shadow-lg text-center max-w-full`}
            >
              {resources.water >= 100 ? '💧 Water Full (100%)' : '💧 Mine Local Water'}
              <br />
              <span className="text-[10px] text-blue-100 font-extrabold">-12 Power → +18 Water</span>
            </span>
          </button>

          <div style={{ left: '78%', top: '42%' }} className="absolute z-30">
            <QuestionMarkButton
              topicKey="LOCAL_WATER"
              seenTopics={seenTopics}
              onOpenTopic={onOpenTopic}
            />
          </div>
        </div>
      );
    }

    // =========================================================================
