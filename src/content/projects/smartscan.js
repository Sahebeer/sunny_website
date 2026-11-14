export const smartscan = {
  id: 'smartscan',
  number: '03',
  slug: 'smart-scan',
  title: 'Smart Scan for Electronic Warfare (SIH 2026)',
  roleBadge: 'RADIO TOWER · SIH IDEA',
  buildingName: 'Radio Tower',
  teamNote: 'Shortlisted problem statement SIH26055 (DRDO, Ministry of Education’s Innovation Cell).',
  status: 'IN PROGRESS: no results yet',
  oneLiner: 'Reinforcement-learning adaptive scheduler concept for electronic-warfare signal interception.',
  evidenceLine:
    'IN PROGRESS (SIH26055 shortlisted problem statement, DRDO): conceptual closed-loop scan scheduler; no results exist yet.',
  problem:
    'Open-loop receiver sweeps spend equal dwell time across quiet bands and miss short, intermittent emitters in contested spectrum.',
  underTheHood: [
    'Shortlisted problem statement SIH26055 (DRDO, Ministry of Education’s Innovation Cell).',
    'Core concept: a reinforcement-learning adaptive scheduler for electronic-warfare signal interception.',
    'Replaces fixed open-loop frequency sweeps with a closed-loop receiver scheduler that learns which frequency bands and time slots to scan.',
    'Planned figures of merit: probability of detection, false-alarm probability, average intercept rate, and intercept time error.',
  ],
  stack: ['Reinforcement Learning (Conceptual)', 'Closed-Loop Scheduling', 'SIH26055 Problem Statement'],
  testRouteSteps: [
    {
      step: '01',
      name: 'Baseline: Open-Loop Sweep',
      detail: 'Sequential scan across all frequency bands regardless of activity history.',
    },
    {
      step: '02',
      name: 'Closed-Loop Observation',
      detail: 'Receiver logs band occupancy outcomes across frequency bands and time slots.',
    },
    {
      step: '03',
      name: 'Adaptive Scan Policy',
      detail: 'RL scheduler selects next band and dwell slot to prioritize likely emitters.',
    },
    {
      step: '04',
      name: 'Planned Figures of Merit',
      detail: 'Evaluate probability of detection, false-alarm probability, average intercept rate, and intercept time error.',
    },
  ],
  resultsTable: [
    {
      metric: 'Current Project Status',
      value: 'IN PROGRESS: no results yet',
      context: 'Shortlisted problem statement SIH26055 (DRDO, Ministry of Education’s Innovation Cell)',
    },
    {
      metric: 'Planned Figure of Merit 1',
      value: 'Pending evaluation',
      context: 'Probability of detection',
    },
    {
      metric: 'Planned Figure of Merit 2',
      value: 'Pending evaluation',
      context: 'False-alarm probability',
    },
    {
      metric: 'Planned Figure of Merit 3',
      value: 'Pending evaluation',
      context: 'Average intercept rate & intercept time error',
    },
  ],
  knownLimits: [
    'IN PROGRESS: no results exist yet. No simulation metrics or hardware benchmarks have been produced.',
    'Conceptual formulation for SIH26055; implementation details are not yet finalized.',
  ],
  whatsNext:
    'Build the baseline open-loop sweep simulator and measure the four planned figures of merit against a closed-loop RL scheduler.',
};

