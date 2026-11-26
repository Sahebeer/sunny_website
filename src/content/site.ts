export type Project = {
  slug: string;
  code: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  status: string;
  stack: string[];
  metric: { label: string; value: string };
  featured: boolean;
  cover: string;
  coverAlt: string;
};

export type Direction = {
  id: "concours" | "telemetry" | "atelier";
  section: string;
  name: string;
  descriptor: string;
  studioNote: string;
  heroKicker: string;
  heroTitle: string;
  heroBody: string;
  signal: string;
  signature: string;
  uniqueNote: string;
  tokens: Array<{ label: string; value: string; swatch?: string }>;
};

export type DeveloperArtifact = {
  label: string;
  title: string;
  body: string;
  terminalLabel: string;
  terminalStatus: string;
  prompt: string;
  terminalLines: string[];
  wallLabel: string;
  wallNote: string;
};

export type EntryConsole = {
  eyebrow: string;
  title: string;
  body: string;
  prompt: string;
  stationLabel: string;
  stationStatus: string;
  displayLabel: string;
  displayValue: string;
  displayNote: string;
  sceneLabel: string;
  sceneNote: string;
  footnote: string;
};

export type WorldCopy = {
  bootKicker: string;
  bootTitle: string;
  bootBody: string;
  bootAction: string;
  sceneLabel: string;
  sceneStatus: string;
  sceneHint: string;
  nav: { home: string; projects: string; about: string; contact: string };
  projectsTitle: string;
  projectsNote: string;
  aboutTitle: string;
  contactTitle: string;
  contactNote: string;
  backLabel: string;
  closeLabel: string;
  specLabels: { stack: string; role: string; email: string; social: string; resume: string };
  palettes: Array<{ id: "signal" | "paper" | "acid"; label: string; note: string }>;
};

