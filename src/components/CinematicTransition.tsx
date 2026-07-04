import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

export interface CinematicTransitionHandle {
  /** Plays a shutter-wipe: covers the screen, fires `onCovered` at full coverage, then reveals. */
  play: (onCovered: () => void) => void;
}

/**
 * A full-viewport GSAP timeline that sweeps two editorial panels (ink + red)
 * across the screen like a camera shutter closing and reopening — used to
 * mask the state swap between exhibition screens for a seamless cinematic cut.
 */
const CinematicTransition = forwardRef<CinematicTransitionHandle>((_props, ref) => {
  const panelA = useRef<HTMLDivElement>(null);
  const panelB = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    play: (onCovered: () => void) => {
      setIsVisible(true);

      requestAnimationFrame(() => {
        if (!panelA.current || !panelB.current || !wrapper.current) {
          setIsVisible(false);
          onCovered();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            setIsVisible(false);
          },
        });

        gsap.set(wrapper.current, { pointerEvents: 'auto' });
        gsap.set([panelA.current, panelB.current], { xPercent: -100, force3D: true });

        tl.to(panelA.current, { xPercent: 0, duration: 0.42, ease: 'power4.inOut' })
          .to(panelB.current, { xPercent: 0, duration: 0.42, ease: 'power4.inOut' }, 0.06)
          .add(() => {
            onCovered();
          })
          .to(panelA.current, { xPercent: 100, duration: 0.5, ease: 'power4.inOut' }, '+=0.05')
          .to(panelB.current, { xPercent: 100, duration: 0.5, ease: 'power4.inOut' }, '<0.06')
          .set(wrapper.current, { pointerEvents: 'none' });
      });
    },
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={wrapper} className="fixed inset-0 z-[9995] overflow-hidden pointer-events-none" aria-hidden="true">
      <div ref={panelB} className="absolute inset-0 bg-[#16151a]" style={{ transform: 'translateX(-100%)' }} />
      <div ref={panelA} className="absolute inset-0 bg-[#b3122a]" style={{ transform: 'translateX(-100%)' }} />
    </div>
  );
});

CinematicTransition.displayName = 'CinematicTransition';

export default CinematicTransition;
