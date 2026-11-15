// Module 4B: Cover Page & Survival Guide
function TitleCoverPage({ onStartMission, isGuide = false }) {
      const survivalTips = [
        ['🍅', 'Grow Tomatoes'],
        ['☀️', 'Collect Solar Power'],
        ['🛸', 'Explore with Rover'],
        ['🫧', 'Make Oxygen'],
      ];

      return (
        <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between relative overflow-hidden">
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            className="inset-0 absolute w-full h-full pointer-events-none"
          >
            <defs>
              <radialGradient id="marsSphere" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f39c6b" />
                <stop offset="45%" stopColor="#d96b38" />
                <stop offset="82%" stopColor="#8c3518" />
                <stop offset="100%" stopColor="#2e0f07" />
              </radialGradient>
              <radialGradient id="marsAtmosphere" cx="38%" cy="45%" r="55%">
                <stop offset="78%" stopColor="#ff9e6d" stopOpacity="0" />
                <stop offset="93%" stopColor="#ff9e6d" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ff9e6d" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1200" height="700" fill="#060911" />
            <ellipse cx="960" cy="480" rx="220" ry="110" fill="#1e293b" opacity="0.35" />
            {[
              [820, 110, 2], [910, 190, 1.5], [1040, 140, 2.5], [1120, 260, 2],
              [870, 340, 1.8], [980, 420, 2.2], [1100, 490, 1.5], [840, 560, 2],
              [760, 240, 1.5], [1020, 610, 2], [930, 640, 1.5], [1150, 90, 2],
            ].map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#e2e8f0" opacity="0.85" />
            ))}

            <circle cx="390" cy="430" r="430" fill="url(#marsAtmosphere)" />
            <circle cx="390" cy="430" r="405" fill="url(#marsSphere)" />
            <ellipse cx="220" cy="95" rx="75" ry="22" transform="rotate(-24 220 95)" fill="#f8fafc" opacity="0.65" />
            <path
              d="M250,470 Q430,430 620,375 Q520,425 360,485 Z"
              fill="#591c0b"
              opacity="0.72"
            />
            <circle cx="195" cy="310" r="34" fill="#9c3d1e" opacity="0.45" />
            <circle cx="290" cy="235" r="22" fill="#9c3d1e" opacity="0.4" />
            <circle cx="480" cy="260" r="28" fill="#822e14" opacity="0.38" />
            <circle cx="140" cy="460" r="42" fill="#782810" opacity="0.45" />
          </svg>

          <header className="relative z-10 pt-7 md:pt-10 px-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.22em] text-slate-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)]">
              LITTLE MARSONAUT
            </h1>
          </header>

          <main className="relative z-10 max-w-4xl w-full mx-auto px-4 my-auto py-4 space-y-4">
            <div className="bg-slate-950/75 backdrop-blur-md border-2 border-amber-300/40 rounded-3xl p-4 md:p-6 shadow-2xl space-y-4">
              {/* Primary Mission Goal: Title only */}
              <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-sky-500/25 p-3.5 md:p-4 flex items-center justify-center sm:justify-start gap-3 shadow-lg">
                <span className="text-3xl md:text-4xl">🪨</span>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                    🌟 MISSION GOAL
                  </div>
                  <div className="text-base sm:text-lg md:text-xl font-black text-white">
                    Collect more &amp; rarer Mars rock samples!
                  </div>
                </div>
              </div>

              {/* Renamed from MISSION GOALS to SURVIVAL TIPS */}
              <div className="flex items-center justify-between border-b border-amber-300/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧑‍🚀</span>
                  <span className="font-black text-base md:text-lg text-amber-200 tracking-wide">SURVIVAL TIPS</span>
                </div>
                <span className="text-xs font-black text-amber-300">Tap big ❓ buttons inside to see real NASA photos!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {survivalTips.map(([icon, label], idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border-2 border-amber-300/50 bg-slate-900/70 p-4 flex items-center gap-3"
                  >
                    <span className="text-3xl">{icon}</span>
                    <span className="text-sm font-black text-slate-100">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-amber-200 text-base sm:text-lg md:text-xl font-black text-center sm:text-left drop-shadow-md flex-1">
                  ✨ Use survival tips to stay alive &amp; collect the rarest Mars samples!
                </p>
                <button
                  onClick={onStartMission}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base md:text-lg shadow-[0_0_25px_rgba(251,191,36,0.6)] active:scale-95 transition flex items-center justify-center gap-2 shrink-0"
                >
                  <span>🚀</span>
                  <span>{isGuide ? 'RETURN TO MISSION' : 'START MISSION'}</span>
                </button>
              </div>
            </div>
          </main>

          <footer className="relative z-10 pb-5 px-6 flex items-center justify-between text-xs md:text-sm font-black tracking-wider text-slate-200">
            <span>2026 NASA HACKATHON</span>
            <span className="text-slate-400 font-bold">Ages 7–12 Science Mission</span>
          </footer>
        </div>
      );
    }
