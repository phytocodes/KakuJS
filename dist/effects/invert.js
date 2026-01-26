import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const invert = {
  phase: "init",
  init() {
    const invertTarget = document.querySelector(".js-invert");
    if (!invertTarget) return;
    const toggleElements = gsap.utils.toArray(".js-invert-toggle");
    toggleElements.forEach((el) => {
      gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: () => `top ${invertTarget.offsetHeight / 2}`,
          end: () => `bottom ${invertTarget.offsetHeight / 2}`,
          toggleClass: {
            targets: invertTarget,
            className: "is-invert"
          }
        });
      }, el);
    });
    window.addEventListener("details:toggle", () => {
      ScrollTrigger.refresh();
    });
  }
};
var invert_default = invert;
export {
  invert_default as default
};
