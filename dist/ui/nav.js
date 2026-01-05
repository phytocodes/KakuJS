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
    let lastFocusedElement = null;
    const setNavOpen = (open) => {
      body.classList.toggle(NAV_OPEN_CLASS, open);
      toggles.forEach((btn) => {
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      gnav.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        gnav.scrollTop = 0;
        lastFocusedElement = document.activeElement;
        links[0]?.focus();
      } else if (lastFocusedElement) {
        lastFocusedElement.focus();
        lastFocusedElement = null;
      }
    };
    const syncByViewport = () => {
      const isMobile = mqDown("xxl");
      if (isMobile) {
        setNavOpen(false);
      } else {
        gnav.setAttribute("aria-hidden", "false");
        toggles.forEach((btn) => {
          btn.setAttribute("aria-expanded", "false");
        });
        body.classList.remove(NAV_OPEN_CLASS);
      }
    };
    toggles.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        setNavOpen(!body.classList.contains(NAV_OPEN_CLASS));
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
    links.forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });
    overlay?.addEventListener("click", () => setNavOpen(false));
    gnav.addEventListener(
      "mouseover",
      (e) => {
        if (e.target.closest(".gnav__item-link")) {
          body.classList.add(NAV_READY_CLASS);
        }
      },
      { once: true }
    );
    window.addEventListener("resize", debounce(syncByViewport, 200));
    window.addEventListener("load", syncByViewport);
  }
};
var nav_default = nav;
export {
  nav_default as default
};
