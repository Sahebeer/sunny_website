import React, { useId, useRef, useState, useEffect } from 'react';
import { useReducedMotion, useInView } from '../../lib';
import styles from './CarActor.module.css';

const VALID_MOODS = [
  'neutral',
  'curious',
  'proud',
  'nervous',
  'sleepy',
  'shocked',
  'celebrating',
];

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function Wheel({ cx, cy, r = 42, hubColor = '#F4F6FB', accentColor = '#2F5BFF', isSpinning }) {
  const innerRim = r * 0.64;
  const hubCapR = r * 0.22;
  const spokeAngles = [0, 72, 144, 216, 288];

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Tire outer rubber */}
      <circle
        cx="0"
        cy="0"
        r={r}
        fill="#1F222A"
        stroke="#12141A"
        strokeWidth="3"
      />
      {/* Tire sidewall highlight ring */}
      <circle
        cx="0"
        cy="0"
        r={r * 0.84}
        fill="none"
        stroke="#323744"
        strokeWidth="2"
        strokeDasharray="18 10"
      />
      {/* Deep dish alloy lip */}
      <circle
        cx="0"
        cy="0"
        r={innerRim}
        fill="#2B303C"
        stroke="#12141A"
        strokeWidth="2.5"
      />
      {/* Rotating 5-spoke hub */}
      <g className={isSpinning ? styles.wheelSpokes : undefined}>
        {spokeAngles.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x2 = Math.cos(rad) * (innerRim - 2);
          const y2 = Math.sin(rad) * (innerRim - 2);
          return (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2={x2}
              y2={y2}
              stroke={hubColor}
              strokeWidth={r * 0.16}
              strokeLinecap="round"
            />
          );
        })}
        {/* Lug nut detail */}
        {spokeAngles.map((deg) => {
          const rad = ((deg + 36) * Math.PI) / 180;
          const lx = Math.cos(rad) * (r * 0.34);
          const ly = Math.sin(rad) * (r * 0.34);
          return <circle key={`lug-${deg}`} cx={lx} cy={ly} r="2.2" fill="#17191E" />;
        })}
        {/* Center cap */}
        <circle
          cx="0"
          cy="0"
          r={hubCapR}
          fill={accentColor}
          stroke="#12141A"
          strokeWidth="2"
        />
        <circle cx="-2" cy="-2" r={hubCapR * 0.35} fill="#FFFFFF" opacity="0.65" />
      </g>
    </g>
  );
}

