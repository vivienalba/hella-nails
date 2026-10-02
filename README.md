# Hella Nails by Kristel

Static, GitHub Pages ready website. This project contains the original compiled React application, its styles and salon assets; no original component source, package manifest, build command or test runner was supplied.

## Preview

From this directory, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173 in a browser. Stop the server with Ctrl+C. Preview through the server rather than opening index.html directly, because the original application uses a JavaScript module.

## Editing

- `assets/refinements.css` refines the existing cream and oxblood design, responsive layouts, navigation, filters, form states and focus treatments.
- Padding, margins, gaps and page gutters are reduced by 15 percent. Control touch targets and image dimensions are retained.
- `assets/refinements.js` adds progressive navigation, copy inquiry and restrained Motion animations. Studio highlights remain static and can be scrolled horizontally on smaller screens. The original React application continues to own service selection, dates, consent, dialogs and inquiry generation.
- The left three-line menu works on all screen sizes. Its links fade and slide in from left to right in sequence. The landing page Instagram logo opens Kristel’s account in a new tab. Visible editorial dashes are replaced with spaces or “to” for ranges. User-entered inquiry text and contact links are preserved. Motion fades offscreen content from transparent to visible over 0.65 seconds as it enters the viewport; reduced-motion and keyboard users receive immediate content.
- `assets/vendor/motion.js` is the local browser distribution of the already installed Motion 13.5.0 library, with its MIT license alongside it. No new animation package or runtime CDN is required.
- Original compiled assets and images are preserved. Deploy all files together using `UPLOAD-GUIDE.md`.

## Verification

JavaScript syntax checks:

```sh
node --check assets/refinements.js
node --check assets/index-BmY98v4H.js
```

Browser checks covered 320, 390, 768 and 1440 pixel widths; image loading; service details and selection; navigation focus and Escape dismissal; date selection and consent; inquiry text and SMS destination; copy inquiry availability; marquee pause; privacy dialog; reduced motion; and print layout. No runtime exceptions were observed. Physical device and screen reader testing remain manual checks.

Appointments remain inquiries that require Kristel's confirmation. This site does not send messages, reserve slots or take payments automatically.
