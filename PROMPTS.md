# PROMPTS.md — The only prompts you'll paste into Codex

Setup: create an empty folder or GitHub repo, put `AGENTS.md`, `BRIEF.md`, `FEEDBACK.md` and this file in the root, fill the [brackets] in BRIEF.md, then open it in Codex.

---

## Prompt 1 — Direction Lab (run once)

```
Read AGENTS.md and BRIEF.md fully before doing anything.

Phase 1: Direction Lab.
Scaffold the project per the stack in AGENTS.md (Next.js App Router, TypeScript, CSS Modules, tokens.css, next/font, motion). Then build a single route /lab that shows the three visual directions from BRIEF.md (A Concours, B Telemetry, C Atelier) one after another, each as a full-width section containing:
- its own token set (palette, type pairing, spacing feel),
- a real hero for the owner using profile data from src/content/site.ts,
- one featured project rendered as a spec sheet,
- a small prototype of each of the three signature interaction candidates, applied in that direction's style.

Each direction must look like a different design studio made it. Make them genuinely distinct, not recolors. Obey every Hard ban. Finish with the quality gates and the report format from AGENTS.md, and include a short paragraph per direction on what makes it unique.
```

Then: open /lab, decide, and write your pick in BRIEF.md ("Owner's pick" and "Chosen"). Mixing is fine.

---

## Prompt 2 — Full build (run once)

```
Read AGENTS.md, BRIEF.md and FEEDBACK.md.

Phase 2: Full build.
Build the complete site in the direction and signature interaction chosen in BRIEF.md: every page and section listed, with the full demo content described in BRIEF.md in src/content/site.ts. Turn the chosen direction into the single global token set and remove /lab.

Treat this as a finished product, not a prototype: real responsive layouts at every breakpoint, loading and empty states, metadata and Open Graph image, sitemap, favicon in the site's style, 404, an accessible nav and footer, and a print-friendly resume link.

Before finishing, do a hard self-critique: list the 5 places most likely to look generic or AI-made and redesign them. Then run all quality gates and report in the AGENTS.md format.
```

---

## Prompt 3 — Every review round (reuse forever)

```
Apply FEEDBACK.md.
```

That's it. AGENTS.md makes Codex read the rules, fix the open items, move them to Done, and report back with scores.

---

## Prompt 4 — Swapping demo content for your real info

```
Replace every // DEMO item in src/content/site.ts with the real content I've pasted below. Keep the design untouched. Resize or crop images in public/images to fit the existing layout. Flag anything that's missing.

[paste your real projects, education, links]
```

---

## Optional — When something feels "off" but you can't explain it

```
Act as a senior art director reviewing this site for an award submission. Without changing anything yet, list the 10 weakest design decisions, ranked, each with the fix you'd make. Wait for my go-ahead.
```

Then reply with the numbers you agree with, e.g. "Do 1, 2, 4, 7."
