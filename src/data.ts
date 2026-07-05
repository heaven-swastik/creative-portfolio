import { PhotographyArtwork, CinematicRelease, GraphicDesignCase, StoryChapter } from './types';

/* ============================================================
   LOCAL IMAGE IMPORTS
   All imagery below is Swastik's own photography, film stills,
   and graphic design work (see /mnt "portfolio assets" source).
   Imported through Vite so they're hashed, optimized into the
   build, and get proper cache-busting — no remote stock photos.
   ============================================================ */

// Photography — Exhibit I
import architecture01 from './assets/images/photography/architecture-01.webp';
import architecture02 from './assets/images/photography/architecture-02.webp';
import captureMoment01 from './assets/images/photography/capture-moment-01.webp';
import captureMoment02 from './assets/images/photography/capture-moment-02.webp';
import captureMoment03 from './assets/images/photography/capture-moment-03.webp';
import captureMoment04 from './assets/images/photography/capture-moment-04.webp';
import captureMoment05 from './assets/images/photography/capture moment 5.webp';
import captureMoment06 from './assets/images/photography/capture moment 6.webp';
import captureMoment07 from './assets/images/photography/capture moment 7.webp';
import captureMoment08 from './assets/images/photography/capture moment 8.webp';
import captureMoment09 from './assets/images/photography/capture moment 9.webp';
import captureMoment10 from './assets/images/photography/capture moment 10.webp';
import captureMoment11 from './assets/images/photography/capture moment 11.webp';
import captureMoment12 from './assets/images/photography/capture moment 12.webp';
import concert01 from './assets/images/photography/concert-01.webp';
import concert02 from './assets/images/photography/concert-02.webp';
import concert03 from './assets/images/photography/concert-03.webp';
import concert04 from './assets/images/photography/concert-04.webp';
import concert05 from './assets/images/photography/concert-05.webp';
import concert06 from './assets/images/photography/concert-06.webp';
import concert07 from './assets/images/photography/concert 7.webp';
import concert08 from './assets/images/photography/concert 8.webp';
import concert09 from './assets/images/photography/concert 9.webp';
import concert10 from './assets/images/photography/concert 10.webp';
import ganeshaImmersion from './assets/images/photography/ganesha-immersion.webp';

// Graphic Design — Exhibit III
import brandingHeavensCafe from './assets/images/graphics/branding-heavens-cafe.webp';
import brandingEpiquench from './assets/images/graphics/branding-epiquench.webp';
import calendarFathersDay from './assets/images/graphics/calendar-fathers-day.webp';
import calendarNoTobaccoDay from './assets/images/graphics/calendar-no-tobacco-day.png';
import calendarSportsDay from './assets/images/graphics/calendar-sports-day.webp';
import calendarEducatorsDay from './assets/images/graphics/calendar-educators-day.webp';
import eventGenAiPractical from './assets/images/graphics/event-genai-practical.webp';
import eventCarouselCover from './assets/images/graphics/event-carousel-cover.webp';
import eventSummerOfCode from './assets/images/graphics/event-summer-of-code.webp';
import eventRegistrationClosing from './assets/images/graphics/event-registration-closing.webp';
import eventPhotographyCompetition from './assets/images/graphics/event-photography-competition.webp';
import idCardIeee from './assets/images/graphics/id-card-ieee.webp';
import idCardWorkshop from './assets/images/graphics/id-card-workshop.webp';
import posterFounderIntro01 from './assets/images/graphics/poster-founder-intro-01.webp';
import posterFounderIntro02 from './assets/images/graphics/poster-founder-intro-02.webp';
import posterSpeakerIntro from './assets/images/graphics/poster-speaker-intro.webp';
import posterCinemaReimagination from './assets/images/graphics/poster-cinema-reimagination.webp';
import apparelIeeeTee01 from './assets/images/graphics/apparel-ieee-tee-01.webp';
import apparelIeeeTee02 from './assets/images/graphics/apparel-ieee-tee-02.webp';
import posterc1 from './assets/images/graphics/poster-c1.webp';
import posterc2 from './assets/images/graphics/poster-c2.webp';
import posterc3 from './assets/images/graphics/poster-c3.webp';
import posterc4 from './assets/images/graphics/poster-c4.webp';
import posterc5 from './assets/images/graphics/poster-c5.webp';

