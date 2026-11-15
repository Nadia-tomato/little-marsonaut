// Module 5B: Interactive Solar Catch Mini-Game
// [Module 5: Solar Catch Mini-Game Modal]
    // =========================================================================
    function SolarMiniGameModal({ sol, isDustStorm, onComplete, onClose }) {
      const GAME_DURATION = 15;
      const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
      const [panelX, setPanelX] = useState(50);
      const [caughtCount, setCaughtCount] = useState(0);
      const [resolvedCount, setResolvedCount] = useState(0);
      const [panelFlash, setPanelFlash] = useState(false);
      const [beams, setBeams] = useState([]);
      const [finished, setFinished] = useState(false);

      const panelXRef = useRef(50);
      const caughtRef = useRef(0);
      const resolvedRef = useRef(0);
      const arenaRef = useRef(null);

      const updatePanelFromClientX = (clientX) => {
        if (!arenaRef.current || finished) return;
        const rect = arenaRef.current.getBoundingClientRect();
        const relX = ((clientX - rect.left) / rect.width) * 100;
        const clamped = Math.max(12, Math.min(88, relX));
        panelXRef.current = clamped;
        setPanelX(clamped);
      };

      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setFinished(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }, []);

      useEffect(() => {
        if (finished) return;

        const spawnInterval = setInterval(() => {
          const id = Math.random().toString(36).slice(2);
          const startX = 10 + Math.random() * 80;
          const speed = isDustStorm ? 2.5 : 4.0;
          setBeams((prev) => [...prev, { id, x: startX, y: 0, speed }]);
        }, isDustStorm ? 480 : 310);

        const loop = setInterval(() => {
          setBeams((prev) => {
            const next = [];
            let newlyCaught = 0;
            let newlyMissed = 0;
            for (const b of prev) {
              const nextY = b.y + b.speed;
              if (nextY >= 80 && nextY <= 91 && Math.abs(b.x - panelXRef.current) <= 13) {
                newlyCaught += 1;
              } else if (nextY < 100) {
                next.push({ ...b, y: nextY });
              } else {
                newlyMissed += 1;
              }
            }
            if (newlyCaught > 0 || newlyMissed > 0) {
              caughtRef.current += newlyCaught;
              resolvedRef.current += newlyCaught + newlyMissed;
              setCaughtCount(caughtRef.current);
              setResolvedCount(resolvedRef.current);
              if (newlyCaught > 0) {
                setPanelFlash(true);
                setTimeout(() => setPanelFlash(false), 120);
              }
            }
            return next;
          });
        }, 33);

        return () => {
          clearInterval(spawnInterval);
          clearInterval(loop);
        };
      }, [finished, isDustStorm]);

      const livePowerPreview = GameLogicModule.calculateSolarGameReward(caughtCount, isDustStorm, sol, resolvedCount);
      const gradeInfo = GameLogicModule.getSolarEfficiencyGrade(caughtCount, isDustStorm);

      return (
        <div className="fixed inset-0 bg-[#2d1e12]/75 flex items-center justify-center p-4 z-50">
          <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-black text-amber-800 text-xs sm:text-sm truncate min-w-0">
                ☀️ Catch Sunbeams!
              </span>
              <div className="flex items-center gap-1.5 font-bold shrink-0">
                <span className="w-16 text-right tabular-nums text-[#6b4c35] whitespace-nowrap">{timeLeft}s left</span>
              </div>
            </div>

            <div className="bg-amber-100/90 border border-amber-300 rounded-2xl px-3 py-2 text-xs text-amber-950 font-semibold leading-snug">
              💡 <b>How Solar Panels Work:</b> Moving the solar panel is like tilting its angle to face the sun! When solar panels point straight at the sun, they catch the most sunlight and turn it into electricity for our base.
            </div>

            <div
              ref={arenaRef}
              onMouseMove={(e) => updatePanelFromClientX(e.clientX)}
              onTouchMove={(e) => updatePanelFromClientX(e.touches[0].clientX)}
              onClick={(e) => updatePanelFromClientX(e.clientX)}
              className={`relative w-full h-56 rounded-2xl overflow-hidden border-2 cursor-pointer ${
                isDustStorm
                  ? 'bg-gradient-to-b from-amber-700 to-stone-800 border-amber-600'
                  : 'bg-gradient-to-b from-sky-600 to-indigo-900 border-sky-400'
              }`}
            >
              {isDustStorm && (
                <div className="top-2 left-2 absolute text-[11px] bg-amber-100/95 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                  🌪️ Dust storm clouds are blocking some sunlight today!
                </div>
              )}

              {beams.map((b) => (
                <div
                  key={b.id}
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                  className="-translate-x-1/2 -translate-y-1/2 absolute text-2xl drop-shadow-[0_0_8px_rgba(253,224,71,0.95)] pointer-events-none"
                >
                  ☀️
                </div>
              ))}

              <div
                style={{ left: `${panelX}%` }}
                className={`-translate-x-1/2 bottom-3 absolute w-24 h-5 rounded-lg border-2 flex items-center justify-center text-[11px] font-black pointer-events-none transition-transform duration-75 ${
                  panelFlash
                    ? 'bg-yellow-300 border-white text-slate-900 scale-110 shadow-[0_0_16px_rgba(253,224,71,1)]'
                    : 'bg-sky-400 border-white text-slate-950 shadow-md'
                }`}
              >
                Solar Panel
              </div>

              {finished && (
                <div className="inset-0 absolute bg-[#2d1e12]/85 flex flex-col items-center justify-center p-4 text-center space-y-2">
                  <div className="text-xs font-bold text-amber-100">
                    You caught {caughtCount} sunbeams!
                  </div>
                  <div className={`text-base font-black bg-white px-3 py-0.5 rounded-full ${gradeInfo.color}`}>
                    {gradeInfo.label}
                  </div>
                  <div className="text-2xl font-black text-yellow-300">
                    Power Made: +{livePowerPreview} ⚡
                  </div>
                  <button
                    onClick={() => onComplete(caughtCount, resolvedCount)}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#3b2514] font-black text-sm shadow-lg active:scale-95 transition"
                  >
                    Save Power to Base!
                  </button>
                </div>
              )}
            </div>

            {!finished && (
              <div className="flex justify-end items-center text-xs text-[#7a5a40] h-6">
                <button onClick={onClose} className="underline font-bold hover:text-amber-900">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // =========================================================================
