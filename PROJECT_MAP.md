# PROJECT MAP — Still Frames Exhibition

> Read this file first. It tells you exactly where everything lives and what
> it does, so you don't have to open every file to get oriented. Written for
> both future AI agents and human developers picking this project back up.

## RECENT CHANGES (July 2026 — storybook + graphics regroup pass)

Two things prompted this pass: the photography exhibit had two views showing
the same 13 photos back to back (repetitive), and the graphic design exhibit
grouped projects into one grab-bag "Studio Favorites" stack instead of
grouping them by what they actually are.

- **Photography's second view is now a storybook, not a second grid.**
  `PhotoStorybook.tsx` (new) replaces the old always-visible metadata grid
  underneath the 3D Lens Curve. It renders one full-width spread per photo —
  image on one side, a hand-written pull-quote and a short story on the
  other, alternating sides down the page. Content lives in
  `PHOTO_STORY_CHAPTERS` in `data.ts` (see the big comment block right above
  it) — that's the only file to touch to add a new page. Two placeholder
  "reserved" chapters are included at the end so the book still looks
  intentional before more stories are written; swap them out by giving them
  a real `photoId` and removing `placeholder: true`.
- **Cinematography now hands off to Graphic Design.** A "See the graphic
  design work next" button sits at the end of the Cinematography tab in
  `ObservedWorld.tsx`. This required a new required prop,
  `onNavigateToGraphics`, wired in `App.tsx` to `goTo('constructed')`.
- **Exhibit III (`ConstructedWorld.tsx`) is grouped by project type, not one
  mixed stack.** Four sections in order: (1) the three calendar pieces in a
  GSAP ScrollStack, (2) the two brand identities shown at full width by
  default (no thumbnail/hover needed to see them properly), (3) the two ID
  cards side by side as lanyard mockups, (4) everything else — 11 posters,
  event graphics, and apparel pieces — in a cream-and-red Pinterest-style
  wall. The old `CURATED_IDS` grab-bag and `CuratedStackCard` are gone;
  content is now split automatically by `mockupType` into `CALENDAR_CASES`,
  `BRANDING_CASES`, `ID_CARD_CASES`, and `REST_CASES` — add/remove a project
  in `GRAPHIC_DESIGN_CASES` (`data.ts`) and it lands in the right section on
  its own.

## RECENT CHANGES (July 2026 — real asset integration pass)

The site previously ran entirely on placeholder Unsplash imagery and invented
"Leica" flavor copy. This pass replaced that with Swastik's real work:

- **All real imagery** now lives in `src/assets/images/` (photography,
  graphics) and `src/assets/images/hero/` (portrait), imported through Vite in
  `src/data.ts` — no more remote stock photos. `technicalSpecs` on each
  photograph use honest general descriptors (exact EXIF wasn't available in
  the source files); edit `src/data.ts` directly with real EXIF/location
  whenever you have it.
- **Cinematography is real**, hosted on Cloudinary (source files are too large
  for the repo). `ObservedWorld.tsx` plays actual `<video>` elements and reads
  runtime + aspect ratio live from `loadedmetadata`/`videoWidth`/`videoHeight`
  — nothing is hardcoded, so the numbers shown are always accurate.
- **Exhibit III no longer relies solely on the Flow Station.** Real graphic
  design work needs to be seen at real size, not a tiny hover thumbnail, so
  `ConstructedWorld.tsx` now leads with a curated `ScrollStack.tsx`
  ("Studio Favorites" — one piece per category, GSAP ScrollTrigger stacking)
  followed by a full `BentoWall.tsx` Pinterest-style masonry of all 18 pieces.
  `FlowingMenu.tsx` still exists and still works, it's just not wired into
  this exhibit anymore.
- **ID cards render through `IDCardMockup.tsx`** — a lanyard/clip/punch-hole
  CSS presentation — instead of a flat rectangle image.
- **Every tile shows its metadata up front** (title, category, tools) instead
  of hiding it behind a click; clicking still opens the full case-file modal,
  which now has a fullscreen lightbox toggle (`Maximize2`/`Minimize2`) that
  opens by default for the two dense moodboard-style branding pieces.
- **New components**: `GlassIcons.tsx` (toolkit tiles in `AboutSection.tsx`)
  and `LiquidEther.tsx` (ambient background in `ContactSection.tsx`) — both
  adapted from the react-bits component ideas of the same name, restyled from
  their original rainbow/violet defaults into this site's restrained
  paper/ink/signal-red palette.

