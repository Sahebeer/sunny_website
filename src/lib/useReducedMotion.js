import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'apex_hollow_reduce_motion';
const EVENT_NAME = 'apex-reduce-motion-change';

function getInitialReducedMotion() {
  if (typeof window === 'undefined') return false;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  } catch {
    // ignore storage errors
  }
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

export function setGlobalReducedMotion(value) {
  const boolVal = Boolean(value);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(boolVal));
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.reducedMotion = String(boolVal);
    }
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: boolVal }));
  }
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(getInitialReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const handleMediaChange = (e) => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
          setReduced(Boolean(e.matches));
        }
      } catch {
        setReduced(Boolean(e.matches));
      }
    };

    const handleCustomChange = (e) => {
      setReduced(Boolean(e.detail));
    };

    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleMediaChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleMediaChange);
      }
    }

    window.addEventListener(EVENT_NAME, handleCustomChange);

    return () => {
      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', handleMediaChange);
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(handleMediaChange);
        }
      }
      window.removeEventListener(EVENT_NAME, handleCustomChange);
    };
  }, []);

  const toggleReducedMotion = useCallback((nextValue) => {
    const resolved = typeof nextValue === 'boolean' ? nextValue : !getInitialReducedMotion();
    setGlobalReducedMotion(resolved);
    setReduced(resolved);
  }, []);

  return [reduced, toggleReducedMotion];
}
