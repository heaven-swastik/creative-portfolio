import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  /** Sticky pin offset from the top of the viewport, in px */
  baseTop?: number;
  /** Extra px added to the pin offset per card, so each new card stacks slightly lower */
  itemStackOffset?: number;
}

/**
 * Vertically-stacking scroll cards — adapted from the react-bits ScrollStack
 * pattern. Each ScrollStackItem sticks near the top of the viewport as the
 * page scrolls; once the next card arrives, the previous one shrinks, dims,
 * and lifts slightly out of the way — built with GSAP ScrollTrigger to match
 * the animation approach already used elsewhere in this codebase (FlowingMenu,
 * Reveal) rather than introducing a second animation library.
 */
export default function ScrollStack({
  children,
  className = '',
  baseTop = 96,
  itemStackOffset = 18,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>('.scroll-stack-item'));
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        const top = baseTop + i * itemStackOffset;
        item.style.top = `${top}px`;
        item.style.zIndex = String(i + 10);

        if (i === items.length - 1) return;

        ScrollTrigger.create({
          trigger: item,
          start: 'top top',
          endTrigger: items[items.length - 1],
          end: 'top top',
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(item, {
              scale: 1 - p * 0.07,
              opacity: 1 - p * 0.6,
              y: -p * 24,
            });
          },
        });
      });
      ScrollTrigger.refresh();
    }, container);

    return () => ctx.revert();
  }, [baseTop, itemStackOffset]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}

export function ScrollStackItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="scroll-stack-item-track relative">
      <div className={`scroll-stack-item sticky ${className}`}>{children}</div>
    </div>
  );
}
