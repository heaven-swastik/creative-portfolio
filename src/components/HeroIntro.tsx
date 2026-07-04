import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { audio } from './AudioEngine';
import { Camera, Compass, Volume2, VolumeX, ArrowDown } from 'lucide-react';
import { PHOTOGRAPHY_EXHIBITION, GRAPHIC_DESIGN_CASES, CINEMATOGRAPHY_RELEASES, heroPortrait } from '../data';
import GridMotion from './GridMotion';
import SketchDoodle from './SketchDoodle';
import { useMagnetic } from '../hooks/useMagnetic';
import { useGuide } from './GuideCompanion';

// A small fanned cluster of exhibit thumbnails, styled like a spread of
// physical portfolio cards tossed onto a desk — echoes the stacked-card
// hero treatment referenced from the moodboard.
const FAN_CARDS = [
  { img: PHOTOGRAPHY_EXHIBITION[2]?.imageUrl, rotate: -14, x: -150, y: 8, tone: 'red' as const },
  { img: GRAPHIC_DESIGN_CASES[4]?.imageUrl, rotate: -5, x: -60, y: -6, tone: 'ink' as const },
  { img: GRAPHIC_DESIGN_CASES[2]?.imageUrl, rotate: 6, x: 40, y: 10, tone: 'green' as const },
  { img: CINEMATOGRAPHY_RELEASES[1]?.posterUrl, rotate: 15, x: 145, y: -4, tone: 'ink' as const },
];

interface HeroIntroProps {
  onEnterSection: (section: 'observed' | 'constructed') => void;
  isSoundActive: boolean;
  onToggleSound: () => void;
}

