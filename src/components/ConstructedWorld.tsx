import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRAPHIC_DESIGN_CASES } from '../data';
import { GraphicDesignCase } from '../types';
import { audio } from './AudioEngine';
import { Compass, ArrowLeft, X, Maximize2, Minimize2, LayoutGrid, CalendarDays, Palette, CreditCard } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import BentoWall, { BentoWallItem } from './BentoWall';
import IDCardMockup from './IDCardMockup';
import SketchDoodle from './SketchDoodle';
import Reveal from './Reveal';
import { useMagnetic } from '../hooks/useMagnetic';
import { useGuide } from './GuideCompanion';

interface ConstructedWorldProps {
  onBackToHome: () => void;
}

function BackButton({ onBackToHome }: { onBackToHome: () => void }) {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.25);
  return (
    <button
      ref={magneticRef}
      onClick={() => {
        audio.playShutter();
        onBackToHome();
      }}
      data-cursor="link"
      className="magnetic-target flex items-center gap-2 font-mono text-[10px] text-[#4a4852] hover:text-[#b3122a] transition-colors uppercase tracking-widest"
      id="back-to-portal-btn-constructed"
    >
      <ArrowLeft size={14} />
      <span>PORTAL_GATEWAYS</span>
    </button>
  );
}

/* ============================================================
   CONTENT GROUPING — four sections, one per kind of work, so
   nothing shows up twice and every category gets the treatment
   that actually suits it (calendars in a stack, brand identities
   at full size, ID cards as physical badges, everything else in
   a Pinterest-style wall). Edit GRAPHIC_DESIGN_CASES in data.ts
   to add or remove a project — it's sorted into the right
   section here automatically by its `mockupType`.
   ============================================================ */
const CALENDAR_CASES = GRAPHIC_DESIGN_CASES.filter((c) => c.mockupType === 'calendar');
const BRANDING_CASES = GRAPHIC_DESIGN_CASES.filter((c) => c.mockupType === 'branding');
const ID_CARD_CASES = GRAPHIC_DESIGN_CASES.filter((c) => c.mockupType === 'id-card');
const REST_CASES = GRAPHIC_DESIGN_CASES.filter(
  (c) => c.mockupType !== 'calendar' && c.mockupType !== 'branding' && c.mockupType !== 'id-card'
);

/** Moodboard-style collage pieces dense enough that they need full-viewport viewing by default. */
const OPENS_FULLSCREEN_BY_DEFAULT = new Set(['design-branding-heavens-cafe', 'design-branding-epiquench']);

function MetaChips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, 3).map((t, i) => (
        <span
          key={i}
          className="px-1.5 py-0.5 rounded bg-white border border-[#16151a]/8 font-mono text-[8px] text-[#4a4852] leading-none"
        >
          {t}
        </span>
      ))}
      {items.length > 3 && (
        <span className="px-1.5 py-0.5 rounded bg-white border border-[#16151a]/8 font-mono text-[8px] text-[#8a8790] leading-none">
          +{items.length - 3}
        </span>
      )}
    </div>
  );
}

/** A single bento-wall tile for the "everything else" wall — cream card, red accents. */
function GraphicTile({ item, onOpen }: { item: GraphicDesignCase; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      data-cursor="view"
      className="group block w-full text-left rounded-2xl bg-[#faf9f6] border border-[#b3122a]/15 hover:border-[#b3122a]/45 transition-colors duration-300 swastik-elevated overflow-hidden cursor-pointer"
    >
      <div className="relative overflow-hidden bg-[#f2f0ea]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          loading="lazy"
        />
      </div>

      <div className="p-3 md:p-4 space-y-1.5 border-t border-[#b3122a]/10">
        <span className="font-sans text-xs md:text-sm font-bold text-[#16151a] uppercase tracking-tight leading-tight block">
          {item.title}
        </span>
        <span className="font-mono text-[8px] text-[#b3122a] uppercase tracking-widest block">
          {item.category}
        </span>
        <MetaChips items={item.techStack} />
      </div>
    </button>
  );
}

