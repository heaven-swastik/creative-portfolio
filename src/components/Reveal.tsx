import { useEffect, useRef, ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Vertical travel distance in px for the entrance */
  y?: number;
  /** Extra delay in seconds */
  delay?: number;
  /** Animate direct children with a stagger instead of the wrapper as a whole */
  stagger?: number;
  /** Scale-in amount (1 = no scale) */
  from?: number;
  as?: 'div' | 'section';
  once?: boolean;
}

/**
 * Wraps content and reveals it with a smooth GSAP ScrollTrigger-driven
 * fade + rise as it enters the viewport — the cinematic "developing print"
 * motion used throughout the exhibition to replace static content pop-in.
 */
export default function Reveal({
  children,
  className = '',
  y = 48,
  delay = 0,
  stagger = 0,
  from = 1,
  as = 'div',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger > 0 ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y, scale: from });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        stagger: stagger > 0 ? stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: once ? 'play none none none' : 'play none none reverse',
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, delay, stagger, from, once]);

  const Tag = as;
  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}

/** Refresh ScrollTrigger measurements — call after layout-affecting state changes (tab switches, etc). */
export function refreshScrollTrigger() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
