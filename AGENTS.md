# AGENTS.md — cinematic portfolio rules

Read `AGENTS.md`, `BRIEF.md`, and `FEEDBACK.md` before every task. The current code and the latest owner brief outrank historical experiments. Record material decisions in `DECISIONS.md`.

## Product

This is a personal portfolio for an IT fresher. The portfolio is a cinematic interactive 3D night service station: the camera travels through one scene as the visitor navigates Home, Projects, About, and Contact. The supplied gas-station/car image is a mood and lighting reference, not a pixel-copy asset.

## Stack

- Next.js 16 App Router, TypeScript, static export friendly
- CSS Modules and the single token file `src/styles/tokens.css`; no Tailwind or UI kits
- `next/font` local font assets; no default Inter, Roboto, or Arial styling
- `motion` for restrained DOM motion; GSAP for camera choreography; Lenis may be used for scroll smoothing where it improves the scene
- `three`, `@react-three/fiber`, `@react-three/drei`, and `@react-three/postprocessing` for the approved primary 3D scene
- Content and copy live in `src/content/site.ts`; images belong in `public/images/`

## Scene and assets

- Run `npm run assets` to refresh Poly Haven CC0 HDRI/material references and regenerate `public/models/station.glb` and `public/models/car.glb` with Blender.
- `CREDITS.md` must list downloaded sources.
- Load the station and car with `useGLTF`. Do not create station, pump, canopy, car, wheel, or other scene objects from Three.js primitive geometry. All authored scene objects must come from GLBs.
- Blender assets should use real bevels, appropriate UVs, PBR references, grime/edge variation, ambient-occlusion intent, and Draco compression when the exporter supports it.
- Three.js primitives are permitted only for explicitly requested effects such as instanced snow and the reflective ground treatment, never as substitutes for the GLB station or car.

## Motion and interaction

- The intro fades from black, flickers the station lights, then dollies in. Pointer parallax is gentle.
- Navigation and scroll move the camera between scene stations. Project screens open a spec panel with a visible close button, Escape close, outside-click close, focus return, and browser-history support.
- The terminal log must auto-scroll to new output while remaining manually scrollable with mouse, touch, and keyboard.
- The service-exit lane-run mini-game is a lazy, separate canvas: it triggers from a footer sentinel, pauses the main scene while active, supports keyboard/touch lane changes, persists only the best score, and unmounts on close or when the visitor scrolls away.
- Use deliberate 200–600ms easing. Respect `prefers-reduced-motion`: static camera, no animated snow, and no non-essential transitions.
- Pause or reduce work when the document is hidden. Cap pixel ratio at 2. Lazy-load the heavy scene. Mobile uses fewer snow particles and no reflector.

## Hard bans

- No emoji, stock icon packs, generic icon circles, skill bars, star ratings, logo walls, or filler copy.
- No purple/blue gradient blobs, glassmorphism, decorative neon haze, cursor trails, typewriter effects, confetti, or decorative particle backgrounds. Snow is allowed only as the requested scene weather effect.
- No scale-everything hover effects, accidental scroll traps, focus traps, dead controls, or browser-history shortcuts implemented as state-only toggles.
- No cartoon cars, steering-wheel/speedometer clichés, flames, tire tracks, or repeated car puns.
- No repeated centered card grids. Use asymmetry, technical annotation, tabular numbers, spec rows, livery restraint, and deliberate camera framing.

## Quality gates

1. `npm run lint` passes.
2. `npm run build` passes and static export remains valid.
3. Check 375, 768, 1280, and 1920 widths; no horizontal overflow or accidental overlaps.
4. Verify keyboard navigation, visible focus, semantic labels, alt text, contrast, modal close states, browser Back, and terminal scrolling.
5. Reduced-motion removes non-essential animation.
6. Keep Lighthouse targets in view: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.
7. Run `npm run review`; screenshots belong in `review/round-N/` with honest notes. Compare against `references/hero-reference.png` and run at least three review rounds for major scene work.
8. Self-review every hard ban before reporting completion.

## Reporting

End every task with:

- **Changed:** short list
- **Self-score (1–5):** Creative / Unique / Aesthetic / Craft / Performance, with one reason each
- **Weakest spot:** one specific next improvement
- **Needs from owner:** requested content/decision, or `none`
