interface IDCardMockupProps {
  imageUrl: string;
  title: string;
  className?: string;
}

/**
 * Wraps flat ID-card artwork in a lightweight CSS "physical card" presentation:
 * a lanyard clip + strap, a punch hole, and a slight resting tilt that
 * straightens on hover — so it reads as a badge hanging on a lanyard rather
 * than a flat rectangle image.
 */
export default function IDCardMockup({ imageUrl, title, className = '' }: IDCardMockupProps) {
  return (
    <div className={`relative flex flex-col items-center pt-10 pb-3 px-6 ${className}`}>
      {/* Lanyard strap disappearing off the top */}
      <div
        className="absolute top-0 w-9 h-14 bg-gradient-to-b from-[#16151a] to-[#4a4852]"
        style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)' }}
        aria-hidden
      />
      {/* Clip */}
      <div
        className="absolute top-11 w-6 h-4 rounded-sm bg-gradient-to-b from-[#8a8790] to-[#4a4852] border border-[#16151a]/30 z-10"
        aria-hidden
      />

      {/* The card itself */}
      <div
        className="group relative bg-white rounded-2xl p-2.5 pt-6 -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out w-full max-w-[240px]"
        style={{ boxShadow: '0 30px 50px -18px rgba(22,21,26,0.4), 0 2px 4px rgba(22,21,26,0.08)' }}
      >
        {/* Punch hole */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-7 h-2.5 rounded-full bg-[#f2f0ea] border border-[#16151a]/15" />
        <div className="rounded-xl overflow-hidden border border-[#16151a]/8">
          <img src={imageUrl} alt={title} className="w-full h-auto object-cover" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
