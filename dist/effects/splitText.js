import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
const splitText = {
  phase: "setup",
  init() {
    const targets = document.querySelectorAll(".js-split-text");
    if (!targets.length) return;
    targets.forEach((target) => {
      const delayBase = parseFloat(target.dataset.delayBase || "0");
      const split = new SplitText(target, {
        type: "chars",
        tag: "span",
        charsClass: "char-item"
      });
      target.setAttribute("role", "text");
      if (!split.chars || !split.chars.length) return;
      split.chars.forEach((charElement, index) => {
        if (charElement instanceof HTMLElement) {
          const delay = delayBase * index;
          charElement.style.transitionDelay = `${delay}s`;
        }
      });
    });
  }
};
var splitText_default = splitText;
export {
  splitText_default as default
};