export const site = {
  metadata: {
    title: "Sunny — Interactive Portfolio",
    description: "An interactive portfolio for an IT fresher, built as a spatial workbench.",
  },
  navigation: {
    mark: "SJ / 01",
    labLabel: "Direction lab",
    labIntro: "Three studies for one portfolio",
    scrollHint: "Scroll to compare",
    footerNote: "Phase 01 · Direction lab",
  },
  entryConsole: {
    eyebrow: "Phase 01 / direction lab",
    title: "Start with the workbench.",
    body: "Choose a visual route, then inspect the same developer through three different design studios.",
    prompt: "Select a direction",
    stationLabel: "Route console / S-01",
    stationStatus: "Systems ready",
    displayLabel: "Available routes",
    displayValue: "03",
    displayNote: "Each route has its own language.",
    sceneLabel: "Scene study / nocturne bay",
    sceneNote: "A spatial interface for the workbench.",
    footnote: "The game layer is only the way in. The work stays visible.",
  } satisfies EntryConsole,
  world: {
    bootKicker: "Sunny / interactive portfolio",
    bootTitle: "Start the workbench",
    bootBody: "A spatial index of projects, process, and the person behind them.",
    bootAction: "Start",
    sceneLabel: "Nocturne service bay / 001",
    sceneStatus: "Scene online",
    sceneHint: "Select a project to bring it forward.",
    nav: { home: "Home", projects: "Projects", about: "About", contact: "Contact" },
    projectsTitle: "Project bay",
    projectsNote: "Select a model on the wall to inspect its build.",
    aboutTitle: "Operator notes",
    contactTitle: "Open channel",
    contactNote: "Available for a first role where useful software matters.",
    backLabel: "Back to the bay",
    closeLabel: "Close panel",
    specLabels: { stack: "Stack", role: "Role", email: "Email", social: "Social", resume: "Resume" },
    palettes: [
      { id: "signal", label: "01 / Signal", note: "The current black, cyan, and orange telemetry palette." },
      { id: "paper", label: "02 / Paper", note: "Warm stock and clay red for a quieter editorial read." },
      { id: "acid", label: "03 / Acid", note: "A bolder chartreuse signal for a more technical, experimental edge." },
    ],
  } satisfies WorldCopy,
  profile: {
    // DEMO / TODO(owner): Replace the Phase 1 placeholders with real profile data.
    name: "[Your Name]",
    role: "IT fresher / [Role]",
    location: "[City, India]",
    statement: "[One honest sentence about what you like building.]",
    availability: "Open to roles from [month]",
    email: "[email]",
    socials: ["GitHub", "LinkedIn"],
    resumeUrl: "#resume",
  },
  about: {
    paragraphs: [
      "I like the part of software where a rough idea becomes a dependable, legible tool.",
      "My work sits between interface detail and practical systems: small products with a clear job, a quick response, and no unnecessary theatre.",
    ],
    currently: {
      learning: "Type-safe product architecture",
      building: "A calmer personal finance tracker",
      reading: "Notes on industrial design",
    },
  },
  projects: [
    // DEMO
    {
      slug: "ledgerline",
      code: "P-01",
      title: "Ledgerline",
      summary: "A quiet expense tracker that turns recurring spending into a readable weekly rhythm.",
      year: "2026",
      role: "Product + full-stack",
      status: "Prototype",
      stack: ["Next.js", "TypeScript", "SQLite"],
      metric: { label: "Core loop", value: "under 30 sec" },
      featured: true,
      cover: "ledgerline",
      coverAlt: "A warm paper-toned project plate labelled P-01 Ledgerline",
    },
    // DEMO
    {
      slug: "fieldnote",
      code: "P-02",
      title: "Fieldnote",
      summary: "A lightweight field log for collecting observations without losing the thread.",
      year: "2025",
      role: "Design + frontend",
      status: "Shipped in beta",
      stack: ["React", "Vite", "IndexedDB"],
      metric: { label: "Capture time", value: "3 taps" },
      featured: false,
      cover: "fieldnote",
      coverAlt: "A cool grey project plate labelled P-02 Fieldnote",
    },
    // DEMO
    {
      slug: "signal-api",
      code: "P-03",
      title: "Signal API",
      summary: "A small REST API that keeps event data consistent between a student club and its dashboard.",
      year: "2025",
      role: "Backend + documentation",
      status: "Maintained",
      stack: ["Node.js", "PostgreSQL", "OpenAPI"],
      metric: { label: "Endpoints", value: "14" },
      featured: false,
      cover: "signal-api",
      coverAlt: "A dark project plate labelled P-03 Signal API",
    },
  ] satisfies Project[],
  // DEMO
  developerArtifact: {
    label: "Developer workbench / process left visible",
    title: "Trace the build, not just the outcome.",
    body: "A little evidence of the work in motion makes the portfolio feel lived-in: a command, a route, a rough edge, a project that has not been polished into a case study yet.",
    terminalLabel: "Local session / P-01 Ledgerline",
    terminalStatus: "Live trace / demo",
    prompt: "dev@workbench:~/ledgerline$",
    terminalLines: [
      "npm run check",
      "14 routes checked / 0 blocking errors",
      "route /expenses     42ms",
      "schema: recurring_spend     ok",
      "git show --stat       P-01",
    ],
    wallLabel: "Project wall / small systems",
    wallNote: "Three frames from the same workbench. Different jobs, same appetite for useful tools.",
  } satisfies DeveloperArtifact,
  directions: [
    {
      id: "concours",
      section: "01",
      name: "Concours",
      descriptor: "Editorial luxury",
      studioNote: "A quiet, image-led study with the restraint of a printed brochure.",
      heroKicker: "Portfolio direction / A",
      heroTitle: "A considered start.",
      heroBody: "Warm paper, generous margins, and a serif voice let the person lead before the interface speaks.",
      signal: "Open to roles",
      signature: "Paper / ink / one line of clay",
      uniqueNote: "Concours is unique because it treats an early-career portfolio like a small-edition object. The contrast comes from scale and silence: a large editorial name, one precise project plate, and just enough annotation to imply engineering under the surface.",
      tokens: [
        { label: "Paper", value: "#f1eee7", swatch: "#f1eee7" },
        { label: "Ink", value: "#1d1b17", swatch: "#1d1b17" },
        { label: "Livery", value: "#b8523e", swatch: "#b8523e" },
        { label: "Display", value: "Fraunces / 88–132" },
        { label: "Text", value: "DM Sans / 16–18" },
        { label: "Spacing", value: "Wide / 8pt rhythm" },
      ],
    },
    {
      id: "telemetry",
      section: "02",
      name: "Telemetry",
      descriptor: "Motorsport data",
      studioNote: "A live-feeling study built from timing grids, readouts, and deliberate pressure.",
      heroKicker: "Portfolio direction / B",
      heroTitle: "Make the signal clear.",
      heroBody: "Near-black fields and a hot livery mark turn the portfolio into a calm timing screen: dense, exact, and always readable.",
      signal: "Available / 07·26",
      signature: "Grid / mono / signal orange",
      uniqueNote: "Telemetry is unique because density becomes the editorial voice. It uses tabular numbers, clipped labels, hard dividers, and a single orange signal to make an entry-level portfolio feel operational rather than ornamental.",
      tokens: [
        { label: "Field", value: "#0c1010", swatch: "#0c1010" },
        { label: "Readout", value: "#f0eee7", swatch: "#f0eee7" },
        { label: "Livery", value: "#ff6338", swatch: "#ff6338" },
        { label: "Display", value: "Space Grotesk / 92–136" },
        { label: "Data", value: "IBM Plex Mono / 12–15" },
        { label: "Spacing", value: "Dense / 4pt rhythm" },
      ],
    },
    {
      id: "atelier",
      section: "03",
      name: "Atelier",
      descriptor: "Technical drawing",
      studioNote: "A blueprint-like study where rules, dimensions, and construction stay visible.",
      heroKicker: "Portfolio direction / C",
      heroTitle: "Built with intent.",
      heroBody: "Cool grey stock, measured hairlines, and a neutral grotesk make the process visible without turning the page into a diagram.",
      signal: "Open / July 2026",
      signature: "Sheet / hairline / datum",
      uniqueNote: "Atelier is unique because it makes the underlying system part of the beauty. Coordinate marks and dimension lines are not decoration; they create a visible discipline around otherwise simple content.",
      tokens: [
        { label: "Stock", value: "#dfe5e8", swatch: "#dfe5e8" },
        { label: "Graphite", value: "#17323a", swatch: "#17323a" },
        { label: "Mark", value: "#b15d4d", swatch: "#b15d4d" },
        { label: "Display", value: "Manrope / 84–126" },
        { label: "Detail", value: "IBM Plex Mono / 12–15" },
        { label: "Spacing", value: "Measured / 6pt rhythm" },
      ],
    },
  ] satisfies Direction[],
  interactionLab: {
    eyebrow: "Signature interaction candidates",
    intro: "All three are shown here for comparison. The final site should choose one.",
    specReveal: {
      title: "01 / Spec sheet reveal",
      body: "Focus a row to plot its rule into place.",
      trigger: "Focus a row",
      rows: [
        { label: "Stack", value: "Next.js · TypeScript" },
        { label: "Role", value: "Product + full-stack" },
        { label: "Status", value: "Prototype" },
      ],
    },
    revLine: {
      title: "02 / Rev-line scroll indicator",
      body: "Scrub the line to test the section readout.",
      label: "Scroll progress",
      units: ["01", "02", "03", "04"],
    },
    garageDoor: {
      title: "03 / Garage door",
      body: "Select a model to bring it forward.",
      trigger: "Select a model",
      lineup: [
        { code: "P-01", title: "Ledgerline" },
        { code: "P-02", title: "Fieldnote" },
        { code: "P-03", title: "Signal API" },
      ],
    },
  },
} as const;

export const featuredProject = site.projects.find((project) => project.featured) ?? site.projects[0];
