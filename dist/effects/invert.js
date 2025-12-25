import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const invert = {
  phase: "init",
  init() {
    const invertTarget = document.querySelector(".js-invert");
    if (!invertTarget) return;
    const toggleElements = gsap.utils.toArray(".js-invert-toggle");
    const invertCenter = invertTarget.offsetHeight / 2;
    toggleElements.forEach((el) => {
      gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: `top ${invertCenter}`,
          end: `bottom ${invertCenter}`,
          toggleClass: {
            targets: invertTarget,
            className: "is-invert"
          }
        });
      }, el);
    });
  }
};
var invert_default = invert;
export {
  invert_default as default
};
