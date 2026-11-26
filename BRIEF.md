# Portfolio brief — Midnight Service Station

## Product idea

This is a personal portfolio for an IT fresher who thinks like a product-minded developer. The first impression is a cinematic night service station in falling snow: a place to stop, inspect the work, and choose a direction. The attached gas-station/car image is a mood and lighting reference only. It must not be pasted as the site background or copied pixel-for-pixel.

The site should feel authored by a developer with a strong visual point of view: tactile, technical, slightly strange, and restrained. It should not read as a corporate agency landing page or a generic portfolio template.

## Scene language

- A real station canopy, pump bank, hoses, signage, wet ground, snow, haze, and a low wedge-shaped car form the hero world.
- The station and car are authored as GLB assets by the Blender pipeline in `scripts/blender/` and loaded with `useGLTF`.
- Three.js may compose, light, animate, and present the authored assets. It must not create the authored station, pump, or car from primitive geometry at runtime.
- The scene uses a near-black environment, cold overhead tubes, selective warm orange accents, controlled reflections, fog, snow, and a restrained filmic finish.
- The car should read from a front-left three-quarter angle, with a low wedge nose, dark glass canopy, hard body planes, wheels, front light strip, and enough material separation to remain legible.

## Experience map

1. Intro: black screen, real asset loading progress, a brief light-up/flicker, and a camera dolly into the station.
2. Home: owner identity and a concise positioning statement lead the page, followed by a compact working-stack readout and CLI trace. No visible bracket placeholders.
3. Projects: camera moves toward the pump/screen area. Project cards behave like instrument panels and open a routed project bay/spec sheet. Keep the CLI trace as part of the developer texture.
4. About: the camera moves to a quieter inspection angle for profile, skills, education, and working style.
5. Contact: the camera rises toward the station signage and exposes the contact action.
6. Service exit: when the footer sentinel enters view, offer a quiet lane-run mini-game. It uses the car GLB, a generated road, keyboard/touch lane controls, a persistent best score, and an explicit close path. The game is lazy-mounted only after the trigger and must not hijack normal portfolio scrolling.

Browser history is part of the experience. Navigation and project bays use URL state, browser back returns to the previous view and scroll position, Escape/outside click close overlays, and focus returns to the element that opened an overlay.

## Motion rules

- Motion is choreographed around the scene: intro reveal, camera stations, light flicker, pointer parallax, project-panel transition, and subtle snow.
- The first frame must be useful while heavier assets load. Progress is real, not a fake timer.
- Reduced motion removes camera animation, flicker, snow movement, and non-essential transitions while preserving content and controls.
- Hidden tabs pause expensive animation. Mobile uses fewer particles and avoids the reflector-heavy path.
- The lane-run canvas is mounted only after the footer trigger, pauses the main scene while active, and unmounts when closed or when the visitor scrolls far back into the portfolio.
- Use `motion`, GSAP/ScrollTrigger, Lenis, or another dependency only when it improves the scene and keeps the existing interaction correct. Do not stack effects for decoration.

## Asset pipeline

Run `npm run assets` to:

1. Fetch the selected CC0 Poly Haven HDRI and PBR maps into `public/assets/`.
2. Write attribution to `CREDITS.md`.
3. Run Blender headlessly with `scripts/blender/build_assets.py`.
4. Export Draco-compressed `public/models/station.glb` and `public/models/car.glb`.

Never commit a downloaded asset without its source attribution. Never replace a weak authored mesh with Three.js primitive stand-ins. If a better vetted CC0 model is sourced, document the choice in `DECISIONS.md` and preserve the GLB loading contract.

## Content and implementation

All owner-facing text, project metadata, links, and image paths live in `src/content/site.ts`. Components consume typed content; they do not invent portfolio copy. `public/images/` remains available for owner-supplied media.

The stack is Next.js App Router, TypeScript, static-export friendly, CSS Modules, `src/styles/tokens.css`, `next/font`, `motion`, and the approved Three.js scene exception. Keep the implementation keyboard accessible, semantic, and safe at 375, 768, 1280, 1440, and 1920px.

## Review loop

Run `npm run lint`, `npm run build`, and `npm run review`. The review script starts a static server for the exported `out/` directory and captures every station view at 1440×900 and 390×844 into `review/round-N/`. Keep an honest `notes.md` per round, fix the largest visual or interaction gap, and run at least three rounds before calling a milestone complete.

The reference target is the atmosphere and commitment of the supplied image, not a promise that generated geometry is automatically award-level. Compare actual screenshots, report what is still weak, and do not describe the build as final while the car, station silhouette, legibility, or performance remains materially below the target.
