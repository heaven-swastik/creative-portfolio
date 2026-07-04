import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items: MenuItem[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onItemClick?: (index: number) => void;
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#16151a',
  bgColor = '#faf9f6',
  marqueeBgColor = '#b3122a',
  marqueeTextColor = '#ffffff',
  borderColor = 'rgba(22, 21, 26, 0.12)',
  onItemClick
}: FlowingMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverImgRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const hoverImg = hoverImgRef.current;
    if (!container || !hoverImg) return;

    // Mouse positioning
    const mouse = { x: 0, y: 0 };
    let lastX = 0;

    const updateMousePos = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    container.addEventListener('mousemove', updateMousePos);

    // Quick set positions
    const setX = gsap.quickTo(hoverImg, 'x', { duration: 0.4, ease: 'power3.out' });
    const setY = gsap.quickTo(hoverImg, 'y', { duration: 0.4, ease: 'power3.out' });
    const setRotation = gsap.quickTo(hoverImg, 'rotation', { duration: 0.4, ease: 'power3.out' });

    // Animation loop for follow and velocity rotation
    const ticker = () => {
      const velocity = mouse.x - lastX;
      const rot = gsap.utils.clamp(-15, 15, velocity * 0.3);
      
      setX(mouse.x);
      setY(mouse.y);
      setRotation(rot);
      
      lastX = mouse.x;
    };

    gsap.ticker.add(ticker);

    // Menu items interactivity
    const menuItems = container.querySelectorAll('.flowing-menu-item');
    menuItems.forEach((item) => {
      const marquee = item.querySelector('.flowing-marquee-wrapper');
      const innerText = item.querySelector('.flowing-item-inner');
      const itemImg = item.getAttribute('data-image') || '';

      const onEnter = () => {
        if (imgRef.current && itemImg) {
          imgRef.current.src = itemImg;
        }
        
        // Animate image container scaling in
        gsap.to(hoverImg, { opacity: 1, scale: 1, duration: 0.3, overwrite: 'auto' });
        
        // Hover effects on the menu item itself
        if (marquee) {
          gsap.to(marquee, { opacity: 1, scaleY: 1, duration: 0.3, ease: 'power2.out' });
        }
        if (innerText) {
          gsap.to(innerText, { y: -5, opacity: 0.3, duration: 0.3 });
        }
      };

      const onLeave = () => {
        // Animate image container scaling out
        gsap.to(hoverImg, { opacity: 0, scale: 0.5, duration: 0.3, overwrite: 'auto' });
        
        if (marquee) {
          gsap.to(marquee, { opacity: 0, scaleY: 0, duration: 0.3, ease: 'power2.in' });
        }
        if (innerText) {
          gsap.to(innerText, { y: 0, opacity: 1, duration: 0.3 });
        }
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
    });

    return () => {
      container.removeEventListener('mousemove', updateMousePos);
      gsap.ticker.remove(ticker);
    };
  }, [items]);

  // Handle repeated text marquee animation
  useEffect(() => {
    const marquees = containerRef.current?.querySelectorAll('.flowing-marquee-inner');
    const timelines: any[] = [];

    marquees?.forEach((m) => {
      const w = m.querySelector('.flowing-marquee-content');
      if (w) {
        // Find half size since we repeat text
        const totalWidth = w.clientWidth / 2;
        const tl = gsap.to(w, {
          x: `-=${totalWidth}`,
          ease: 'none',
          duration: speed,
          repeat: -1
        });
        timelines.push(tl);
      }
    });

    return () => {
      timelines.forEach((tl) => tl.kill());
    };
  }, [items, speed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-center overflow-hidden border-t select-none"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      {/* Absolute image overlay following the mouse */}
      <div
        ref={hoverImgRef}
        className="pointer-events-none absolute left-0 top-0 z-50 w-[240px] h-[160px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md shadow-[0_20px_45px_rgba(22,21,26,0.35)] opacity-0 scale-50 border border-white/40"
        style={{ transformOrigin: 'center center' }}
      >
        <img
          ref={imgRef}
          src=""
          alt="Preview"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <nav className="w-full flex flex-col divide-y" style={{ borderColor: borderColor }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flowing-menu-item relative flex items-center justify-between py-6 md:py-8 px-6 md:px-12 cursor-pointer overflow-hidden transition-colors"
            data-image={item.image}
            style={{ borderColor: borderColor }}
          >
            {/* Background Marquee layer (reveals on hover) */}
            <div
              className="flowing-marquee-wrapper absolute inset-0 opacity-0 scale-y-0 origin-bottom pointer-events-none flex items-center overflow-hidden transition-all duration-300"
              style={{ backgroundColor: marqueeBgColor, color: marqueeTextColor }}
            >
              <div className="flowing-marquee-inner flex whitespace-nowrap py-4 w-full">
                <div className="flowing-marquee-content flex gap-8 whitespace-nowrap text-xl md:text-3xl font-bold tracking-tight uppercase leading-none">
                  {/* Repeated items for infinite loop scroll */}
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="flex items-center gap-4">
                      {item.text}
                      <span className="text-sm opacity-50">•</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Static display text (visible by default, shifts up on hover) */}
            <a
              href={item.link}
              className="flowing-item-inner w-full flex items-center justify-between text-left relative z-10 select-none"
              style={{ color: textColor }}
              onClick={(e) => {
                e.preventDefault();
                onItemClick?.(idx);
              }}
            >
              <span className="text-lg md:text-2xl font-mono tracking-wider uppercase font-medium">
                {item.text}
              </span>
              <span className="font-mono text-[9px] md:text-xs text-[#8a8790] tracking-widest">
                [0{idx + 1}_STATION]
              </span>
            </a>
          </div>
        ))}
      </nav>
    </div>
  );
}
