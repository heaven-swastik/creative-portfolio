import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HeroIntro from './components/HeroIntro';
import ObservedWorld from './components/ObservedWorld';
import ConstructedWorld from './components/ConstructedWorld';
import ContactSection from './components/ContactSection';
import AboutSection from './components/AboutSection';
import ApertureCursor from './components/ApertureCursor';
import CinematicTransition, { CinematicTransitionHandle } from './components/CinematicTransition';
import { GuideProvider, useGuide } from './components/GuideCompanion';
import { audio } from './components/AudioEngine';
import { Compass, Camera, Home, Mail, Sparkles } from 'lucide-react';

type Screen = 'intro' | 'observed' | 'constructed' | 'contact' | 'about';

// Baseline curator commentary for arriving on each screen. More specific
// commentary (e.g. switching photography/cinematography tabs) is layered
// on top of this from within the screens themselves via useGuide().
const SCREEN_GUIDE_LINES: Record<Screen, string> = {
  intro: "Welcome to Still Frames. I'm your curator for the tour — scroll or tap the dial to bring the first exhibit into focus.",
  about: "This is Swastik's dossier — his story, philosophy, and toolkit. Use the quick-nav here to step straight into an exhibit.",
  observed: "You're inside The Observed. Drag the Lens Curve to spin through the photography, or switch tabs above for the cinematography reel.",
  constructed: "Welcome to The Constructed — graphic design case studies, grouped by project type. Tap any piece to open its full case file.",
  contact: "You've reached the end of the tour. Leave a message here, or watch the credits roll while you decide where to go next.",
};

export default function App() {
  return (
    <GuideProvider>
      <AppShell />
    </GuideProvider>
  );
}

