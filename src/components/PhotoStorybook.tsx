import { ImagePlus } from 'lucide-react';
import { PHOTOGRAPHY_EXHIBITION, PHOTO_STORY_CHAPTERS } from '../data';
import Reveal from './Reveal';

/**
 * The "page two" of Exhibit I — a slow, narrated read-through of a handful
 * of photographs, one full spread per photo, instead of another thumbnail
 * grid repeating what the 3D Lens Curve above it already shows.
 *
 * To add a page: see the big comment above PHOTO_STORY_CHAPTERS in data.ts.
 * That's the only file that needs editing — this component just renders
 * whatever's in that array, including empty "reserved" pages so the book
 * never looks unfinished.
 */
export default function PhotoStorybook() {
  return (
    <div className="space-y-4 md:space-y-6">
      {PHOTO_STORY_CHAPTERS.map((chapter, index) => {
        const photo = chapter.photoId
          ? PHOTOGRAPHY_EXHIBITION.find((p) => p.id === chapter.photoId)
          : undefined;
        const pageNumber = String(index + 1).padStart(2, '0');
        const imageFirst = index % 2 === 0;

        /* RESERVED / PLACEHOLDER PAGE — no photo attached yet */
        if (chapter.placeholder || !photo) {
          return (
            <Reveal key={chapter.id} y={36}>
              <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl md:rounded-3xl overflow-hidden border border-dashed border-[#8a8790]/40 bg-[#f2f0ea]/60">
                <div className="flex items-center justify-center min-h-[160px] md:min-h-[300px] p-8">
                  <div className="flex flex-col items-center gap-3 text-[#8a8790]">
                    <ImagePlus size={22} strokeWidth={1.5} />
                    <span className="font-mono text-[9px] tracking-widest uppercase">
                      PAGE {pageNumber} // RESERVED
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-12 flex flex-col justify-center gap-3">
                  {chapter.pullQuote && (
                    <p className="type-hand text-xl md:text-2xl text-[#8a8790] leading-tight">
                      {chapter.pullQuote}
                    </p>
                  )}
                  <p className="font-sans text-xs md:text-sm text-[#8a8790] leading-relaxed max-w-md">
                    {chapter.story}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        }

        /* REAL STORY PAGE */
        return (
          <Reveal key={chapter.id} y={48}>
            <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl md:rounded-3xl overflow-hidden bg-white border border-[#16151a]/8 swastik-elevated-lg">
              <div
                className={`relative aspect-[4/5] md:aspect-auto min-h-[260px] overflow-hidden ${
                  imageFirst ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 font-mono text-[9px] tracking-widest uppercase bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                  PAGE {pageNumber}
                </span>
                <span className="absolute top-4 right-4 font-mono text-[9px] tracking-widest uppercase bg-[#b3122a] text-white px-2.5 py-1 rounded-full">
                  {photo.category}
                </span>
              </div>

              <div
                className={`p-6 md:p-12 flex flex-col justify-center gap-4 md:gap-5 ${
                  imageFirst ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <span className="font-mono text-[9px] text-[#b3122a] tracking-widest uppercase">
                  {photo.caption}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#16151a] leading-[0.95]">
                  {photo.title}
                </h3>
                {chapter.pullQuote && (
                  <p className="type-hand text-2xl md:text-3xl text-[#16151a] leading-tight">
                    &ldquo;{chapter.pullQuote}&rdquo;
                  </p>
                )}
                <p className="font-sans text-xs md:text-sm text-[#4a4852] leading-relaxed max-w-md">
                  {chapter.story}
                </p>
                <div className="flex items-center gap-4 font-mono text-[9px] text-[#8a8790] pt-3 border-t border-[#16151a]/8">
                  <span>{photo.technicalSpecs.location}</span>
                  <span>{photo.technicalSpecs.year}</span>
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
