# Hella Nails by Kristel

Refined static website, ready for the existing GitHub Pages setup.

## What changed

- Preserved the cream and oxblood palette, serif identity, supplied photos, prices, and inquiry workflow.
- Unified spacing, heading rhythm, service-card alignment, borders, and mobile layouts.
- Improved touch targets, keyboard focus, date selection, form spacing, and the explanation shown when consent is still needed.
- Added a restrained GSAP 3.13.0 entrance for the hero heading and hand. GSAP owns those elements only; the existing Motion 13.5.0 library owns menu and inquiry feedback. Anime.js owns supporting-content and booking-summary motion.
- Shortened the menu link stagger and reduced travel. Controls stay usable during motion.
- Replaced the old unused remote Anime.js integration with locally bundled Anime.js 4.1.3 targeting the actual interface.
- Kept content visible before scroll effects initialize, including when animation libraries cannot load.
- Removed the marquee pause button and its reserved space. The strip spans the full width; hover and keyboard focus can still pause it.
- Anime.js 4.1.3 handles photo zoom on hover/focus, price-row feedback, starburst line drawing, hero side-copy entrances, supporting-content reveals, and week/booking-summary transitions.
- Restored card and heading reveals with a gentler 850–900 ms cubic ease, 10–14 px of movement, softer starting opacity, and a short 45 ms card stagger. Reveals begin just before entering the viewport to avoid a visible start-up jump.
- Full animations stay active regardless of the device motion preference, as requested.
- Both the root site and the enclosed legacy folder now load the same refinements.

## Preview

From this directory run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Use a server rather than double-clicking index.html: the original application loads as a JavaScript module.

## Edit

- `assets/refinements.css`: visual and responsive adjustments.
- `assets/refinements.js`: progressive enhancements, GSAP hero and Motion menu/inquiry effects.
- `assets/animations.js`: Anime.js content and interaction effects.
- `assets/vendor/anime.umd.min.js`: Anime.js 4.1.3; MIT license included.
- `assets/vendor/gsap.min.js`: GSAP 3.13.0, locally bundled with its license notice.
- `assets/vendor/motion.js`: the existing Motion 13.5.0 library.
- `index.html`: stylesheet and script loading.

The supplied archive contains a compiled React application, not its original component source or build project. No npm install or rebuild is required for these static files. The compiled application still owns booking state, dialogs, service selection, dates, and inquiry text. If you edit the root files later, use the root version for deployment; the legacy folder is a synchronized copy for compatibility.

## Verification

Automated Chromium checks covered 320, 390, 768, and 1440 pixel widths, image loading, horizontal overflow, service filtering and details, menu Escape/focus return, service/date selection, consent guidance, inquiry generation, SMS URL composition, copy feedback, invalidation of a prepared inquiry after form edits, full animation under either device motion preference, rapid category switching, image hover/reset, absence of the marquee pause button, print visibility, the legacy entry point, and unavailable animation libraries. JavaScript syntax checks passed. No runtime exceptions occurred during the verification flow.

The scrolling ribbon is retained as an intentional part of the supplied design; it spans the full width without a pause button. Real-device Safari, screen-reader testing, and actual SMS sending remain manual checks. No message was sent and no appointment was booked during verification.

## Upload

Follow UPLOAD-GUIDE.md. This update has not been published.

Appointments remain inquiries requiring Kristel’s confirmation. The site does not reserve slots or take payments automatically.
