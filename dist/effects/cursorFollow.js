import gsap from "gsap";
import { mqDown } from "../utils";
const cursorFollow = {
  phase: "init",
  init() {
    const ball = document.querySelector(".mouse");
    if (!ball || mqDown("sm")) return;
    const pointer = document.querySelector(".mouse__pointer");
    if (!pointer) return;
    const containers = document.querySelectorAll(".js-hover-cursor");
    const pos = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    const mouse = { ...pos };
    const speed = 0.2;
    const xSet = gsap.quickSetter(ball, "x", "px");
    const ySet = gsap.quickSetter(ball, "y", "px");
    gsap.set(".mouse", { xPercent: -70, yPercent: -70 });
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    gsap.ticker.add(() => {
      const dt = 1 - (1 - speed) ** gsap.ticker.deltaRatio();
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });
    containers.forEach((container) => {
      const ds = container.dataset;
      container.addEventListener("mouseenter", () => {
        if (ds.src) pointer.dataset.bg = ds.src;
        if (ds.cursorText) pointer.dataset.text = ds.cursorText;
        ball.classList.add("is-hover");
      });
      container.addEventListener("mouseleave", () => {
        ball.classList.remove("is-hover");
        pointer.dataset.bg = "";
        pointer.dataset.text = "";
      });
    });
  }
};
var cursorFollow_default = cursorFollow;
export {
  cursorFollow_default as default
};
