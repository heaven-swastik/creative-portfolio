import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X, Sparkles } from 'lucide-react';
import { audio } from './AudioEngine';

/**
 * GuideCompanion — a persistent "virtual tour curator" that floats across
 * every screen of the exhibition and narrates what the visitor is looking
 * at, the way a museum audio-guide would. Any component wrapped by
 * <GuideProvider> (mounted once in App.tsx) can call `useGuide().say(...)`
 * at a meaningful moment — a phase change, a tab switch, a modal opening —
 * to surface a new line of commentary. A soft chime marks each new line,
 * and the bubble can be minimized to a small badge that pulses when new
 * commentary is waiting.
 */

interface GuideContextValue {
  say: (message: string) => void;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function useGuide(): GuideContextValue {
  const ctx = useContext(GuideContext);
  if (!ctx) {
    // Safe no-op so a component can still call useGuide() even if it's
    // ever rendered outside the provider — never throws, just goes quiet.
    return { say: () => {} };
  }
  return ctx;
}

const WELCOME_MESSAGE =
  "Welcome to Still Frames. I'm your curator for the tour — scroll or tap the dial to bring the first exhibit into focus.";

export function GuideProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState(WELCOME_MESSAGE);
  const [displayed, setDisplayed] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const [pulse, setPulse] = useState(false);
  const typeTimer = useRef<number | null>(null);
  const lastMessageRef = useRef(message);

  const say = (next: string) => {
    if (!next || next === lastMessageRef.current) return;
    lastMessageRef.current = next;
    setMessage(next);
    audio.playGuideChime();
    setPulse(true);
  };

  // Typewriter-style reveal on every new message, matching the site's
  // "developing focus" motif rather than snapping text in instantly.
  useEffect(() => {
    if (typeTimer.current) window.clearInterval(typeTimer.current);
    setDisplayed('');
    let i = 0;
    typeTimer.current = window.setInterval(() => {
      i += 1;
      setDisplayed(message.slice(0, i));
      if (i >= message.length && typeTimer.current) {
        window.clearInterval(typeTimer.current);
        typeTimer.current = null;
      }
    }, 16);
    return () => {
      if (typeTimer.current) window.clearInterval(typeTimer.current);
    };
  }, [message]);

  const toggleCollapsed = () => {
    audio.playGearTick();
    setCollapsed((c) => !c);
    setPulse(false);
  };

  return (
    <GuideContext.Provider value={{ say }}>
      {children}

      <div className="fixed z-40 right-3 md:right-6 bottom-6 md:bottom-8 flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              key="guide-bubble"
              initial={{ opacity: 0, y: 14, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 8, scale: 0.97, filter: 'blur(2px)' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="pointer-events-auto mb-3 w-[74vw] max-w-[19rem] sm:max-w-xs bg-white/92 backdrop-blur-xl border border-[#16151a]/10 rounded-2xl rounded-br-sm shadow-[0_20px_50px_rgba(22,21,26,0.16)] px-4 py-3"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Compass size={11} className="text-[#b3122a]" />
                <span className="font-mono text-[8px] tracking-widest uppercase text-[#b3122a]">Your Curator</span>
              </div>
              <p className="font-sans text-[11px] md:text-xs leading-relaxed text-[#16151a] min-h-[2.4em]">
                {displayed}
                <span className="inline-block w-[2px] h-[1em] align-middle bg-[#b3122a]/50 ml-0.5 animate-pulse" />
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleCollapsed}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          data-cursor="sound"
          aria-label={collapsed ? 'Show tour guide' : 'Minimize tour guide'}
          id="guide-companion-toggle"
          className="pointer-events-auto relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#16151a] text-white flex items-center justify-center shadow-[0_10px_30px_rgba(22,21,26,0.32)] border border-white/10"
        >
          {collapsed ? <Sparkles size={16} /> : <X size={15} />}
          {pulse && collapsed && (
            <>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#b3122a] border-2 border-[#faf9f6] animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#b3122a] border-2 border-[#faf9f6]" />
            </>
          )}
        </motion.button>
      </div>
    </GuideContext.Provider>
  );
}

export default GuideProvider;
