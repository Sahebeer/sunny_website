import React from 'react';
import styles from './Fallback.module.css';

export function Fallback({ sectionName = 'Section' }) {
  return (
    <div className={styles.fallbackBox} role="alert">
      <div className={styles.fallbackTitle}>
        This section stalled; the rest of the site still works
      </div>
      <p className={styles.fallbackText}>
        {sectionName} encountered an unexpected fault and was safely isolated by the chassis
        breaker.
      </p>
    </div>
  );
}

export default Fallback;