export { default as heroPortrait } from './assets/images/hero/swastik-portrait.webp';

/* ============================================================
   EXHIBIT I — PHOTOGRAPHY
   Note: exact camera/lens/EXIF data wasn't available in the
   source assets, so technicalSpecs below use honest, general
   descriptors rather than invented gear. Swap in your real
   EXIF/location per shot whenever you have it — this is the
   only file you need to touch to update photography content.

   Every imported photography asset above is registered below —
   nothing imported is left unused. Newly added entries (previously
   imported but missing from the exhibition array) are marked
   with a comment so you can find and edit them quickly.
   ============================================================ */
export const PHOTOGRAPHY_EXHIBITION: PhotographyArtwork[] = [
  {
    id: 'photo-arch-01',
    title: 'Ascending Frame',
    caption: 'Interior Study, Spiral & Skylight',
    description: 'A study in interior architecture — stairwells and structural lines read as pure geometry once the eye stops looking for a destination and starts looking for the pattern.',
    imageUrl: architecture01,
    category: 'architecture',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Available Light • Handheld', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-arch-02',
    title: 'Concrete Horizon',
    caption: 'Structural Facade Study',
    description: 'An exterior composition built around hard lines and negative space — the built environment treated less like a building and more like a diagram.',
    imageUrl: architecture02,
    category: 'architecture',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Available Light • Handheld', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-01',
    title: 'Unscripted',
    caption: 'Documentary / Candid',
    description: 'Street and candid photography — no direction given, just a frame pulled from a moment that was already happening on its own.',
    imageUrl: captureMoment01,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-02',
    title: 'Passing Glance',
    caption: 'Documentary / Candid',
    description: 'A quick, observational frame — the kind of shot that rewards paying attention rather than posing for it.',
    imageUrl: captureMoment02,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-03',
    title: 'Quiet Interval',
    caption: 'Documentary / Candid',
    description: 'A held breath between events — the in-between moments that usually get edited out end up telling most of the story.',
    imageUrl: captureMoment03,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-04',
    title: 'Held Frame',
    caption: 'Documentary / Candid',
    description: 'A candid capture built around expression and timing over anything technical — reaction over composition.',
    imageUrl: captureMoment04,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  // --- newly registered: previously imported but unused ---
  {
    id: 'photo-candid-05',
    title: 'Sidelong',
    caption: 'Documentary / Candid',
    description: 'A frame caught from an angle rather than head-on — candid work often reads truer from the edges of a scene than dead center.',
    imageUrl: captureMoment05,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-06',
    title: 'Unposed',
    caption: 'Documentary / Candid',
    description: 'No direction, no second take — a moment shot exactly as it happened.',
    imageUrl: captureMoment06,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-07',
    title: 'In Passing',
    caption: 'Documentary / Candid',
    description: 'A street frame built on timing rather than setup — gone the instant after it was taken.',
    imageUrl: captureMoment07,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-08',
    title: 'Still, Briefly',
    caption: 'Documentary / Candid',
    description: 'A quiet beat pulled out of a busy scene — proof that not every candid shot needs motion to hold attention.',
    imageUrl: captureMoment08,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-09',
    title: 'Unrehearsed',
    caption: 'Documentary / Candid',
    description: 'Another frame from the same instinct as the rest of this series: camera ready, no cues given.',
    imageUrl: captureMoment09,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-10',
    title: 'Between Frames',
    caption: 'Documentary / Candid',
    description: 'The pause between two more obvious moments — often where the more honest expression lives.',
    imageUrl: captureMoment10,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-11',
    title: 'Caught Looking',
    caption: 'Documentary / Candid',
    description: 'A subject mid-glance, unaware of the frame being taken — the tension that makes candid work worth shooting.',
    imageUrl: captureMoment11,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-candid-12',
    title: 'Last Look',
    caption: 'Documentary / Candid',
    description: 'The closing frame of this candid set — same principle as the rest: observe first, shoot second.',
    imageUrl: captureMoment12,
    category: 'candid',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Prime Lens', settings: 'Natural Light', location: 'Kolkata, India', year: '2025' },
  },
  // --- end newly registered candid set ---
  {
    id: 'photo-concert-01',
    title: 'Stagelight Pulse',
    caption: 'Live Performance',
    description: 'Concert and stage photography — chasing the exact second the lighting rig and the performer\u2019s movement line up.',
    imageUrl: concert01,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-02',
    title: 'Crowd Current',
    caption: 'Live Performance',
    description: 'Wide-frame stage energy — the crowd and the light rig treated as one moving instrument.',
    imageUrl: concert02,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-03',
    title: 'Amber Haze',
    caption: 'Live Performance',
    description: 'Warm stage-light coverage — shooting for atmosphere as much as for a sharp, literal record of the set.',
    imageUrl: concert03,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-04',
    title: 'Front Row',
    caption: 'Live Performance',
    description: 'A tight performance frame from close to the stage, timed to the beat rather than the pose.',
    imageUrl: concert04,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-05',
    title: 'Encore',
    caption: 'Live Performance',
    description: 'Late-set stage photography — the energy in the room by that point in the show comes through in the light itself.',
    imageUrl: concert05,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-06',
    title: 'Live Wire',
    caption: 'Live Performance',
    description: 'A closing stage frame — motion blur and hard color used deliberately rather than corrected away.',
    imageUrl: concert06,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  // --- newly registered: previously imported but unused ---
  {
    id: 'photo-concert-07',
    title: 'Backlit',
    caption: 'Live Performance',
    description: 'A silhouette-driven stage frame — the rig behind the performer doing as much storytelling as the performer themselves.',
    imageUrl: concert07,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-08',
    title: 'Feedback',
    caption: 'Live Performance',
    description: 'A high-energy mid-set frame, shot for the noise and motion of the room as much as the performer on stage.',
    imageUrl: concert08,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-09',
    title: 'Spotlight Drift',
    caption: 'Live Performance',
    description: 'A frame built around a single moving light source crossing the stage.',
    imageUrl: concert09,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  {
    id: 'photo-concert-10',
    title: 'Last Chord',
    caption: 'Live Performance',
    description: 'The final frame from this stage set — closing on the same restless energy the whole series was shot for.',
    imageUrl: concert10,
    category: 'concert',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Telephoto / Fast Prime', settings: 'Low Light • High ISO', location: 'Kolkata, India', year: '2025' },
  },
  // --- end newly registered concert set ---
  {
    id: 'photo-festival-01',
    title: 'Immersion',
    caption: 'Festival Documentary — Ganesh Visarjan',
    description: 'Documentary coverage of a Ganesh idol immersion procession — dense, fast-moving, low-light festival photography shot on the move rather than staged.',
    imageUrl: ganeshaImmersion,
    category: 'festival',
    technicalSpecs: { camera: 'Digital Mirrorless', lens: 'Wide Prime', settings: 'Available Light • Handheld', location: 'Kolkata, India', year: '2025' },
  },
];

/* ============================================================
   PHOTOGRAPHY STOREY-BOOK — Exhibit I, "page two"
   This is the ONLY file you need to touch to add or change a
   storybook page. Each chapter below pairs with one photo from
   PHOTOGRAPHY_EXHIBITION above (matched by `photoId`).

   TO ADD A NEW PAGE:
   1. Add the photo itself to PHOTOGRAPHY_EXHIBITION above first
      (or reuse an existing id already in that array).
   2. Copy one of the chapter objects below, give it a new `id`,
      point `photoId` at the photo, and write your own `story`
      (2-4 sentences, plain language) and `pullQuote` (one short
      standout line).
   3. Leave `placeholder: true` chapters at the end as-is until
      you're ready to fill them — they render as empty "coming
      soon" pages so the book always looks intentional, never
      cut off.

   Component that renders this: components/ObservedWorld.tsx,
   search for "STORYBOOK".
/* ============================================================
   PHOTO_STORY_CHAPTERS: Deep Photographer's Perspective
   ============================================================ */
export const PHOTO_STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-01',
    photoId: 'photo-concert-07',
    pullQuote: 'The voice is invisible, but the gravity of it isn’t.',
    story: "In the middle of a screaming crowd, you don't look for a clean smile; you look for the exact moment a performer forgets the audience entirely. The neon microphone cuts through the darkness, but the real photograph is the visceral strain in her expression. It’s a raw, unshielded surrender to the sound—captured in a fraction of a second before the mood shifted.",
  },
  {
    id: 'chapter-02',
    photoId: 'photo-concert-02',
    pullQuote: 'Light doesn’t just illuminate; it isolates.',
    story: "Color can sometimes be a distraction when you’re trying to capture patience. Stripping this scene down to black and white allows the singular, piercing spotlight to cut its path through the dark, carving the bassist out of the background. It is a quiet study of absolute focus hidden right inside the chaos of a live set.",
  },
  {
    id: 'chapter-03',
    photoId: 'photo-concert-04',
    pullQuote: 'Sharpness is a technicality; blur is a feeling.',
    story: "If your shutter speed is too fast, you freeze the motion but kill the energy. By letting the frame bleed into a deliberate, kinetic drag, the musician becomes a ghost of pure movement. This isn't a portrait of a person—it is a visual representation of how heavy music actually feels when it passes straight through a human body.",
  },
  {
    id: 'chapter-04',
    photoId: 'photo-arch-01',
    pullQuote: 'The camera’s frame should never be the only frame.',
    story: "Architecture is permanent, but its relationship with light is entirely fleeting. By using the dark, severe silhouettes of the foreground structures to violently cage the pagoda, the eye is forced upward into the burning symmetry of the rooflines. It transforms a heavy, static monument into an intimate, fleeting confession between shadow and sky.",
  },
  {
    id: 'chapter-05',
    photoId: 'photo-candid-09',
    pullQuote: 'The ground we walk on holds the truest portraits.',
    story: "Faces are practiced at hiding things, but hands and feet rarely lie. Dropping the camera down to the dust of the pavement reveals an unwritten narrative of devotion and labor. The contrast between the weathered skin and the delicate, temporary white chalk art tells a deep story about creating beauty in spaces meant to be stepped on.",
  },
  {
    id: 'chapter-06',
    photoId: 'photo-candid-11',
    pullQuote: 'Eyes see, but shadows remember.',
    story: "Low-key lighting acts like a scalpel, carving out only what is absolutely necessary to understand a human soul. The heavy, textured detail of the skin and the quiet weight of the gaze through the window bars don't demand an explanation. As a photographer, you don't ask what he's looking at—you just let the silence fill the frame.",
  },
];

/* ============================================================
   EXHIBIT II — CINEMATOGRAPHY
   Real short films, hosted on Cloudinary per Swastik's note
   (source files are too large to check into the GitHub repo).
   Runtime and aspect ratio are intentionally NOT hardcoded —
   ObservedWorld reads them live off the actual video element
   once it loads, so the numbers shown are always accurate.
   ============================================================ */
const CLOUD_BASE = 'https://res.cloudinary.com/dxv2zl4me/video/upload';

function cloudinaryThumb(publicPath: string) {
  // Cloudinary generates a real frame grab when you request the same
  // delivery URL with an image extension — so_0 pins it to the first frame.
  return `${CLOUD_BASE}/so_0,q_auto,w_1200/${publicPath}.jpg`;
}

export const CINEMATOGRAPHY_RELEASES: CinematicRelease[] = [
  {
    id: 'cinema-who',
    title: 'WHO — We Hide Ourselves',
    category: 'Suspense Short Film',
    description: 'An official suspense short film produced with fellow IEM New Town / UEMK students — a slow-building narrative about the masks people wear, shot on location with a full student crew.',
    videoUrl: `${CLOUD_BASE}/v1783068906/WHO_-_We_Hide_Ourselves_Official_Suspense_Short_Film_Film_by_IEM_New_Town_Students_UEMK_-_Sattwik_Singha_Roy_1080p_u88mha.mp4`,
    posterUrl: cloudinaryThumb('v1783068906/WHO_-_We_Hide_Ourselves_Official_Suspense_Short_Film_Film_by_IEM_New_Town_Students_UEMK_-_Sattwik_Singha_Roy_1080p_u88mha'),
    releaseCredits: { director: 'Pallabi Roy', cinematography: 'Swastik Manna', format: 'Student Production • 1080p' },
  },
  {
    id: 'cinema-escaping-illusion',
    title: 'Escaping The Illusion',
    category: 'Cinematic Journey / Experimental',
    description: 'A cinematic journey produced under the Tech Of Craze banner — visual, mood-driven storytelling built around light, movement, and pace rather than dialogue.',
    videoUrl: `${CLOUD_BASE}/v1783068886/Escaping_The_Illusion_A_Cinematic_Journey_-_Tech_Of_Craze_1080p_asohqs.mp4`,
    posterUrl: cloudinaryThumb('v1783068886/Escaping_The_Illusion_A_Cinematic_Journey_-_Tech_Of_Craze_1080p_asohqs'),
    releaseCredits: { director: 'Swastik Manna', cinematography: 'Swastik Manna', format: 'Short Film • 1080p' },
  },
  {
    id: 'cinema-kalimpong',
    title: 'Kalimpong',
    category: 'Travel Film',
    description: 'A travel film shot in the hill town of Kalimpong, West Bengal — handheld coverage of the terraced hillsides, mist, and mountain light.',
    videoUrl: `${CLOUD_BASE}/v1783068894/kalimpong_mrqday.mp4`,
    posterUrl: cloudinaryThumb('v1783068894/kalimpong_mrqday'),
    releaseCredits: { director: 'Swastik Manna', cinematography: 'Swastik Manna', format: 'Travel Film' },
  },
  {
    id: 'cinema-varanasi',
    title: 'Varanasi',
    category: 'Travel Film',
    description: 'A travel film shot along the ghats of Varanasi — the ritual, the river, and the crowd captured as one continuous, unscripted scene.',
    videoUrl: `${CLOUD_BASE}/v1783068868/varanashi_-_vid_aimrd8.mp4`,
    posterUrl: cloudinaryThumb('v1783068868/varanashi_-_vid_aimrd8'),
    releaseCredits: { director: 'Swastik Manna', cinematography: 'Swastik Manna', format: 'Travel Film' },
  },
    {
    id: 'cinema-event',
    title: 'Treasure Hunt — Event Introduction',
    category: 'Event Film',
    description: 'A short event film produced for a college treasure hunt — a fast-paced, high-energy introduction to the event, shot on location with a student crew.',
    videoUrl: `${CLOUD_BASE}/v1783160520/reelsvideo.io_1783160166658_-_ROTATE_-_Videobolt.net_hqc2ho.mp4`,
    posterUrl: cloudinaryThumb('v1783160520/reelsvideo.io_1783160166658_-_ROTATE_-_Videobolt.net_hqc2ho'),
    releaseCredits: { director: 'Swastik Manna', cinematography: 'Swastik Manna', format: 'Event Film' },
  },
];

/* ============================================================
   EXHIBIT III — GRAPHIC DESIGN
   Sourced from the "graphics metadata.txt" brief notes.
   ============================================================ */
export const GRAPHIC_DESIGN_CASES: GraphicDesignCase[] = [
  {
    id: 'design-branding-heavens-cafe',
    title: "Heaven's Café & Kitchen",
    category: 'Brand Identity',
    concept: "A bold red-and-black identity for a café and restaurant — deliberately contrasting a soft, heavenly namesake against a heavy, high-contrast visual system.",
    imageUrl: brandingHeavensCafe,
    mockupType: 'branding',
    deliverables: ['Primary Logo Lockup', 'Signage & Menu Boards', 'Social Templates'],
    techStack: ['Adobe Illustrator', 'Adobe Photoshop'],
  },
  {
    id: 'design-branding-epiquench',
    title: 'EpiQuench',
    category: 'Brand Identity — Skincare',
    concept: 'A soft, calming identity for a skincare brand — gentle type, airy composition, and a restrained palette to match a client who wanted the visual system to feel as soft as the product itself.',
    imageUrl: brandingEpiquench,
    mockupType: 'branding',
    deliverables: ['Brand Mark', 'Packaging-Ready Layout', 'Color & Type System'],
    techStack: ['Adobe Illustrator', 'Figma'],
  },
  {
    id: 'design-calendar-fathers-day',
    title: "Father's Day Calendar",
    category: 'Editorial / Calendar Design',
    concept: "A calendar spread designed around Father's Day — warm, personal art direction built for a single-month feature page rather than a generic template.",
    imageUrl: calendarFathersDay,
    mockupType: 'calendar',
    deliverables: ['Print-Ready Calendar Spread'],
    techStack: ['Adobe Photoshop', 'Adobe InDesign'],
  },
  {
    id: 'design-calendar-no-tobacco-day',
    title: 'No Tobacco Day',
    category: 'Editorial / Awareness Design',
    concept: 'A calendar feature page marking World No Tobacco Day — public-health messaging paired with a clean, legible layout built to hold attention without shouting.',
    imageUrl: calendarNoTobaccoDay,
    mockupType: 'calendar',
    deliverables: ['Print-Ready Calendar Spread'],
    techStack: ['Adobe Photoshop', 'Adobe InDesign'],
  },
  {
    id: 'design-calendar-sports-day',
    title: 'Sports Day',
    category: 'Editorial / Calendar Design',
    concept: "A high-energy Sports Day calendar feature — dynamic typography and motion-implying layout to match the day it's celebrating.",
    imageUrl: calendarSportsDay,
    mockupType: 'calendar',
    deliverables: ['Print-Ready Calendar Spread'],
    techStack: ['Adobe Photoshop', 'Adobe InDesign'],
  },
    {
    id: 'design-calendar-educators-day',
    title: "Educator's Day Calendar",
    category: 'Editorial / Calendar Design',
    concept: "A calendar feature page for Educator's Day — a clean, respectful layout built to celebrate teachers and mentors without relying on cliches.",
    imageUrl: calendarEducatorsDay,
    mockupType: 'calendar',
    deliverables: ['Print-Ready Calendar Spread'],
    techStack: ['Adobe Photoshop', 'Adobe InDesign'],
  },
  {
    id: 'design-event-genai-practical',
    title: 'Gen AI Practical Session',
    category: 'Event Poster — GGSC',
    concept: 'A "future ready" themed poster for a hands-on Generative AI practical session — tech-forward visual language built to read instantly on a crowded notice board or social feed.',
    imageUrl: eventGenAiPractical,
    mockupType: 'event',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Illustrator', 'Adobe Photoshop'],
  },
  {
    id: 'design-event-carousel-cover',
    title: 'Event Carousel — Cover Page',
    category: 'Social Media Design',
    concept: 'The opening frame of a multi-slide Instagram carousel — designed to stop the scroll and set the visual tone for the slides that follow.',
    imageUrl: eventCarouselCover,
    mockupType: 'event',
    deliverables: ['Carousel Cover Slide', 'Slide Template System'],
    techStack: ['Adobe Illustrator', 'Canva'],
  },
  {
    id: 'design-event-summer-of-code',
    title: 'Summer of Code',
    category: 'Event Poster — Coding Bootcamp',
    concept: 'A poster for a coding bootcamp — built to communicate "hands-on, high-energy, beginner-friendly" at a glance for a technical student audience.',
    imageUrl: eventSummerOfCode,
    mockupType: 'event',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Illustrator', 'Adobe Photoshop'],
  },
  {
    id: 'design-event-registration-closing',
    title: 'Registrations Closing Soon',
    category: 'Event Poster — Anime Themed',
    concept: "An anime-styled urgency poster built to push last-minute event sign-ups — a playful illustration style chosen deliberately to stand out from the club's usual tech-poster language.",
    imageUrl: eventRegistrationClosing,
    mockupType: 'event',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Photoshop', 'Procreate'],
  },
  {
    id: 'design-event-photography-competition',
    title: 'Photography Competition',
    category: 'Event Poster',
    concept: 'A more contemplative, image-led poster for a photography competition — letting a single strong frame and restrained type carry the whole design.',
    imageUrl: eventPhotographyCompetition,
    mockupType: 'event',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Photoshop', 'Adobe Lightroom'],
  },
  {
    id: 'design-id-card-ieee',
    title: 'IEEE Membership ID Card',
    category: 'ID Card Design',
    concept: 'An official membership ID card layout for IEEE — clean grid, legible hierarchy, and print-safe bleed for physical card production.',
    imageUrl: idCardIeee,
    mockupType: 'id-card',
    deliverables: ['Front/Back ID Card Layout', 'Print-Ready Dieline'],
    techStack: ['Adobe Illustrator'],
  },
  {
    id: 'design-id-card-workshop',
    title: 'Workshop ID Card',
    category: 'ID Card Design',
    concept: 'A dedicated participant ID card designed for a workshop — built as its own visual system rather than a reused template.',
    imageUrl: idCardWorkshop,
    mockupType: 'id-card',
    deliverables: ['Front/Back ID Card Layout', 'Print-Ready Dieline'],
    techStack: ['Adobe Illustrator'],
  },
  {
    id: 'design-poster-founder-intro-01',
    title: 'Founder Intro Poster I',
    category: 'Event Poster — Speaker Series',
    concept: 'Part one of a founder-introduction poster pair — portrait-led layout built to introduce a speaker with authority ahead of a talk.',
    imageUrl: posterFounderIntro01,
    mockupType: 'poster',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Photoshop', 'Adobe Illustrator'],
  },
  {
    id: 'design-poster-founder-intro-02',
    title: 'Founder Intro Poster II',
    category: 'Event Poster — Speaker Series',
    concept: 'The companion piece to the first founder-intro poster — same system, second speaker, kept visually consistent as a set.',
    imageUrl: posterFounderIntro02,
    mockupType: 'poster',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Photoshop', 'Adobe Illustrator'],
  },
  {
    id: 'design-poster-speaker-intro',
    title: 'Speaker Introduction Poster',
    category: 'Event Poster — Speaker Series',
    concept: 'A speaker-introduction poster designed to carry credibility and clear session details in a single, confident layout.',
    imageUrl: posterSpeakerIntro,
    mockupType: 'poster',
    deliverables: ['Event Poster', 'Social Media Crop'],
    techStack: ['Adobe Photoshop', 'Adobe Illustrator'],
  },
  {
    id: 'design-poster-cinema-reimagination',
    title: 'Cinema Poster Reimagined',
    category: 'Poster Design — Reimagination Challenge',
    concept: 'An entry for a "reimagine a movie poster" design challenge — a fresh visual take on a well-known title, built entirely from original composition and typography.',
    imageUrl: posterCinemaReimagination,
    mockupType: 'poster',
    deliverables: ['Reimagined Movie Poster'],
    techStack: ['Adobe Photoshop'],
  },
  {
    id: 'design-apparel-ieee-tee-01',
    title: 'IEEE Club Tee I',
    category: 'Apparel Design',
    concept: 'A club apparel design for IEEE — graphic built to work at t-shirt scale and hold up in screen print.',
    imageUrl: apparelIeeeTee01,
    mockupType: 'apparel',
    deliverables: ['Front/Back Print Artwork', 'Screen-Print-Ready Files'],
    techStack: ['Adobe Illustrator'],
  },
  {
    id: 'design-apparel-ieee-tee-02',
    title: 'IEEE Club Tee II',
    category: 'Apparel Design',
    concept: 'A companion design in the same club apparel drop — kept consistent in system while offering a distinct graphic option.',
    imageUrl: apparelIeeeTee02,
    mockupType: 'apparel',
    deliverables: ['Front/Back Print Artwork', 'Screen-Print-Ready Files'],
    techStack: ['Adobe Illustrator'],
  },
  {
    id: 'design-poster-mind-bound',
    title: 'Mind Bound',
    category: 'Poster Design — Visual Concept',
    concept: 'A dark, psychological visual concept featuring bold red typography over a tape-wrapped silhouette, exploring the theme of mental entrapment and inner noise.',
    imageUrl: posterc1,
    mockupType: 'poster',
    deliverables: ['Conceptual Poster Design'],
    techStack: ['Adobe Photoshop'],
  },
  {
    id: 'design-poster-chernobyl',
    title: 'Chernobyl',
    category: 'Poster Design — Cinematic Tribute',
    concept: 'A gritty, atmospheric collaborative concept honoring the sacrifices of the 1986 disaster, blending an overgrown gas mask with a decaying nuclear powerplant backdrop.',
    imageUrl: posterc2,
    mockupType: 'poster',
    deliverables: ['Cinematic Poster Design'],
    techStack: ['Adobe Photoshop'],
  },
  {
    id: 'design-poster-think-free',
    title: 'Think Free',
    category: 'Poster Design — Brand Concept',
    concept: 'A minimalist, high-contrast propaganda-style poster designed for Veridian, utilizing puppet imagery and striking typography to provoke thought on self-determination.',
    imageUrl: posterc3,
    mockupType: 'poster',
    deliverables: ['Minimalist Graphic Poster'],
    techStack: ['Adobe Illustrator', 'Adobe Photoshop'],
  },
  {
    id: 'design-poster-glitters-gold',
    title: 'Not Everything That Glitters Is Gold',
    category: 'Poster Design — Mixed Media Collage',
    concept: 'A highly textured, editorial-style poster that pairs classical sculpture with bold paint slashes and halftone patterns to critique contemporary consumerism and pursuit of superficial value.',
    imageUrl: posterc4,
    mockupType: 'poster',
    deliverables: ['Mixed Media Style Poster'],
    techStack: ['Adobe Photoshop'],
  },
  {
    id: 'design-poster-swaranjali-live',
    title: 'Swaranjali Live — Special Sunday',
    category: 'Poster Design — Cultural Fusion & Digital Composition',
    concept: 'A majestic, highly stylized concert poster for an Indian fusion band that blends traditional elements like intricate paisley borders, diya lighting, and classical instruments with a modern, dramatic stage lighting aesthetic.',
    imageUrl: posterc5,
    mockupType: 'poster',
    deliverables: ['Digital Concert Poster Design'],
    techStack: ['Adobe Photoshop'],
  },
];
