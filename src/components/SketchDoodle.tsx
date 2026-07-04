import { motion } from 'motion/react';

export type SketchVariant =
  | 'arrow-curl-down'
  | 'arrow-curl-left'
  | 'arrow-curl-right'
  | 'circle-scribble'
  | 'underline-squiggle'
  | 'star-burst'
  | 'crop-tag'
  | 'thumb-frame'
  | 'cross-mark';

interface SketchDoodleProps {
  variant: SketchVariant;
  className?: string;
  color?: string;
  strokeWidth?: number;
  animate?: boolean;
  delay?: number;
}

/**
 * Hand-rasterised, rough-sketch style SVG marks used across the exhibition
 * to give the "designer's notebook" annotation layer — imperfect curves,
 * slightly-off circles, marker arrows — the kind of thing you'd find
 * scribbled around a typographic composition sheet.
 */
export default function SketchDoodle({
  variant,
  className = '',
  color = 'currentColor',
  strokeWidth = 2,
  animate = true,
  delay = 0,
}: SketchDoodleProps) {
  const drawTransition = { duration: 1.1, delay, ease: [0.65, 0, 0.35, 1] as const };

  const wrap = (children: React.ReactNode, viewBox: string) => (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      {children}
    </svg>
  );

  const pathProps = (d: string) =>
    animate
      ? {
          d,
          stroke: color,
          strokeWidth,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: drawTransition,
        }
      : { d, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (variant) {
    case 'arrow-curl-down':
      return wrap(
        <>
          <motion.path {...pathProps('M6 4 C 2 22, 22 30, 16 50 C 12 62, 26 66, 24 74')} />
          <motion.path
            {...pathProps('M14 65 L 24 76 L 34 63')}
            transition={{ ...drawTransition, delay: delay + 0.6 }}
          />
        </>,
        '0 0 40 80'
      );

    case 'arrow-curl-left':
      return wrap(
        <>
          <motion.path {...pathProps('M74 8 C 40 6, 18 18, 20 34 C 21 44, 34 46, 30 54')} />
          <motion.path
            {...pathProps('M40 46 L 28 55 L 38 63')}
            transition={{ ...drawTransition, delay: delay + 0.6 }}
          />
        </>,
        '0 0 80 70'
      );

    case 'arrow-curl-right':
      return wrap(
        <>
          <motion.path {...pathProps('M6 8 C 40 6, 62 18, 60 34 C 59 44, 46 46, 50 54')} />
          <motion.path
            {...pathProps('M40 46 L 52 55 L 42 63')}
            transition={{ ...drawTransition, delay: delay + 0.6 }}
          />
        </>,
        '0 0 80 70'
      );

    case 'circle-scribble':
      return wrap(
        <motion.path
          {...pathProps(
            'M62 8 C 90 6, 112 24, 108 46 C 104 70, 76 82, 48 78 C 18 74, 2 52, 8 30 C 13 12, 38 2, 60 6 C 66 7, 70 10, 68 12'
          )}
        />,
        '0 0 116 84'
      );

    case 'underline-squiggle':
      return wrap(
        <motion.path
          {...pathProps('M2 10 C 20 2, 34 18, 52 8 C 70 -1, 84 16, 102 7 C 112 3, 118 6, 120 9')}
        />,
        '0 0 122 18'
      );

    case 'star-burst':
      return wrap(
        <>
          <motion.path {...pathProps('M20 2 L 20 38')} />
          <motion.path {...pathProps('M2 20 L 38 20')} transition={{ ...drawTransition, delay: delay + 0.1 }} />
          <motion.path {...pathProps('M7 7 L 33 33')} transition={{ ...drawTransition, delay: delay + 0.2 }} />
          <motion.path {...pathProps('M33 7 L 7 33')} transition={{ ...drawTransition, delay: delay + 0.3 }} />
        </>,
        '0 0 40 40'
      );

    case 'crop-tag':
      return wrap(
        <>
          <motion.path {...pathProps('M2 2 L 2 16 M 2 2 L 16 2')} />
          <motion.path {...pathProps('M58 2 L 58 16 M 58 2 L 44 2')} transition={{ ...drawTransition, delay: delay + 0.1 }} />
          <motion.path {...pathProps('M2 42 L 2 28 M 2 42 L 16 42')} transition={{ ...drawTransition, delay: delay + 0.2 }} />
          <motion.path {...pathProps('M58 42 L 58 28 M 58 42 L 44 42')} transition={{ ...drawTransition, delay: delay + 0.3 }} />
        </>,
        '0 0 60 44'
      );

    case 'thumb-frame':
      return wrap(
        <>
          <motion.path {...pathProps('M3 3 L 61 3 L 61 45 L 3 45 Z')} />
          <motion.path
            {...pathProps('M10 34 L 24 20 L 33 29 L 44 14 L 55 30')}
            transition={{ ...drawTransition, delay: delay + 0.4 }}
          />
          <motion.path
            {...pathProps('M46 12 m -4 0 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0')}
            transition={{ ...drawTransition, delay: delay + 0.3 }}
          />
        </>,
        '0 0 64 48'
      );

    case 'cross-mark':
      return wrap(
        <>
          <motion.path {...pathProps('M4 4 L 26 26')} />
          <motion.path {...pathProps('M26 4 L 4 26')} transition={{ ...drawTransition, delay: delay + 0.15 }} />
        </>,
        '0 0 30 30'
      );

    default:
      return null;
  }
}