## What this project is

A cinematic single-page portfolio/exhibition site for visual creator
**Swastik Manna** ("Still Frames"). Three "exhibits" reachable from a hero
portal screen:

- **Exhibit I — Photography** (inside `ObservedWorld.tsx`): a 3D WebGL
  circular/carousel gallery (the "Lens Curve") for browsing all 13 photos,
  followed by `PhotoStorybook.tsx` — a narrated, one-spread-per-photo
  storybook for a handful of them. There is intentionally no flat metadata
  grid anymore; see "RECENT CHANGES" at the top of this file.
- **Exhibit II — Cinematography** (also inside `ObservedWorld.tsx`, second
  tab): a widescreen film-still showcase with a fullscreen "theater" modal,
  ending in a CTA button straight into Exhibit III.
- **Exhibit III — Graphic Design** (`ConstructedWorld.tsx`): four sections in
  order — a GSAP ScrollStack of the calendar series, full-width brand
  identity spreads, ID cards shown as lanyard mockups, and a cream-and-red
  Pinterest-style `BentoWall` for the remaining posters/events/apparel. The
  old marquee/typography "Flow Station" (`FlowingMenu.tsx`) still exists in
  the codebase but isn't wired into any screen. See "RECENT CHANGES" near the
  top of this file for the full rundown.

Design language: premium **light** editorial theme — soft off-white paper
background, near-black ink text, one rich red accent color. No dark "black
palette" chrome anywhere except (a) full-bleed photographic images/overlays
where a dark scrim aids text legibility, and (b) the intentionally
dark/immersive fullscreen movie-theater modal in `ObservedWorld.tsx`.

Stack: React 19 + TypeScript + Vite 6 + Tailwind CSS v4 (CSS-first `@theme`
config, no `tailwind.config.js`) + Framer Motion (`motion/react`) for
state-driven transitions + GSAP (+ ScrollTrigger) for scroll reveals and
magnetic hover micro-interactions + `ogl` (lightweight WebGL) for the 3D
gallery.

## Quick start

```bash
npm install
npm run dev      # dev server on :3000
npm run build    # production build → dist/
npm run preview  # serve the dist/ build locally
npm run lint     # tsc --noEmit type-check only, no emit
```

No environment variables are required to run the app (`.env.example` is a
leftover placeholder — the app makes no external/API calls at runtime).

## Top-level layout

```
index.html              Entry HTML. Loads Google Fonts (Unbounded, Bricolage
                         Grotesque, Caveat, Space Mono), sets page title/meta.
vite.config.ts           Vite config. Tailwind v4 plugin + React plugin +
                         manualChunks vendor code-splitting (react/motion/
                         gsap/ogl/lucide each get their own chunk).
tsconfig.json             TS config, "@/*" path alias → project root.
package.json               Scripts + dependencies (see below).
metadata.json              Leftover AI Studio project metadata (not read by
                         the app at runtime — safe to ignore/remove).
README.md                Original scaffold readme (AI Studio boilerplate).
assets/                  Legacy placeholder folder from the original scaffold
                         at the project root (unrelated to src/assets/images/,
                         which now holds all real exhibit imagery — see
                         "RECENT CHANGES" near the top of this file).
dist/                    Production build output (generated by `npm run
                         build`; safe to delete and regenerate).
```

## `src/` layout

