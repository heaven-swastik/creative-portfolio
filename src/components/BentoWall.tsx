interface BentoWallProps {
  children: React.ReactNode;
  className?: string;
  columns?: 'default' | 'wide';
}

/**
 * Pinterest-style masonry wall using native CSS columns — each child keeps
 * its natural aspect ratio and the browser packs them into balanced columns,
 * no measuring/JS layout pass needed. Children should set `break-inside-avoid`
 * (already applied here) and their own margin-bottom for gutter spacing.
 */
export default function BentoWall({ children, className = '', columns = 'default' }: BentoWallProps) {
  const columnClasses =
    columns === 'wide'
      ? 'columns-1 sm:columns-2 lg:columns-3'
      : 'columns-2 md:columns-3 lg:columns-4';

  return (
    <div className={`${columnClasses} gap-3 md:gap-5 ${className}`} style={{ columnFill: 'balance' }}>
      {children}
    </div>
  );
}

export function BentoWallItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-3 md:mb-5 break-inside-avoid ${className}`}>{children}</div>;
}
