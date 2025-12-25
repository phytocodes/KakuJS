const details = {
  phase: "init",
  init() {
    const detailsList = document.querySelectorAll(".details");
    if (!detailsList.length) return;
    const animTiming = {
      duration: 400,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)"
    };
    detailsList.forEach((el) => {
      const summary = el.querySelector(".details__summary");
      const content = el.querySelector(".details__content");
      if (!summary || !content) return;
      summary.setAttribute("role", "button");
      summary.setAttribute("aria-expanded", el.hasAttribute("open") ? "true" : "false");
      summary.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
        }
      });
      summary.addEventListener("keyup", (e) => {
        if (e.key === " " || e.key === "Enter") {
          toggleDetails(el, summary, content, animTiming);
        }
      });
      summary.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDetails(el, summary, content, animTiming);
      });
    });
  }
};
var details_default = details;
function toggleDetails(el, summary, content, animTiming) {
  const isOpen = el.hasAttribute("open");
  if (isOpen) {
    const startHeight = content.offsetHeight;
    const animation = content.animate(
      [
        { height: `${startHeight}px`, opacity: 1 },
        { height: "0px", opacity: 0 }
      ],
      animTiming
    );
    animation.onfinish = () => {
      el.removeAttribute("open");
      summary.setAttribute("aria-expanded", "false");
      content.style.height = "";
      content.style.opacity = "";
    };
    return;
  }
  el.setAttribute("open", "");
  summary.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    const fullHeight = content.scrollHeight;
    const animation = content.animate(
      [
        { height: "0px", opacity: 0 },
        { height: `${fullHeight}px`, opacity: 1 }
      ],
      animTiming
    );
    animation.onfinish = () => {
      content.style.height = "auto";
      content.style.opacity = "";
    };
  });
}
export {
  details_default as default
};
