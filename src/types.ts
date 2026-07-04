export interface PhotographyArtwork {
  id: string;
  title: string;
  caption: string;
  description: string;
  imageUrl: string;
  category: 'architecture' | 'candid' | 'concert' | 'festival';
  technicalSpecs: {
    camera: string;
    lens: string;
    settings: string;
    location: string;
    year: string;
  };
}

export interface CinematicRelease {
  id: string;
  title: string;
  category: string;
  description: string;
  /** Actual playable source, hosted on Cloudinary (kept off-repo per Swastik's note — too large for GitHub). */
  videoUrl: string;
  /** Cloudinary-generated frame thumbnail derived from the source video (so_0 = first frame). */
  posterUrl: string;
  releaseCredits: {
    director: string;
    cinematography: string;
    /** Static fallback shown before the player reads real metadata from the file itself. */
    format: string;
  };
}

/**
 * One "page" of the Photography Storybook (Exhibit I). Each chapter tells
 * the story behind a single photograph in plain language. Leave `photoId`
 * and `story` empty (placeholder: true) to reserve a future page — see
 * PHOTO_STORY_CHAPTERS in data.ts for exactly where to add new ones.
 */
export interface StoryChapter {
  id: string;
  /** Must match a PhotographyArtwork.id from PHOTOGRAPHY_EXHIBITION above. Omit for a placeholder page. */
  photoId?: string;
  /** One short standout line, shown big — the "louder" line of the page. */
  pullQuote?: string;
  /** The 2-4 sentence story itself, written in plain, human language. */
  story: string;
  /** Marks an empty page reserved for a future photo + story. */
  placeholder?: boolean;
}

export type GraphicDesignCategory =
  | 'poster'
  | 'event'
  | 'calendar'
  | 'branding'
  | 'id-card'
  | 'apparel';

export interface GraphicDesignCase {
  id: string;
  title: string;
  category: string;
  concept: string;
  imageUrl: string;
  mockupType: GraphicDesignCategory;
  deliverables: string[];
  techStack: string[];
}
