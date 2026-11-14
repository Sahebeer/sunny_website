export const ecosnap = {
  id: 'ecosnap',
  number: '02',
  slug: 'ecosnap',
  title: 'EcoSnap (LeafLens)',
  roleBadge: 'INSPECTION STATION',
  buildingName: 'Inspection Station',
  teamNote: 'Duo project; most of the work by Sahebjot across frontend, backend and models.',
  status: 'CHECKED',
  oneLiner: 'Waste-disposal rewards app with an anti-fraud pipeline.',
  evidenceLine:
    'Two-stage verification (YOLOv8m conf >= 0.60 + Gemini multimodal intent check) and a 7-step anti-fraud pipeline tested empirically on fraud test images.',
  problem:
    'Reward apps get gamed with duplicate, AI-generated and staged photos.',
  underTheHood: [
    'React Native (Expo) mobile client paired with a Node/Express + MongoDB Atlas backend and a Python Flask AI microservice.',
    'Stage 1 local verification: YOLOv8m (COCO, confidence >= 0.60, mapped to 5 waste streams) rejects irrelevant uploads.',
    'Stage 2 multimodal verification: Gemini multimodal call judges active remediation versus passive litter or a staged selfie.',
    '7-booth anti-fraud pipeline before points are minted: MD5 duplicate check, AI-image detector, Error Level Analysis (ELA) tampering check, CLIP similarity against past images, EXIF metadata check, Gemini intent check, and user warning strikes.',
    'Rewards engine: 10 to 50 points scaled by impact, streaks, badges, partner discounts, and coupons that self-destruct after 15 minutes.',
  ],
  stack: ['React Native (Expo)', 'Node.js / Express', 'MongoDB Atlas', 'Python Flask', 'YOLOv8m', 'CLIP', 'Gemini API'],
  testRouteSteps: [
    {
      step: '01',
      name: 'Upload & Hash Booth',
      detail: 'MD5 duplicate check + EXIF metadata check.',
    },
    {
      step: '02',
      name: 'Forensics Booth',
      detail: 'AI-image detector + ELA tampering check + CLIP similarity vs past images.',
    },
    {
      step: '03',
      name: 'YOLOv8m Object Gate',
      detail: 'Local YOLOv8m (COCO, conf >= 0.60) maps detection to 5 waste streams.',
    },
    {
      step: '04',
      name: 'Gemini Intent & Minting',
      detail: 'Judges active disposal vs passive litter; mints 10–50 pts or issues warning strike.',
    },
  ],
  fraudBooths: [
    { id: 'md5', name: 'Booth 1: MD5 Duplicate Check', rule: 'Exact file hash lookup against prior submissions' },
    { id: 'ai-gen', name: 'Booth 2: AI-Image Detector', rule: 'Flags synthetic / diffusion-generated waste scenes' },
    { id: 'ela', name: 'Booth 3: ELA Tampering Check', rule: 'Error Level Analysis for spliced or doctored regions' },
    { id: 'clip', name: 'Booth 4: CLIP Similarity', rule: 'Embedding cosine similarity vs past uploaded photos' },
    { id: 'exif', name: 'Booth 5: EXIF Check', rule: 'Verifies camera capture metadata consistency' },
    { id: 'yolo', name: 'Booth 6: YOLOv8m Gate', rule: 'COCO conf >= 0.60 mapped to 5 waste streams' },
    { id: 'gemini', name: 'Booth 7: Gemini Intent Check', rule: 'Active remediation vs passive litter/selfie (+ warning strikes)' },
  ],
  resultsTable: [
    {
      metric: 'Local Object Gate Threshold',
      value: 'conf >= 0.60',
      context: 'YOLOv8m (COCO) mapped to 5 waste streams before multimodal call',
    },
    {
      metric: 'Anti-Fraud Verification Checks',
      value: '7 checks',
      context: 'MD5, AI-detector, ELA, CLIP similarity, EXIF, YOLOv8m, Gemini intent',
    },
    {
      metric: 'Reward Point Range',
      value: '10 to 50 pts',
      context: 'Scaled by disposal impact; redeemed for 15:00 self-destructing coupons',
    },
    {
      metric: 'Formal Dataset Benchmark',
      value: 'Not run',
      context: 'Checked empirically on test fraud images only (no TACO/TrashNet evaluation)',
    },
  ],
  recognitionConditional: '7th of 36 teams, ACM KJSCE hackathon',
  knownLimits: [
    'Prototype with seeded test accounts and no public users.',
    'No formal accuracy benchmark (no TACO or TrashNet evaluation); checked empirically on test fraud images only.',
  ],
  whatsNext:
    'Evaluate the waste detector and anti-fraud gates on labeled TACO/TrashNet splits and measure false-rejection rates on genuine low-light phone photos.',
};
