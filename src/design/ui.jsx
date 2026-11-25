import React from 'react';
import styles from './ui.module.css';

export function Container({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component className={`${styles.container} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

export function Badge({ children, tone = 'default', className = '', ...rest }) {
  const toneClass =
    tone === 'cobalt'
      ? styles.badgeCobalt
      : tone === 'yellow'
      ? styles.badgeYellow
      : tone === 'teal'
      ? styles.badgeTeal
      : tone === 'pass'
      ? styles.badgePass
      : tone === 'limit'
      ? styles.badgeLimit
      : '';

  return (
    <span className={`${styles.badge} ${toneClass} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}

export function Stamp({ status = 'PASSED', className = '', ...rest }) {
  const upper = String(status).toUpperCase();
  const toneClass =
    upper.includes('REJECT') || upper.includes('FAIL') || upper.includes('SOLD OUT')
      ? styles.stampRejected
      : upper.includes('PASS') || upper.includes('CHECKED') || upper.includes('SPOTTED')
      ? styles.stampPassed
      : styles.stampPending;

  return (
    <span className={`${styles.stamp} ${toneClass} ${className}`.trim()} {...rest}>
      {status}
    </span>
  );
}

export function Button({
  children,
  variant = 'default',
  as: Component = 'button',
  className = '',
  ...rest
}) {
  const variantClass =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'yellow'
      ? styles.buttonYellow
      : '';

  return (
    <Component className={`${styles.button} ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

export function Card({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component className={`${styles.card} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

export function CheckEngineLight({ label = 'CHECK ENGINE: KNOWN LIMITS' }) {
  return (
    <span className={styles.checkEngineIcon} role="status">
      <svg
        width="22"
        height="16"
        viewBox="0 0 28 20"
        fill="none"
        aria-hidden="true"
         focusable="false"
      >
        <path
          d="M9 3H17M13 3V6M5 9V15M2 10V14M5 12H7M7 6H19L22 9H25V16H21L19 18H9L7 15V6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </span>
  );
}

export function LimitBox({ children, title = 'Known Limits & Caveats', className = '' }) {
  return (
    <div className={`${styles.limitBox} ${className}`.trim()}>
      <div style={{ marginBottom: '0.6rem' }}>
        <CheckEngineLight label={title} />
      </div>
      {children}
    </div>
  );
}

