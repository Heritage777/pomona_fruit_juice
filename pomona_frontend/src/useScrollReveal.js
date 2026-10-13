import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    const observeRevealElements = () => {
      const revealElements = document.querySelectorAll(
        '.reveal:not(.active)'
      );

      revealElements.forEach(element => {
        observer.observe(element);
      });
    };

    // Observe existing elements.
    observeRevealElements();

    // Also detect reveal elements added later,
    // such as content inside opened drawers.
    const mutationObserver = new MutationObserver(() => {
      observeRevealElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}