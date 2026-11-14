export const videopipeline = {
  id: 'videopipeline',
  number: '04',
  slug: 'video-pipeline',
  title: 'Automated Short-Form Video Pipeline',
  roleBadge: 'DRIVE-IN CINEMA',
  buildingName: 'Drive-in Cinema',
  teamNote: 'Small automation workflow.',
  status: 'CHECKED',
  oneLiner: 'Scheduled GitHub Actions pipeline generating and publishing short-form videos to YouTube.',
  evidenceLine:
    'Runs MoneyPrinterTurbo on GitHub Actions free tier with Gemini Flash scripts, Edge TTS, and stock footage APIs; constrained by free API quotas.',
  problem:
    'Manual scripting, voiceover generation, footage matching, and upload scheduling for short-form video is repetitive.',
  underTheHood: [
    'Built on MoneyPrinterTurbo running on the GitHub Actions free tier.',
    'Uses Gemini Flash for script generation and Edge TTS for voice synthesis.',
    'Pulls visuals from stock footage APIs and runs scheduled publishing directly to YouTube.',
    'Currently exploring Hugging Face ZeroGPU for text-to-video generation.',
  ],
  stack: ['GitHub Actions', 'MoneyPrinterTurbo', 'Gemini Flash', 'Edge TTS', 'YouTube API'],
  testRouteSteps: [
    {
      step: '01',
      name: 'Scheduled Workflow Trigger',
      detail: 'GitHub Actions cron job wakes the pipeline on the free tier.',
    },
    {
      step: '02',
      name: 'Script & Voice Synthesis',
      detail: 'Gemini Flash drafts the script; Edge TTS synthesizes narration.',
    },
    {
      step: '03',
      name: 'Footage Assembly',
      detail: 'MoneyPrinterTurbo pairs narration with clips from stock footage APIs.',
    },
    {
      step: '04',
      name: 'Scheduled YouTube Publish',
      detail: 'Uploads completed short-form video if free-tier API quotas permit.',
    },
  ],
  resultsTable: [
    {
      metric: 'Execution Host',
      value: 'GitHub Actions (Free Tier)',
      context: 'Automated scheduled workflow runs',
    },
    {
      metric: 'Script & Audio Stack',
      value: 'Gemini Flash + Edge TTS',
      context: 'Paired with stock footage APIs via MoneyPrinterTurbo',
    },
    {
      metric: 'Primary Bottleneck',
      value: 'Free API Quotas',
      context: 'Runs halt when external free-tier API rate/quota limits are exhausted',
    },
  ],
  knownLimits: [
    'Strictly depends on free API quotas across GitHub Actions, Gemini Flash, stock footage APIs, and YouTube publishing.',
    'Uses stock footage matching rather than custom generative video (currently exploring Hugging Face ZeroGPU for text-to-video).',
  ],
  whatsNext:
    'Test Hugging Face ZeroGPU for text-to-video segments while keeping compute within free-tier runner budgets.',
};

