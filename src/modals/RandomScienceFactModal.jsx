// Module 5E: Random Science Fact Modal (NASA & CSA Verified Resources)
// Simplified layout, elementary-friendly English (ages 7-10), single close button.

function RandomScienceFactModal({ fact, onNextRandomFact, onClose }) {
  if (!fact) return null;
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    setImgFailed(false);
  }, [fact?.id]);

  return (
    <div className="fixed inset-0 bg-[#2d1e12]/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#fdf6e9] border-4 border-[#d9c2a3] text-[#4a3525] rounded-3xl max-w-sm w-full p-4 sm:p-5 space-y-3 shadow-2xl relative">
        {/* Header: Category Badge + Single '×' Close Button */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black text-xs inline-flex items-center border border-amber-300 shadow-sm">
            {fact.category}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#ebd8c1] hover:bg-[#d9c2a3] text-[#4a3525] font-black flex items-center justify-center text-lg active:scale-95 transition cursor-pointer shadow-sm"
          >
            ×
          </button>
        </div>

        {/* Short, Catchy Title */}
        <h3 className="text-lg sm:text-xl font-black text-[#4a3525] leading-snug">
          {fact.title}
        </h3>

        {/* Verified NASA/CSA Photo with Bulletproof Fallback */}
        <div className="space-y-1">
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#e6d5bc] bg-stone-900/10 aspect-[16/10] flex items-center justify-center shadow-inner">
            {imgFailed ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-500 space-y-1">
                <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold text-stone-500">Image unavailable</span>
              </div>
            ) : (
              <img
                src={fact.imageUrl}
                alt={fact.imageAlt || fact.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>
          {!imgFailed && (
            <div className="flex items-center justify-between text-[10px] text-[#78350f]/80 font-bold px-1">
              <span>Photo: {fact.imageCredit}</span>
              <span>{fact.sourceName}</span>
            </div>
          )}
        </div>

        {/* Elementary-Friendly Fact Body */}
        <div className="bg-white/85 border-2 border-[#ebd8c1] rounded-2xl p-3 shadow-sm">
          <p className="text-xs sm:text-sm font-bold text-[#4a3525] leading-relaxed">
            {fact.fact}
          </p>
        </div>

        {/* Action Buttons: Exactly TWO buttons (Another Fact + Source) */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={onNextRandomFact}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm text-center shadow active:scale-95 transition flex items-center justify-center cursor-pointer"
          >
            Another Fact
          </button>

          {fact.sourceUrl && (
            <a
              href={fact.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm text-center shadow active:scale-95 transition flex items-center justify-center gap-1 shrink-0"
            >
              <span>Source</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
