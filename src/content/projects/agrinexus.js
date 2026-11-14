export const agrinexus = {
  id: 'agrinexus',
  number: '01',
  slug: 'agrinexus',
  title: 'AgriNexus',
  roleBadge: 'PRIMARY TEST VEHICLE',
  buildingName: 'Greenhouse Garage',
  teamNote: 'Group project of 2; Sahebjot built the majority.',
  status: 'CHECKED',
  oneLiner: 'ConvNeXt plant disease classifier with a reject-non-leaf gate.',
  evidenceLine:
    '97.65% peak validation accuracy (88.62% macro-F1, 61-class); 42.86% on an external unaligned PlantDoc benchmark; rejected 9/9 non-leaf test images (N=9).',
  problem:
    'Classifiers trained on lab photos fail on real field photos and confidently misclassify non-leaf images.',
  underTheHood: [
    '60-class plant disease classifier (ConvNeXt, PyTorch) plus an explicit background/non-leaf class (61 classes total); trained on PlantDoc + PlantVillage on a Colab A100.',
    'Switched architecture from EfficientNetB0 (which worked only on lab-style images) to ConvNeXt.',
    'Dual-gate inference pipeline: Stage 1 MobileNetV3 leaf/non-leaf filter rejects uploads if P(leaf) < 0.80; Stage 2 ConvNeXt classifier rejects anything predicted as the explicit background class.',
    'Training logs a free-energy out-of-distribution (OOD) AUROC as a secondary checkpoint gate (>= 0.95).',
    'Crop recommender: Random Forest across 22 crops and 7 features with Mahalanobis OOD gating.',
    'Agronomy & geospatial modules: weather/GDD/drought indices (Open-Meteo), SoilGrids soil data, Sentinel-2 NDVI/EVI/NDWI, KML/KMZ/GeoJSON field boundary import.',
    'Working mandi marketplace backed by PostgreSQL CRUD, plus an AI agronomy advisor powered by Gemini 2.5 Flash with a local RAG fallback.',
  ],
  stack: ['Next.js', 'FastAPI/Uvicorn', 'PostgreSQL', 'Docker Compose', 'PyTorch'],
  testRouteSteps: [
    {
      step: '01',
      name: 'Input Upload',
      detail: 'Field photo or arbitrary image enters the inspection lane.',
    },
    {
      step: '02',
      name: 'Gate 1: MobileNetV3 Leaf Filter',
      detail: 'Checks P(leaf) >= 0.80. Non-leaf objects are rejected before disease classification.',
    },
    {
      step: '03',
      name: 'Gate 2: ConvNeXt 61-Class + Background Gate',
      detail: 'Classifies across 60 disease classes + 1 explicit background class (OOD checkpoint gate AUROC >= 0.95).',
    },
    {
      step: '04',
      name: 'Agronomy & Advisory Output',
      detail: 'Returns diagnosis or rejection reason, paired with Gemini 2.5 Flash + local RAG fallback.',
    },
  ],
  resultsTable: [
    {
      metric: 'Disease Classifier Validation Accuracy',
      value: '97.65%',
      context: 'Peak validation accuracy (61-class, in-distribution, PlantDoc + PlantVillage)',
    },
    {
      metric: 'Disease Classifier Validation Macro-F1',
      value: '88.62%',
      context: 'Best validation macro-F1 across 61 classes (in-distribution)',
    },
    {
      metric: 'Two-Stage Non-Leaf Rejection Test',
      value: '9 / 9 rejected',
      context: 'Two-stage pipeline rejected all 9 non-leaf test images (small test, N=9)',
    },
    {
      metric: 'Crop Recommender Validation Accuracy',
      value: '99.09%',
      context: 'Random Forest (22 crops, 7 features, Mahalanobis OOD gating)',
    },
    {
      metric: 'Crop Recommender Held-Out Test',
      value: '100%',
      context: 'Evaluated on a 330-sample held-out test set',
    },
    {
      metric: 'External Unaligned PlantDoc Benchmark',
      value: '42.86% acc / 14.84% macro-F1',
      context: 'Out-of-domain external benchmark with domain shift and unmapped categories',
    },
  ],
  dynoVsRoad: {
    dynoLabel: 'Dyno Number (In-Distribution Validation)',
    dynoValue: 97.65,
    roadLabel: 'Real-Road Number (External Unaligned Benchmark)',
    roadValue: 42.86,
    disclaimer:
      'These two numbers are NOT equivalent: 97.65% is peak in-distribution validation accuracy across 61 classes, while 42.86% (14.84% macro-F1) is on an external unaligned PlantDoc benchmark with domain shift and unmapped categories.',
  },
  scrutineeringDemo: {
    notice: 'Illustration of the gate logic with preset examples. No model runs on this page.',
    presets: [
      {
        id: 'leaf',
        label: 'Diseased Tomato Leaf',
        gate1Prob: 'P(leaf) = 0.96 (>= 0.80)',
        gate1Passed: true,
        gate2Result: 'Class: Early Blight (Non-background)',
        gate2Passed: true,
        finalStamp: 'CLASSIFICATION RETURNED',
        inspectorStatus: 'PASSED',
      },
      {
        id: 'mug',
        label: 'Coffee Mug on Desk',
        gate1Prob: 'P(leaf) = 0.11 (< 0.80)',
        gate1Passed: false,
        gate2Result: 'Skipped (Stopped at Gate 1)',
        gate2Passed: false,
        finalStamp: 'REJECTED: NOT A LEAF',
        inspectorStatus: 'REJECTED',
      },
      {
        id: 'shoe',
        label: 'Muddy Field Boot',
        gate1Prob: 'P(leaf) = 0.24 (< 0.80)',
        gate1Passed: false,
        gate2Result: 'Skipped (Stopped at Gate 1)',
        gate2Passed: false,
        finalStamp: 'REJECTED: NOT A LEAF',
        inspectorStatus: 'REJECTED',
      },
    ],
  },
  knownLimits: [
    '42.86% accuracy / 14.84% macro-F1 on an external unaligned PlantDoc benchmark (domain shift, unmapped categories).',
    'Mandi prices are a static seeded catalog rather than a live commodity feed.',
    'Sub-field zones, barren-land segmentation, and Sentinel-1 SAR forecasting are synthetic demo layers explicitly labelled "[demo layer]".',
    'Runs locally/containerized via Docker Compose; not deployed at production scale.',
  ],
  whatsNext:
    'Expand external field-photo calibration, map unaligned PlantDoc taxonomy classes, and test non-leaf rejection on a larger out-of-distribution image set beyond N=9.',
};

