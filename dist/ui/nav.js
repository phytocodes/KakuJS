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
      if (isOpen) return;
      isOpen = true;
      body.classList.add(NAV_OPEN_CLASS);
      toggles.forEach((btn) => {
        btn.setAttribute("aria-expanded", "true");
      });
      lastFocusedElement = document.activeElement;
      if (mode === "mobile") {
        gnav.removeAttribute("inert");
        gnav.scrollTop = 0;
        links[0]?.focus();
      }
    };
    const closeNav = () => {
      if (!isOpen) return;
      isOpen = false;
      body.classList.remove(NAV_OPEN_CLASS);
      toggles.forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
      });
      if (mode === "mobile") {
        gnav.setAttribute("inert", "");
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }
      }
    };
    const isHoveringGnav = () => {
      return window.matchMedia("(hover: hover)").matches && gnav.matches(":hover");
    };
    let hoverReady = false;
    let hoverListenerAttached = false;
    const setupHoverReady = () => {
      if (hoverReady || hoverListenerAttached) return;
      if (mode !== "desktop") return;
      if (isHoveringGnav()) {
        body.classList.add(NAV_READY_CLASS);
        hoverReady = true;
        return;
      }
      hoverListenerAttached = true;
      gnav.addEventListener(
        "pointerenter",
        () => {
          if (mode !== "desktop") return;
          body.classList.add(NAV_READY_CLASS);
          hoverReady = true;
        },
        { once: true }
      );
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
        setupHoverReady();
      } else {
        isOpen = false;
        body.classList.remove(NAV_OPEN_CLASS);
        gnav.setAttribute("inert", "");
        body.classList.remove(NAV_READY_CLASS);
        hoverReady = false;
        hoverListenerAttached = false;
      }
    };
    applyMode(detectMode());
    toggles.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (isOpen) {
          closeNav();
        } else {
          openNav();
        }
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
    links.forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    overlay?.addEventListener("click", closeNav);
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
