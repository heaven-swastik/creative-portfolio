import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface LiquidEtherProps {
  className?: string;
  /** CSS colors for each blob, in order. Defaults to the site's ink / signal-red / soft-red tones. */
  colors?: [string, string, string];
  /** How strongly blobs drift toward the cursor (0–1) */
  mouseForce?: number;
  /** Overall opacity of the liquid layer */
  intensity?: number;
}

/**
 * A soft, colored "liquid ether" backdrop — adapted from the react-bits
 * LiquidEther concept. The original is a WebGL fluid simulation tuned for a
 * dark violet/pink palette; that reads as loud against this site's
 * restrained "one red accent, no chrome" editorial system (see
 * index.css / PROJECT_MAP.md), so this version trades the fluid-dynamics
 * sim for a lightweight CSS "goo" blend of GSAP-driven blobs in the site's
 * own ink / signal-red tones — same organic liquid feel, on-brand color.
 * Uses gsap.quickTo for the cursor-follow, matching the pattern already
 * used in FlowingMenu.tsx elsewhere in this codebase.
 */
export default function LiquidEther({
  className = '',
  colors = ['#16151a', '#b3122a', '#d94a3a'],
  mouseForce = 0.4,
  intensity = 0.5,
}: LiquidEtherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setters = blobRefs.current.map((el) => {
      if (!el) return null;
      return {
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
      };
    });

    // Idle autonomous drift so the layer feels alive before any interaction
    const idleTweens = blobRefs.current.map((el, i) => {
      if (!el || prefersReduced) return null;
      return gsap.to(el, {
        x: `+=${60 + i * 25}`,
        y: `+=${-40 - i * 15}`,
        duration: 9 + i * 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    let raf = 0;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      raf = requestAnimationFrame(() => {
        setters.forEach((setter, i) => {
          if (!setter) return;
          const depth = (i + 1) * 40 * mouseForce;
          setter.x(relX * depth);
          setter.y(relY * depth);
        });
      });
    };

    if (!prefersReduced) {
      window.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(raf);
      idleTweens.forEach((t) => t?.kill());
    };
  }, [mouseForce]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: intensity }}
    >
      <div
        className="absolute inset-0"
        style={{ filter: 'blur(48px) contrast(18)', mixBlendMode: 'multiply' }}
      >
        <div
          ref={(el) => { blobRefs.current[0] = el; }}
          className="absolute rounded-full"
          style={{ width: 340, height: 340, left: '15%', top: '20%', background: colors[0], opacity: 0.55 }}
        />
        <div
          ref={(el) => { blobRefs.current[1] = el; }}
          className="absolute rounded-full"
          style={{ width: 280, height: 280, left: '55%', top: '35%', background: colors[1], opacity: 0.6 }}
        />
        <div
          ref={(el) => { blobRefs.current[2] = el; }}
          className="absolute rounded-full"
          style={{ width: 220, height: 220, left: '35%', top: '55%', background: colors[2], opacity: 0.55 }}
        />
      </div>
    </div>
  );
}
