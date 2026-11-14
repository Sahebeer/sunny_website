export const site = {
  name: 'Sahebjot Bendeshah',
  spellingNote: 'CONFIRM spelling: Bandeshah vs Bendeshah',
  siteName: 'Apex Hollow Test Fleet',
  tagline: 'I build things that can be checked.',
  townSign: 'Welcome to Apex Hollow. Population: projects.',
  mascotName: 'Dudu',
  inspectorName: 'Old Gasket',
  sidekickName: 'Pip',
  github: 'https://github.com/Sahebeer',
  linkedin: 'https://www.linkedin.com/in/sahebjot-singh-bendeshah-310275291/',
  email: '',
  resumeUrl: '',
  location: 'Mumbai, India',
  lastUpdated: '2026-11-14',
  flags: {
    confirmAcmRank: false,
  },
  collaborator: '',

  hero: {
    label: 'STUDENT DEVELOPER / INFORMATION TECHNOLOGY',
    headline: 'I build things that can be checked.',
    intro:
      'Final-year Information Technology student building ML systems, computer-vision pipelines, and full-stack tools—tested against real inputs with known limits disclosed upfront.',
    ctaPrimary: 'Start the road test',
    instrumentStrip: {
      mode: 'LEARNING IN PUBLIC',
      status: 'BUILDING · TESTING · DOCUMENTING',
      condition: 'STILL IMPROVING',
    },
    jokes: ['Cold start successful.', 'No fake horsepower detected.'],
  },

  brief: {
    who: {
      label: 'WHO',
      title: 'Final-year IT student',
      detail:
        'B.Tech Information Technology (2023 to 2027) at K. J. Somaiya Institute of Technology, Mumbai, with honours in cybersecurity.',
    },
    what: {
      label: 'WHAT',
      title: 'ML systems, privacy-aware tools, applied AI',
      detail:
        'Computer vision with out-of-distribution gates, anti-fraud verification pipelines, and containerized full-stack applications.',
    },
    evidence: {
      label: 'STRONGEST EVIDENCE',
      title: 'AgriNexus: 97.65% validation accuracy, 42.86% on an external benchmark, limits disclosed',
      detail:
        '60-class ConvNeXt + MobileNetV3 dual-gate plant disease classifier; both in-distribution peak and external domain-shift numbers reported side by side.',
    },
  },

  about: {
    heading: 'Still becoming a developer.',
    education: {
      degree: 'Final-year B.Tech Information Technology (2023 to 2027)',
      institution: 'K. J. Somaiya Institute of Technology, Mumbai',
      honours: 'Honours in Cybersecurity alongside B.Tech IT',
    },
    coursework: [
      'Machine Learning Operations',
      'Blockchain',
      'Generative AI',
      'Natural Language Processing (NLP)',
      'Autonomous Systems / Drone Technology',
    ],
    currentProgram: 'Currently doing the AWS re:Start course',
    interests: ['ML systems', 'Web3', 'Automation'],
    availability: 'Open to internships in software and ML.',
    honestProcess:
      'I plan with LLMs and implement with AI-assisted tools, then test and document failures myself.',
    optionPackages: [
      {
        id: 'ml-package',
        name: 'ML Package',
        tag: 'CORE OPTION',
        skills: ['Python', 'PyTorch', 'TensorFlow/Keras', 'scikit-learn', 'XGBoost'],
      },
      {
        id: 'vision-nlp-package',
        name: 'Vision & GenAI Package',
        tag: 'APPLIED AI',
        skills: [
          'Computer Vision',
          'NLP',
          'GenAI (transformers, Hugging Face, RAG, LLM APIs)',
        ],
      },
      {
        id: 'web-backend-package',
        name: 'Web and Backend Package',
        tag: 'CHASSIS & DRIVETRAIN',
        skills: ['JavaScript', 'FastAPI', 'Flask', 'Node', 'Docker', 'Git'],
      },
      {
        id: 'data-package',
        name: 'Data Package',
        tag: 'STORAGE',
        skills: ['SQL', 'MongoDB', 'MySQL', 'SQLite'],
      },
      {
        id: 'security-package',
        name: 'Security Package',
        tag: 'FOUNDATIONAL',
        note: 'Foundational familiarity only',
        skills: ['Wireshark', 'Nmap', 'OWASP Top 10', 'Burp Suite', 'Kali'],
      },
    ],
  },

  buildLog: [
    {
      id: 'val-vs-external',
      tag: 'Flaw',
      status: 'Still investigating',
      title: 'Why validation numbers can mislead (97.65% validation vs 42.86% external)',
      project: 'AgriNexus',
      summary:
        'A model reaching 97.65% peak validation accuracy (88.62% macro-F1 across 61 in-distribution classes) dropped to 42.86% accuracy (14.84% macro-F1) on an external unaligned PlantDoc benchmark. High validation scores reflect dataset similarity rather than field readiness when lighting, backgrounds, and unmapped categories shift.',
    },
    {
      id: 'efficientnet-to-convnext',
      tag: 'Fixed?',
      status: 'Feature',
      title: 'Why the model was switched from EfficientNetB0 to ConvNeXt',
      project: 'AgriNexus',
      summary:
        'EfficientNetB0 worked only on clean, lab-style single-leaf images and broke down when tested on noisier field photos. Moving to ConvNeXt trained on PlantDoc + PlantVillage on a Colab A100—paired with a MobileNetV3 leaf/non-leaf gate (reject if P(leaf) < 0.80) and an explicit background class—improved robustness on non-studio inputs.',
    },
    {
      id: 'demo-layer-labels',
      tag: 'Feature',
      status: 'Fixed?',
      title: 'Why demo layers are labelled "[demo layer]"',
      project: 'AgriNexus',
      summary:
        'In AgriNexus, sub-field zones, barren-land segmentation, and Sentinel-1 SAR forecasting are synthetic demonstration layers rather than backed by live satellite inference pipelines. Labelling them "[demo layer]" in the UI prevents reviewers from mistaking UI prototypes for verified production pipelines.',
    },
    {
      id: 'placeholder-note',
      tag: 'Still investigating',
      status: 'Still investigating',
      title: '[PLACEHOLDER]',
      project: '[PLACEHOLDER]',
      summary: '[PLACEHOLDER]',
    },
  ],

  garage: {
    heroLine: 'Tech is the job. Cars are the point.',
    subtitle:
      'Personal garage bay and spotter notebook. Reserved for real drives and real sightings—never synthetic stories.',
    specs: [
      { id: 'current-car', label: 'Current Daily', value: '[Your current car]' },
      { id: 'dream-car', label: 'Dream Spec', value: '[Your dream car]' },
      { id: 'favourite-era', label: 'Golden Era', value: '[Your favourite era]' },
      { id: 'best-drive', label: 'Best Road Driven', value: '[Your best drive]' },
    ],
    spottersLog: [
      { id: 'spot-1', photo: '[PLACEHOLDER: your photo]', stamp: 'SPOTTED', note: '[PLACEHOLDER]' },
      { id: 'spot-2', photo: '[PLACEHOLDER: your photo]', stamp: 'SPOTTED', note: '[PLACEHOLDER]' },
      { id: 'spot-3', photo: '[PLACEHOLDER: your photo]', stamp: 'SPOTTED', note: '[PLACEHOLDER]' },
      { id: 'spot-4', photo: '[PLACEHOLDER: your photo]', stamp: 'SPOTTED', note: '[PLACEHOLDER]' },
    ],
    teaser: 'Cars × Tech: Next experiment, on the lift',
  },

  contact: {
    headline: 'Have a problem worth testing?',
    line: "Bring the problem. I'll bring the test plan.",
    cta: 'Start a conversation',
  },

  footer: {
    line: 'Engine off. See you at the next build.',
  },
};

