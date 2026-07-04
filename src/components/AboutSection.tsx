import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Compass, Sliders, ArrowRight, Aperture, Clapperboard, PenTool, Image as ImageIcon, Layers, Figma } from 'lucide-react';
import { audio } from './AudioEngine';
import Reveal from './Reveal';
import GlassIcons from './GlassIcons';
import { heroPortrait } from '../data';
import { useMagnetic } from '../hooks/useMagnetic';

interface AboutSectionProps {
  onBackToHome: () => void;
  onNavigateSection: (section: 'observed' | 'constructed' | 'contact') => void;
}

export default function AboutSection({ onBackToHome, onNavigateSection }: AboutSectionProps) {
  const [lensFocus, setLensFocus] = useState(85); // 0 to 100 focus
  const [activePhilosophyTab, setActivePhilosophyTab] = useState<'vision' | 'method' | 'medium'>('vision');

  const focusBlur = Math.max((100 - lensFocus) / 4, 0);

  const handleFocusChange = (val: number) => {
    setLensFocus(val);
    if (Math.floor(val) % 8 === 0) {
      audio.playLensDial();
    }
  };

  return (
    <div className="relative min-h-screen swastik-aura-bg text-[#16151a] font-sans overflow-y-auto px-6 py-20 md:p-24 lg:p-32 select-none">
      {/* Editorial Grid Backing */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(22,21,26,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(22,21,26,0.045)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-full swastik-grain-heavy pointer-events-none opacity-5 z-10" />

      {/* Decorative Technical Border/Headers */}
      <div className="absolute top-8 left-8 right-8 justify-between items-center hidden md:flex font-mono text-[9px] text-[#4a4852] tracking-[0.25em] z-20">
        <button
          onClick={() => {
            audio.playShutter();
            onBackToHome();
          }}
          data-cursor="link"
          className="flex items-center gap-2 hover:text-[#b3122a] transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#b3122a] animate-pulse" />
          <span>SWASTIK // DOSSIER_09 // RETURN TO PORTAL</span>
        </button>
        <div>OPTICAL SYSTEM // 35MM COUPLING</div>
        <div>EDITORIAL GRID ALIGNED</div>
      </div>

      <div className="max-w-6xl mx-auto relative z-20 mt-8 md:mt-0">
        
        {/* EDITORIAL HEADER */}
        <div className="space-y-4 mb-16 md:mb-24 text-left">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-[#16151a] tracking-[0.4em] uppercase block font-bold"
          >
            [THE CREATIVE IDENTITY]
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
          >
            MEET <span className="swastik-acid-text">SWASTIK</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-xl md:text-2xl text-[#4a4852] max-w-2xl font-light tracking-wide leading-relaxed"
          >
            A visual artist operating at the intersection of cinematic atmosphere and rigid structural graphic systems.
          </motion.p>
        </div>

        {/* CORE GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: VISUAL PORTRAIT FRAME (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] w-full rounded-[40px] md:rounded-[50px] overflow-hidden border border-[#16151a]/10 bg-[#16151a] swastik-elevated-lg">
              
              {/* Dynamic Camera Viewfinder Sights */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-20 text-white/70 font-mono text-[9px]">
                <div className="flex justify-between items-center">
                  <span>FOCUS // AUTO_LENS</span>
                  <span>f/0.95</span>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-[#b3122a]/20 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#b3122a] rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#b3122a] font-bold">FOCUS: {lensFocus}%</span>
                  <span>ISO 100</span>
                </div>
              </div>

              {/* Portrait Image */}
              <motion.div 
                className="w-full h-full"
                style={{ filter: `blur(${focusBlur}px)` }}
              >
                <img
                  src={heroPortrait}
                  alt="Swastik Manna Portrait"
                  className="w-full h-full object-cover grayscale contrast-[1.15] select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                {/* Creative color lighting leaks */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#b3122a]/20 via-transparent to-[#d94a3a]/15 mix-blend-soft-light opacity-90 pointer-events-none" />
              </motion.div>
            </div>

            {/* INTERACTIVE LENS CALIBRATION SLIDER */}
            <div className="p-6 rounded-3xl swastik-glass-card space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#b3122a]" />
                  <span className="font-mono text-[10px] tracking-wider text-[#16151a] uppercase font-bold">LENS DIAL CALIBRATION</span>
                </div>
                <span className="font-mono text-[9px] text-[#4a4852] uppercase tracking-widest">[DRAG TO FOCUS]</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={lensFocus}
                onChange={(e) => handleFocusChange(Number(e.target.value))}
                className="w-full h-1 bg-[#16151a]/10 rounded-lg appearance-none cursor-pointer accent-[#b3122a] focus:outline-none focus:ring-0"
              />
              <p className="font-mono text-[8px] text-[#4a4852] leading-relaxed uppercase tracking-wider">
                {lensFocus < 50 
                  ? "DIALING COUPLING FLUIDS TO SHARPEN THE IDENTITY..." 
                  : lensFocus < 90 
                    ? "ALMOST SECURED // ATMOSPHERIC OPTICAL COUPLING ACTIVE" 
                    : "LOCKED AT MAX RESOLUTION // 35MM RECTILINEAR APERTURE"}
              </p>
            </div>
          </div>

          {/* RIGHT: EDITORIAL BIOGRAPHY & PHILOSOPHY (7 columns) */}
          <div className="lg:col-span-7 space-y-10 text-left">
            
            {/* BIG MOTTO */}
            <div className="border-l-4 border-[#b3122a] pl-6 space-y-2">
              <h3 className="font-sans text-2xl md:text-4xl font-bold uppercase tracking-tight text-[#16151a] leading-tight">
                I create visuals that <span className="swastik-acid-text">don&apos;t just capture attention</span>—they create <span className="text-[#16151a] font-serif lowercase italic">emotion</span>.
              </h3>
            </div>

            {/* TWO REALMS */}
            <Reveal stagger={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#b3122a]/10 border border-[#b3122a]/20 text-[#b3122a]">
                    <Camera size={14} />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#16151a] uppercase">
                    [01_THE_OBSERVED]
                  </span>
                </div>
                <h4 className="font-sans text-sm font-bold text-[#4a4852] uppercase">Photography & Cinematography</h4>
                <p className="font-sans text-xs text-[#4a4852] leading-relaxed">
                  I chase atmosphere and emotion through glass. From high-contrast monochrome street frames to cinematic color-graded vignettes, I seek to turn ordinary moments into timeless editorial compositions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-[#16151a]/10 border border-[#16151a]/20 text-[#16151a]">
                    <Compass size={14} />
                  </div>
                  <span className="font-mono text-[10px] tracking-widest font-bold text-[#16151a] uppercase">
                    [02_THE_CONSTRUCTED]
                  </span>
                </div>
                <h4 className="font-sans text-sm font-bold text-[#4a4852] uppercase">Graphic Layout & Dielines</h4>
                <p className="font-sans text-xs text-[#4a4852] leading-relaxed">
                  I construct clean, bold visual layouts. Rooted in the Swiss grid tradition, my designs prioritize striking typographic scaling, structural balance, and intentional negative space.
                </p>
              </div>
            </Reveal>

            {/* THIRD BIOGRAPHY EXCERPT */}
            <p className="font-sans text-sm text-[#4a4852] leading-relaxed">
              &ldquo;No matter the medium, my goal remains the same: to create visuals that people don&apos;t just see—but remember. This portfolio captures reality through glass, and projects imagination through pure design.&rdquo;
            </p>

            {/* INTERACTIVE PHILOSOPHY SELECTOR */}
            <div className="border border-[#16151a]/10 rounded-3xl p-6 bg-white swastik-elevated space-y-6">
              <div className="flex gap-2 border-b border-[#16151a]/8 pb-3 overflow-x-auto">
                {(['vision', 'method', 'medium'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      audio.playLensDial();
                      setActivePhilosophyTab(tab);
                    }}
                    className={`px-4 py-1.5 rounded-full font-mono text-[9px] tracking-wider uppercase transition-all ${
                      activePhilosophyTab === tab
                        ? 'bg-[#b3122a] text-white font-bold'
                        : 'text-[#4a4852] hover:text-[#16151a]'
                    }`}
                  >
                    {tab === 'vision' ? 'CORE VISION' : tab === 'method' ? 'THE METHOD' : 'FAVORED MEDIUMS'}
                  </button>
                ))}
              </div>

              <div className="min-h-[80px]">
                {activePhilosophyTab === 'vision' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 text-xs text-[#4a4852]"
                  >
                    <p className="leading-relaxed">
                      To design with extreme intent. Aesthetics are empty without structural foundation. Visual storytelling is achieved by stripping away the non-essential to reveal raw core message.
                    </p>
                    <div className="flex gap-3 text-[9px] font-mono text-[#b3122a]">
                      <span>#CONTRAST</span>
                      <span>#REDUCTION</span>
                      <span>#ATMOSPHERE</span>
                    </div>
                  </motion.div>
                )}

                {activePhilosophyTab === 'method' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 text-xs text-[#4a4852]"
                  >
                    <p className="leading-relaxed">
                      Balancing manual photography (analog intuition, shallow physical depth, restrained editorial color grades) with digital design perfection (rigid geometry, vectorized mathematical dielines, Swiss layout grids).
                    </p>
                    <div className="flex gap-3 text-[9px] font-mono text-[#16151a]">
                      <span>#SWISS_GRID</span>
                      <span>#35MM_OPTICS</span>
                      <span>#DIELINE_SYSTEMS</span>
                    </div>
                  </motion.div>
                )}

                {activePhilosophyTab === 'medium' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 text-xs text-[#4a4852]"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-[#8a8790] uppercase block">OPTICAL</span>
                        <span className="text-[#16151a] font-medium">35mm Prime, f/0.95 glass, Contrast Monochrome</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] text-[#8a8790] uppercase block">LAYOUT</span>
                        <span className="text-[#16151a] font-medium">Posters, Packaging, Brand Guidelines, Dielines</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* TOOLKIT — GlassIcons, adapted from react-bits in the site's ink/paper/signal-red palette */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-widest font-bold text-[#16151a] uppercase">
                  [03_THE_TOOLKIT]
                </span>
                <span className="h-px flex-grow bg-[#16151a]/10" />
                <span className="font-mono text-[8px] text-[#8a8790] uppercase tracking-widest">6 daily drivers</span>
              </div>
              <GlassIcons
                items={[
                  { icon: <Aperture size={18} />, label: 'Lightroom', sub: 'Photography', tone: 'red' },
                  { icon: <Clapperboard size={18} />, label: 'Premiere Pro', sub: 'Cinematography', tone: 'ink' },
                  { icon: <PenTool size={18} />, label: 'Illustrator', sub: 'Vector & Brand', tone: 'red' },
                  { icon: <ImageIcon size={18} />, label: 'Photoshop', sub: 'Compositing', tone: 'ink' },
                  { icon: <Layers size={18} />, label: 'InDesign', sub: 'Layout', tone: 'red' },
                  { icon: <Figma size={18} />, label: 'Figma', sub: 'Prototyping', tone: 'ink' },
                ]}
              />
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <ActionFooterButton
                onClick={() => onNavigateSection('observed')}
                eyebrow="EXHIBIT I & II"
                label="THE OBSERVED WORLD"
                variant="red"
              />
              <ActionFooterButton
                onClick={() => onNavigateSection('constructed')}
                eyebrow="EXHIBIT III"
                label="THE CONSTRUCTED WORLD"
                variant="ink"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function ActionFooterButton({
  onClick,
  eyebrow,
  label,
  variant,
}: {
  onClick: () => void;
  eyebrow: string;
  label: string;
  variant: 'red' | 'ink';
}) {
  const magneticRef = useMagnetic<HTMLButtonElement>(0.15);
  const borderHover = variant === 'red' ? 'hover:border-[#b3122a]/35' : 'hover:border-[#16151a]/35';
  const textHover = variant === 'red' ? 'group-hover:text-[#b3122a]' : 'group-hover:text-[#16151a]';
  return (
    <button
      ref={magneticRef}
      onClick={onClick}
      data-cursor="link"
      className={`magnetic-target flex items-center justify-between px-6 py-4 rounded-xl border border-[#16151a]/10 ${borderHover} transition-all group bg-white swastik-elevated text-left sm:flex-1`}
    >
      <div>
        <span className="font-mono text-[8px] text-[#4a4852] block">{eyebrow}</span>
        <span className={`font-sans text-xs font-bold text-[#16151a] uppercase transition-colors ${textHover}`}>
          {label}
        </span>
      </div>
      <ArrowRight size={14} className={`text-[#4a4852] ${textHover} group-hover:translate-x-1 transition-all`} />
    </button>
  );
}
