import { useEffect, useRef } from 'react';

/**
 * useReveal — attaches an IntersectionObserver to a container ref.
 * Any child with class `reveal`, `reveal-left`, `reveal-right`, or `reveal-scale`
 * gets the `visible` class when it enters the viewport.
 */
const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
};

export default useReveal;
