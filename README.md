# Creator's School website

A standalone, responsive multi-page rebuild for Creator's School.

## Run locally

From this folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

The website itself is static. The optional local Agentation feedback toolbar uses the development setup below.

## Agentation feedback

Install dependencies and rebuild the toolbar after changing `dev/agentation-entry.jsx`:

```powershell
npm install
npm run build:agentation
```

Agentation loads only on `file://`, `localhost`, and `127.0.0.1`. It connects to the locally registered Agentation service at `http://127.0.0.1:4747` and is excluded from normal deployed pages.

## Project structure

```text
creators-school-rebuild/
├── assets/images/        # Optimized mentor, workshop, community, and texture assets
├── index.html            # Home / landing page
├── programs.html         # All four learning paths
├── results.html          # Student outcomes and case studies
├── mentor.html           # Lokesh's journey, workshops, and recognition
├── community.html        # Community benefits and creator ecosystem
├── styles.css            # Shared multi-page design system
├── script.js             # Shared navigation, reveal, and interaction behavior
└── README.md
```

## Design system

- Warm paper background: `#F7F4EE`
- Near-black typography: `#141519`
- Action yellow: `#F5A623`
- Display: Helvetica / Helvetica Neue, SemiBold (600)
- Body: IBM Plex Sans
- Utility labels: IBM Plex Mono
- Direction: editorial magazine with restrained neobrutalist interaction

## Notes

- Primary conversions open pre-filled WhatsApp messages.
- Motion respects `prefers-reduced-motion`.
- All pages are semantic, keyboard navigable, and designed from desktop down to 320px.
- Image stages preserve the complete source image. Portrait and landscape assets use `object-fit: contain` with a blurred, color-matched editorial mat instead of cropping.
- Student outcomes are presented as examples, not guaranteed results.
- The paper/risograph texture was generated specifically for this project with the built-in image-generation tool using this prompt:

> A seamless warm off-white uncoated paper texture with extremely subtle risograph grain, faint black halftone specks, and very sparse muted amber registration marks; flat edge-to-edge, tile-friendly, no text, logos, objects, borders, shadows, vignette, or watermark.

- Mentor, award, workshop, and community photography was sourced from the user-provided Creator's School reference site and lokesharukala.com, then optimized locally.
