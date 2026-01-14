import { debounce, mqDown } from "../utils";
const NAV_OPEN_CLASS = "is-nav-opened";
const NAV_READY_CLASS = "is-nav-ready";
const nav = {
  phase: "init",
  init() {
    const body = document.body;
    const gnav = document.querySelector(".gnav");
    const toggles = document.querySelectorAll(".js-gnav-toggle");
    const overlay = document.getElementById("overlay");
    const links = gnav ? gnav.querySelectorAll("a") : [];
    if (!gnav) return;
    let mode = null;
    let isOpen = false;
    let lastFocusedElement = null;
    const detectMode = () => mqDown("xxl") ? "mobile" : "desktop";
    const openNav = () => {
      if (mode !== "mobile" || isOpen) return;
      isOpen = true;
      body.classList.add(NAV_OPEN_CLASS);
      toggles.forEach((btn) => {
        btn.setAttribute("aria-expanded", "true");
      });
      lastFocusedElement = document.activeElement;
      gnav.removeAttribute("inert");
      gnav.scrollTop = 0;
      links[0]?.focus();
    };
    const closeNav = () => {
      if (mode !== "mobile" || !isOpen) return;
      isOpen = false;
      body.classList.remove(NAV_OPEN_CLASS);
      toggles.forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
      });
      gnav.setAttribute("inert", "");
      if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    };
    const applyMode = (nextMode) => {
      if (mode === nextMode) return;
      mode = nextMode;
      if (mode === "desktop") {
        isOpen = false;
        body.classList.remove(NAV_OPEN_CLASS);
        gnav.removeAttribute("inert");
        toggles.forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });
      } else {
        isOpen = false;
        body.classList.remove(NAV_OPEN_CLASS);
        gnav.setAttribute("inert", "");
      }
    };
    applyMode(detectMode());
    toggles.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (mode !== "mobile") return;
        isOpen ? closeNav() : openNav();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
    links.forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    overlay?.addEventListener("click", closeNav);
    gnav.addEventListener(
      "mouseover",
      (e) => {
        if (e.target.closest(".gnav__item-link")) {
          body.classList.add(NAV_READY_CLASS);
        }
      },
      { once: true }
    );
    window.addEventListener(
      "resize",
      debounce(() => {
        applyMode(detectMode());
      }, 200)
    );
  }
};
var nav_default = nav;
export {
  nav_default as default
};