/** A large, editorial ScrollStack card for the calendar series. */
function CalendarStackCard({ item, index, onOpen }: { item: GraphicDesignCase; index: number; onOpen: () => void }) {
  return (
    <div className="border border-[#16151a]/10 rounded-2xl md:rounded-3xl bg-white overflow-hidden swastik-elevated-lg grid grid-cols-1 md:grid-cols-12">
      <div className="md:col-span-7 relative bg-[#f2f0ea] flex items-center justify-center min-h-[260px] md:min-h-[380px] max-h-[520px] overflow-hidden">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain" loading="lazy" />
        <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase bg-[#16151a] text-white px-2.5 py-1 rounded-full">
          EDITION.{String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="md:col-span-5 p-6 md:p-10 flex flex-col justify-center gap-4 md:gap-5">
        <span className="font-mono text-[9px] text-[#b3122a] tracking-widest uppercase bg-[#b3122a]/5 px-2.5 py-0.5 rounded border border-[#b3122a]/20 w-fit">
          {item.category}
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-[#16151a] leading-[0.95]">
          {item.title}
        </h3>
        <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed line-clamp-4">
          {item.concept}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {item.techStack.map((t, i) => (
            <span key={i} className="px-2 py-1 rounded bg-[#f2f0ea] border border-[#16151a]/8 font-mono text-[9px] text-[#4a4852]">
              {t}
            </span>
          ))}
        </div>
        <button
          onClick={onOpen}
          className="w-fit mt-1 py-2.5 px-5 bg-[#16151a] hover:bg-[#b3122a] text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors duration-300"
        >
          Open Case File
        </button>
      </div>
    </div>
  );
}

/** A full-width brand identity spread — the image shown at real size, not a thumbnail, with a short plain-language description beside it. */
function BrandSpread({ item, index, onOpen }: { item: GraphicDesignCase; index: number; onOpen: () => void }) {
  return (
    <Reveal y={40}>
      <div className="border border-[#16151a]/10 rounded-2xl md:rounded-3xl bg-white overflow-hidden swastik-elevated-lg">
        <div
          onClick={onOpen}
          data-cursor="view"
          className="relative w-full bg-[#f2f0ea] flex items-center justify-center min-h-[280px] md:min-h-[480px] overflow-hidden cursor-zoom-in group"
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase bg-[#16151a] text-white px-2.5 py-1 rounded-full">
            BRAND.{String(index + 1).padStart(2, '0')}
          </span>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest bg-black/70 text-white px-3 py-1.5 rounded-full">
              <Maximize2 size={11} /> View Full Size
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 justify-between">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[9px] text-[#b3122a] tracking-widest uppercase">{item.category}</span>
            <h3 className="font-display text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a] block">
              {item.title}
            </h3>
            <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed">
              {item.concept}
            </p>
          </div>
          <button
            onClick={onOpen}
            className="flex-shrink-0 w-fit py-2.5 px-5 bg-[#16151a] hover:bg-[#b3122a] text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors duration-300"
          >
            Open Case File
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export default function ConstructedWorld({ onBackToHome }: ConstructedWorldProps) {
  const [selectedCase, setSelectedCase] = useState<GraphicDesignCase | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { say } = useGuide();

  const openCase = (item: GraphicDesignCase) => {
    audio.playLensDial();
    setSelectedCase(item);
    setIsExpanded(OPENS_FULLSCREEN_BY_DEFAULT.has(item.id));
    say(`Case file: "${item.title}". Try Full Screen for the denser moodboard pieces, or close to keep browsing the wall.`);
  };

  const closeCase = () => {
    setSelectedCase(null);
    setIsExpanded(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#16151a] font-sans relative flex flex-col justify-between overflow-x-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 sketch-paper opacity-40 pointer-events-none z-0" />

      {/* STICKY EDITORIAL NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#16151a]/8 px-5 md:px-8 py-5 md:py-6 flex items-center justify-between gap-4">
        <BackButton onBackToHome={onBackToHome} />

        <div className="flex items-center gap-2">
          <Compass className="text-[#b3122a]" size={14} />
          <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold text-[#16151a] text-center">
            EXHIBIT III // GRAPHIC DESIGN
          </span>
        </div>

        <div className="font-mono text-[9px] text-[#8a8790] hidden md:block">
          {GRAPHIC_DESIGN_CASES.length} PROJECTS
        </div>
      </header>

      {/* EDITORIAL CASE STUDY SHEET CANVAS */}
      <main className="flex-grow w-full relative z-10 px-5 md:px-12 lg:px-20 py-10 md:py-16">
        <div className="space-y-20 md:space-y-28">

          {/* Header Summary section */}
          <Reveal className="max-w-3xl space-y-6 relative">
            <div className="space-y-4 relative">
              <div className="hidden md:block absolute -top-10 -left-2 pointer-events-none">
                <SketchDoodle variant="star-burst" color="#b3122a" className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-[#b3122a] tracking-widest uppercase block">
                GRAPHIC DESIGN &amp; VISUAL SYSTEMS
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.95] relative inline-block">
                Form follows <span className="relative inline-block">
                  <span className="type-hand text-[#b3122a] normal-case">Concept</span>
                  <SketchDoodle
                    variant="underline-squiggle"
                    color="#b3122a"
                    className="absolute -bottom-2 left-0 w-full h-3"
                  />
                </span>
              </h1>
              <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed max-w-xl">
                {GRAPHIC_DESIGN_CASES.length} client and club projects, grouped by what they actually are: a calendar series, two brand identities, a pair of ID cards, and everything else — posters, event graphics, and apparel — in one wall at the end.
              </p>
            </div>
          </Reveal>

          {/* SECTION 01 — THE CALENDAR SERIES */}
          <div className="space-y-6 md:space-y-8">
            <Reveal className="flex items-end justify-between gap-4 flex-wrap">
              <div className="space-y-2 relative w-fit">
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} className="text-[#b3122a]" />
                  <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790]">
                    01 // THE CALENDAR SERIES
                  </span>
                </div>
                <h2 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a]">
                  A Month, One Page At A Time
                </h2>
                <span className="type-hand text-lg text-[#b3122a] absolute -right-14 top-0 hidden lg:block rotate-[-6deg]">
                  scroll ↓
                </span>
              </div>
              <p className="font-sans text-xs text-[#4a4852] max-w-xs text-right">
                Three monthly feature pages, stacked so each one gets a full screen to itself as you scroll.
              </p>
            </Reveal>

            <ScrollStack baseTop={104} itemStackOffset={16} className="max-w-[1100px] mx-auto px-4">
              {CALENDAR_CASES.map((item, i) => (
                <ScrollStackItem key={item.id}>
                  <CalendarStackCard item={item} index={i} onOpen={() => openCase(item)} />
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>

          {/* SECTION 02 — BRAND IDENTITIES, SHOWN AT FULL SIZE */}
          <div className="space-y-6 md:space-y-8">
            <Reveal className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette size={13} className="text-[#b3122a]" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790]">
                  02 // BRAND IDENTITIES
                </span>
              </div>
              <h2 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a]">
                Two Brands, Two Different Problems
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#4a4852] max-w-xl leading-relaxed">
                Brand work needs to be seen at real size to judge it fairly, so both identities below are shown full width by default — no thumbnail, no hover required.
              </p>
            </Reveal>

            <div className="space-y-6 md:space-y-8">
              {BRANDING_CASES.map((item, i) => (
                <BrandSpread key={item.id} item={item} index={i} onOpen={() => openCase(item)} />
              ))}
            </div>
          </div>

          {/* SECTION 03 — ID CARDS, AS PHYSICAL BADGES */}
          <div className="space-y-6 md:space-y-8">
            <Reveal className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard size={13} className="text-[#b3122a]" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790]">
                  03 // ID CARDS
                </span>
              </div>
              <h2 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a]">
                Made To Hang On A Lanyard
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#4a4852] max-w-xl leading-relaxed">
                Both cards shown the way they're actually worn — clipped to a lanyard, not flattened into a rectangle image.
              </p>
            </Reveal>

            <Reveal stagger={0.1} className="flex flex-wrap items-start justify-center gap-10 md:gap-20 py-4">
              {ID_CARD_CASES.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-3">
                  <button onClick={() => openCase(item)} data-cursor="view" className="cursor-pointer">
                    <IDCardMockup imageUrl={item.imageUrl} title={item.title} className="md:scale-110" />
                  </button>
                  <div className="text-center space-y-1">
                    <span className="font-sans text-xs md:text-sm font-bold text-[#16151a] uppercase tracking-tight block">
                      {item.title}
                    </span>
                    <span className="font-mono text-[9px] text-[#b3122a] uppercase tracking-widest">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* SECTION 04 — EVERYTHING ELSE, PINTEREST-STYLE */}
          <div className="space-y-6 md:space-y-8">
            <Reveal className="space-y-2">
              <div className="flex items-center gap-2">
                <LayoutGrid size={13} className="text-[#b3122a]" />
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790]">
                  04 // POSTERS, EVENTS &amp; MORE
                </span>
              </div>
              <h2 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a]">
                {REST_CASES.length} More Projects, One Wall
              </h2>
              <p className="font-sans text-xs md:text-sm text-[#4a4852] max-w-xl leading-relaxed">
                Event posters, speaker intros, apparel, and the rest — tap any piece to open its full case file.
              </p>
            </Reveal>

            <div className="rounded-2xl md:rounded-3xl bg-[#f2f0ea] border border-[#b3122a]/15 p-4 md:p-8">
              <BentoWall>
                {REST_CASES.map((item) => (
                  <BentoWallItem key={item.id}>
                    <GraphicTile item={item} onOpen={() => openCase(item)} />
                  </BentoWallItem>
                ))}
              </BentoWall>
            </div>
          </div>

        </div>
      </main>

      {/* CASE FILE DETAIL MODAL — with a fullscreen lightbox toggle */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#16151a]/70 backdrop-blur-md flex items-center justify-center p-2 md:p-10"
          >
            <div className="absolute inset-0 cursor-pointer" onClick={closeCase} />

            {isExpanded ? (
              /* FULLSCREEN LIGHTBOX — for dense moodboard pieces or on-demand zoom */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="relative z-10 w-full h-full max-w-6xl flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-3 text-white px-1">
                  <div className="min-w-0">
                    <h2 className="font-sans text-sm md:text-base font-bold uppercase tracking-tight truncate">{selectedCase.title}</h2>
                    <span className="font-mono text-[9px] text-white/60 uppercase tracking-widest">{selectedCase.category}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full transition-colors"
                    >
                      <Minimize2 size={12} /> Case File
                    </button>
                    <button
                      onClick={closeCase}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label="Close"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-grow rounded-xl overflow-hidden bg-black/30 flex items-center justify-center">
                  <img
                    src={selectedCase.imageUrl}
                    alt={selectedCase.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </div>
              </motion.div>
            ) : (
              /* STANDARD CASE FILE PANEL */
              <motion.div
                initial={{ scale: 0.94, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 20 }}
                className="relative max-w-4xl w-full bg-white border border-[#16151a]/10 rounded-2xl p-6 md:p-10 flex flex-col gap-8 z-10 overflow-y-auto max-h-[90vh] swastik-elevated-lg"
              >
                {/* Close and expand controls */}
                <div className="absolute top-5 right-5 md:top-6 md:right-6 flex items-center gap-2 z-20">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#4a4852] hover:text-[#b3122a] bg-[#16151a]/5 hover:bg-[#16151a]/10 px-3 py-2 rounded-full transition-colors"
                    aria-label="View fullscreen"
                  >
                    <Maximize2 size={12} /> <span className="hidden sm:inline">Full Screen</span>
                  </button>
                  <button
                    onClick={closeCase}
                    className="text-[#4a4852] hover:text-[#16151a] font-mono text-xs cursor-pointer bg-[#16151a]/5 hover:bg-[#16151a]/10 p-2 rounded-full transition-colors"
                    aria-label="Close case file"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-[#b3122a] text-[9px] tracking-widest uppercase">
                      PROJECT DETAILS
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-[#16151a] mt-2">
                      {selectedCase.title}
                    </h2>
                    <p className="font-mono text-[10px] text-[#8a8790] uppercase tracking-widest">
                      {selectedCase.category}
                    </p>
                  </div>

                  <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed">
                    {selectedCase.concept}
                  </p>

                  {/* Case image — click to expand fullscreen */}
                  <div
                    onClick={() => setIsExpanded(true)}
                    data-cursor="view"
                    className="relative w-full rounded-xl overflow-hidden bg-[#f2f0ea] border border-[#16151a]/8 shadow-inner cursor-zoom-in group flex items-center justify-center"
                  >
                    {selectedCase.mockupType === 'id-card' ? (
                      <IDCardMockup imageUrl={selectedCase.imageUrl} title={selectedCase.title} className="scale-110 py-10" />
                    ) : (
                      <img
                        src={selectedCase.imageUrl}
                        alt={selectedCase.title}
                        className="w-full max-h-[60vh] object-contain"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest bg-black/70 text-white px-3 py-1.5 rounded-full">
                        <Maximize2 size={11} /> View Full Size
                      </span>
                    </div>
                  </div>

                  {/* Modular specs tables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#16151a]/8 pt-6">
                    <div className="space-y-3">
                      <span className="text-[#16151a] font-bold block uppercase text-[10px] tracking-wider font-mono">DELIVERABLES</span>
                      <ul className="space-y-2">
                        {selectedCase.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 font-sans text-xs text-[#4a4852]">
                            <span className="w-1.5 h-1.5 bg-[#b3122a]/70 rounded-full flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[#16151a] font-bold block uppercase text-[10px] tracking-wider font-mono">TOOLS USED</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCase.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded bg-[#f2f0ea] border border-[#16151a]/8 font-mono text-[9px] text-[#4a4852]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER STAT PANEL */}
      <footer className="border-t border-[#16151a]/8 bg-[#faf9f6] px-5 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8a8790] font-mono text-[9px]">
        <div>CASE STUDY PANEL 02 // VECTOR GRAPHICS SYSTEM</div>
        <div className="flex items-center gap-2 text-[#b3122a]">
          <span className="animate-pulse">●</span>
          <span>STILL FRAMES ARCHIVE READY</span>
        </div>
        <div>CONSTRUCTION // CONSTRUCTED.WORLD</div>
      </footer>
    </div>
  );
}
