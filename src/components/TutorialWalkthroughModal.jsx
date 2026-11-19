// Module 4D: Interactive Onboarding Walkthrough Tutorial Modal
// Kid-friendly, steady, concise English walkthrough ending in exclamation marks
const { useState, useEffect } = React;

const TUTORIAL_STEPS = [
  {
    id: 'RESOURCES',
    targetKey: 'resources',
    title: 'Life Support',
    arrowText: 'Life Support Bars',
    arrowDir: 'UP',
    color: '#38bdf8',
    desc: 'Keep Air 🫧, Power ⚡, Water 💧, and Food 🍅 full to keep your astronauts safe and happy!',
  },
  {
    id: 'CLOCK',
    targetKey: 'clock',
    title: 'Sol Clock',
    arrowText: 'Sol Clock',
    arrowDir: 'UP',
    color: '#fbbf24',
    desc: 'A day on Mars is called a Sol ☀️! Try your best to survive 20 Sols and return to Earth 🌍!',
  },
  {
    id: 'POWER_LAB',
    targetKey: 'power',
    title: 'Power Lab',
    arrowText: 'Power Lab',
    arrowDir: 'DOWN',
    color: '#eab308',
    bullets: [
      'Catch sunbeams in the fun mini-game to make power ⚡!',
      'Melt underground ice into fresh water 💧!',
      'Make clean air 🫧 for your astronauts to breathe!',
    ],
  },
  {
    id: 'GREENHOUSE',
    targetKey: 'greenhouse',
    title: 'Greenhouse',
    arrowText: 'Greenhouse',
    arrowDir: 'DOWN',
    color: '#10b981',
    desc: 'Plant, water 💧, and pick fresh tomatoes 🍅 to keep your crew fed!',
  },
  {
    id: 'ROVER_GARAGE',
    targetKey: 'rover',
    title: 'Rover Garage',
    arrowText: 'Rover Garage',
    arrowDir: 'DOWN',
    color: '#0284c7',
    desc: 'Drive Curiosity 🛸 across Mars to find cool rocks 💎 and earn science points!',
  },
  {
    id: 'MISSION_CONTROL',
    targetKey: 'control',
    title: 'Base Center',
    arrowText: 'Base Center',
    arrowDir: 'DOWN',
    color: '#6366f1',
    desc: 'See real Mars rock samples 💎 and check today’s weather report 📡!',
  },
];

