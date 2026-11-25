import { useState, useEffect } from 'react';

export function useInView(ref, options = { threshold: 0.05, rootMargin: '80px' }) {
  const [inViewport, setInViewport] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handleVisibility = () => {
      setTabVisible(document.visibilityState !== 'hidden');
    };
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    const element = ref?.current;
    if (!element || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setInViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setInViewport(entry.isIntersecting);
        }
      },
      {
        threshold: options.threshold ?? 0.05,
        rootMargin: options.rootMargin ?? '80px',
      }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin]);

  return inViewport && tabVisible;
}

