// Module 4C: Earth-to-Mars Launch Cutscene
function MarsLaunchTransition({ fact, onSkip, onComplete }) {
      useEffect(() => {
        const timer = window.setTimeout(onComplete, 11200);
        return () => window.clearTimeout(timer);
      }, [onComplete]);

      return (
        <div className="animate-launch-fade min-h-screen bg-[#070b16] text-white flex flex-col items-center justify-end relative overflow-hidden p-5 pb-8 sm:pb-12">
          <svg viewBox="0 0 1200 700" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <rect width="1200" height="700" fill="#070b16" />
            {Array.from({ length: 48 }).map((_, i) => (
              <circle
                key={i}
                cx={(i * 187) % 1200}
                cy={(i * 113) % 680 + 10}
                r={i % 4 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2}
                fill={i % 3 === 0 ? '#fef08a' : '#ffffff'}
                opacity={0.6 + (i % 5) * 0.09}
              />
            ))}

            {/* Earth (Bottom Left) */}
            <g transform="translate(130, 540)">
              <circle cx="0" cy="0" r="95" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="4" opacity="0.9" />
              <path d="M -45,-30 Q -15,-60 10,-30 Q 35,-10 10,25 Q -30,45 -60,10 Z" fill="#22c55e" opacity="0.85" />
              <path d="M 15,-50 Q 55,-40 50,0 Q 25,-10 15,-50 Z" fill="#16a34a" opacity="0.85" />
              <path d="M -70,-20 Q -40,-45 20,-25 Q 70,-10 40,20 Q -10,35 -70,-20" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.5" />
            </g>

            {/* Mars (Upper Right) */}
            <g transform="translate(970, 210)">
              <circle cx="0" cy="0" r="130" fill="#ea580c" opacity="0.25" />
              <circle cx="0" cy="0" r="105" fill="#c2410c" stroke="#f97316" strokeWidth="5" />
              <ellipse cx="-20" cy="-78" rx="35" ry="12" fill="#f8fafc" opacity="0.85" />
              <path d="M -80,-10 Q -20,-45 50,-15 Q 85,25 20,45 Q -50,55 -80,-10" fill="#7c2d12" opacity="0.5" />
              <circle cx="-35" cy="20" r="18" fill="#9a3412" opacity="0.6" />
              <circle cx="40" cy="-25" r="14" fill="#9a3412" opacity="0.6" />
            </g>

            {/* Flight Path Arc */}
            <path
              d="M 190 490 Q 540 180 900 210"
              fill="none"
              stroke="#facc15"
              strokeWidth="3.5"
              strokeDasharray="12 10"
              className="animate-orbit-path"
            />

            {/* Flying Space Rocket */}
            <g className="animate-rocket-flight">
              <animateMotion
                path="M 190 490 Q 540 180 900 210"
                rotate="auto"
                dur="10.8s"
                fill="freeze"
                calcMode="spline"
                keyTimes="0; 1"
                keySplines="0.25 0.46 0.45 0.94"
              />
              <g transform="rotate(90) scale(0.85)">
                <polygon points="-9,28 0,65 9,28" fill="#f59e0b" className="animate-thruster" />
                <polygon points="-5,28 0,48 5,28" fill="#fef08a" className="animate-thruster" />
                <polygon points="-18,20 -34,36 -18,32" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                <polygon points="18,20 34,36 18,32" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
                <path d="M -18,28 C -18,-15 0,-45 0,-45 C 0,-45 18,-15 18,28 Z" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
                <path d="M -12,-20 C -6,-38 0,-45 0,-45 C 0,-45 6,-38 12,-20 Z" fill="#ef4444" />
                <rect x="-18" y="14" width="36" height="6" fill="#3b82f6" />
                <circle cx="0" cy="-2" r="7.5" fill="#38bdf8" stroke="#1e293b" strokeWidth="2.5" />
                <circle cx="-2" cy="-4" r="2.5" fill="#ffffff" opacity="0.8" />
              </g>
            </g>
          </svg>

          <div className="relative z-10 max-w-md w-full text-center space-y-4 bg-slate-950/75 backdrop-blur-md border border-amber-300/30 rounded-3xl p-5 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-100">🚀 Flying to Mars...</h2>
            <p className="text-amber-100 text-xs md:text-sm leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-amber-400/20">
              💡 {fact}
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-black text-amber-200 px-1">
                <span>🌍 Earth</span>
                <span>🔴 Mars</span>
              </div>
              <div className="relative h-3 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500 origin-left animate-[launch-progress_11s_linear]" />
              </div>
            </div>

            <button
              onClick={onSkip}
              className="px-5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/40 active:scale-95 transition font-black text-xs text-slate-100 shadow"
            >
              Skip ➔
            </button>
          </div>
        </div>
      );
    }
