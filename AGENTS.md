# AGENTS.md — Standing rules for this repo

Codex: read this file, `BRIEF.md` and `FEEDBACK.md` before every task. These rules apply to every change, every time.

## What we are building
A personal portfolio for an IT fresher. It shows who they are, their projects, skills, education and how to contact them. The bar: **creative, unique, aesthetic, refined, confident and fast, all at once.** It should look like a design studio built it, not an AI or a template.

## Stack (do not change without being asked)
- Next.js (App Router) + TypeScript, static export friendly
- Styling: CSS Modules + a single `src/styles/tokens.css` of design tokens (color, type scale, spacing, radius, motion). No Tailwind, no UI kits (no shadcn, MUI or Bootstrap).
- Motion: `motion` (Framer Motion) only where it earns its place. Respect `prefers-reduced-motion`.
- Fonts via `next/font`. No default Inter/Roboto/Arial look.
- Icons: none by default. If one is truly needed, draw a custom inline SVG that matches the line weight of the design.
- Owner-approved 3D exception: `three` may power the primary interactive portfolio scene. Keep the scene lightweight, static-export friendly, keyboard-complemented by DOM controls, and disabled to a calm presentation under `prefers-reduced-motion`.

## Content lives in ONE place
All text, projects, links and images come from `src/content/site.ts` (typed). Components never hard-code copy. The owner should be able to update the whole site by editing only that file and `public/images/`.

## Hard bans (these make a site look cheap or AI-made)
- Emoji anywhere in the UI. No 👋, 🚀 or ✨.
- Generic icon-in-a-circle feature grids, stock icon packs and logo walls of tech-stack icons.
- Skill percentage bars, star ratings or "90% JavaScript".
- Purple/blue gradient blobs, glassmorphism cards, neon glows and particle backgrounds.
- Typewriter text effects, bouncing scroll arrows, cursor trails and confetti.
- Hover effects that scale everything. Motion on every element.
- Centered-everything layouts with identical card grids repeated down the page.
- Filler phrases: "passionate developer", "crafting digital experiences", "Hi, I'm X".
- Car clichés: steering wheel or speedometer icons, tire tracks, flames, cartoon cars and puns in every heading.

## What to do instead
- A real layout grid (12-column desktop) with deliberate asymmetry, overlap and scale contrast.
- Large, expressive typography as the main visual. Tight, considered type scale. Tabular figures for numbers.
- A restrained palette: 1 background, 1 ink, 1–2 neutrals, **one** accent used rarely.
- Exactly **one signature interaction** on the site (defined in BRIEF.md). Everything else is calm: subtle fades, measured easing (`cubic-bezier(0.22, 1, 0.36, 1)`), 200–600ms.
- The car influence comes from *design language* (brochures, spec sheets, instrument clusters, technical drawings, livery), never from car clip art.
- Every section should have a reason to look the way it does.

## Quality gates (check before saying a task is done)
1. `npm run build` passes with no type errors or lint errors.
2. Works at 375px, 768px, 1280px and 1920px with no horizontal scroll and no overlaps that look accidental.
3. Keyboard navigable, visible focus states, alt text, color contrast AA, semantic HTML.
4. Reduced-motion mode removes non-essential animation.
5. Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
6. Self-review against every line in "Hard bans". If any appear, fix them.
7. If Playwright is available, take screenshots at 375 and 1440 widths into `/review/` and critique them honestly before finishing.

## How to report back
End every task with:
- **Changed:** short list of what changed
- **Self-score (1–5):** Creative / Unique / Aesthetic / Craft / Performance, one line of reasoning each
- **Weakest spot:** the single thing you'd improve next
- **Needs from owner:** any content or decision you need (or "none")

## Workflow
- Work in phases as directed by the prompt. Do not skip ahead.
- When `FEEDBACK.md` has open items, apply them, then move them to the "Done" section with a one-line note.
- Never delete the owner's content in `site.ts`; if something must change, leave a `// TODO(owner):` comment.
