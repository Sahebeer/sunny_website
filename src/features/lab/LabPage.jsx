import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CarActor } from '../../actors/CarActor';
import { Container, Badge, Button } from '../../design/ui';
import { safeGet, useReducedMotion } from '../../lib';
import { site } from '../../content/site';
import styles from './LabPage.module.css';

const MOOD_LIST = [
  {
    id: 'neutral',
    label: 'Neutral',
    note: 'Relaxed open headlight-eyes, gentle suspension idle, friendly grille.',
  },
  {
    id: 'curious',
    label: 'Curious',
    note: 'Head tilt, asymmetric raised eyelid, arched hood-crease brow.',
  },
  {
    id: 'proud',
    label: 'Proud',
    note: 'Chest-up pitch, lifted hood-crease brows, confident grin grille.',
  },
  {
    id: 'nervous',
    label: 'Nervous',
    note: 'Darting pupils, tense lower lids, chassis jitter (used near Known Limits).',
  },
  {
    id: 'sleepy',
    label: 'Sleepy',
    note: 'Heavy drooping upper eyelids, slow breathing suspension.',
  },
  {
    id: 'shocked',
    label: 'Shocked',
    note: 'Rev-limiter vibration, wide-open headlights, pinprick pupils.',
  },
  {
    id: 'celebrating',
    label: 'Celebrating',
    note: 'Rhythmic suspension hop plus high-beam headlight flash.',
  },
];

const STAMP_OPTIONS = ['PASSED', 'REJECTED', 'NEEDS MORE TESTING'];
const MOTION_STATES = ['idle', 'accelerate', 'brake', 'stop'];