function AppShell() {
  const [activeScreen, setActiveScreen] = useState<Screen>('intro');
  const [isSoundActive, setIsSoundActive] = useState(false);
  const transitionRef = useRef<CinematicTransitionHandle>(null);
  const { say } = useGuide();

  // Every time the visitor lands on a new screen, the curator opens with
  // a baseline line of commentary for that space.
  useEffect(() => {
    say(SCREEN_GUIDE_LINES[activeScreen]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeScreen]);

  // Synchronise sound toggles
  const handleToggleSound = () => {
    const isNowOn = audio.toggleSound();
    setIsSoundActive(isNowOn);
  };

  // Navigate with a cinematic shutter-wipe cut between screens
  const goTo = (target: Screen) => {
    if (target === activeScreen) return;
    transitionRef.current?.play(() => setActiveScreen(target));
  };

  const handleEnterSection = (section: 'observed' | 'constructed') => {
    goTo(section);
  };

  const isHome = activeScreen === 'intro';

  // Listen to keyboard shortcuts (e.g. Esc to exit lightbox modals or return home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeScreen !== 'intro') {
          audio.playLensDial();
          goTo('intro');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen]);

  return (
    <div className="relative min-h-screen swastik-aura-bg text-[#16151a] overflow-x-hidden">
      {/* Cinematic Film Grain & editorial Vignette */}
      <div className="grain-overlay" />
      <div className="camera-lens-vignette" />
      <div className="lens-glare" />

      {/* Visual Cursor overlay */}
      <ApertureCursor />

      {/* Shutter-wipe cinematic screen transition */}
      <CinematicTransition ref={transitionRef} />

      {/* Screen swap */}
      <AnimatePresence mode="wait">
        {activeScreen === 'intro' && (
          <motion.div
            key="screen-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HeroIntro
              onEnterSection={handleEnterSection}
              isSoundActive={isSoundActive}
              onToggleSound={handleToggleSound}
            />
          </motion.div>
        )}

        {activeScreen === 'about' && (
          <motion.div
            key="screen-about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AboutSection
              onBackToHome={() => goTo('intro')}
              onNavigateSection={(section) => goTo(section)}
            />
          </motion.div>
        )}

        {activeScreen === 'observed' && (
          <motion.div
            key="screen-observed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ObservedWorld onBackToHome={() => goTo('intro')} onNavigateToGraphics={() => goTo('constructed')} />
          </motion.div>
        )}

        {activeScreen === 'constructed' && (
          <motion.div
            key="screen-constructed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ConstructedWorld onBackToHome={() => goTo('intro')} />
          </motion.div>
        )}

        {activeScreen === 'contact' && (
          <motion.div
            key="screen-contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ContactSection onRestartExperience={() => goTo('intro')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY FLOATING CREATIVE NAVIGATION RAIL (Present on all screens except initial intro) */}
      <AnimatePresence>
        {activeScreen !== 'intro' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 200, delay: 0.3 }}
            className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <nav className="flex items-center gap-1 md:gap-1.5 bg-white/85 border border-[#16151a]/10 rounded-full px-3 md:px-4 py-2 md:py-2.5 shadow-[0_20px_50px_rgba(22,21,26,0.14)] backdrop-blur-xl select-none">

              {/* Home / Lens Portal Gate */}
              <button
                onClick={() => {
                  audio.playLensDial();
                  goTo('intro');
                }}
                onMouseEnter={() => audio.playGearTick()}
                data-cursor="link"
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all duration-300 ${
                  isHome ? 'text-[#b3122a] bg-[#b3122a]/10' : 'text-[#4a4852] hover:text-[#16151a]'
                }`}
                id="rail-home-btn"
              >
                <Home size={11} />
                <span className="hidden md:inline">PORTAL</span>
              </button>

              <span className="text-[#16151a]/15 font-mono text-[9px]">|</span>

              {/* About Swastik dossier */}
              <button
                onClick={() => {
                  audio.playLensDial();
                  goTo('about');
                }}
                onMouseEnter={() => audio.playGearTick()}
                data-cursor="link"
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all duration-300 ${
                  activeScreen === 'about' ? 'text-[#b3122a] bg-[#b3122a]/10' : 'text-[#4a4852] hover:text-[#16151a]'
                }`}
                id="rail-about-btn"
              >
                <Sparkles size={11} />
                <span className="hidden md:inline">ABOUT</span>
              </button>

              <span className="text-[#16151a]/15 font-mono text-[9px]">|</span>

              {/* Exhibit I & II: The Observed */}
              <button
                onClick={() => {
                  audio.playLensDial();
                  goTo('observed');
                }}
                onMouseEnter={() => audio.playGearTick()}
                data-cursor="link"
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all duration-300 ${
                  activeScreen === 'observed' ? 'text-[#b3122a] bg-[#b3122a]/10' : 'text-[#4a4852] hover:text-[#16151a]'
                }`}
                id="rail-observed-btn"
              >
                <Camera size={11} />
                <span className="hidden md:inline">OBSERVED</span>
              </button>

              <span className="text-[#16151a]/15 font-mono text-[9px]">|</span>

              {/* Exhibit III: The Constructed */}
              <button
                onClick={() => {
                  audio.playLensDial();
                  goTo('constructed');
                }}
                onMouseEnter={() => audio.playGearTick()}
                data-cursor="link"
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all duration-300 ${
                  activeScreen === 'constructed' ? 'text-[#b3122a] bg-[#b3122a]/10' : 'text-[#4a4852] hover:text-[#16151a]'
                }`}
                id="rail-constructed-btn"
              >
                <Compass size={11} />
                <span className="hidden md:inline">CONSTRUCTED</span>
              </button>

              <span className="text-[#16151a]/15 font-mono text-[9px]">|</span>

              {/* Scene IV: Contact */}
              <button
                onClick={() => {
                  audio.playShutter();
                  goTo('contact');
                }}
                onMouseEnter={() => audio.playGearTick()}
                data-cursor="link"
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all duration-300 ${
                  activeScreen === 'contact' ? 'text-[#b3122a] bg-[#b3122a]/10' : 'text-[#4a4852] hover:text-[#16151a]'
                }`}
                id="rail-contact-btn"
              >
                <Mail size={11} />
                <span className="hidden md:inline">CONTACT</span>
              </button>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
