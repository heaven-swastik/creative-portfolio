import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function ApertureCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'default' | 'view' | 'drag' | 'sound' | 'gate' | 'enter' | 'link'>('default');
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [bladeCount, setBladeCount] = useState(8);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable standard cursor on the page if desktop
    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (!isTouch) {
        setIsVisible(true);
        document.body.style.cursor = 'none';
      }
    };

    checkDevice();

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('[data-cursor]');
      
      if (interactiveEl) {
        setIsHovered(true);
        const type = interactiveEl.getAttribute('data-cursor') || 'default';
        setHoverType(type as any);
        
        // Vary aperture blade count based on hover items to create organic feedback
        if (type === 'gate') setBladeCount(6);
        else if (type === 'view') setBladeCount(9);
        else if (type === 'sound') setBladeCount(12);
        else setBladeCount(8);
      } else {
        setIsHovered(false);
        setHoverType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  // Scale calculations
  const cursorSize = isHovered ? (hoverType === 'gate' ? 90 : hoverType === 'sound' ? 64 : 80) : 32;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <motion.div
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
        className="relative flex items-center justify-center rounded-full border border-[#16151a]/25 bg-white/30 backdrop-blur-[1px] select-none"
      >
        {/* Dynamic Telemetry Coordinates */}
        {!isHovered && (
          <div className="absolute text-[8px] font-mono text-[#4a4852] tracking-widest whitespace-nowrap translate-y-6">
            Y.{Math.round(coords.y)} / X.{Math.round(coords.x)}
          </div>
        )}

        {/* Central Aperture Blades */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full text-[#b3122a] opacity-50 animate-spin-slow"
          style={{ animationDuration: isHovered ? '20s' : '40s' }}
        >
          {/* External Reticle Markers */}
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray={isHovered ? "4 4" : "1 12"} />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.2" />
          
          {/* Precision Crosshairs */}
          {isHovered && (
            <>
              <line x1="50" y1="2" x2="50" y2="10" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="90" x2="50" y2="98" stroke="currentColor" strokeWidth="0.5" />
              <line x1="2" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="0.5" />
              <line x1="90" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="0.5" />
            </>
          )}

          {/* Aperture Shutter Blades Simulation */}
          {Array.from({ length: bladeCount }).map((_, idx) => {
            const angle = (idx * 360) / bladeCount;
            return (
              <g key={idx} transform={`rotate(${angle} 50 50)`}>
                <line
                  x1="50"
                  y1="25"
                  x2="85"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="0.4"
                  opacity={isHovered ? 0.8 : 0.3}
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Cursor Center Core */}
        <motion.div
          animate={{
            scale: isHovered ? 0.3 : 1,
            backgroundColor: isHovered ? '#b3122a' : '#16151a',
          }}
          transition={{ type: 'tween', duration: 0.2 }}
          className="w-1.5 h-1.5 rounded-full"
        />

        {/* Hover Text Prompters inside Cursor */}
        {isHovered && (
          <div className="absolute text-[8px] font-mono font-medium text-[#16151a] uppercase tracking-widest text-center pointer-events-none">
            {hoverType === 'view' && 'VIEW'}
            {hoverType === 'drag' && 'DRAG'}
            {hoverType === 'sound' && 'SOUND'}
            {hoverType === 'gate' && 'ENTER'}
            {hoverType === 'enter' && 'FOCUS'}
            {hoverType === 'link' && 'GO'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