export function LabPage() {
  const mascotName = safeGet(site, 'mascotName', 'Dudu');
  const inspectorName = safeGet(site, 'inspectorName', 'Old Gasket');
  const sidekickName = safeGet(site, 'sidekickName', 'Pip');

  const [activeMood, setActiveMood] = useState('curious');
  const [speed, setSpeed] = useState(48);
  const [stampText, setStampText] = useState('PASSED');
  const [motionState, setMotionState] = useState('idle');
  const [matrixVariant, setMatrixVariant] = useState('hero');
  const [manualEyes, setManualEyes] = useState(false);
  const [lookX, setLookX] = useState(2);
  const [lookY, setLookY] = useState(-1);
  const [nightPreview, setNightPreview] = useState(false);
  const [reducedMotion, toggleReducedMotion] = useReducedMotion();

  const toggleNight = () => {
    const next = !nightPreview;
    setNightPreview(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next ? 'night' : 'day';
    }
  };

  const castMembers = [
    {
      variant: 'hero',
      name: mascotName,
      badge: 'HERO CAR · HOT-HATCH',
      badgeTone: 'cobalt',
      personality:
        'Curious, slightly overconfident, over-tests everything. Cobalt (#2F5BFF) with sunshine-yellow (#FFC72C) roof stripe.',
      specs: 'Wheel r=42 (5-spoke) · Headlight eyes 56px · Dual-gate tester',
    },
    {
      variant: 'inspector',
      name: inspectorName,
      badge: 'CHIEF INSPECTOR · WAGON',
      badgeTone: 'teal',
      personality:
        'Tall boxy station wagon in faded teal (#488B86); brass monocle bezel on right headlight; wiper blade holds rubber stamp.',
      specs: `Active Stamp: ${stampText} · Honest limits auditor`,
    },
    {
      variant: 'pip',
      name: sidekickName,
      badge: 'SIDEKICK · 3-WHEELER',
      badgeTone: 'yellow',
      personality:
        'Tiny three-wheeled delivery scooter-van in sunshine yellow (#FFC72C). Eager sidekick for warm-up gags, tooltips & hints.',
      specs: '3-wheel stance · Parcel pod · Cobalt beacon',
    },
  ];

  return (
    <main className={styles.labWrapper}>
      <Container>
        <header className={styles.topBar}>
          <div className={styles.brandBlock}>
            <span className={styles.kicker}>
              APEX HOLLOW PROVING GROUND · ART BIBLE &amp; CHARACTER ENGINE (/LAB)
            </span>
            <h1 className={styles.title}>Test Track &amp; Cast Dyno Lab</h1>
            <p className={styles.subtitle}>
              Interactive inspection rig for <code>&lt;CarActor&gt;</code>. Move your cursor to test
              headlight-eye tracking (clamped to 6px), or scrub speed, moods, chassis pitch, and Old
              Gasket&apos;s rubber stamp.
            </p>
          </div>
          <div className={styles.quickActions}>
            <Button onClick={toggleNight} variant={nightPreview ? 'yellow' : 'default'}>
              {nightPreview ? 'Daylight Mode' : 'Night Drive Mode'}
            </Button>
            <Button onClick={() => toggleReducedMotion(!reducedMotion)}>
              Motion: {reducedMotion ? 'Reduced (Static)' : 'Full Active'}
            </Button>
            <Button as={Link} to="/" variant="primary">
              Back to Town Road
            </Button>
          </div>
        </header>

        {/* Interactive Dyno Telemetry Console */}
        <section className={styles.consolePanel} aria-label="Character Lab Controls">
          <div className={styles.consoleGrid}>
            {/* Mood Selector */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>
                <span>Acting Mood</span>
                <span className={styles.monoValue}>{activeMood.toUpperCase()}</span>
              </span>
              <div className={styles.pillGroup} role="group" aria-label="Select mood">
                {MOOD_LIST.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMood(m.id)}
                    className={`${styles.pillBtn} ${
                       m.id === 'nervous' ? styles.pillBtnWarn : ''
                    } ${activeMood === m.id ? styles.pillBtnActive : ''}`.trim()}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyno Speed & Chassis Pitch */}
            <div className={styles.controlGroup}>
              <label htmlFor="lab-speed-slider" className={styles.controlLabel}>
                <span>Dyno Roller Speed (Wheel Spin)</span>
                <span className={styles.monoValue}>{speed} km/h</span>
              </label>
              <input
                id="lab-speed-slider"
                type="range"
                min="0"
                max="120"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <span className={styles.controlLabel} style={{ marginTop: '0.35rem' }}>
                <span>Chassis Pitch / Squash</span>
                <span className={styles.monoValue}>{motionState.toUpperCase()}</span>
              </span>
              <div className={styles.pillGroup}>
                {MOTION_STATES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setMotionState(st)}
                    className={`${styles.pillBtn} ${
                      motionState === st ? styles.pillBtnActive : ''
                    }`.trim()}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Old Gasket Rubber Stamp & Eye Gaze */}
            <div className={styles.controlGroup}>
              <span className={styles.controlLabel}>
                <span>Old Gasket Wiper Stamp</span>
              </span>
              <div className={styles.pillGroup}>
                {STAMP_OPTIONS.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStampText(st)}
                    className={`${styles.pillBtn} ${
                      st === 'REJECTED' ? styles.pillBtnWarn : ''
                    } ${stampText === st ? styles.pillBtnActive : ''}`.trim()}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '0.45rem' }}>
                <label className={styles.controlLabel}>
                  <span>Headlight Eye Gaze (Max 6px)</span>
                  <button
                    type="button"
                    onClick={() => setManualEyes(!manualEyes)}
                    className={styles.pillBtn}
                  >
                    {manualEyes ? 'Manual Sliders' : 'Cursor Track'}
                  </button>
                </label>
                {manualEyes && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.3rem' }}>
                    <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      lookX ({lookX}px)
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="1"
                        value={lookX}
                        onChange={(e) => setLookX(Number(e.target.value))}
                        className={styles.rangeInput}
                      />
                    </label>
                    <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                      lookY ({lookY}px)
                      <input
                        type="range"
                        min="-6"
                        max="6"
                        step="1"
                        value={lookY}
                        onChange={(e) => setLookY(Number(e.target.value))}
                        className={styles.rangeInput}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Original Cast Trio: Side & Front Views */}
        <section aria-labelledby="cast-lineup-heading">
          <div className={styles.sectionHeader}>
            <h2 id="cast-lineup-heading" className={styles.sectionTitle}>
              1. Original Cast Lineup — Side (480×270) &amp; Front Portrait (360×270)
            </h2>
            <span className={styles.sectionMeta}>
              HEADLIGHT EYES ONLY · NO WINDSHIELD EYES · RED RESERVED FOR WARNINGS/LIMITS
            </span>
          </div>

          <div className={styles.castGrid}>
            {castMembers.map((member) => (
              <article key={member.variant} className={styles.castCard}>
                <div className={styles.castHeader}>
                  <div className={styles.castTitleRow}>
                    <h3 className={styles.castName}>{member.name}</h3>
                    <Badge tone={member.badgeTone}>{member.badge}</Badge>
                  </div>
                  <p className={styles.castPersonality}>{member.personality}</p>
                </div>

                <div className={styles.stageGrid}>
                  <div className={styles.stageCell}>
                    <span className={styles.stageTag}>SIDE VIEW · 480×270</span>
                    <CarActor
                      variant={member.variant}
                      view="side"
                      mood={activeMood}
                      speed={speed}
                      lookX={manualEyes ? lookX : undefined}
                      lookY={manualEyes ? lookY : undefined}
                      stampText={stampText}
                      headlightsOn={nightPreview}
                      motionState={motionState}
                      ariaHidden={false}
                      label={`${member.name} side view in ${activeMood} mood`}
                    />
                  </div>
                  <div className={styles.stageCell}>
                    <span className={styles.stageTag}>FRONT PORTRAIT · 360×270</span>
                    <CarActor
                      variant={member.variant}
                      view="front"
                      mood={activeMood}
                      speed={speed}
                      lookX={manualEyes ? lookX : undefined}
                      lookY={manualEyes ? lookY : undefined}
                      stampText={stampText}
                      headlightsOn={nightPreview}
                      motionState={motionState}
                      ariaHidden={false}
                      label={`${member.name} front portrait in ${activeMood} mood`}
                    />
                  </div>
                </div>

                <div className={styles.castSpecFooter}>
                  <span>{member.specs}</span>
                  <span>MOOD: {activeMood.toUpperCase()}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* All 7 Moods Acting Sheet */}
        <section aria-labelledby="mood-sheet-heading">
          <div className={styles.sectionHeader}>
            <h2 id="mood-sheet-heading" className={styles.sectionTitle}>
              2. Complete Acting &amp; Expression Sheet (All 7 Moods)
            </h2>
            <div className={styles.pillGroup} role="group" aria-label="Filter mood matrix by character">
              {castMembers.map((m) => (
                <button
                  key={m.variant}
                  type="button"
                  onClick={() => setMatrixVariant(m.variant)}
                  className={`${styles.pillBtn} ${
                    matrixVariant === m.variant ? styles.pillBtnActive : ''
                  }`.trim()}
                >
                  Inspect: {m.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.moodMatrixGrid}>
            {MOOD_LIST.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMood(m.id)}
                className={`${styles.moodTile} ${
                  activeMood === m.id ? styles.moodTileActive : ''
                }`.trim()}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.moodTileHeader}>
                  <span className={styles.moodName}>{m.label}</span>
                  <Badge tone={m.id === 'nervous' ? 'limit' : 'default'}>{m.id}</Badge>
                </div>
                <p className={styles.moodNote}>{m.note}</p>
                <CarActor
                  variant={matrixVariant}
                  view="front"
                  mood={m.id}
                  speed={speed}
                  stampText={m.id === 'nervous' ? 'REJECTED' : stampText}
                  headlightsOn={nightPreview}
                />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

export default LabPage;
