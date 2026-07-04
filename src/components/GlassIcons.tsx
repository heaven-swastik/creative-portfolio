import { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface GlassIconItem {
  icon: ReactNode;
  label: string;
  /** Optional short sub-label, e.g. the tool/software name */
  sub?: string;
  /** 'red' uses the signal accent, 'ink' uses the near-black neutral tone */
  tone?: 'red' | 'ink';
}

interface GlassIconsProps {
  items: GlassIconItem[];
  className?: string;
}

/**
 * A frosted-glass tile grid. Adapted from the react-bits GlassIcons concept —
 * restyled in Swastik's editorial palette (paper / ink / one signal-red accent)
 * instead of the original's rainbow per-tile colors, to stay consistent with
 * the "one rich accent color, no chrome" rule in index.css.
 */
export default function GlassIcons({ items, className = '' }: GlassIconsProps) {
  return (
    <div className={`grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 ${className}`}>
      {items.map((item, idx) => {
        const isRed = (item.tone ?? (idx % 2 === 0 ? 'red' : 'ink')) === 'red';
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.05, ease: 'easeOut' }}
            whileHover={{ y: -6, scale: 1.04 }}
            className="group relative flex flex-col items-center gap-2 md:gap-3 rounded-2xl p-3 md:p-5 cursor-default select-none overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(22,21,26,0.08)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 1px 2px rgba(22,21,26,0.04), 0 14px 30px -14px rgba(22,21,26,0.18)',
            }}
          >
            {/* Glass sheen sweep on hover */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-y-4 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-700 ease-out"
            />

            <div
              className="relative z-10 flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{
                background: isRed ? 'rgba(179,18,42,0.10)' : 'rgba(22,21,26,0.06)',
                border: `1px solid ${isRed ? 'rgba(179,18,42,0.25)' : 'rgba(22,21,26,0.14)'}`,
                color: isRed ? '#b3122a' : '#16151a',
              }}
            >
              {item.icon}
            </div>

            <div className="relative z-10 text-center leading-tight">
              <div className="font-mono text-[8px] md:text-[9px] tracking-widest uppercase font-bold text-[#16151a]">
                {item.label}
              </div>
              {item.sub && (
                <div className="font-mono text-[7px] md:text-[8px] tracking-wider uppercase text-[#8a8790] mt-0.5">
                  {item.sub}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
