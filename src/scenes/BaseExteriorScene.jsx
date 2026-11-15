// Module 6A: Mars Base Exterior Overview
// [Module 6: Mars Base Exterior Overview Module]
    // - Garage red dot is the exact same size (h-5 w-5) as other red dots!
    // - When rover returns with findings (roverResultUnread === true), dot turns into "!"
    // =========================================================================
    const { useState } = React;

    function BaseExteriorModule({
      sol,
      weather,
      nightFactor,
      tomatoProgress,
      showPowerDot,
      showGreenhouseDot,
      showRoverDot,
      onEnterRoom,
      roverResultUnread,
      onOpenRandomScienceFact,
      hasRipeTomatoes = false,
      hasRottenTomatoes = false,
      seenSupplySols,
      onDismissSupplyAlert,
    }) {
      const [showSupplyModal, setShowSupplyModal] = useState(false);

      const palette = getDayNightPalette(nightFactor);
      const isNight = nightFactor >= 0.55;
      const isSupplyDay = sol % 6 === 0;
      const supplyUnread = isSupplyDay && !(seenSupplySols && seenSupplySols.has(sol));

      return (
        <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border-4 border-[#e6d5bc] shadow-xl bg-[#f3a678]">
          <svg viewBox="0 0 1000 625" className="w-full h-full object-cover block">
            <defs>
              <linearGradient id="marsSkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.skyTop} />
                <stop offset="48%" stopColor={palette.skyMid} />
                <stop offset="100%" stopColor={palette.skyBot} />
              </linearGradient>
              <linearGradient id="marsGroundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.groundTop} />
                <stop offset="100%" stopColor={palette.groundBot} />
              </linearGradient>
              <linearGradient id="marsDustStormHaze" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#c2410c" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#9a3412" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.75" />
              </linearGradient>
              <clipPath id="baseCenterGlassClip">
                <path d="M75,115 C75,45 235,45 235,115 Z" />
              </clipPath>
            </defs>

            <rect width="1000" height="625" fill="url(#marsSkyGrad)" />

            {palette.starOpacity > 0.01 && (
              <g opacity={palette.starOpacity}>
                <circle cx="150" cy="65" r="2.5" fill="#fef9c3" />
                <circle cx="290" cy="45" r="2" fill="#fef9c3" />
                <circle cx="480" cy="75" r="3" fill="#fef9c3" />
                <circle cx="670" cy="50" r="2.5" fill="#fef9c3" />
                <circle cx="830" cy="80" r="2" fill="#fef9c3" />
                <circle cx="920" cy="40" r="3" fill="#fef9c3" />
                <circle cx="770" cy="65" r="11" fill="#e2e8f0" />
                <circle cx="805" cy="90" r="6" fill="#cbd5e1" />
              </g>
            )}

            <polygon
              points="0,240 120,130 240,210 380,100 540,190 720,90 880,170 1000,120 1000,280 0,280"
              fill={palette.mountainFill}
              opacity="0.82"
            />
            <rect y="230" width="1000" height="395" fill="url(#marsGroundGrad)" />

            {/* Bottom-left Mars ISRU Subsurface Ice-Mining Drill Rig (Sealed Cryo-System, No Exposed Liquid Water) */}
            <g transform="translate(90, 480)">
              {/* Crater & Excavated Martian Regolith / Frost Tailings */}
              <ellipse cx="0" cy="5" rx="50" ry="18" fill="#2d1e12" opacity="0.34" />
              <ellipse cx="0" cy="0" rx="46" ry="16" fill={palette.craterFill} stroke="#5c2818" strokeWidth="3" />
              <path d="M -27,2 Q 0,-9 27,2 Q 17,10 -17,10 Z" fill="#9a3412" stroke="#5c2818" strokeWidth="2" />
              {/* Subsurface Ice-Dust Shavings Around Borehole */}
              <ellipse cx="0" cy="-1" rx="22" ry="7.5" fill="#cbd5e1" opacity="0.45" />
              {/* Sealed Dark Metallic Borehole Wellhead Collar */}
              <ellipse cx="0" cy="-1" rx="16" ry="5.5" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
              <ellipse cx="0" cy="-1" rx="9" ry="3" fill="#0f172a" />
              {/* White Aerospace Truss Derrick */}
              <line x1="-24" y1="-2" x2="-5" y2="-74" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
              <line x1="24" y1="-2" x2="5" y2="-74" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
              <line x1="-24" y1="-2" x2="-5" y2="-74" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
              <line x1="24" y1="-2" x2="5" y2="-74" stroke="#475569" strokeWidth="1.5" strokeDasharray="5 4" />
              <line x1="-17" y1="-26" x2="17" y2="-26" stroke="#64748b" strokeWidth="2.5" />
              <line x1="-11" y1="-50" x2="11" y2="-50" stroke="#64748b" strokeWidth="2.5" />
              {/* Top Telemetry Beacon */}
              <rect x="-11" y="-80" width="22" height="8" rx="3" fill="#334155" stroke="#f8fafc" strokeWidth="1.5" />
              <circle cx="0" cy="-84" r="3" fill="#ef4444" />
              {/* Gold Kapton Foil Thermal Drill Head */}
              <rect x="-9" y="-44" width="18" height="17" rx="3.5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <line x1="-6" y1="-36" x2="6" y2="-36" stroke="#fef08a" strokeWidth="1.5" />
              {/* Rotary Auger Drill Shaft */}
              <line x1="0" y1="-72" x2="0" y2="-1" stroke="#cbd5e1" strokeWidth="4" />
              <path d="M -3,-24 L 3,-20 M -3,-16 L 3,-12 M -3,-8 L 3,-4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              {/* Enclosed Insulated Pressurized Tank & Heated Conduit (No Blue Water Shown) */}
              <path d="M 9,-34 L 33,-34 L 33,-20" fill="none" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 9,-34 L 33,-34 L 33,-20" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="23" y="-22" width="20" height="26" rx="8" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
              <rect x="23" y="-15" width="20" height="4" fill="#f59e0b" />
              <rect x="23" y="-6" width="20" height="4" fill="#f59e0b" />
            </g>

            {/* Base Connecting Roads */}
            <path d="M260,335 C295,316 345,316 385,320" fill="none" stroke="#e6ddd0" strokeWidth="14" strokeLinecap="round" />
            <path d="M615,320 C655,316 705,316 740,335" fill="none" stroke="#e6ddd0" strokeWidth="14" strokeLinecap="round" />
            <path d="M500,345 L500,445" fill="none" stroke="#e6ddd0" strokeWidth="14" strokeLinecap="round" />
            <path d="M230,390 C230,460 320,490 380,490" fill="none" stroke="#e6ddd0" strokeWidth="14" strokeLinecap="round" />
            <path d="M770,390 C770,460 680,490 620,490" fill="none" stroke="#e6ddd0" strokeWidth="14" strokeLinecap="round" />

            {/* Solar Array */}
            <g transform="translate(55, 160)">
              {[0, 75, 150].map((dx, idx) => (
                <g key={idx} transform={`translate(${dx}, 0)`}>
                  <rect x="26" y="55" width="8" height="35" fill="#7c6855" />
                  <polygon points="0,55 18,10 68,10 50,55" fill={lerpHexColor('#4f86c6', '#1e3a8a', nightFactor)} stroke="#fff" strokeWidth="3" />
                  <line x1="9" y1="32" x2="59" y2="32" stroke="#bae6fd" strokeWidth="2.5" />
                </g>
              ))}
            </g>

            {/* Center Dome = Base Center */}
            <g transform="translate(345, 140)">
              <ellipse cx="155" cy="215" rx="150" ry="30" fill="#2d1e12" opacity="0.35" />
              <path d="M35,150 C35,40 275,40 275,150 L295,205 C295,225 15,225 15,205 Z" fill="#f5ede0" stroke="#7c6855" strokeWidth="5" />
              <path d="M75,115 C75,45 235,45 235,115 Z" fill={palette.domeGlassBlue} stroke="#5c7d99" strokeWidth="4" />
              <g clipPath="url(#baseCenterGlassClip)">
                <path d="M110,40 L110,120 M155,40 L155,120 M200,40 L200,120 M70,92 L240,92" stroke="#cbe6fa" strokeWidth="3" />
              </g>
              <g transform="translate(195, 20)">
                <line x1="10" y1="58" x2="10" y2="20" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="10" cy="58" rx="8" ry="3.5" fill="#334155" />
                <ellipse cx="10" cy="14" rx="26" ry="15" fill="#f8fafc" stroke="#334155" strokeWidth="3.5" transform="rotate(-25 10 14)" />
                <line x1="10" y1="14" x2="26" y2="2" stroke="#ef4444" strokeWidth="2.5" />
                <circle cx="27" cy="1" r="3.5" fill="#ef4444" />
              </g>
              <rect x="130" y="165" width="50" height="52" rx="8" fill="#8b9bb4" stroke="#5a4636" strokeWidth="4" />
              <rect x="65" y="172" width="26" height="22" rx="5" fill="#fef08a" stroke="#5a4636" strokeWidth="3" />
              <rect x="218" y="172" width="26" height="22" rx="5" fill="#fef08a" stroke="#5a4636" strokeWidth="3" />
              <rect x="70" y="124" width="170" height="32" rx="16" fill="#4f46e5" stroke="#fff" strokeWidth="3" />
              <text x="155" y="145" textAnchor="middle" fill="#ffffff" fontSize="15" fontWeight="900">BASE CENTER</text>
            </g>

            {/* Power Dome */}
            <g transform="translate(95, 225)">
              <ellipse cx="105" cy="165" rx="105" ry="22" fill="#2d1e12" opacity="0.35" />
              <path d="M20,110 C20,25 190,25 190,110 L205,155 C205,172 5,172 5,155 Z" fill="#f5ede0" stroke="#7c6855" strokeWidth="5" />
              <path d="M40,95 C40,35 170,35 170,95 Z" fill={palette.powerGlassBlue} stroke="#4d6f9e" strokeWidth="4" />
              <rect x="85" y="122" width="40" height="42" rx="6" fill="#8b9bb4" stroke="#5a4636" strokeWidth="4" />
              <rect x="35" y="96" width="140" height="28" rx="14" fill="#fffaf0" stroke="#9e8267" strokeWidth="3" />
              <text x="105" y="115" textAnchor="middle" fill="#5a3e28" fontSize="15" fontWeight="900">⚡ Power Lab</text>
            </g>

            {/* Greenhouse Dome */}
            <g transform="translate(685, 215)">
              <ellipse cx="115" cy="175" rx="112" ry="22" fill="#2d1e12" opacity="0.35" />
              <path d="M20,120 C20,20 210,20 210,120 L225,165 C225,182 5,182 5,165 Z" fill="#f5ede0" stroke="#7c6855" strokeWidth="5" />
              <path d="M35,112 C35,28 195,28 195,112 Z" fill={palette.greenhouseGlass} stroke="#5c9c49" strokeWidth="4" />
              <circle cx="80" cy="85" r="22" fill="#5eb848" />
              <circle cx="115" cy="75" r="26" fill="#4da338" />
              <circle cx="150" cy="88" r="22" fill="#5eb848" />
              <rect x="95" y="132" width="40" height="42" rx="6" fill="#8b9bb4" stroke="#5a4636" strokeWidth="4" />
              <rect x="40" y="102" width="150" height="28" rx="14" fill="#fffaf0" stroke="#9e8267" strokeWidth="3" />
              <text x="115" y="121" textAnchor="middle" fill="#5a3e28" fontSize="15" fontWeight="900">🍅 Greenhouse</text>
            </g>

            {/* Rover Garage */}
            <g transform="translate(345, 420)">
              <ellipse cx="155" cy="168" rx="165" ry="22" fill="#2d1e12" opacity="0.35" />
              <polygon points="35,45 275,45 305,155 5,155" fill="#f5ede0" stroke="#7c6855" strokeWidth="5" strokeLinejoin="round" />
              <rect x="85" y="105" width="140" height="50" rx="6" fill="#708099" stroke="#4a3525" strokeWidth="4" />
              <line x1="85" y1="122" x2="225" y2="122" stroke="#9db0cc" strokeWidth="3" />
              <line x1="85" y1="138" x2="225" y2="138" stroke="#9db0cc" strokeWidth="3" />
              <rect x="60" y="65" width="190" height="32" rx="16" fill="#fffaf0" stroke="#9e8267" strokeWidth="3" />
              <text x="155" y="86" textAnchor="middle" fill="#5a3e28" fontSize="15" fontWeight="900">Rover Garage</text>
            </g>

            <g transform="translate(175, 485)">
              <line x1="15" y1="0" x2="15" y2="85" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
              <rect x="18" y="5" width="64" height="42" rx="4" fill="#fff" stroke="#7c6855" strokeWidth="3" />
              <circle cx="50" cy="26" r="15" fill="#1d4ed8" />
              <text x="50" y="30" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">NASA</text>
            </g>

            {/* Supply Rocket Ship (Landed on bottom-right beside Rover Garage) */}
            {isSupplyDay && (
              <g transform="translate(735, 435) scale(0.68)">
                <g className="animate-supply-hover">
                  <ellipse cx="95" cy="185" rx="80" ry="16" fill="#2d1e12" opacity="0.38" />
                  <path d="M55,140 L28,182 M135,140 L162,182 M95,148 L95,186" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                  <polygon points="68,142 82,142 86,158 64,158" fill="#334155" />
                  <polygon points="108,142 122,142 126,158 104,158" fill="#334155" />
                  <path d="M55,142 C55,65 72,22 95,5 C118,22 135,65 135,142 Z" fill="#f8fafc" stroke="#475569" strokeWidth="4" />
                  <path d="M76,34 Q95,22 114,34 L95,5 Z" fill="#ef4444" />
                  <rect x="57" y="108" width="76" height="16" fill="#3b82f6" />
                  <polygon points="55,105 28,145 55,138" fill="#ef4444" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
                  <polygon points="135,105 162,145 135,138" fill="#ef4444" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
                  <circle cx="95" cy="68" r="16" fill="#38bdf8" stroke="#475569" strokeWidth="4" />
                  <circle cx="91" cy="64" r="5" fill="#ffffff" opacity="0.75" />
                </g>
              </g>
            )}

            {/* Martian Dust Storm Atmospheric Hazy Fog (Seamless Single Overlay) */}
            <g
              className="pointer-events-none smooth-dust-fog"
              style={{ opacity: weather?.isDustStorm ? 1 : 0 }}
            >
              <rect width="1000" height="625" fill="url(#marsDustStormHaze)" />
            </g>
          </svg>

          <div className="top-3 left-3 absolute bg-[#fdf6e9]/95 border-2 border-[#d9c2a3] px-3.5 py-1 rounded-full font-black text-xs md:text-sm text-[#5a3e28] shadow">
            {isSupplyDay
              ? `Day ${sol} Supply Rocket Landed (+30 Water, +30 Food)`
              : weather?.isDustStorm
              ? 'Dust Storm Active — Visibility Hazy'
              : isNight
              ? 'Mars Night — Tap a Building'
              : nightFactor > 0.25
              ? 'Mars Sunset — Tap a Building'
              : 'Mars Daytime — Tap a Building'}
          </div>

          {/* Top-Right Science Fact "?" Button */}
          <button
            onClick={onOpenRandomScienceFact}
            aria-label="Open Mars Science Fact"
            title="Learn a Mars Science Fact!"
            className="top-3 right-3 absolute bg-[#fdf6e9]/95 hover:bg-white border-2 border-[#d9c2a3] px-3 py-1 rounded-full font-black text-xs md:text-sm text-[#5a3e28] shadow flex items-center gap-1.5 active:scale-95 transition cursor-pointer z-30"
          >
            <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] md:text-xs flex items-center justify-center shadow-inner">
              ?
            </span>
            <span>Science Fact</span>
          </button>

          <button
            onClick={() => onEnterRoom('CONTROL')}
            style={{ left: '35%', top: '22%', width: '30%', height: '35%' }}
            className="absolute rounded-3xl border-0 outline-none hover:border-2 hover:border-indigo-300 hover:bg-indigo-300/20 active:scale-95 transition cursor-pointer"
            title="Open Base Center"
          />

          <button
            onClick={() => onEnterRoom('POWER')}
            style={{ left: '9%', top: '34%', width: '22%', height: '31%' }}
            className="absolute rounded-3xl border-0 outline-none hover:border-2 hover:border-yellow-300 hover:bg-yellow-200/25 active:scale-95 transition cursor-pointer flex items-start justify-end p-2"
          >
            {showPowerDot && (
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white shadow" />
              </span>
            )}
          </button>

          <button
            onClick={() => onEnterRoom('GREENHOUSE')}
            style={{ left: '68%', top: '33%', width: '24%', height: '32%' }}
            className="absolute rounded-3xl border-0 outline-none hover:border-2 hover:border-emerald-300 hover:bg-emerald-200/25 active:scale-95 transition cursor-pointer flex flex-col items-end justify-between p-2"
          >
            {showGreenhouseDot && (
              <span className="flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-red-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white shadow" />
              </span>
            )}
            {hasRottenTomatoes ? (
              <span className="self-center px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-200 border border-amber-600 text-xs font-black shadow animate-pulse">
                🥀 Spoiled!
              </span>
            ) : hasRipeTomatoes || tomatoProgress >= MAX_TOMATO_GROWTH ? (
              <span className="self-center px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black shadow animate-bounce">
                🍅 Ripe! Pick Now
              </span>
            ) : null}
          </button>

          {/* Rover Garage Button: Plain red dot is h-5 w-5 (same size as others); turns into "!" when rover has collected findings */}
          <button
            onClick={() => onEnterRoom('ROVER')}
            style={{ left: '34%', top: '66%', width: '32%', height: '28%' }}
            className="absolute rounded-3xl border-0 outline-none hover:border-2 hover:border-sky-300 hover:bg-sky-200/25 active:scale-95 transition cursor-pointer flex items-start justify-end p-2"
          >
            {showRoverDot && (
              roverResultUnread ? (
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-red-400 opacity-85" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 border-2 border-white shadow text-white font-black text-xs leading-none items-center justify-center">
                    !
                  </span>
                </span>
              ) : (
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-red-400 opacity-80" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white shadow" />
                </span>
              )
            )}
          </button>
          {/* Supply Rocket Ship Clickable Area & Alert "!" */}
          {isSupplyDay && (
            <button
              type="button"
              onClick={() => {
                if (onDismissSupplyAlert) onDismissSupplyAlert(sol);
                setShowSupplyModal(true);
              }}
              style={{ left: '72%', top: '65%', width: '16%', height: '27%' }}
              className="absolute rounded-3xl border-0 outline-none hover:bg-amber-400/20 active:scale-95 transition cursor-pointer flex flex-col items-center justify-start pt-1 z-30"
              title="Tap Supply Rocket to inspect delivered resources!"
            >
              {supplyUnread && (
                <span className="relative flex h-8 w-8 items-center justify-center animate-alert-pulse">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-85" />
                  <span className="relative inline-flex rounded-full h-7 w-7 bg-red-600 border-2 border-white shadow-xl text-white font-black text-sm leading-none items-center justify-center">
                    !
                  </span>
                </span>
              )}
            </button>
          )}

          {showSupplyModal && (
            <SupplyRocketModal
              sol={sol}
              onClose={() => setShowSupplyModal(false)}
            />
          )}
        </div>
      );
    }

    // =========================================================================
