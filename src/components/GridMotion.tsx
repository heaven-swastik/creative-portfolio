import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface GridMotionProps {
  items?: (string | React.ReactNode)[];
  gradientColor?: string;
}

export default function GridMotion({
  items = [],
  gradientColor = 'black'
}: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split items into 5 columns
  const colsCount = 5;
  const distributedColumns: (string | React.ReactNode)[][] = Array.from({ length: colsCount }, () => []);
  
  items.forEach((item, idx) => {
    distributedColumns[idx % colsCount].push(item);
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cols = colRefs.current.filter((col): col is HTMLDivElement => col !== null);
    if (cols.length === 0) return;

    // We animate columns in opposite directions based on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();
      
      // Calculate normalized mouse positions (-0.5 to 0.5)
      const nx = (clientX / window.innerWidth) - 0.5;
      const ny = (clientY / window.innerHeight) - 0.5;

      cols.forEach((col, idx) => {
        // Odd columns move up/left, even columns move down/right
        const direction = idx % 2 === 0 ? 1 : -1;
        const xMove = nx * 50 * direction;
        const yMove = ny * 120 * direction;

        gsap.to(col, {
          x: xMove,
          y: yMove,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-transparent flex items-center justify-center py-20"
    >
      {/* 5-Column Grid */}
      <div className="grid grid-cols-5 gap-4 md:gap-8 w-[120%] h-[140%] -rotate-6 scale-110">
        {distributedColumns.map((colItems, colIdx) => (
          <div
            key={colIdx}
            ref={(el) => { colRefs.current[colIdx] = el; }}
            className="flex flex-col gap-4 md:gap-8 justify-center"
            style={{
              transform: `translateY(${colIdx % 2 === 0 ? '-10%' : '10%'})`
            }}
          >
            {colItems.map((item, itemIdx) => {
              const isUrl = typeof item === 'string' && (item.startsWith('http') || item.startsWith('/') || item.startsWith('data:'));
              return (
                <div
                  key={itemIdx}
                  className="aspect-[4/5] w-full rounded-lg md:rounded-xl overflow-hidden bg-white border border-[#16151a]/8 shadow-lg group flex items-center justify-center text-center p-4 relative"
                >
                  {isUrl ? (
                    <img
                      src={item as string}
                      alt={`Grid item ${colIdx}-${itemIdx}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-[#16151a] font-mono text-[10px] md:text-xs font-semibold leading-relaxed tracking-wider uppercase">
                      {item}
                    </div>
                  )}
                  {/* Subtle glass reflection hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Top and Bottom elegant fading overlay */}
      <div
        className="absolute top-0 left-0 w-full h-1/4 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, ${gradientColor} 0%, transparent 100%)`
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-1/4 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to top, ${gradientColor} 0%, transparent 100%)`
        }}
      />
      
      {/* Left and Right elegant fading overlay */}
      <div
        className="absolute top-0 left-0 h-full w-1/4 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to right, ${gradientColor} 0%, transparent 100%)`
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-1/4 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to left, ${gradientColor} 0%, transparent 100%)`
        }}
      />
    </div>
  );
}