```
src/
  main.tsx               React root bootstrap. Renders <App /> into #root.
  index.css              *** THE DESIGN SYSTEM ***. Tailwind v4 @theme
                          tokens (colors, fonts) + all custom utility
                          classes (grain overlay, glass cards, gradient
                          text, crop-frame marks, reveal helpers, etc).
                          Read this before changing any visual styling.
  App.tsx                 Root component. Owns which "screen" is active
                          (intro / about / observed / constructed /
                          contact), the floating bottom nav rail, the
                          cursor, and wires up the cinematic screen-
                          transition wipe. Screens are plain conditional
                          renders inside <AnimatePresence>, not routes —
                          there is no react-router.
  data.ts                 All content: PHOTOGRAPHY_EXHIBITION,
                          CINEMATOGRAPHY_RELEASES, GRAPHIC_DESIGN_CASES
                          arrays. Edit here to add/remove/change portfolio
                          items — no component changes needed for content
                          updates as long as the shape matches types.ts.
  types.ts                 TypeScript interfaces for the data.ts shapes
                          (PhotographyArtwork, CinematicRelease,
                          GraphicDesignCase).

  hooks/
    useMagnetic.ts          GSAP magnetic-hover-follow hook for buttons/
                          cards. Skips itself automatically on touch
                          devices. Usage: `const ref = useMagnetic<HTMLDivElement>(strength)`
                          then attach `ref` to the element and add the
                          `magnetic-target` class (for will-change hint).

  lib/
    gsap.ts                 Central GSAP import — registers ScrollTrigger
                          exactly once and sets a shared default ease.
                          Always import gsap/ScrollTrigger from here, not
                          directly from 'gsap', so the plugin registration
                          isn't duplicated.

  components/
    Reveal.tsx               Reusable GSAP ScrollTrigger fade+rise-in
                          wrapper component. Wrap any block of JSX in
                          <Reveal> to give it a cinematic scroll-triggered
                          entrance. Supports `stagger` to animate direct
                          children individually (e.g. a grid of cards).
    CinematicTransition.tsx  The full-viewport GSAP "shutter wipe" that
                          plays between screen navigations (two panels —
                          ink then red — sweep across, state swaps at
                          full coverage, panels sweep back off). Mounted
                          once in App.tsx and driven imperatively via a
                          ref (`transitionRef.current.play(callback)`).

    HeroIntro.tsx            The intro/portal screen (screen = 'intro').
                          Large, scroll/wheel-driven 3-phase interaction
                          (0 = "PORT / ? / FOLIO" title + fan of cards,
                          1 = developing portrait + bio copy, 2 = the two
                          portal cards to Exhibit I/II vs Exhibit III).
                          Also renders the floating audio toggle and the
                          phase stepper footer. Owns its own wheel/touch
                          scroll handling (not real page scroll).
    AboutSection.tsx          "Meet Swastik" dossier screen. Portrait with
                          an interactive focus-blur slider, a two-column
                          "Observed vs Constructed" summary, a tabbed
                          philosophy panel, and quick-nav buttons into
                          the two exhibits.
    ObservedWorld.tsx          Exhibit I & II combined screen (tab-switched).
                          Photography tab renders the 3D CircularGallery for
                          browsing all photos, then PhotoStorybook.tsx for a
                          narrated few. Cinematography tab renders the film
                          showcase + fullscreen theater modal (intentionally
                          dark), ending in a CTA into Exhibit III.
    PhotoStorybook.tsx          Exhibit I "page two" — one full spread per
                          photo (image + hand-written pull-quote + short
                          story), sourced from PHOTO_STORY_CHAPTERS in
                          data.ts. Includes placeholder "reserved" pages.
    ConstructedWorld.tsx        Exhibit III screen. Renders four sections in
                          order: calendar ScrollStack, full-width brand
                          spreads, ID cards as lanyard mockups, and a
                          cream-and-red BentoWall for everything else —
                          split automatically from GRAPHIC_DESIGN_CASES by
                          `mockupType`. FlowingMenu "Flow Station" still
                          exists but isn't wired into this screen. Clicking
                          any piece opens a case-file detail modal (title,
                          concept, image, deliverables, tech stack).
    ContactSection.tsx          Closing "Let's Create" screen: contact form
                          (client-side only, no backend — submitting just
                          shows a success state, does not send anywhere)
                          + a slow auto-scrolling film-credits roll.

    CircularGallery.tsx        The WebGL 3D "Lens Curve" gallery, built on
                          `ogl`. Renders a curved wall of images the user
                          can drag/wheel-scroll to spin. IMPORTANT: wheel/
                          mousedown/touchstart listeners are scoped to the
                          gallery's own container (not `window`) — this was
                          a bug fix; previously any scroll/click anywhere
                          on the page would hijack the gallery. Touch drag
                          also detects horizontal-vs-vertical gesture intent
                          before capturing, so vertical page swipes over the
                          gallery still scroll the page normally. Also has
                          a ResizeObserver (in addition to window `resize`)
                          so it stays correctly sized through layout changes.
    CircularGallery.css       Minimal supporting CSS (cursor states, focus
                          outline) for the above.
    FlowingMenu.tsx            The interactive marquee/typography list used
                          by ConstructedWorld's Flow Station. Hover shows a
                          floating image preview that follows the cursor;
                          each row has a rolling marquee reveal on hover.
                          Takes an optional `onItemClick(index)` prop —
                          that's how ConstructedWorld opens its detail modal.
    GridMotion.tsx             Decorative animated 5-column parallax image
                          grid used as a background flourish inside
                          HeroIntro's phase-2 portal screen. Unrelated to
                          the (removed) Exhibit I flat grid — different
                          feature, kept intentionally.
    SketchDoodle.tsx            Small hand-drawn-style animated SVG
                          flourishes (arrows, underlines, star bursts,
                          crop tags) used as decorative accents. Colors are
                          passed as props by the caller.
    ApertureCursor.tsx          Custom camera-aperture-styled cursor that
                          follows the mouse and reacts to `data-cursor`
                          attributes on hoverable elements (e.g.
                          `data-cursor="link"`, `"gate"`, `"view"`,
                          `"drag"`, `"sound"`, `"enter"`). Desktop only —
                          disables itself on touch devices.
    AudioEngine.ts              Tiny Web Audio API synth (no audio files) —
                          generates UI sound effects (shutter click, lens
                          dial tick) procedurally. Exported singleton
                          `audio` used throughout via `audio.playShutter()`
                          / `audio.playLensDial()` / `audio.toggleSound()`.

    (Removed during the premium redesign — do not re-add references:
     BrandFullscreenShowcase.tsx, CredentialsApparelShowcase.tsx. These
     only existed to support the old Exhibit III "Swiss Grid" layout,
     which was intentionally removed in favor of the Flow Station-only
     experience.)
```

