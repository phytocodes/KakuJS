import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { mqUp } from "../utils";
gsap.registerPlugin(ScrollTrigger);
const smoothScroll = {
  phase: "init",
  init() {
    const DEFAULT_PC_OFFSET = -69;
    const DEFAULT_SP_OFFSET = -50;
    const htmlElement = document.documentElement;
    const lenis = new Lenis({
      smooth: true
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    const smoothScrollTriggers = document.querySelectorAll('a[href^="#"]:not(.no-lenis-scroll)');
    if (!smoothScrollTriggers.length) return;
    smoothScrollTriggers.forEach((target) => {
      const ds = target.dataset;
      target.addEventListener("click", (e) => {
        e.preventDefault();
        const pcOffset = ds.pcOffset ? Number(ds.pcOffset) : DEFAULT_PC_OFFSET;
        const spOffset = ds.spOffset ? Number(ds.spOffset) : DEFAULT_SP_OFFSET;
        const offset = mqUp("sm") ? pcOffset : spOffset;
        const href = target.getAttribute("href");
        if (!href) return;
        htmlElement.classList.add("smooth");
        lenis.scrollTo(href, {
          lock: true,
          offset,
          onComplete: () => {
            htmlElement.classList.remove("smooth");
          }
        });
      });
    });
  }
};
var smoothScroll_default = smoothScroll;
export {
  smoothScroll_default as default
};
