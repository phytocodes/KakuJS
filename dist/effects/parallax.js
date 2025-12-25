import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mqDown, mqUp } from "../utils";
gsap.registerPlugin(ScrollTrigger);
const BREAKPOINT_KEY = "sm";
const PC_Y_DEFAULT = "-2.0833333333vw";
const PC_OFFSET = "80px";
const SP_Y_DEFAULT = "-10%";
const SCRUB_VALUE = 2;
const parallax = {
  phase: "init",
  init() {
    const els = gsap.utils.toArray(".js-parallax");
    if (!els.length) return;
    const isPc = mqUp(BREAKPOINT_KEY);
    const isSp = mqDown(BREAKPOINT_KEY);
    const initialY = isPc ? PC_Y_DEFAULT : SP_Y_DEFAULT;
    const offset = isPc ? PC_OFFSET : "0px";
    els.forEach((el) => {
      const ds = el.dataset;
      const pcY = ds.parallaxY ?? initialY;
      const Y = isSp && ds.parallaxSpY ? ds.parallaxSpY : pcY;
      const trigger = ds.parallaxTrigger ? `.${ds.parallaxTrigger}` : el;
      const isStartTop = ds.parallaxStart === "top";
      const start = isStartTop ? `top ${offset}` : "top bottom";
      const end = isStartTop ? "bottom top" : "top top";
      gsap.to(el, {
        y: Y,
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: SCRUB_VALUE
        }
      });
    });
  }
};
var parallax_default = parallax;
export {
  parallax_default as default
};
