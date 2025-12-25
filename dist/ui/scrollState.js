const DEFAULT_THRESHOLD = 0;
const scrollState = {
  phase: "init",
  init() {
    let lastY = 0;
    let ticking = false;
    const body = document.body;
    const threshold = body.dataset.scrollThreshold !== void 0 ? Number(body.dataset.scrollThreshold) : DEFAULT_THRESHOLD;
    let isScrolled = body.classList.contains("is-scrolled");
    if (window.scrollY > threshold) {
      body.classList.add("is-scrolled");
      isScrolled = true;
    }
    window.addEventListener(
      "scroll",
      () => {
        lastY = window.scrollY;
        if (!ticking) {
          requestAnimationFrame(() => {
            const newState = lastY > threshold;
            if (newState !== isScrolled) {
              body.classList.toggle("is-scrolled", newState);
              isScrolled = newState;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }
};
var scrollState_default = scrollState;
export {
  scrollState_default as default
};