function TutorialWalkthroughModal({ visible, sol = 1, onComplete, onSkip }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      setShowPrompt(false);
      return;
    }
    const updateRect = () => {
      const step = TUTORIAL_STEPS[stepIndex];
      if (!step) return;
      const el = document.querySelector(`[data-tour="${step.targetKey}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
          right: r.right,
          bottom: r.bottom,
        });
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    const t = setTimeout(updateRect, 60);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearTimeout(t);
    };
  }, [visible, stepIndex]);

  if (!visible) return null;

  // Intermediate Quick Tip Modal with ☀️ and 🍅 bullet points
  if (showPrompt) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050810]/85 flex items-center justify-center p-4 select-none">
        <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] text-[#4a3525] rounded-3xl max-w-sm w-full p-5 md:p-6 shadow-2xl space-y-3.5 text-center animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-sm">
            💡
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-[#4a3525]">Astronaut Quick Tips!</h3>
            <p className="text-xs md:text-sm text-[#6a4c33] font-bold mt-1">Here are two things to do first:</p>
          </div>

          <div className="space-y-2 text-left">
            <div className="bg-amber-100/90 border-2 border-amber-300/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm">
              <span className="text-2xl shrink-0 leading-none">☀️</span>
              <div className="text-xs text-amber-950 font-bold leading-snug">
                <strong className="font-black text-amber-900 block text-xs md:text-sm">Power Lab:</strong>
                Catch falling sunbeams in the solar mini-game to charge your battery ⚡!
              </div>
            </div>

            <div className="bg-emerald-100/90 border-2 border-emerald-300/80 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm">
              <span className="text-2xl shrink-0 leading-none">🍅</span>
              <div className="text-xs text-emerald-950 font-bold leading-snug">
                <strong className="font-black text-emerald-900 block text-xs md:text-sm">Greenhouse:</strong>
                Water 💧 your tomato plants so they grow into yummy fresh food 🍅!
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowPrompt(false);
              if (onComplete) onComplete();
            }}
            className="w-full py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-sm shadow-md border-2 border-amber-600 active:scale-95 transition cursor-pointer"
          >
            {sol === 1 ? 'View Sol 1 News →' : 'Continue Mission →'}
          </button>
        </div>
      </div>
    );
  }

  const currentStep = TUTORIAL_STEPS[stepIndex];
  const isLastStep = stepIndex === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setShowPrompt(true);
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  const isTargetInLowerHalf = targetRect && targetRect.top > window.innerHeight * 0.48;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden">
      {/* Target Spotlight Cutout: Steady dark background outside, crystal-clear inside, NO pulsing */}
      {targetRect ? (
        <div
          style={{
            position: 'fixed',
            left: Math.max(0, targetRect.left - 6),
            top: Math.max(0, targetRect.top - 6),
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: currentStep.targetKey === 'clock' ? '20px' : '26px',
            boxShadow: '0 0 0 9999px rgba(5, 8, 16, 0.82), 0 0 16px rgba(255, 255, 255, 0.35)',
            border: `3px solid ${currentStep.color || '#fbbf24'}`,
            pointerEvents: 'none',
            zIndex: 35,
          }}
          className="transition-all duration-300"
        />
      ) : (
        <div className="absolute inset-0 bg-[#050810]/82 pointer-events-none z-35" />
      )}

      {/* Pointer Arrow Label (Calm & Non-intrusive) */}
      {targetRect && (
        currentStep.arrowDir === 'UP' ? (
          <div
            style={{
              position: 'fixed',
              left: Math.max(100, Math.min(window.innerWidth - 100, targetRect.left + targetRect.width / 2)),
              top: targetRect.bottom + 10,
              transform: 'translateX(-50%)',
              zIndex: 45,
            }}
            className="flex flex-col items-center pointer-events-none"
          >
            <span className="text-2xl text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">▲</span>
            <span className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-white whitespace-nowrap">
              {currentStep.arrowText}
            </span>
          </div>
        ) : (
          <div
            style={{
              position: 'fixed',
              left: Math.max(100, Math.min(window.innerWidth - 100, targetRect.left + targetRect.width / 2)),
              top: Math.max(10, targetRect.top - 46),
              transform: 'translateX(-50%)',
              zIndex: 45,
            }}
            className="flex flex-col items-center pointer-events-none"
          >
            <span className="bg-amber-400 text-amber-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-white whitespace-nowrap">
              {currentStep.arrowText}
            </span>
            <span className="text-2xl text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">▼</span>
          </div>
        )
      )}

      {/* Skip Tour Button */}
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={handleSkip}
          className="bg-slate-900/90 hover:bg-black text-amber-300 hover:text-white border border-amber-400/80 rounded-full px-3.5 py-1 text-xs font-black shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          title="Skip tutorial and proceed to Sol 1 news"
        >
          <span>Skip Tour</span>
          <span className="text-xs">✕</span>
        </button>
      </div>

      {/* Dialog Card (Concise, Clean & Steady) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 px-3 md:px-4 max-w-sm w-full transition-all duration-300 ${
          isTargetInLowerHalf ? 'top-4' : 'bottom-4'
        }`}
      >
        <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] text-[#4a3525] rounded-3xl p-4 md:p-5 shadow-2xl space-y-3">
          {/* Header & Step progress badge */}
          <div className="flex items-center justify-between border-b-2 border-[#eadbc5] pb-1.5">
            <h3 className="text-base font-black text-[#4a3525] truncate">{currentStep.title}</h3>
            <span className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full font-black text-xs border border-amber-400 shrink-0">
              {stepIndex + 1} / {TUTORIAL_STEPS.length}
            </span>
          </div>

          {/* Description or Bullet Points */}
          {currentStep.bullets ? (
            <ul className="space-y-1.5 text-xs md:text-sm text-[#5a4636] font-bold">
              {currentStep.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 shrink-0">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs md:text-sm text-[#5a4636] font-bold leading-relaxed">
              {currentStep.desc}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-1 flex items-center justify-between gap-2">
            {/* Step Indicators */}
            <div className="flex items-center gap-1">
              {TUTORIAL_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === stepIndex
                      ? 'w-4 bg-amber-500'
                      : idx < stepIndex
                      ? 'w-1.5 bg-emerald-500'
                      : 'w-1.5 bg-[#d9c2a3]'
                  }`}
                  title={`Step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Back & Next / Start Game Buttons */}
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="py-1.5 px-3 rounded-2xl font-black text-xs bg-white hover:bg-amber-50 text-[#5a4636] border-2 border-[#d9c2a3] shadow-sm transition active:scale-95 cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className={`py-1.5 px-4 rounded-2xl font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1 ${
                  isLastStep
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400'
                    : 'bg-amber-500 hover:bg-amber-400 text-amber-950 border-2 border-amber-600'
                }`}
              >
                <span>{isLastStep ? 'Start Game' : 'Next'}</span>
                <span>{isLastStep ? '🚀' : '✓'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TutorialWalkthroughModal = TutorialWalkthroughModal;
