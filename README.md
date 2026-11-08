# Moving Polaroid AR — Next.js Phase 1

Scan the QR code on a printed Polaroid with the normal Android/iPhone camera, open the linked website, grant camera permission, and aim at the image to play an AR video overlay.

**Stack:** Next.js App Router, TypeScript, MindAR 1.2.5, Three.js, qrcode.react.

## Pages
- `/` — landing page
- `/print/demo` — printable sample card and unique-origin QR
- `/p/demo` — mobile AR viewer

## Run locally
```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Vercel
Import GitHub repository, use Next.js preset, Node 22.x, root directory `./`.
Leave NEXT_PUBLIC_SITE_URL unset unless using a fixed custom HTTPS domain. QR codes default to the current browser origin.

## Demo media
The sample tracking target/photo come from the official MindAR demo CDN. The demonstration video is an independently hosted CC0 flower video from MDN. Both sources require network access. This project does NOT yet include a backend, authenticated upload form, or private video storage.

## Your own photo
Capture a short H.264 MP4 and pick a still. Crop the photo content, excluding the white frame and QR, then compile that exact crop with [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/). Update the catalog in `src/lib/polaroids.ts` with matching image, .mind target and video URL. Ensure targetAspectRatio matches the photo crop.

## Testing
1. Print the image on `/print/demo`.
2. Scan QR with phone’s normal camera; tap the HTTPS link.
3. Tap Start AR camera, grant permission and point at printed card.
4. The video should align with the tracked image.
5. Test Android Chrome and iPhone Safari. Support depends on browser, camera permissions, lighting and target image quality.

In Phase 2, add authentication, PostgreSQL/Prisma catalog and safe direct-to-object-storage uploads; never expose private personal media in the public directory.
