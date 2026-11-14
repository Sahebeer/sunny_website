let soundEnabled = false;
let audioCtx = null;

function getAudioContext() {
  if (!soundEnabled || typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('apex-sound-change', { detail: soundEnabled }));
  }
  return soundEnabled;
}

export function playRev() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    sub.type = 'triangle';

    osc.frequency.setValueAtTime(68, now);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.55);

    sub.frequency.setValueAtTime(34, now);
    sub.frequency.exponentialRampToValueAtTime(105, now + 0.22);
    sub.frequency.exponentialRampToValueAtTime(42, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    sub.start(now);
    osc.stop(now + 0.6);
    sub.stop(now + 0.6);
  } catch {
    // fail silently
  }
}

export function playHorn() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const playBeep = (startOffset, duration) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(440, now + startOffset);
      osc2.frequency.setValueAtTime(554.37, now + startOffset);

      gain.gain.setValueAtTime(0.001, now + startOffset);
      gain.gain.linearRampToValueAtTime(0.1, now + startOffset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now + startOffset);
      osc2.start(now + startOffset);
      osc1.stop(now + startOffset + duration + 0.02);
      osc2.stop(now + startOffset + duration + 0.02);
    };

    playBeep(0, 0.11);
    playBeep(0.15, 0.16);
  } catch {
    // fail silently
  }
}

export function playIndicatorTick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.03);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // fail silently
  }
}