function FrontGrilleMouth({ mood, variant }) {
  const isInspector = variant === 'inspector';
  const isPip = variant === 'pip';
  const yBase = isPip ? 196 : isInspector ? 194 : 192;
  const widthHalf = isPip ? 34 : isInspector ? 56 : 52;
  const cx = 180;

  if (mood === 'shocked') {
    return (
      <g>
        <rect
          x={cx - 26}
          y={yBase - 14}
          width="52"
          height="30"
          rx="15"
          fill="#161920"
          stroke="#12141A"
          strokeWidth="3"
        />
        <line x1={cx - 12} y1={yBase - 12} x2={cx - 12} y2={yBase + 14} stroke="#383F4E" strokeWidth="2" />
        <line x1={cx} y1={yBase - 13} x2={cx} y2={yBase + 15} stroke="#383F4E" strokeWidth="2" />
        <line x1={cx + 12} y1={yBase - 12} x2={cx + 12} y2={yBase + 14} stroke="#383F4E" strokeWidth="2" />
      </g>
    );
  }

  if (mood === 'celebrating' || mood === 'proud') {
    const smileDepth = mood === 'celebrating' ? 28 : 20;
    return (
      <g>
        <path
          d={`M ${cx - widthHalf} ${yBase - 6} Q ${cx} ${yBase - 2} ${cx + widthHalf} ${yBase - 6} Q ${cx + widthHalf - 6} ${yBase + smileDepth} ${cx} ${yBase + smileDepth} Q ${cx - widthHalf + 6} ${yBase + smileDepth} ${cx - widthHalf} ${yBase - 6} Z`}
          fill="#181B22"
          stroke="#12141A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d={`M ${cx - widthHalf + 10} ${yBase + 2} Q ${cx} ${yBase + 8} ${cx + widthHalf - 10} ${yBase + 2}`}
          fill="none"
          stroke="#DDE3F0"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (mood === 'nervous') {
    return (
      <g>
        <rect
          x={cx - widthHalf}
          y={yBase - 8}
          width={widthHalf * 2}
          height="20"
          rx="9"
          fill="#181B22"
          stroke="#12141A"
          strokeWidth="3"
        />
        <path
          d={`M ${cx - widthHalf + 8} ${yBase + 2} L ${cx - 24} ${yBase - 3} L ${cx - 8} ${yBase + 5} L ${cx + 8} ${yBase - 3} L ${cx + 24} ${yBase + 5} L ${cx + widthHalf - 8} ${yBase - 1}`}
          fill="none"
          stroke="#CFD6E6"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  if (mood === 'curious') {
    return (
      <g>
        <path
          d={`M ${cx - widthHalf + 6} ${yBase + 2} Q ${cx - 8} ${yBase + 4} ${cx + widthHalf - 4} ${yBase - 7} Q ${cx + widthHalf} ${yBase + 10} ${cx + 6} ${yBase + 13} Q ${cx - widthHalf + 4} ${yBase + 14} ${cx - widthHalf + 6} ${yBase + 2} Z`}
          fill="#181B22"
          stroke="#12141A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line
          x1={cx - 24}
          y1={yBase + 5}
          x2={cx + 28}
          y2={yBase + 1}
          stroke="#6A7386"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    );
  }

  if (mood === 'sleepy') {
    return (
      <g>
        <rect
          x={cx - 28}
          y={yBase - 4}
          width="56"
          height="12"
          rx="6"
          fill="#181B22"
          stroke="#12141A"
          strokeWidth="2.8"
        />
      </g>
    );
  }

  // Default: neutral
  return (
    <g>
      <path
        d={`M ${cx - widthHalf} ${yBase - 4} Q ${cx} ${yBase + 2} ${cx + widthHalf} ${yBase - 4} L ${cx + widthHalf - 5} ${yBase + 11} Q ${cx} ${yBase + 17} ${cx - widthHalf + 5} ${yBase + 11} Z`}
        fill="#181B22"
        stroke="#12141A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1={cx - 26} y1={yBase - 2} x2={cx - 26} y2={yBase + 12} stroke="#424959" strokeWidth="2.2" />
      <line x1={cx} y1={yBase - 1} x2={cx} y2={yBase + 14} stroke="#424959" strokeWidth="2.2" />
      <line x1={cx + 26} y1={yBase - 2} x2={cx + 26} y2={yBase + 12} stroke="#424959" strokeWidth="2.2" />
    </g>
  );
}

function InspectorWiperStamp({ x, y, stampText = 'PASSED', scale = 1 }) {
  const upper = String(stampText).toUpperCase();
  const isRed = upper.includes('REJECT') || upper.includes('LIMIT') || upper.includes('FAIL');
  const isWarn = upper.includes('MORE') || upper.includes('TEST') || upper.includes('PENDING');
  const badgeFill = isRed ? '#FDEAEA' : isWarn ? '#FFF6D6' : '#E5F6ED';
  const badgeStroke = isRed ? '#D62828' : isWarn ? '#C99000' : '#1C7C49';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} className={styles.wiperArm}>
      {/* Wiper pivot nut */}
      <circle cx="0" cy="0" r="5" fill="#1E222B" stroke="#12141A" strokeWidth="2" />
      {/* Articulated wiper arm */}
      <path
        d="M 0 0 L 18 -34 L 38 -30"
        fill="none"
        stroke="#1E222B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Rubber stamp handle */}
      <rect
        x="34"
        y="-42"
        width="14"
        height="10"
        rx="2"
        fill="#8C5A2B"
        stroke="#12141A"
        strokeWidth="2"
      />
      {/* Stamp plaque */}
      <g transform="translate(24, -64) rotate(-5)">
        <rect
          x="0"
          y="0"
          width="112"
          height="24"
          rx="4"
          fill={badgeFill}
          stroke={badgeStroke}
          strokeWidth="2.4"
        />
        <text
          x="56"
          y="16"
          textAnchor="middle"
          fill={badgeStroke}
          fontFamily="var(--font-label, sans-serif)"
          fontWeight="800"
          fontSize="11"
          letterSpacing="0.8"
        >
          {upper}
        </text>
      </g>
    </g>
  );
}

export function CarActor({
  variant = 'hero',
  view = 'side',
  mood = 'neutral',
  speed = 0,
  lookX,
  lookY,
  stampText = 'PASSED',
  headlightsOn = false,
  motionState = 'idle',
  interactive = true,
  ariaHidden = true,
  label,
  className = '',
}) {
  const uid = useId().replace(/:/g, '');
  const rootRef = useRef(null);
  const isInView = useInView(rootRef);
  const [reducedMotion] = useReducedMotion();

  const [cursorLook, setCursorLook] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  const safeMood = VALID_MOODS.includes(mood) ? mood : 'neutral';
  const numericSpeed = clamp(Number(speed) || 0, 0, 120);
  const isSpinning = numericSpeed > 0 && isInView && !reducedMotion;
  const spinDuration =
    numericSpeed > 0 ? `${clamp(1.8 - (numericSpeed / 120) * 1.45, 0.22, 1.8).toFixed(2)}s` : '0s';

  // Randomized natural blink every 3 to 6 seconds
  useEffect(() => {
    if (reducedMotion || !isInView || safeMood === 'sleepy') {
      setIsBlinking(false);
      return undefined;
    }

    let blinkTimer = null;
    let openTimer = null;

    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      blinkTimer = window.setTimeout(() => {
        setIsBlinking(true);
        openTimer = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 140);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      if (blinkTimer) window.clearTimeout(blinkTimer);
      if (openTimer) window.clearTimeout(openTimer);
    };
  }, [reducedMotion, isInView, safeMood]);

  // Cursor eye-tracking (clamped to max 6px, disabled on touch & reduced motion)
  useEffect(() => {
    if (
      !interactive ||
      reducedMotion ||
      !isInView ||
      typeof lookX === 'number' ||
      typeof lookY === 'number' ||
      typeof window === 'undefined'
    ) {
      return undefined;
    }

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return undefined;
    }

    const handleMouseMove = (e) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / 45;
      const dy = (e.clientY - centerY) / 45;
      setCursorLook({
        x: clamp(dx, -6, 6),
        y: clamp(dy, -6, 6),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, reducedMotion, isInView, lookX, lookY]);

  const finalLookX = clamp(typeof lookX === 'number' ? lookX : cursorLook.x, -6, 6);
  const finalLookY = clamp(typeof lookY === 'number' ? lookY : cursorLook.y, -6, 6);

  const palette =
    variant === 'inspector'
      ? {
          bodyMain: '#488B86',
          bodyShadow: '#2F6460',
          bodyHighlight: '#72B5B0',
          stripe: '#D8C39E',
          hubAccent: '#488B86',
          eyeIris: '#2F6460',
           lidColor: '#3B7570',
        }
      : variant === 'pip'
      ? {
          bodyMain: '#FFC72C',
          bodyShadow: '#D99B00',
          bodyHighlight: '#FFE17D',
          stripe: '#2F5BFF',
          hubAccent: '#2F5BFF',
          eyeIris: '#2F5BFF',
          lidColor: '#E5AD12',
        }
      : {
          // Hero ("Dudu") - Cobalt #2F5BFF with Sunshine-Yellow #FFC72C roof stripe
          bodyMain: '#2F5BFF',
          bodyShadow: '#1B3FCC',
          bodyHighlight: '#6688FF',
          stripe: '#FFC72C',
          hubAccent: '#FFC72C',
          eyeIris: '#1B3FCC',
          lidColor: '#254CE0',
        };

  const rootClassNames = [
    styles.actorRoot,
    styles[`mood_${safeMood}`],
    motionState && motionState !== 'idle' ? styles[`motion_${motionState}`] : '',
    isBlinking ? styles.isBlinking : '',
    !isInView ? styles.paused : '',
    reducedMotion ? styles.reducedMotion : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cssVars = {
    '--pupil-x': `${finalLookX.toFixed(2)}px`,
    '--pupil-y': `${finalLookY.toFixed(2)}px`,
    '--wheel-spin-duration': spinDuration,
  };

  // ==================== FRONT PORTRAIT VIEW ====================
  if (view === 'front') {
    const leftEyeClip = `left-eye-${uid}`;
    const rightEyeClip = `right-eye-${uid}`;
    const leftEyeX = variant === 'pip' ? 132 : 112;
    const rightEyeX = variant === 'pip' ? 228 : 248;
    const eyeY = variant === 'pip' ? 148 : 146;
    const eyeR = 28; // 56px diameter per Art Bible

    return (
      <div
        ref={rootRef}
        className={rootClassNames}
        style={cssVars}
        data-variant={variant}
        data-view="front"
        data-mood={safeMood}
      >
        <svg
          viewBox="0 0 360 270"
          className={styles.svgCanvas}
          aria-hidden={ariaHidden ? 'true' : undefined}
          role={ariaHidden ? undefined : 'img'}
          aria-label={ariaHidden ? undefined : label || `${variant} car portrait (${safeMood})`}
        >
          <defs>
            <clipPath id={leftEyeClip}>
              <circle cx={leftEyeX} cy={eyeY} r={eyeR} />
            </clipPath>
            <clipPath id={rightEyeClip}>
              <circle cx={rightEyeX} cy={eyeY} r={eyeR} />
            </clipPath>
          </defs>

          {/* Ground shadow ellipse */}
          <ellipse cx="180" cy="244" rx={variant === 'pip' ? 98 : 136} ry="14" fill="#12141A" opacity="0.22" />

          {/* Tires / Front stance */}
          {variant === 'pip' ? (
            <g>
              {/* Single centered front scooter wheel + two rear stabilizer wheels */}
              <rect x="74" y="198" width="28" height="46" rx="8" fill="#1F222A" stroke="#12141A" strokeWidth="3" />
              <rect x="258" y="198" width="28" height="46" rx="8" fill="#1F222A" stroke="#12141A" strokeWidth="3" />
              <rect x="162" y="202" width="36" height="46" rx="12" fill="#1A1D24" stroke="#12141A" strokeWidth="3" />
              <line x1="180" y1="208" x2="180" y2="242" stroke="#323744" strokeWidth="3" strokeDasharray="5 4" />
            </g>
          ) : (
            <g>
              {/* Left & Right Wide Front Tires */}
              <rect x="44" y="188" width="44" height="56" rx="11" fill="#1F222A" stroke="#12141A" strokeWidth="3" />
              <line x1="56" y1="196" x2="56" y2="236" stroke="#323744" strokeWidth="2.5" strokeDasharray="6 5" />
              <rect x="272" y="188" width="44" height="56" rx="11" fill="#1F222A" stroke="#12141A" strokeWidth="3" />
              <line x1="304" y1="196" x2="304" y2="236" stroke="#323744" strokeWidth="2.5" strokeDasharray="6 5" />
            </g>
          )}

          {/* Animated Front Chassis & Suspension */}
          <g className={styles.frontChassisGroup}>
            <g className={styles.suspensionBounce}>
              {/* Roof Rack or Beacon */}
              {variant === 'inspector' && (
                <g>
                  <path
                    d="M 96 42 L 96 28 L 264 28 L 264 42"
                    fill="none"
                    stroke="#5C6475"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="114" y="22" width="132" height="9" rx="3" fill="#B58952" stroke="#12141A" strokeWidth="2.2" />
                </g>
              )}

              {variant === 'pip' && (
                <g>
                  {/* Delivery box peeking above cab + cobalt beacon */}
                  <rect x="104" y="24" width="152" height="32" rx="8" fill="#FFF3C4" stroke="#12141A" strokeWidth="2.8" />
                  <rect x="166" y="12" width="28" height="14" rx="6" fill="#2F5BFF" stroke="#12141A" strokeWidth="2.5" />
                </g>
              )}

              {/* Side Mirrors */}
              <path
                d={
                  variant === 'pip'
                    ? 'M 86 102 C 62 96, 58 116, 82 118 Z'
                    : 'M 68 106 C 38 100, 36 124, 66 124 Z'
                }
                fill={palette.bodyMain}
                stroke="#12141A"
                strokeWidth="3"
              />
              <path
                d={
                  variant === 'pip'
                    ? 'M 274 102 C 298 96, 302 116, 278 118 Z'
                    : 'M 292 106 C 322 100, 324 124, 294 124 Z'
                }
                fill={palette.bodyMain}
                stroke="#12141A"
                strokeWidth="3"
              />

              {/* Upper Cabin / Greenhouse Silhouette */}
              {variant === 'inspector' ? (
                <path
                  d="M 78 114 L 90 42 Q 180 36 270 42 L 282 114 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
              ) : variant === 'pip' ? (
                <path
                  d="M 90 116 C 94 52, 120 42, 180 42 C 240 42, 266 52, 270 116 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M 72 114 C 84 54, 114 42, 180 42 C 246 42, 276 54, 288 114 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
              )}

              {/* Hero Sunshine-Yellow Roof Stripe */}
              {variant === 'hero' && (
                <path
                  d="M 150 43 L 210 43 L 218 114 L 142 114 Z"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="2.4"
                />
              )}

              {/* Windshield Glass (NO eyes on windshield—clean glass reflection streaks only!) */}
              <path
                d={
                  variant === 'inspector'
                    ? 'M 92 108 L 100 52 Q 180 48 260 52 L 268 108 Z'
                    : variant === 'pip'
                    ? 'M 102 108 C 106 64, 128 54, 180 54 C 232 54, 254 64, 258 108 Z'
                    : 'M 88 108 C 96 64, 122 54, 180 54 C 238 54, 264 64, 272 108 Z'
                }
                fill="#1D2636"
                stroke="#12141A"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Interior dashboard glow in Night Drive */}
              <ellipse cx="180" cy="102" rx="64" ry="8" fill="var(--window-lit-color)" opacity="0.22" />
              {/* Crisp diagonal glass reflection streaks */}
              <path d="M 114 98 L 140 60 L 154 60 L 128 98 Z" fill="#FFFFFF" opacity="0.22" />
              <path d="M 160 98 L 186 60 L 193 60 L 167 98 Z" fill="#FFFFFF" opacity="0.14" />

              {/* Main Front Hood & Fender Body */}
              <path
                d={
                  variant === 'pip'
                    ? 'M 72 114 C 66 136, 66 196, 82 214 L 278 214 C 294 196, 294 136, 288 114 Z'
                    : 'M 48 112 C 36 138, 38 196, 56 216 L 304 216 C 322 196, 324 138, 312 112 Z'
                }
                fill={palette.bodyMain}
                stroke="#12141A"
                strokeWidth="3.4"
                strokeLinejoin="round"
              />

              {/* Lower Bumper Valance Shadow */}
              <path
                d={
                  variant === 'pip'
                    ? 'M 76 186 L 284 186 L 278 214 L 82 214 Z'
                    : 'M 50 184 L 310 184 L 304 216 L 56 216 Z'
                }
                fill={palette.bodyShadow}
                stroke="#12141A"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Hero Center Sunshine-Yellow Hood Stripe */}
              {variant === 'hero' && (
                <path
                  d="M 148 112 L 212 112 L 204 176 L 156 176 Z"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="2.5"
                />
              )}

              {/* Inspector Wood/Cream Trim Bar */}
              {variant === 'inspector' && (
                <rect
                  x="52"
                  y="176"
                  width="256"
                  height="10"
                  rx="3"
                  fill="#D8C39E"
                  stroke="#12141A"
                  strokeWidth="2.2"
                />
              )}

              {/* Pip Cobalt Delivery Stripe */}
              {variant === 'pip' && (
                <rect
                  x="156"
                  y="114"
                  width="48"
                  height="64"
                  rx="6"
                  fill="#2F5BFF"
                  stroke="#12141A"
                  strokeWidth="2.4"
                />
              )}

              {/* ==================== LEFT HEADLIGHT EYE (56px / r=28) ==================== */}
              <g>
                {/* Chrome / Dark Bezel */}
                <circle
                  cx={leftEyeX}
                  cy={eyeY}
                  r={eyeR + 4}
                  fill="#E4E9F2"
                  stroke="#12141A"
                  strokeWidth="3"
                />
                {/* Headlight Lens Base */}
                <circle cx={leftEyeX} cy={eyeY} r={eyeR} fill="#FFFDF7" />
                <g clipPath={`url(#${leftEyeClip})`}>
                  {/* Warm inner headlight ring */}
                  <circle
                    cx={leftEyeX}
                    cy={eyeY}
                    r={eyeR - 3}
                    fill="none"
                    stroke="#E8E2D0"
                    strokeWidth="2"
                  />
                  {/* Tracking Pupil Group */}
                  <g className={styles.pupilGroup}>
                    <circle cx={leftEyeX} cy={eyeY} r="14.5" fill={palette.eyeIris} />
                    <circle cx={leftEyeX} cy={eyeY} r="9.5" fill="#12141A" />
                    <circle cx={leftEyeX - 4.5} cy={eyeY - 5} r="4" fill="#FFFFFF" />
                    <circle cx={leftEyeX + 4} cy={eyeY + 4} r="1.8" fill="#FFFFFF" opacity="0.85" />
                  </g>
                  {/* Clipped Upper Eyelid */}
                  <rect
                    x={leftEyeX - eyeR - 2}
                    y={eyeY - eyeR - 2}
                    width={eyeR * 2 + 4}
                    height={eyeR * 2 + 4}
                    fill={palette.lidColor}
                    stroke="#12141A"
                    strokeWidth="2.5"
                    className={styles.lidTopLeft}
                  />
                  {/* Clipped Lower Eyelid */}
                  <rect
                    x={leftEyeX - eyeR - 2}
                    y={eyeY - eyeR - 2}
                    width={eyeR * 2 + 4}
                    height={eyeR * 2 + 4}
                    fill={palette.lidColor}
                    stroke="#12141A"
                    strokeWidth="2.5"
                    className={styles.lidBottomLeft}
                  />
                </g>
                <circle
                  cx={leftEyeX}
                  cy={eyeY}
                  r={eyeR}
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="3"
                />
              </g>

              {/* ==================== RIGHT HEADLIGHT EYE (56px / r=28) ==================== */}
              <g>
                {/* Inspector Brass Monocle Bezel + Chain */}
                {variant === 'inspector' ? (
                  <g>
                    <circle
                      cx={rightEyeX}
                      cy={eyeY}
                      r={eyeR + 7}
                      fill="#F2B705"
                      stroke="#12141A"
                      strokeWidth="3"
                    />
                    {/* Monocle tab handle */}
                    <rect
                      x={rightEyeX + eyeR + 2}
                      y={eyeY - 6}
                      width="10"
                      height="12"
                      rx="3"
                      fill="#F2B705"
                      stroke="#12141A"
                      strokeWidth="2.4"
                    />
                    {/* Monocle brass chain draped to lower fender */}
                    <path
                      d={`M ${rightEyeX + eyeR + 8} ${eyeY + 6} Q ${rightEyeX + 42} ${eyeY + 34} ${rightEyeX + 18} ${eyeY + 44}`}
                      fill="none"
                      stroke="#F2B705"
                      strokeWidth="2.5"
                      strokeDasharray="3 3"
                    />
                  </g>
                ) : (
                  <circle
                    cx={rightEyeX}
                    cy={eyeY}
                    r={eyeR + 4}
                    fill="#E4E9F2"
                    stroke="#12141A"
                    strokeWidth="3"
                  />
                )}

                <circle cx={rightEyeX} cy={eyeY} r={eyeR} fill="#FFFDF7" />
                <g clipPath={`url(#${rightEyeClip})`}>
                  <circle
                    cx={rightEyeX}
                    cy={eyeY}
                    r={eyeR - 3}
                    fill="none"
                    stroke="#E8E2D0"
                    strokeWidth="2"
                  />
                  <g className={styles.pupilGroup}>
                    <circle cx={rightEyeX} cy={eyeY} r="14.5" fill={palette.eyeIris} />
                    <circle cx={rightEyeX} cy={eyeY} r="9.5" fill="#12141A" />
                    <circle cx={rightEyeX - 4.5} cy={eyeY - 5} r="4" fill="#FFFFFF" />
                    <circle cx={rightEyeX + 4} cy={eyeY + 4} r="1.8" fill="#FFFFFF" opacity="0.85" />
                  </g>
                  {/* Monocle glass tint for Old Gasket */}
                  {variant === 'inspector' && (
                    <path
                      d={`M ${rightEyeX - 18} ${eyeY - 20} L ${rightEyeX + 16} ${eyeY + 18}`}
                      stroke="#FFF3B0"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      opacity="0.45"
                    />
                  )}
                  <rect
                    x={rightEyeX - eyeR - 2}
                    y={eyeY - eyeR - 2}
                    width={eyeR * 2 + 4}
                    height={eyeR * 2 + 4}
                    fill={palette.lidColor}
                    stroke="#12141A"
                    strokeWidth="2.5"
                    className={styles.lidTopRight}
                  />
                  <rect
                    x={rightEyeX - eyeR - 2}
                    y={eyeY - eyeR - 2}
                    width={eyeR * 2 + 4}
                    height={eyeR * 2 + 4}
                    fill={palette.lidColor}
                    stroke="#12141A"
                    strokeWidth="2.5"
                    className={styles.lidBottomRight}
                  />
                </g>
                <circle
                  cx={rightEyeX}
                  cy={eyeY}
                  r={eyeR}
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="3"
                />
              </g>

              {/* Celebrating / Night Drive Headlight Glow Halo */}
              <g className={headlightsOn ? undefined : styles.celebrateFlash}>
                <circle cx={leftEyeX} cy={eyeY} r={eyeR + 10} fill="#FFE57F" opacity="0.32" />
                <circle cx={rightEyeX} cy={eyeY} r={eyeR + 10} fill="#FFE57F" opacity="0.32" />
              </g>

              {/* Hood-Crease Expressive Brow Lines */}
              <path
                d={`M ${leftEyeX - 30} ${eyeY - 33} Q ${leftEyeX} ${eyeY - 40} ${leftEyeX + 30} ${eyeY - 31}`}
                fill="none"
                stroke="#12141A"
                strokeWidth="4.2"
                strokeLinecap="round"
                className={styles.browLeft}
              />
              <path
                d={`M ${rightEyeX - 30} ${eyeY - 31} Q ${rightEyeX} ${eyeY - 40} ${rightEyeX + 30} ${eyeY - 33}`}
                fill="none"
                stroke="#12141A"
                strokeWidth="4.2"
                strokeLinecap="round"
                className={styles.browRight}
              />

              {/* Morphing Front Grille Mouth */}
              <FrontGrilleMouth mood={safeMood} variant={variant} />

              {/* Amber Turn Signal Fog Pods */}
              <rect
                x={variant === 'pip' ? 84 : 60}
                y="192"
                width="20"
                height="10"
                rx="4"
                fill="#FFB703"
                stroke="#12141A"
                strokeWidth="2.2"
              />
              <rect
                x={variant === 'pip' ? 256 : 280}
                y="192"
                width="20"
                height="10"
                rx="4"
                fill="#FFB703"
                stroke="#12141A"
                strokeWidth="2.2"
              />

              {/* Old Gasket Wiper Blade Holding Rubber Stamp */}
              {variant === 'inspector' && (
                <InspectorWiperStamp x={188} y={108} stampText={stampText} scale={0.95} />
              )}
            </g>
          </g>
        </svg>
      </div>
    );
  }

  // ==================== SIDE PROFILE VIEW (viewBox 480x270) ====================
  const sideEyeClip = `side-eye-${uid}`;
  const sideEyeX = variant === 'pip' ? 378 : variant === 'inspector' ? 404 : 400;
  const sideEyeY = variant === 'pip' ? 144 : variant === 'inspector' ? 144 : 148;
  const sideEyeRx = 18;
  const sideEyeRy = 22;

  return (
    <div
      ref={rootRef}
      className={rootClassNames}
      style={cssVars}
      data-variant={variant}
      data-view="side"
      data-mood={safeMood}
    >
      <svg
        viewBox="0 0 480 270"
        className={styles.svgCanvas}
        aria-hidden={ariaHidden ? 'true' : undefined}
        role={ariaHidden ? undefined : 'img'}
        aria-label={ariaHidden ? undefined : label || `${variant} car side view (${safeMood})`}
      >
        <defs>
          <clipPath id={sideEyeClip}>
            <ellipse cx={sideEyeX} cy={sideEyeY} rx={sideEyeRx} ry={sideEyeRy} />
          </clipPath>
          <linearGradient id={`beam-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FFE885" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FFE885" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ground Shadow Ellipse */}
        <ellipse
          cx="244"
          cy="242"
          rx={variant === 'pip' ? 156 : 194}
          ry="13"
          fill="#12141A"
          opacity="0.22"
        />

        {/* Subtle Exhaust Puffs */}
        <g transform={variant === 'pip' ? 'translate(84, 198)' : 'translate(54, 196)'}>
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="#9BA3B5"
            className={styles.exhaustPuff1}
          />
          <circle
            cx="-8"
            cy="-4"
            r="6"
            fill="#B5BDCE"
            className={styles.exhaustPuff2}
          />
        </g>

        {/* Suspended Chassis Group */}
        <g className={styles.chassisGroup}>
          <g className={styles.suspensionBounce}>
            {/* Night Drive / Celebrating Headlight Beam Cone */}
            <path
              d={`M ${sideEyeX + 10} ${sideEyeY - 12} L 478 ${sideEyeY - 46} L 478 ${sideEyeY + 46} L ${sideEyeX + 10} ${sideEyeY + 14} Z`}
              fill={`url(#beam-${uid})`}
              style={{ opacity: headlightsOn ? 0.85 : 'var(--headlight-beam-opacity, 0.08)' }}
              className={headlightsOn ? undefined : styles.celebrateFlash}
            />

            {/* ==================== VARIANT 1: HERO ("DUDU") HOT-HATCH ==================== */}
            {variant === 'hero' && (
              <g>
                {/* Tailpipe */}
                <rect
                  x="48"
                  y="190"
                  width="24"
                  height="11"
                  rx="5"
                  fill="#5C6475"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
                {/* Hot-Hatch Roof Spoiler */}
                <path
                  d="M 88 64 L 62 52 L 58 64 L 94 76 Z"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Main Cobalt Hot-Hatch Body */}
                <path
                  d="M 64 198 L 58 148 C 58 128, 76 92, 102 66 C 122 50, 178 46, 252 50 C 288 52, 318 82, 342 108 L 410 118 C 430 122, 438 142, 436 176 L 430 198 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Lower Rocker Shadow Tone */}
                <path
                  d="M 62 174 L 434 174 L 430 198 L 64 198 Z"
                  fill={palette.bodyShadow}
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Sunshine-Yellow Roof & Rally Stripe */}
                <path
                  d="M 98 68 C 122 50, 180 46, 254 50 C 274 52, 294 64, 308 78 L 288 80 C 272 66, 252 60, 232 59 L 106 62 Z"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M 332 134 L 433 142 L 434 154 L 326 146 Z"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="2.4"
                />
                {/* Side Windows with Reflection Streaks */}
                <path
                  d="M 118 112 L 134 68 C 154 62, 188 60, 206 60 L 206 112 Z"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M 218 112 L 218 60 C 254 62, 286 72, 318 112 Z"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Window Reflection Streaks */}
                <path d="M 140 106 L 160 66 L 172 66 L 152 106 Z" fill="#FFFFFF" opacity="0.24" />
                <path d="M 234 106 L 256 68 L 270 72 L 248 106 Z" fill="#FFFFFF" opacity="0.24" />
                {/* Sculpted Shoulder Line, Door Seam & Handle */}
                <path
                  d="M 80 132 L 328 134"
                  fill="none"
                  stroke="#6688FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 212 60 L 212 184 M 316 112 L 310 184"
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="2.4"
                />
                <rect
                  x="224"
                  y="124"
                  width="24"
                  height="8"
                  rx="4"
                  fill="#FFC72C"
                  stroke="#12141A"
                  strokeWidth="2.2"
                />
                {/* Flared Wheel Arches */}
                <path
                  d="M 82 198 A 54 54 0 0 1 190 198"
                  fill="#151820"
                  stroke="#12141A"
                  strokeWidth="3.5"
                />
                <path
                  d="M 294 198 A 54 54 0 0 1 402 198"
                  fill="#151820"
                  stroke="#12141A"
                  strokeWidth="3.5"
                />
                {/* Front & Rear Chunky Bumpers */}
                <rect
                  x="46"
                  y="174"
                  width="28"
                  height="18"
                  rx="6"
                  fill="#1E222B"
                  stroke="#12141A"
                  strokeWidth="3"
                />
                <rect
                  x="418"
                  y="174"
                  width="26"
                  height="18"
                  rx="6"
                  fill="#1E222B"
                  stroke="#12141A"
                  strokeWidth="3"
                />
                {/* Rear Amber Tail Light */}
                <rect
                  x="54"
                  y="132"
                  width="12"
                  height="26"
                  rx="4"
                  fill="#FFB703"
                  stroke="#12141A"
                  strokeWidth="2.6"
                />
              </g>
            )}

            {/* ==================== VARIANT 2: OLD GASKET (INSPECTOR WAGON) ==================== */}
            {variant === 'inspector' && (
              <g>
                {/* Tailpipe */}
                <rect
                  x="44"
                  y="192"
                  width="24"
                  height="10"
                  rx="4"
                  fill="#5C6475"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
                {/* Roof Luggage Rack */}
                <path
                  d="M 92 48 L 98 34 L 310 34 L 316 48"
                  fill="none"
                  stroke="#5C6475"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <rect
                  x="118"
                  y="28"
                  width="164"
                  height="8"
                  rx="3"
                  fill="#B58952"
                  stroke="#12141A"
                  strokeWidth="2.2"
                />
                {/* Tall Boxy Station Wagon Body in Faded Teal */}
                <path
                  d="M 58 198 L 62 56 Q 64 46 78 46 L 316 46 Q 332 46 346 106 L 424 114 Q 438 118 438 140 L 436 198 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                {/* Classic Wood/Cream Beltline Panel */}
                <rect
                  x="62"
                  y="138"
                  width="372"
                  height="20"
                  rx="3"
                  fill="#D8C39E"
                  stroke="#12141A"
                  strokeWidth="2.6"
                />
                <path
                  d="M 60 176 L 436 176 L 436 198 L 58 198 Z"
                  fill={palette.bodyShadow}
                  stroke="#12141A"
                  strokeWidth="3"
                />
                {/* Three Tall Boxy Wagon Windows with Reflection Streaks */}
                <rect
                  x="76"
                  y="60"
                  width="72"
                  height="54"
                  rx="5"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
                <rect
                  x="158"
                  y="60"
                  width="76"
                  height="54"
                  rx="5"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
                <path
                  d="M 244 60 L 316 60 L 334 114 L 244 114 Z"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
                <path d="M 90 108 L 112 66 L 122 66 L 100 108 Z" fill="#FFFFFF" opacity="0.22" />
                <path d="M 176 108 L 198 66 L 208 66 L 186 108 Z" fill="#FFFFFF" opacity="0.22" />
                <path d="M 262 108 L 284 66 L 296 66 L 274 108 Z" fill="#FFFFFF" opacity="0.22" />
                {/* Door Line & Handle */}
                <line x1="239" y1="56" x2="239" y2="184" stroke="#12141A" strokeWidth="2.5" />
                <rect x="250" y="124" width="22" height="7" rx="3" fill="#E4E9F2" stroke="#12141A" strokeWidth="2" />
                {/* Squared Wagon Wheel Arches */}
                <path
                  d="M 80 198 L 88 148 L 184 148 L 192 198 Z"
                  fill="#151820"
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 294 198 L 302 148 L 398 148 L 406 198 Z"
                  fill="#151820"
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                />
                {/* Chrome Bumpers & Amber Tail Lamp */}
                <rect x="44" y="174" width="26" height="18" rx="4" fill="#D5DCE8" stroke="#12141A" strokeWidth="3" />
                <rect x="424" y="174" width="24" height="18" rx="4" fill="#D5DCE8" stroke="#12141A" strokeWidth="3" />
                <rect x="54" y="118" width="11" height="24" rx="3" fill="#FFB703" stroke="#12141A" strokeWidth="2.5" />
                {/* Inspector Wiper Blade Holding Rubber Stamp */}
                <InspectorWiperStamp x={338} y={108} stampText={stampText} scale={0.92} />
              </g>
            )}

            {/* ==================== VARIANT 3: PIP (3-WHEELED SCOOTER-VAN) ==================== */}
            {variant === 'pip' && (
              <g>
                {/* Putter Exhaust */}
                <rect
                  x="76"
                  y="192"
                  width="20"
                  height="9"
                  rx="4"
                  fill="#5C6475"
                  stroke="#12141A"
                  strokeWidth="2.6"
                />
                {/* Rear Cargo Box Pod */}
                <rect
                  x="92"
                  y="50"
                  width="156"
                  height="144"
                  rx="14"
                  fill="#FFF2BD"
                  stroke="#12141A"
                  strokeWidth="3.4"
                />
                {/* Cargo Box Cobalt Stripe */}
                <rect
                  x="94"
                  y="128"
                  width="152"
                  height="20"
                  fill="#2F5BFF"
                  stroke="#12141A"
                  strokeWidth="2.5"
                />
                {/* Front Rounded Scooter Cab in Sunshine Yellow */}
                <path
                  d="M 232 194 L 232 62 C 266 56, 316 64, 346 108 L 398 122 C 414 128, 418 152, 412 194 Z"
                  fill={palette.bodyMain}
                  stroke="#12141A"
                  strokeWidth="3.4"
                  strokeLinejoin="round"
                />
                {/* Cab Roof Beacon */}
                <rect
                  x="266"
                  y="44"
                  width="26"
                  height="14"
                  rx="6"
                  fill="#2F5BFF"
                  stroke="#12141A"
                  strokeWidth="2.6"
                />
                {/* Cab Window with Reflection Streaks */}
                <path
                  d="M 248 118 L 248 74 C 278 72, 310 82, 332 118 Z"
                  fill="#1D2636"
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M 264 112 L 284 78 L 296 80 L 276 112 Z" fill="#FFFFFF" opacity="0.25" />
                {/* Door Seam & Handle */}
                <line x1="244" y1="68" x2="244" y2="188" stroke="#12141A" strokeWidth="2.5" />
                <rect x="254" y="132" width="20" height="7" rx="3.5" fill="#2F5BFF" stroke="#12141A" strokeWidth="2" />
                {/* Rear Wheel Arch & Front Scooter Mudguard */}
                <path
                  d="M 110 198 A 48 48 0 0 1 206 198"
                  fill="#151820"
                  stroke="#12141A"
                  strokeWidth="3.2"
                />
                <path
                  d="M 314 198 A 48 48 0 0 1 410 198"
                  fill="#2F5BFF"
                  stroke="#12141A"
                  strokeWidth="3.2"
                />
                {/* Bumpers & Amber Tail Light */}
                <rect x="78" y="174" width="22" height="16" rx="5" fill="#1E222B" stroke="#12141A" strokeWidth="2.8" />
                <rect x="398" y="176" width="22" height="15" rx="5" fill="#1E222B" stroke="#12141A" strokeWidth="2.8" />
                <rect x="86" y="146" width="10" height="22" rx="3" fill="#FFB703" stroke="#12141A" strokeWidth="2.4" />
              </g>
            )}

            {/* ==================== SIDE-PROFILE HEADLIGHT EYE & BROW ==================== */}
            <g>
              {variant === 'inspector' ? (
                <ellipse
                  cx={sideEyeX}
                  cy={sideEyeY}
                  rx={sideEyeRx + 4}
                  ry={sideEyeRy + 4}
                  fill="#F2B705"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
              ) : (
                <ellipse
                  cx={sideEyeX}
                  cy={sideEyeY}
                  rx={sideEyeRx + 3}
                  ry={sideEyeRy + 3}
                  fill="#E4E9F2"
                  stroke="#12141A"
                  strokeWidth="2.8"
                />
              )}

              <ellipse cx={sideEyeX} cy={sideEyeY} rx={sideEyeRx} ry={sideEyeRy} fill="#FFFDF7" />

              <g clipPath={`url(#${sideEyeClip})`}>
                <g className={styles.pupilGroup}>
                  <ellipse cx={sideEyeX + 4} cy={sideEyeY} rx="10" ry="12" fill={palette.eyeIris} />
                  <ellipse cx={sideEyeX + 5} cy={sideEyeY} rx="6.5" ry="8" fill="#12141A" />
                  <circle cx={sideEyeX + 2} cy={sideEyeY - 4} r="3" fill="#FFFFFF" />
                </g>
                <rect
                  x={sideEyeX - sideEyeRx - 2}
                  y={sideEyeY - sideEyeRy - 2}
                  width={sideEyeRx * 2 + 4}
                  height={sideEyeRy * 2 + 4}
                  fill={palette.lidColor}
                  stroke="#12141A"
                  strokeWidth="2.4"
                  className={styles.lidTopRight}
                />
                <rect
                  x={sideEyeX - sideEyeRx - 2}
                  y={sideEyeY - sideEyeRy - 2}
                  width={sideEyeRx * 2 + 4}
                  height={sideEyeRy * 2 + 4}
                  fill={palette.lidColor}
                  stroke="#12141A"
                  strokeWidth="2.4"
                  className={styles.lidBottomRight}
                />
              </g>

              <ellipse
                cx={sideEyeX}
                cy={sideEyeY}
                rx={sideEyeRx}
                ry={sideEyeRy}
                fill="none"
                stroke="#12141A"
                strokeWidth="2.8"
              />

              {/* Hood Crease Brow over Side Headlight Eye */}
              <path
                d={`M ${sideEyeX - 20} ${sideEyeY - 24} Q ${sideEyeX} ${sideEyeY - 30} ${sideEyeX + 18} ${sideEyeY - 22}`}
                fill="none"
                stroke="#12141A"
                strokeWidth="3.8"
                strokeLinecap="round"
                className={styles.browRight}
              />

              {/* Expressive Side Nose Corner Mouth */}
              {safeMood === 'celebrating' || safeMood === 'proud' ? (
                <path
                  d={`M ${sideEyeX - 4} ${sideEyeY + 30} Q ${sideEyeX + 14} ${sideEyeY + 36} ${sideEyeX + 24} ${sideEyeY + 24}`}
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              ) : safeMood === 'nervous' ? (
                <path
                  d={`M ${sideEyeX - 6} ${sideEyeY + 30} L ${sideEyeX + 4} ${sideEyeY + 26} L ${sideEyeX + 14} ${sideEyeY + 32} L ${sideEyeX + 24} ${sideEyeY + 27}`}
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              ) : safeMood === 'shocked' ? (
                <ellipse
                  cx={sideEyeX + 12}
                  cy={sideEyeY + 29}
                  rx="7"
                  ry="9"
                  fill="#181B22"
                  stroke="#12141A"
                  strokeWidth="2.6"
                />
              ) : (
                <path
                  d={`M ${sideEyeX - 2} ${sideEyeY + 29} Q ${sideEyeX + 12} ${sideEyeY + 32} ${sideEyeX + 24} ${sideEyeY + 27}`}
                  fill="none"
                  stroke="#12141A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>
        </g>

        {/* Planted Rotating 5-Spoke Wheels (Radius 42 per Art Bible) */}
        {variant === 'pip' ? (
          <>
            <Wheel
              cx={158}
              cy={198}
              r={38}
              accentColor={palette.hubAccent}
              isSpinning={isSpinning}
            />
            <Wheel
              cx={362}
              cy={198}
              r={38}
              accentColor={palette.hubAccent}
              isSpinning={isSpinning}
            />
          </>
        ) : (
          <>
            <Wheel
              cx={136}
              cy={198}
              r={42}
              accentColor={palette.hubAccent}
              isSpinning={isSpinning}
            />
            <Wheel
              cx={348}
              cy={198}
              r={42}
              accentColor={palette.hubAccent}
              isSpinning={isSpinning}
            />
          </>
        )}
      </svg>
    </div>
  );
}

export default CarActor;

