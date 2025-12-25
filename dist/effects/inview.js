const inview = {
  phase: "observe",
  init() {
    const items = document.querySelectorAll(".js-inview");
    if (!items.length) return;
    const CLASS_INVIEW = "is-inview";
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target;
            const shouldToggle = el.dataset.inviewToggle === "true";
            if (entry.isIntersecting) {
              el.classList.add(CLASS_INVIEW);
              if (!shouldToggle) io.unobserve(el);
            } else if (shouldToggle) {
              el.classList.remove(CLASS_INVIEW);
            }
          }
        },
        {
          root: null,
          rootMargin: "0px 0px -5% 0px",
          threshold: 0.1
        }
      );
      items.forEach((item) => {
        io.observe(item);
      });
    } else {
      items.forEach((el) => {
        el.classList.add(CLASS_INVIEW);
      });
    }
  }
};
var inview_default = inview;
export {
  inview_default as default
};
