# Hella Nails by Kristel

Refined static website, ready for the existing GitHub Pages setup.

## What changed

- Preserved the cream and oxblood palette, serif identity, supplied photos, prices, and inquiry workflow.
- Unified spacing, heading rhythm, service-card alignment, borders, and mobile layouts.
- Improved touch targets, keyboard focus, date selection, form spacing, and the explanation shown when consent is still needed.
- Added a restrained GSAP 3.13.0 entrance for the hero heading and hand. GSAP owns those elements only; the existing Motion 13.5.0 library owns menu, tab, and inquiry feedback.
- Shortened the menu link stagger and reduced travel. Controls stay usable during motion.
- Removed the unused remote Anime.js script, which targeted nonexistent classes and produced an error when unavailable.
- Kept content visible before scroll effects initialize, including when animation libraries cannot load.
- Added pause/resume, hover pause, and keyboard-focus pause to the existing studio ribbon. Reduced-motion users get a static, wrapped version.
- Both the root site and the enclosed legacy folder now load the same refinements.

## Preview

From this directory run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Use a server rather than double-clicking index.html: the original application loads as a JavaScript module.

## Edit

- `assets/refinements.css`: visual and responsive adjustments.
- `assets/refinements.js`: progressive enhancements and motion.
- `assets/vendor/gsap.min.js`: GSAP 3.13.0, locally bundled with its license notice.
- `assets/vendor/motion.js`: the existing Motion 13.5.0 library.
- `index.html`: stylesheet and script loading.

The supplied archive contains a compiled React application, not its original component source or build project. No npm install or rebuild is required for these static files. The compiled application still owns booking state, dialogs, service selection, dates, and inquiry text. If you edit the root files later, use the root version for deployment; the legacy folder is a synchronized copy for compatibility.

## Verification

Automated Chromium checks covered 320, 390, 768, and 1440 pixel widths, image loading, horizontal overflow, service filtering and details, menu Escape/focus return, service/date selection, consent guidance, inquiry generation, SMS URL composition, copy feedback, invalidation of a prepared inquiry after form edits, live reduced-motion changes, print visibility, the legacy entry point, and unavailable animation libraries. JavaScript syntax checks passed. No runtime exceptions occurred during the verification flow.

The scrolling ribbon is retained as an intentional part of the supplied design; it has explicit pause/resume and reduced-motion support. Real-device Safari, screen-reader testing, and actual SMS sending remain manual checks. No message was sent and no appointment was booked during verification.

## Upload

Follow UPLOAD-GUIDE.md. This update has not been published.

Appointments remain inquiries requiring Kristel’s confirmation. The site does not reserve slots or take payments automatically.
