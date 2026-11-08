# Moving Polaroid AR — Next.js

A browser-based AR demo with a local-first Phase 2 Creator Studio.

## Features

- Scan demo QR with a normal camera and open the AR site in Chrome/Safari.
- Print sample card at /print/demo and launch the demo AR camera at /ar/demo.html.
- Create your own unpublished Polaroid in /studio using a JPG/PNG/WebP photo (max 12 MB) and MP4/WebM video (max 80 MB).
- Automatically compile a MindAR .mind target in the browser, or import an existing .mind file.
- Save drafts with image, video, compiled target, title and caption to **browser IndexedDB**.
- Print the local photo at /studio/print.html?id=... and test it at /ar/local.html?id=... on the **same browser and device**.
- Export a compiled .mind file from a local draft.

## Privacy and current limits

This version has **NO backend upload endpoint, user login, or public publishing**. Drafts remain on the device where they were created. Browser storage can be cleared and is not backed up. The printable private draft intentionally does **not** contain a scannable QR for cross-device playback. The QR placeholder is reserved for the future publishing stage, when media and the target will live on a secured hosting service.

Do not mistake the private draft URL for a permanent share URL. The compiled target must correspond to the exact printed photo crop. Personal media never gets committed to GitHub or uploaded to Vercel in this phase.

## Development

Use Node 22+:

    npm install
    npm run typecheck
    npm run lint
    npm run build
    npm run dev

Open http://localhost:3000/studio on desktop or mobile. For camera testing on a separate phone, use an HTTPS development domain; localhost is only treated as secure on the device itself.

## Browser compiler

The page loads the officially documented MindAR browser compiler bundle from jsDelivr:

    https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js

It uses MINDAR.IMAGE.Compiler to compile one image to a .mind file. The viewer uses Three.js + MindAR ES modules via import maps. These external scripts require network access and may be blocked by restrictive networks. If compilation fails, use MindAR's official online compiler and import the generated .mind file into the Creator Studio.

## Phase 2 publishing work not yet complete

To support printing a QR that works on anyone's phone, implement:
1. Authenticated creator accounts and authorization.
2. Durable video/image/.mind storage (for example a properly configured Vercel Blob store).
3. A durable database with records and ownership enforcement.
4. A publish/revoke flow and unique share IDs.
5. Validation, storage quotas, privacy rules, and cleanup for abandoned uploads.
6. Cross-device mobile acceptance testing and camera permission handling.

Automatic GitHub → Vercel preview builds deploy feature branches; production stays on main until intentionally released.