export default function HeroIntro({ onEnterSection, isSoundActive, onToggleSound }: HeroIntroProps) {
  // Navigation Phase:
  // 0 = Initial Screen (PORT / ? / FOLIO)
  // 1 = Curtains split, portrait developing
  // 2 = Camera lens overlay and portal choice
  const [phase, setPhase] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); // 0 to 100
  const [focusBlur, setFocusBlur] = useState(30); // 30px down to 0px
  const [hoveredPortal, setHoveredPortal] = useState<'none' | 'observed' | 'constructed'>('none');
  const [isFlickering, setIsFlickering] = useState(false);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [detentPulse, setDetentPulse] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observedPortalRef = useMagnetic<HTMLDivElement>(0.1);
  const constructedPortalRef = useMagnetic<HTMLDivElement>(0.1);
  const scrollLockTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);
  const { say } = useGuide();

  // Refs mirror the reactive state above so the wheel/touch listeners
  // (attached once, below) always read the *current* values instead of a
  // stale closure — this is what makes the scroll lock actually hold.
  const isFlickeringRef = useRef(false);
  const lockedRef = useRef(false);
  const phaseRef = useRef(0);

  // Curate visual files for the GridMotion background (Phase 2 Portal wall)
  const gridItems = [
    ...PHOTOGRAPHY_EXHIBITION.map(p => p.imageUrl),
    ...GRAPHIC_DESIGN_CASES.map(d => d.imageUrl),
    ...CINEMATOGRAPHY_RELEASES.map(c => c.posterUrl)
  ];

  // Shutter noise simulation on section selection
  const handleSelectPortal = (target: 'observed' | 'constructed') => {
    setIsFlickering(true);
    isFlickeringRef.current = true;
    audio.playShutter();
    
    // Simulate camera shutter black-out speed
    setTimeout(() => {
      onEnterSection(target);
    }, 600);
  };

  const PHASE_ONE_START = 25;
  const PHASE_TWO_START = 90;
  const MAX_BLUR = 30;

  // A physical dial has "detents" — small click-stops the ring settles
  // into. Every time a scroll/swipe crosses into a new phase, we snap the
  // progress to a clean checkpoint and hold scrolling there for a beat so
  // the now-in-focus text is fully readable before the visitor continues.
  const PHASE_GUIDE_LINES: Record<number, string> = {
    0: "Turn the dial — scroll or tap to bring the picture into focus.",
    1: "This is Swastik — keep scrolling to develop the full portrait and bio.",
    2: "Focus locked. Choose a path: The Observed for photography and film, or The Constructed for design.",
  };

  const lockScroll = (duration = 1100) => {
    setIsScrollLocked(true);
    lockedRef.current = true;
    if (scrollLockTimeoutRef.current) {
      window.clearTimeout(scrollLockTimeoutRef.current);
    }
    scrollLockTimeoutRef.current = window.setTimeout(() => {
      setIsScrollLocked(false);
      lockedRef.current = false;
      scrollLockTimeoutRef.current = null;
    }, duration);
  };

  const updateProgress = (next: number) => {
    if (Math.floor(next) % 15 === 0 && Math.floor(scrollProgress) % 15 !== 0) {
      audio.playLensDial();
    }

    let newPhase = 0;
    let newBlur = MAX_BLUR;

    if (next <= 0) {
      newPhase = 0;
      newBlur = MAX_BLUR;
    } else if (next < PHASE_ONE_START) {
      newPhase = 0;
      newBlur = MAX_BLUR;
    } else if (next < PHASE_TWO_START) {
      newPhase = 1;
      const ratio = (next - PHASE_ONE_START) / (PHASE_TWO_START - PHASE_ONE_START);
      newBlur = Math.max(MAX_BLUR * (1 - ratio), 0);
    } else {
      newPhase = 2;
      newBlur = 0;
    }

    setFocusBlur(newBlur);
    audio.adjustFocusPitch(newBlur);

    // Crossing a phase boundary is the "click stop" — engage the detent:
    // snap fully into the new phase, hold the scroll, and let the curator
    // narrate what just came into focus.
    if (newPhase !== phaseRef.current) {
      phaseRef.current = newPhase;
      setPhase(newPhase);
      audio.playGearTick();
      lockScroll(newPhase === 2 ? 1300 : 950);
      setDetentPulse((t) => t + 1);
      say(PHASE_GUIDE_LINES[newPhase]);
    } else {
      setPhase(newPhase);
    }
  };

  // Listen to wheel scrolls to simulate scrolling progress. Attached once
  // (empty deps) and gated entirely through refs, so the lock engaged by
  // updateProgress above is always respected in real time — not just on
  // whichever render the listener happened to be created during.
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isFlickeringRef.current || lockedRef.current) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      
      const direction = e.deltaY > 0 ? 1 : -1;
      
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + direction * 4, 0), 100);
        updateProgress(next);
        return next;
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFlickeringRef.current || lockedRef.current) return;
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - touchY;
    
    // Convert touch swipe to scroll progress
    if (Math.abs(deltaY) > 5) {
      setScrollProgress((prev) => {
        const direction = deltaY > 0 ? 1 : -1;
        const next = Math.min(Math.max(prev + direction * 5, 0), 100);
        updateProgress(next);
        return next;
      });
      touchStartYRef.current = touchY;
    }
  };

  // Button step navigation (fallback for non-wheel or simpler click-through)
  const advanceStep = () => {
    if (lockedRef.current) return;
    audio.playLensDial();
    if (phase === 0) {
      setScrollProgress(50);
      updateProgress(50);
    } else if (phase === 1) {
      setScrollProgress(100);
      updateProgress(100);
    }
  };

  const reverseStep = () => {
    if (lockedRef.current) return;
    audio.playLensDial();
    if (phase === 2) {
      setScrollProgress(50);
      updateProgress(50);
    } else if (phase === 1) {
      setScrollProgress(0);
      updateProgress(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-full h-screen bg-[#faf9f6] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background Cinematic Texture Overlay */}
      <div className="absolute inset-0 sketch-paper opacity-30 pointer-events-none z-10" />

      {/* Dynamic Parallax Grid Background (Revealed in Portal phase 2) */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <GridMotion items={gridItems} gradientColor="#faf9f6" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Grid Lines (Rangefinder Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none border border-[#16151a]/10 m-12 z-0">
        <div className="absolute top-0 bottom-0 left-1/3 border-r border-[#16151a]/5" />
        <div className="absolute top-0 bottom-0 left-2/3 border-r border-[#16151a]/5" />
        <div className="absolute left-0 right-0 top-1/3 border-b border-[#16151a]/5" />
        <div className="absolute left-0 right-0 top-2/3 border-b border-[#16151a]/5" />
        
        {/* Fine Lens Sights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-[#b3122a]/10 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-[#b3122a]/30 rounded-full" />
        </div>
        
        {/* Framing Corners — design-tool selection brackets with handle nodes */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#16151a]/25">
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#faf9f6] border border-[#16151a]/50" />
        </div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#b3122a]/40">
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#faf9f6] border border-[#b3122a]/60" />
        </div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#16151a]/40">
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#faf9f6] border border-[#16151a]/60" />
        </div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#16151a]/25">
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#faf9f6] border border-[#16151a]/50" />
        </div>
      </div>

      {/* TOP HEADER STATUS */}
      <header className="relative z-20 flex justify-between items-center p-8 md:px-16 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.3em] text-[#16151a] font-semibold">
            PERSPECTIVE // EXHIBIT
          </span>
          <span className="px-1.5 py-0.5 rounded-sm bg-[#b3122a]/10 text-[#b3122a] font-mono text-[8px] border border-[#b3122a]/20 uppercase tracking-widest">
            LIVE CALIBRATION
          </span>
        </div>

        {/* Audio Control Module */}
        <button
          onClick={onToggleSound}
          data-cursor="sound"
          className="flex items-center gap-2 px-4 py-2 border border-[#16151a]/15 rounded-full hover:border-[#b3122a]/30 transition-all duration-300 pointer-events-auto bg-white/70 backdrop-blur-sm swastik-elevated group"
          id="audio-toggle-button"
        >
          {isSoundActive ? (
            <>
              <Volume2 size={12} className="text-[#b3122a] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] tracking-wider text-[#b3122a]">AUDIO.ON</span>
              <div className="flex gap-[1px] items-end h-2 ml-1">
                <span className="w-[1.5px] bg-[#b3122a] animate-bounce" style={{ height: '40%', animationDelay: '0.1s' }} />
                <span className="w-[1.5px] bg-[#b3122a] animate-bounce" style={{ height: '100%', animationDelay: '0.3s' }} />
                <span className="w-[1.5px] bg-[#b3122a] animate-bounce" style={{ height: '60%', animationDelay: '0.2s' }} />
              </div>
            </>
          ) : (
            <>
              <VolumeX size={12} className="text-[#4a4852] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[9px] tracking-wider text-[#4a4852]">AUDIO.OFF</span>
            </>
          )}
        </button>
      </header>

      {/* CORE EXHIBITION FRAME (CENTRAL ELEMENT) */}
      <main className="flex-grow flex items-center justify-center relative w-full h-full sketch-paper">
        {/* SCENE 0: MONOLITH PORTFOLIO SLIDER */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20">

          {/* Structural red block — the single loud color-field, echoing a
              printed exhibition poster's bleed bar */}
          <motion.div
            animate={{
              opacity: phase >= 1 ? 0 : 1,
              scaleY: phase >= 1 ? 0.4 : 1,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 140 }}
            className="absolute top-[8%] bottom-[8%] w-[7vw] md:w-[4.5vw] bg-[#b3122a] z-0 pointer-events-none"
          />

          {/* Ghost outline duplicate — misregistered print / distorted double-take */}
          <motion.div
            animate={{ opacity: phase >= 1 ? 0 : 0.5, x: phase >= 1 ? '-80%' : '-3%', y: '-3%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 180 }}
            className="absolute left-0 right-1/2 pr-4 md:pr-12 text-right pointer-events-none z-0"
          >
            <h1 className="type-distort-outline text-[12vw] md:text-[14vw] font-bold uppercase leading-none">
              PORT
            </h1>
          </motion.div>
          <motion.div
            animate={{ opacity: phase >= 1 ? 0 : 0.5, x: phase >= 1 ? '80%' : '3%', y: '3%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 180 }}
            className="absolute right-0 left-1/2 pl-4 md:pl-12 text-left pointer-events-none z-0"
          >
            <h1 className="type-distort-outline text-[12vw] md:text-[14vw] font-bold uppercase leading-none">
              FOLIO
            </h1>
          </motion.div>

          <motion.div
            animate={{
              x: phase >= 1 ? '-80%' : '0%',
              opacity: phase >= 1 ? 0 : 1,
              scale: phase >= 1 ? 0.95 : 1,
            }}
            transition={{ type: 'spring', damping: 35, stiffness: 180 }}
            className="absolute left-0 right-1/2 pr-4 md:pr-12 text-right pointer-events-none z-10"
          >
            <h1 className="type-distort-solid text-[12vw] md:text-[14vw] font-bold text-[#16151a] uppercase select-none leading-none">
              PORT
            </h1>
          </motion.div>

          <motion.div
            animate={{
              x: phase >= 1 ? '80%' : '0%',
              opacity: phase >= 1 ? 0 : 1,
              scale: phase >= 1 ? 0.95 : 1,
            }}
            transition={{ type: 'spring', damping: 35, stiffness: 180 }}
            className="absolute right-0 left-1/2 pl-4 md:pl-12 text-left pointer-events-none z-10"
          >
            <h1 className="type-distort-solid text-[12vw] md:text-[14vw] font-bold text-[#16151a] uppercase select-none leading-none">
              FOLIO
            </h1>
          </motion.div>

          {/* Pencil-note annotations scribbled around the title, notebook-style */}
          {phase === 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden md:flex absolute top-[14%] left-[8%] items-start gap-2 z-30 pointer-events-none"
              >
                <SketchDoodle variant="arrow-curl-right" color="#b3122a" className="w-10 h-10 -mt-1" delay={0.7} />
                <div className="pt-3">
                  <span className="type-hand text-2xl text-[#b3122a] block leading-none">est. 2026</span>
                  <span className="font-mono text-[8px] text-[#4a4852] tracking-widest uppercase">visual creator</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="hidden md:flex absolute bottom-[16%] right-[9%] flex-col items-end gap-1 z-30 pointer-events-none text-right"
              >
                <span className="type-hand text-2xl text-[#16151a] leading-none">observed + constructed</span>
                <SketchDoodle variant="underline-squiggle" color="#16151a" className="w-32 h-4" delay={0.85} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="hidden lg:block absolute top-[10%] right-[6%] z-30 pointer-events-none"
              >
                <SketchDoodle variant="crop-tag" color="#8a8790" className="w-14 h-10" delay={0.9} />
              </motion.div>
            </>
          )}

          {/* Fanned exhibit-card cluster — a spread of thumbnails tossed under the title */}
          {phase === 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] md:bottom-[8%] z-20 pointer-events-none">
              <div className="relative w-[64vw] max-w-md h-24 md:h-28">
                {FAN_CARDS.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, rotate: 0 }}
                    animate={{ opacity: 1, y: 0, rotate: card.rotate }}
                    transition={{ delay: 0.4 + i * 0.08, type: 'spring', damping: 20, stiffness: 120 }}
                    style={{ left: `calc(50% + ${card.x}px)` }}
                    className="absolute -translate-x-1/2 bottom-0 w-16 h-24 md:w-20 md:h-28 rounded-lg overflow-hidden border-2 border-[#16151a]/15 shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                  >
                    <img src={card.img} alt="" className="w-full h-full object-cover grayscale contrast-125" referrerPolicy="no-referrer" />
                    <div
                      className="absolute inset-0 mix-blend-color"
                      style={{
                        background:
                          card.tone === 'red' ? 'rgba(179,18,42,0.35)' : card.tone === 'green' ? 'rgba(22,21,26,0.28)' : 'rgba(74,72,82,0.18)',
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Central Mystery Dot or Reticle inside phase 0 */}
          {phase === 0 && (
            <motion.button
              onClick={advanceStep}
              data-cursor="enter"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, rotate: 8 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#b3122a] flex items-center justify-center bg-white/85 backdrop-blur-sm shadow-[0_0_36px_rgba(179,18,42,0.18)] z-40 pointer-events-auto"
              id="center-explore-trigger"
            >
              <div className="relative flex flex-col items-center">
                <span className="font-display text-xl md:text-2xl font-light text-[#b3122a] animate-pulse">?</span>
                <span className="absolute -bottom-8 type-hand text-sm text-[#16151a]/70 tracking-wide">scroll or tap</span>
              </div>
            </motion.button>
          )}
        </div>

        {/* SCENE 1: DEVELOPMENT OF MOODY CREATOR PORTRAIT & CREATIVE IDENTITY */}
        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-y-auto py-16 lg:py-0">
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{
                  opacity: phase === 1 ? 1 : 0.0,
                  scale: phase === 1 ? 1 : 0.85,
                  pointerEvents: phase === 1 ? 'auto' : 'none'
                }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', damping: 30, stiffness: 100 }}
                className="w-full max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                
                {/* PORTRAIT VIEWPORT FRAME (Left 5 Columns) */}
                <div className="lg:col-span-5 flex justify-center relative">
                  <div className="relative w-64 h-80 md:w-80 md:h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Simulated Lens Aperture Ring around the image */}
                    <motion.div 
                      animate={{ rotate: scrollProgress * 2.4 }}
                      className="absolute inset-0 border border-dashed border-[#b3122a]/30 rounded-full scale-[1.05] pointer-events-none"
                    />

                    {/* Moody portrait styled with lens flare and focus blur */}
                    <div 
                      className="w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden border border-[#16151a]/20 bg-neutral-950 transition-all duration-500 ease-out shadow-2xl relative"
                      style={{
                        filter: `blur(${focusBlur}px)`,
                        maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                      }}
                    >
                      <img
                        src={heroPortrait}
                        alt="Swastik Manna Portrait"
                        className="w-full h-full object-cover grayscale contrast-125 select-none"
                      />
                      {/* Abstract violet/teal lighting leak element inspired by uploaded colors */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#b3122a]/20 via-transparent to-[#d94a3a]/15 mix-blend-soft-light opacity-90 pointer-events-none" />
                    </div>

                    {/* Active Focus Sights over portrait in Scene 1 */}
                    {phase === 1 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pointer-events-none text-white z-10 bg-black/10">
                        <div className="font-mono text-[8px] tracking-[0.25em] text-white/80 uppercase bg-black/50 px-2 py-0.5 rounded border border-white/10">
                          MANUAL COUPLING
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="px-2.5 py-1 rounded bg-black/80 font-mono text-[9px] text-[#d94a3a] border border-[#b3122a]/30 shadow-lg">
                            FOCAL DISTANCE // {Math.round(100 - focusBlur * 3.3)}%
                          </div>
                          <span className="text-[8px] font-mono text-white/70 tracking-wider uppercase animate-pulse">
                            {focusBlur > 5 ? 'ROTATE SCROLL RING' : 'LENS CALIBRATION_LOCKED'}
                          </span>
                        </div>
                        <div className="font-mono text-[8px] tracking-wider text-white/80 uppercase bg-black/50 px-2 py-0.5 rounded border border-white/10">
                          DIAPHRAGM // f/0.95
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* EDITORIAL STORYTELLING PANEL (Right 7 Columns) */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] text-[#16151a] tracking-[0.4em] uppercase block font-bold">
                      COGNITIVE_FILE // IDENT_09
                    </span>
                    <h2 
                      style={{ filter: `blur(${focusBlur * 0.15}px)` }}
                      className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight leading-none text-[#16151a] transition-all duration-300"
                    >
                      I create visuals that <span className="swastik-acid-text">don't just capture attention</span>—they create <span className="text-[#16151a] font-serif lowercase italic">emotion</span>.
                    </h2>
                  </div>

                  {/* SWASTIK STORY SECTION */}
                  <div 
                    style={{ filter: `blur(${focusBlur * 0.1}px)` }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#16151a]/10 text-[#4a4852] transition-all duration-300"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-mono text-[9px] text-[#b3122a] tracking-widest font-bold uppercase bg-[#b3122a]/5 px-2 py-0.5 rounded border border-[#b3122a]/20 w-fit">
                        [01_LIGHT_ATMOSPHERE]
                      </div>
                      <p className="font-sans text-xs leading-relaxed">
                        I&apos;m <strong className="text-[#16151a]">Swastik</strong>, exploring two creative realms. Through photography and cinematic filmmaking, I chase atmosphere and emotion—transforming ordinary scenes into memorable moments framed with intense intentional perspective.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 font-mono text-[9px] text-[#16151a] tracking-widest font-bold uppercase bg-[#16151a]/5 px-2 py-0.5 rounded border border-[#16151a]/20 w-fit">
                        [02_GEOMETRIC_DESIGN]
                      </div>
                      <p className="font-sans text-xs leading-relaxed">
                        On the design side, I shape bold, minimal, and visually striking graphics that communicate ideas with striking clarity. From Swiss grid posters to custom packaging dielines, every layout balances pure aesthetics with core purpose.
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM NOTE STATEMENT */}
                  <div 
                    style={{ filter: `blur(${focusBlur * 0.05}px)` }}
                    className="pt-4 font-sans text-xs transition-all duration-300"
                  >
                    <p className="leading-relaxed border-l-2 border-[#b3122a] pl-4 italic text-[#16151a]">
                      &ldquo;No matter the medium, my goal remains the same: to create visuals that people don&apos;t just see—but remember. This portfolio captures reality through glass, and projects imagination through pure design.&rdquo;
                    </p>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SCENE 2: THE APERTURE PORTAL CHANNELS */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 px-12 md:px-24 z-30"
            >
              {/* PORTAL A: THE OBSERVED WORLD (Photography & Cinematography) */}
              <motion.div
                ref={observedPortalRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.1 }}
                onMouseEnter={() => setHoveredPortal('observed')}
                onMouseLeave={() => setHoveredPortal('none')}
                onClick={() => handleSelectPortal('observed')}
                data-cursor="gate"
                className="magnetic-target w-full md:w-1/3 p-8 rounded-3xl swastik-glass-card cursor-pointer hover:border-[#b3122a]/40 hover:shadow-[0_0_30px_rgba(179,18,42,0.14)] transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-80 md:h-96"
                id="portal-observed"
              >
                {/* Technical grids */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#4a4852] tracking-wider">
                  SYS.01 // GLASS_SENSORS
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-[#16151a]/30 flex items-center justify-center group-hover:border-[#b3122a] group-hover:bg-[#b3122a]/10 transition-all duration-500 shadow-inner">
                    <Camera className="text-[#4a4852] group-hover:text-[#b3122a] transition-colors" size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#16151a] group-hover:text-[#b3122a] transition-colors">
                      The Observed
                    </h2>
                    <p className="font-mono text-[9px] text-[#b3122a] uppercase tracking-widest mt-1">
                      Photography & Cinematography
                    </p>
                  </div>
                  <p className="font-sans text-xs text-[#4a4852] leading-relaxed group-hover:text-[#16151a] transition-colors duration-300">
                    A cinematic curation of optical moments frozen in glass. Museum architectural captures and A24-style short film stories documenting life, shadows, and perspective.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#16151a]/10 pt-4 mt-4 font-mono text-[9px] text-[#4a4852] group-hover:text-[#b3122a] transition-colors">
                  <span>ENTER EXHIBITION</span>
                  <span className="text-xs">→</span>
                </div>
              </motion.div>

              {/* PORTAL B: THE CONSTRUCTED WORLD (Graphic Design) */}
              <motion.div
                ref={constructedPortalRef}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120, delay: 0.25 }}
                onMouseEnter={() => setHoveredPortal('constructed')}
                onMouseLeave={() => setHoveredPortal('none')}
                onClick={() => handleSelectPortal('constructed')}
                data-cursor="gate"
                className="magnetic-target w-full md:w-1/3 p-8 rounded-3xl swastik-glass-card cursor-pointer hover:border-[#16151a]/50 hover:shadow-[0_0_30px_rgba(22,21,26,0.10)] transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-80 md:h-96"
                id="portal-constructed"
              >
                {/* Technical grids */}
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#4a4852] tracking-wider">
                  SYS.02 // SHAPE_METRICS
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full border border-[#16151a]/30 flex items-center justify-center group-hover:border-[#16151a] group-hover:bg-[#16151a]/10 transition-all duration-500 shadow-inner">
                    <Compass className="text-[#4a4852] group-hover:text-[#16151a] transition-colors" size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#16151a] group-hover:text-[#16151a] transition-colors">
                      The Constructed
                    </h2>
                    <p className="font-mono text-[9px] text-[#16151a] uppercase tracking-widest mt-1">
                      Graphic Design & Case Studies
                    </p>
                  </div>
                  <p className="font-sans text-xs text-[#4a4852] leading-relaxed group-hover:text-[#16151a] transition-colors duration-300">
                    A collection of high-concept graphic artifacts, modular grids, event posters, corporate branding portfolios, and sculptural physical packaging systems.
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#16151a]/10 pt-4 mt-4 font-mono text-[9px] text-[#4a4852] group-hover:text-[#16151a] transition-colors">
                  <span>ENTER CASE STUDIES</span>
                  <span className="text-xs">→</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER CALIBRATION PANEL */}
      <footer className="relative z-20 p-8 md:px-16 pointer-events-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Navigation Indicators */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#4a4852]">
            <span>PHASE</span>
            <span className="text-[#16151a] font-bold">0{phase + 1}</span>
            <span>/</span>
            <span>03</span>
          </div>

          {/* Stepper buttons (allows user to click through if they can't scroll easily) */}
          <div className="flex items-center border border-[#16151a]/20 rounded bg-white/70 backdrop-blur-sm swastik-elevated overflow-hidden">
            <button
              onClick={reverseStep}
              disabled={phase === 0}
              className="px-3 py-1 font-mono text-[9px] text-[#16151a] hover:bg-[#16151a]/6 disabled:opacity-30 disabled:hover:bg-transparent border-r border-[#16151a]/20 transition-colors"
            >
              PREV
            </button>
            <button
              onClick={advanceStep}
              disabled={phase === 2}
              className="px-3 py-1 font-mono text-[9px] text-[#b3122a] hover:bg-[#b3122a]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              NEXT
            </button>
          </div>
        </div>

        {/* Scroll helper */}
        <motion.div
          animate={{
            y: isScrollLocked ? 0 : [0, 5, 0],
          }}
          transition={{
            repeat: isScrollLocked ? 0 : Infinity,
            duration: 2,
          }}
          className="flex flex-col items-center pointer-events-none"
        >
          {isScrollLocked ? (
            <span className="font-mono text-[8px] text-[#8a8790] tracking-widest uppercase animate-pulse">
              HOLDING FOCUS — SCROLL AGAIN TO CONTINUE
            </span>
          ) : phase < 2 ? (
            <>
              <ArrowDown size={14} className="text-[#b3122a]" />
              <span className="font-mono text-[8px] text-[#4a4852] tracking-widest uppercase mt-1">
                SCROLL DOWN TO FOCUS LENS
              </span>
            </>
          ) : (
            <span className="font-mono text-[8px] text-[#b3122a] tracking-widest uppercase animate-pulse">
              SELECT PATHWAY TO ENTER CREATIVE WORLD
            </span>
          )}
        </motion.div>

        {/* Studio metrics */}
        <div className="font-mono text-[9px] text-[#4a4852] uppercase tracking-widest text-right hidden md:block">
          CWD.7.0.2 // RECTILINEAR_PERSPECTIVE
        </div>
      </footer>

      {/* Detent Click-Stop Pulse — a light, quick ring flash marking each
          phase boundary "settling into place", distinct from the heavier
          full-screen shutter flicker used on portal selection */}
      <AnimatePresence>
        {detentPulse > 0 && (
          <motion.div
            key={detentPulse}
            initial={{ opacity: 0.5, scale: 0.7 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-[#b3122a]/60 pointer-events-none z-50"
          />
        )}
      </AnimatePresence>

      {/* Optical Shutter Flicker Effect overlay on scene load */}
      <AnimatePresence>
        {isFlickering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0, 0.55, 0, 0.35],
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#16151a] z-[999] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
