export default function inview(): void {
  const items = document.querySelectorAll<HTMLElement>('.js-inview');
  if (!items.length) return;

  const CLASS_INVIEW = 'is-inview';

  // IntersectionObserver が使える場合
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement & {
            dataset: { inviewToggle?: string };
          };

          const shouldToggle = el.dataset.inviewToggle === 'true';

          if (entry.isIntersecting) {
            el.classList.add(CLASS_INVIEW);

            // トグルなしなら監視解除で軽量化
            if (!shouldToggle) io.unobserve(el);
          } else if (shouldToggle) {
            el.classList.remove(CLASS_INVIEW);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -5% 0px',
        threshold: 0.1,
      }
    );

    // --- Init ---
    items.forEach((item) => {
      io.observe(item);
    });
  } else {
    // --- フォールバック（古いブラウザなど） ---
    items.forEach((el) => {
      el.classList.add(CLASS_INVIEW);
    });
  }
}