## Design system cheat-sheet (from `src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#faf9f6` | App/page background |
| `--color-surface` | `#ffffff` | Card/panel background |
| `--color-surface-sunken` | `#f2f0ea` | Recessed panel tone |
| `--color-ink` | `#16151a` | Primary text (never pure black) |
| `--color-ink-soft` | `#4a4852` | Secondary/body text |
| `--color-line` | `#8a8790` | Neutral dividers/labels |
| `--color-signal-red` | `#b3122a` | The one accent color |
| `--color-signal-red-soft` | `#d94a3a` | Lighter accent variant |

Useful utility classes already defined — reach for these instead of
reinventing them: `swastik-aura-bg` (page backdrop gradient), `swastik-glass-card`
/ `swastik-elevated` / `swastik-elevated-lg` (card surfaces + shadows),
`swastik-acid-text` / `swastik-violet-text` (gradient text), `sketch-paper`
(faint blueprint grid texture), `grain-overlay` + `camera-lens-vignette` +
`lens-glare` (global fixed-position atmosphere layers, mounted once in
`App.tsx`), `type-hand` (Caveat handwriting font), `gsap-reveal` /
`gsap-reveal-up` (pre-animation hidden states, used by `Reveal.tsx`).

## Interaction/animation conventions

- **Scroll-triggered entrances** → wrap content in `<Reveal>` (from
  `components/Reveal.tsx`), not raw `motion.div` + `whileInView`, when
  adding new sections. Existing simple mount-fade animations using Framer
  Motion's `initial`/`animate` (not scroll-triggered) were left as-is where
  they already worked fine.
- **Hover-follow "magnetic" buttons** → `useMagnetic<T>(strength)` from
  `hooks/useMagnetic.ts`, attach the returned ref, add class `magnetic-target`.
- **Screen navigation** → always go through `App.tsx`'s `goTo(screen)`
  helper (plays the `CinematicTransition` shutter wipe), never set the
  screen state directly from a child component.
- **Sound** → call the relevant `audio.play...()` method on the same user
  gesture that triggers a nav/UI change, matching the existing pattern.
- **Cursor reactivity** → add `data-cursor="link" | "gate" | "view" |
  "drag" | "sound" | "enter"` to interactive elements to get the custom
  cursor's hover state/label; it's picked up automatically by
  `ApertureCursor.tsx`'s event delegation, no extra wiring needed.

## Known intentional design decisions (don't "fix" these)

- Exhibit I photography has no flat/grid view — 3D Lens Curve only.
- Exhibit III leads with ScrollStack + BentoWall; the Flow Station component still exists but isn't wired in (see "RECENT CHANGES" at the top of this file).
- The fullscreen movie-theater modal in `ObservedWorld.tsx` is deliberately
  dark/black even though the rest of the site is light — it's a cinema
  immersion effect, not a leftover dark-theme bug.
- The contact form in `ContactSection.tsx` has no backend — it's UI-only
  by design (no `.env` API keys are wired up).
