import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PHOTOGRAPHY_EXHIBITION, CINEMATOGRAPHY_RELEASES } from '../data';
import { CinematicRelease } from '../types';
import { audio } from './AudioEngine';
import { Camera, Film, ArrowLeft, ArrowRight, Play, Pause, Orbit, BookOpen, Clock, RectangleHorizontal } from 'lucide-react';
import CircularGallery from './CircularGallery';
import PhotoStorybook from './PhotoStorybook';
import Reveal from './Reveal';
import SketchDoodle from './SketchDoodle';
import { useMagnetic } from '../hooks/useMagnetic';
import { useGuide } from './GuideCompanion';

interface ObservedWorldProps {
  onBackToHome: () => void;
  /** Sends the visitor straight to Exhibit III (Graphic Design) — wired to App.tsx's goTo('constructed'). */
  onNavigateToGraphics: () => void;
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
      id="back-to-portal-btn"
    >
      <ArrowLeft size={14} />
      <span>PORTAL_GATEWAYS</span>
    </button>
  );
}

/** Formats raw seconds into a real, non-fabricated mm:ss timestamp. */
function formatDuration(totalSeconds: number) {
  if (!isFinite(totalSeconds) || totalSeconds <= 0) return '—:—';
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Formats real pixel dimensions into a cinema-style aspect ratio, e.g. 1.78:1. */
function formatRatio(width: number, height: number) {
  if (!width || !height) return '—';
  return `${(width / height).toFixed(2)}:1`;
}

export default function ObservedWorld({ onBackToHome, onNavigateToGraphics }: ObservedWorldProps) {
  const [activeTab, setActiveTab] = useState<'photography' | 'cinematography'>('photography');
  const [activeMovie, setActiveMovie] = useState<CinematicRelease | null>(null);
  const [isPlayingMovie, setIsPlayingMovie] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [liveMeta, setLiveMeta] = useState<{ duration: string; ratio: string } | null>(null);
  const [playhead, setPlayhead] = useState({ current: 0, duration: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { say } = useGuide();
  const photographyItems = useMemo(
    () => PHOTOGRAPHY_EXHIBITION.map(photo => ({ image: photo.imageUrl, text: photo.title })),
    []
  );

  const handleTabChange = (tab: 'photography' | 'cinematography') => {
    audio.playLensDial();
    setActiveTab(tab);
    setActiveMovie(null);
    setIsPlayingMovie(false);
    say(
      tab === 'photography'
        ? 'Drag or scroll the Lens Curve to spin through every frame — keep going past the gallery for the full storybook.'
        : "You're in the cinematography reel. Press play on any release to step into the theatre."
    );
  };

  const openTheater = (movie: CinematicRelease) => {
    audio.playShutter();
    setActiveMovie(movie);
    setIsPlayingMovie(true);
    setIsPaused(false);
    setLiveMeta(null);
    setPlayhead({ current: 0, duration: 0 });
    say(`Now screening "${movie.title}" — press Esc or the close button to step back out of the theatre.`);
  };

  const closeTheater = () => {
    audio.playLensDial();
    setIsPlayingMovie(false);
    setActiveMovie(null);
  };

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setLiveMeta({
      duration: formatDuration(v.duration),
      ratio: formatRatio(v.videoWidth, v.videoHeight),
    });
    setPlayhead({ current: 0, duration: v.duration });
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setPlayhead({ current: v.currentTime, duration: v.duration });
  }, []);

  const togglePlayback = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPaused(false);
    } else {
      v.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#16151a] font-sans relative flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient overlays */}
      <div className="absolute inset-0 sketch-paper opacity-40 pointer-events-none z-0" />

      {/* FIXED NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#16151a]/8 px-5 md:px-8 py-5 md:py-6 flex items-center justify-between gap-4">
        <BackButton onBackToHome={onBackToHome} />

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 border border-[#16151a]/10 rounded-full shadow-sm">
          <button
            onClick={() => handleTabChange('photography')}
            className={`flex items-center gap-2 px-3.5 md:px-5 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'photography'
                ? 'bg-[#b3122a] text-white font-bold'
                : 'text-[#4a4852] hover:text-[#16151a]'
            }`}
            id="tab-photography"
          >
            <Camera size={11} />
            <span className="hidden sm:inline">EXHIBIT I // STILLS</span>
            <span className="sm:hidden">STILLS</span>
          </button>
          <button
            onClick={() => handleTabChange('cinematography')}
            className={`flex items-center gap-2 px-3.5 md:px-5 py-2 rounded-full font-mono text-[9px] tracking-widest uppercase transition-all duration-300 ${
              activeTab === 'cinematography'
                ? 'bg-[#b3122a] text-white font-bold'
                : 'text-[#4a4852] hover:text-[#16151a]'
            }`}
            id="tab-cinematography"
          >
            <Film size={11} />
            <span className="hidden sm:inline">EXHIBIT II // MOTION</span>
            <span className="sm:hidden">MOTION</span>
          </button>
        </div>

        {/* Technical Calibration Index */}
        <div className="font-mono text-[9px] text-[#8a8790] hidden md:block">
          ARCHIVE.REF // SF.EXHIBITION.2025
        </div>
      </header>

      {/* MAIN GALLERY CANVAS */}
      <main className="flex-grow w-full relative z-10 px-5 md:px-12 lg:px-20 py-10 md:py-16">
        <AnimatePresence mode="wait">
          {activeTab === 'photography' ? (
            /* PHOTOGRAPHY MUSEUM EXHIBITION — 3D LENS CURVE ONLY */
            <motion.div
              key="photography-pane"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10 md:space-y-14"
            >
              {/* Exhibit Label */}
              <Reveal className="max-w-3xl space-y-6">
                <div className="space-y-4 relative">
                  <span className="font-mono text-xs text-[#b3122a] tracking-widest uppercase block">
                    [EXHIBIT I] THE STILL IMAGE // OBSERVATIONAL STUDY
                  </span>
                  <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase leading-none relative w-fit">
                    Luminance &amp; Silence
                    <SketchDoodle
                      variant="underline-squiggle"
                      className="absolute -bottom-3 left-0 w-full h-3 text-[#b3122a]"
                      strokeWidth={2.5}
                    />
                  </h1>
                  <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed max-w-xl">
                    Thirteen frames from architecture studies, candid street moments, live concerts, and a festival procession. Spin the gallery below to see all of them, then scroll further down for the story behind a few.
                  </p>
                </div>

                {/* View mode badge — 3D Lens Curve is the sole experience */}
                <div className="flex items-center gap-2 bg-white p-1 pl-3 border border-[#16151a]/10 rounded-lg w-fit select-none">
                  <Orbit size={11} className="text-[#b3122a]" />
                  <span className="font-mono text-[9px] tracking-wider uppercase text-[#16151a] font-bold pr-2 py-1">
                    3D LENS CURVE
                  </span>
                </div>
              </Reveal>

              {/* IMMERSIVE 3D PARALLAX CIRCULAR GALLERY */}
              <div
                className="relative w-full h-[clamp(420px,62vh,760px)] border border-[#16151a]/10 rounded-2xl md:rounded-3xl overflow-hidden bg-white swastik-elevated flex items-center justify-center touch-pan-y"
                data-cursor="drag"
              >
                <CircularGallery
                  items={photographyItems}
                  bend={4}
                  textColor="#b3122a"
                  borderRadius={0.12}
                  scrollEase={0.08}
                  scrollSpeed={3}
                  font="bold 20px 'Space Mono', monospace"
                />

                {/* Navigation HUD */}
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 pointer-events-none font-mono text-[8px] md:text-[9px] text-[#4a4852] tracking-widest uppercase flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-md border border-[#16151a]/10 backdrop-blur-sm z-30 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-[#b3122a] rounded-full animate-pulse" />
                  <span className="hidden sm:inline">CLICK + DRAG OR WHEEL SCROLL TO SPIN LENS CHANNELS</span>
                  <span className="sm:hidden">DRAG OR SCROLL TO SPIN</span>
                </div>

                <div className="absolute top-4 md:top-6 right-4 md:right-6 pointer-events-none font-mono text-[8px] md:text-[9px] text-[#4a4852] tracking-widest uppercase bg-white/90 px-3 py-1.5 rounded-md border border-[#16151a]/10 backdrop-blur-sm z-30 shadow-sm">
                  PORTAL // 3D_PARALLAX_LENS
                </div>
              </div>

              {/* STORYBOOK — a slow, narrated read-through of a few frames, one full page each */}
              <div className="space-y-6 md:space-y-8 pt-4">
                <Reveal className="flex items-end justify-between gap-4 flex-wrap max-w-3xl relative">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790] flex items-center gap-2">
                      <BookOpen size={12} className="text-[#b3122a]" />
                      PAGE TWO
                    </span>
                    <h2 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-[#16151a]">
                      A Few Frames, Told Properly
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-[#4a4852] max-w-xl leading-relaxed">
                      Not every photo needs an explanation, but a few of these have one worth reading. New pages get added here as more photos earn a story.
                    </p>
                  </div>
                  <span className="type-hand text-lg text-[#b3122a] rotate-[-4deg] hidden md:block">
                    turn the page ↓
                  </span>
                </Reveal>

                <PhotoStorybook />
              </div>
            </motion.div>
          ) : (
            /* CINEMATOGRAPHY NEOTHEATER */
            <motion.div
              key="cinematography-pane"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16 md:space-y-24"
            >
              {/* Cinema Header */}
              <Reveal className="max-w-3xl space-y-4">
                <span className="font-mono text-xs text-[#b3122a] tracking-widest uppercase">
                  [EXHIBIT II] THE MOVING IMAGE // SHORT THEATRICALS
                </span>
                <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase leading-none">
                  Anamorphic Horizons
                </h1>
                <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed max-w-xl">
                  Four real releases — a student suspense short, an experimental cinematic journey, and two travel films — hosted and streamed directly from Cloudinary. Runtime and projection ratio below are read live from each file, not typed in by hand.
                </p>
              </Reveal>

              {/* FILM RELEASES SHOWCASE */}
              <div className="space-y-12 md:space-y-16">
                {CINEMATOGRAPHY_RELEASES.map((movie, index) => (
                  <Reveal key={movie.id} y={40}>
                    <div className="border border-[#16151a]/10 rounded-2xl bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:border-[#b3122a]/25 transition-all duration-500 swastik-elevated">
                      {/* Film Still Poster (Left 7 Columns) */}
                      <div
                        onClick={() => openTheater(movie)}
                        data-cursor="view"
                        className="lg:col-span-7 aspect-video relative group overflow-hidden cursor-pointer bg-black"
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/60 flex items-center justify-center bg-black/50 group-hover:border-[#b3122a] group-hover:scale-110 transition-all duration-500">
                            <Play className="text-white group-hover:text-[#b3122a] fill-white group-hover:fill-[#b3122a] translate-x-0.5 transition-colors" size={22} />
                          </div>
                        </div>
                        {/* Letterbox Bars overlays */}
                        <div className="absolute top-0 left-0 right-0 h-3 md:h-4 bg-black pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 h-3 md:h-4 bg-black pointer-events-none" />
                      </div>

                      {/* Film Meta (Right 5 Columns) */}
                      <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between h-full space-y-6 md:space-y-8">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-[#b3122a] tracking-wider uppercase bg-[#b3122a]/5 px-2.5 py-0.5 rounded border border-[#b3122a]/20">
                              {movie.category}
                            </span>
                            <span className="font-mono text-[9px] text-[#8a8790]">
                              RELE.0{index + 1}
                            </span>
                          </div>

                          <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#16151a]">
                            {movie.title}
                          </h2>

                          <p className="font-sans text-xs text-[#4a4852] leading-relaxed">
                            {movie.description}
                          </p>
                        </div>

                        {/* Credits block */}
                        <div className="border-t border-[#16151a]/8 pt-5 md:pt-6 space-y-4">
                          <div className="grid grid-cols-2 gap-y-3 gap-x-2 font-mono text-[10px]">
                            <div>
                              <span className="text-[#8a8790] block uppercase text-[8px]">DIRECTED BY</span>
                              <span className="text-[#16151a] font-semibold">{movie.releaseCredits.director}</span>
                            </div>
                            <div>
                              <span className="text-[#8a8790] block uppercase text-[8px]">CINEMATOGRAPHY</span>
                              <span className="text-[#16151a] font-semibold">{movie.releaseCredits.cinematography}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[#8a8790] block uppercase text-[8px]">FORMAT</span>
                              <span className="text-[#b3122a] font-semibold">{movie.releaseCredits.format}</span>
                            </div>
                          </div>

                          {/* Launch Button */}
                          <button
                            onClick={() => openTheater(movie)}
                            className="w-full py-3 bg-[#16151a] hover:bg-[#b3122a] text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                            id={`play-movie-btn-${movie.id}`}
                          >
                            <Play size={11} fill="currentColor" />
                            <span>LAUNCH THEATRICAL PREVIEW</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* CONTINUE TO GRAPHIC DESIGN */}
              <Reveal className="pt-6 md:pt-10 flex flex-col items-center gap-4 text-center border-t border-[#16151a]/8">
                <span className="font-mono text-[9px] tracking-widest uppercase text-[#8a8790]">
                  NEXT UP
                </span>
                <h3 className="font-sans text-lg md:text-xl font-black uppercase tracking-tight text-[#16151a]">
                  See the graphic design work next
                </h3>
                <button
                  onClick={() => {
                    audio.playShutter();
                    onNavigateToGraphics();
                  }}
                  data-cursor="link"
                  className="group flex items-center gap-2 px-6 py-3 bg-[#16151a] hover:bg-[#b3122a] text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-full transition-colors duration-300"
                  id="cinema-to-graphics-btn"
                >
                  <span>Exhibit III // Graphic Design</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FULLSCREEN THEATER MODAL — real playable video, real metadata read live from the file */}
      <AnimatePresence>
        {activeMovie && isPlayingMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col justify-between p-4 md:p-12 select-none"
          >
            {/* Widescreen Matte Bars */}
            <div className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-10 border-b border-white/5 flex items-center justify-between px-5 md:px-16">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] md:text-[10px] text-[#8a8790]">
                  PROJECTION RATIO // {liveMeta?.ratio ?? 'READING...'}
                </span>
                <span className="px-2 py-0.5 rounded bg-red-600/15 text-red-500 font-mono text-[8px] font-bold">● LIVE</span>
              </div>
              <button
                onClick={closeTheater}
                className="font-mono text-[9px] md:text-[10px] text-[#8a8790] hover:text-[#d94a3a] border border-white/15 rounded px-3 md:px-4 py-1.5 bg-neutral-900 cursor-pointer"
              >
                CLOSE CINEMATIQUE
              </button>
            </div>

            {/* Active Cinema Projection Block — real <video> playback */}
            <div className="flex-grow flex items-center justify-center relative bg-black overflow-hidden m-2 md:m-8 border border-white/5 rounded-lg shadow-2xl">
              <video
                key={activeMovie.id}
                ref={videoRef}
                src={activeMovie.videoUrl}
                poster={activeMovie.posterUrl}
                autoPlay
                controls
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPaused(false)}
                onPause={() => setIsPaused(true)}
                className="w-full h-full object-contain bg-black"
              />
            </div>

            {/* Bottom Timeline Bar — real playhead / duration, not scripted */}
            <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-10 border-t border-white/5 flex items-center justify-between px-5 md:px-16">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  className="p-2 border border-white/15 rounded-full text-white hover:text-[#d94a3a] bg-neutral-900/60"
                  onClick={togglePlayback}
                >
                  {isPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>
                <div className="flex flex-col">
                  <span className="font-sans text-xs font-semibold uppercase text-neutral-200">{activeMovie.title}</span>
                  <span className="font-mono text-[9px] text-[#8a8790]">{activeMovie.category}</span>
                </div>
              </div>

              <div className="flex-grow max-w-md mx-8 relative h-1 bg-neutral-800 rounded-full overflow-hidden hidden md:block">
                <div
                  className="absolute top-0 bottom-0 left-0 bg-[#d94a3a]"
                  style={{ width: `${playhead.duration ? (playhead.current / playhead.duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center gap-4 md:gap-6 font-mono text-[9px] text-[#8a8790]">
                <span className="hidden sm:inline flex items-center gap-1">
                  <Clock size={9} />
                  {formatDuration(playhead.current)} / {liveMeta?.duration ?? '—:—'}
                </span>
                <span className="text-[#d94a3a] flex items-center gap-1">
                  <RectangleHorizontal size={9} />
                  {liveMeta?.ratio ?? '—'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER METRIC BANNER */}
      <footer className="border-t border-[#16151a]/8 bg-[#faf9f6] px-5 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#8a8790] font-mono text-[9px]">
        <div>EXHIBITION PANEL 01 // PHOTOGRAPHY &amp; MOTION SYSTEMS</div>
        <div className="flex items-center gap-2 text-[#b3122a]">
          <span className="animate-pulse">●</span>
          <span>STILL FRAMES HIGH-FIDELITY PREVIEW SERVICE ACTIVE</span>
        </div>
        <div>STORYTELLING // OBSERVED.WORLD</div>
      </footer>
    </div>
  );
}
