# BRIEF.md — Design brief & site spec

> Owner: fill in anything in [brackets]. Leave the rest. Codex treats this as the source of truth for taste.

## About the owner
- Name: [Your Name]
- Role: IT fresher / [e.g. Full-stack developer, ML engineer]
- Location: [City, India]
- One honest sentence about what you like building: [e.g. "Fast, useful tools that people actually open twice."]
- Interests outside code: cars (design, engineering, motorsport), [others]

## Personality of the site
Creative, unique, aesthetic, precise, confident, calm, engineered, editorial, a little playful in one place only.
It should feel like **a premium car brochure crossed with an engineer's notebook.**

## Car influence, done with taste
Use these as *design language*, never as decoration:
- **Spec sheets.** Each project is presented like a model's spec page: clean label/value rows (Stack, Role, Year, Status, Duration, Key metric) set in a mono or tabular face.
- **Technical drawing.** Thin hairlines, dimension markers, small coordinate labels and section numbers (01, 02, 03) as the grid's annotation.
- **Livery.** One accent colour, used like a racing stripe: rarely, purposefully, never as a gradient.
- **Instrument cluster.** Numbers matter: tabular figures, crisp counters, precise alignment.
- **Model naming.** Projects get a short code (e.g. `P-01`, `P-02`) like chassis codes. Keep headings plain English. No puns.

## Three visual directions (Phase 1 builds all three so the owner can choose)
**A — Concours (editorial luxury)**
Warm off-white paper, deep ink, a serif display face with a refined grotesk. Huge type, generous whitespace, photography-first, like a coffee-table car book.

**B — Telemetry (motorsport data)**
Near-black, a mono + condensed grotesk pairing, timing-screen grids, one hot livery accent (e.g. signal orange). Dense, precise, alive but not noisy.

**C — Atelier (technical drawing)**
Pale cool grey, blueprint hairlines, dimension annotations, a neutral grotesk with mono details. It should feel like a design studio's engineering sheet.

Owner's pick (fill after Phase 1): [A / B / C / mix, e.g. "B layout with A typography"]

## The one signature interaction
Pick one with the owner in Phase 1. Candidates:
1. **Spec sheet reveal.** Hovering or focusing a project row draws its spec lines in, like a technical drawing being plotted.
2. **Rev-line scroll indicator.** A thin line in the header that fills with scroll, with section numbers ticking like gear indicators.
3. **Garage door.** The projects index is a horizontal "lineup"; selecting one slides it forward into a full spec page with a shared-element transition.

Chosen: [1 / 2 / 3 / other]

## Pages & sections
1. **Home**
   - Hero: name, role, one-line statement, availability status ("Open to roles from [month]"), primary link to projects and resume. No portrait required; the typography carries it.
   - Selected work: 3–4 featured projects as spec-sheet rows or a lineup.
   - About (short): who I am in 3–4 sentences, plus a "Currently" block (learning, building, reading).
   - Skills: grouped (Languages / Frameworks / Tools / Concepts) as plain text lists. No bars, no logos.
   - Education & experience: a compact timeline (degree, internships, certifications, hackathons).
   - Garage (personal): a small, tasteful section on the car interest, e.g. a favourite design or a "dream spec" card. This is where a bit of personality is allowed.
   - Contact: email, GitHub, LinkedIn, resume PDF. A large, simple closing line.
2. **Projects index** (`/work`): all projects, filterable by type or stack.
3. **Project detail** (`/work/[slug]`): spec sheet, problem, approach, what I built, screenshots, outcome or metrics, what I learned, links (live, repo).
4. **404 page**: on-brand and witty in one line.

## Demo content (Phase 2)
Use realistic placeholder content in `src/content/site.ts`: 5 plausible fresher projects (e.g. an expense tracker, an ML image classifier, a college event app, a REST API, a CLI tool), a B.Tech/BCA style education entry, one internship and two certifications. Mark every placeholder with `// DEMO`. Use neutral placeholder images (solid tonal blocks with the project code), not stock photos.

## Content schema (`src/content/site.ts`)
- `profile`: name, role, location, statement, availability, email, socials, resumeUrl
- `about`: paragraphs[], currently { learning, building, reading }
- `projects[]`: slug, code, title, summary, year, role, status, stack[], metric { label, value }, featured, cover, images[], problem, approach, outcome, learned, links { live, repo }
- `skills`: { languages[], frameworks[], tools[], concepts[] }
- `timeline[]`: year, title, org, type (education | work | cert | award), note
- `garage`: title, body, spec[] { label, value }, image

## Non-negotiables
Fast, accessible, responsive and readable. Taste over tricks.
