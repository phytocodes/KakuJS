const tabs = {
  phase: "init",
  init() {
    const tabContainers = document.querySelectorAll(".tabs");
    if (!tabContainers.length) return;
    tabContainers.forEach((tabsContainer) => {
      const tabs2 = tabsContainer.querySelectorAll('[role="tab"]');
      const panels = tabsContainer.querySelectorAll('[role="tabpanel"]');
      if (!tabs2.length || !panels.length) return;
      const activateTabAndPanel = (targetTab) => {
        tabs2.forEach((t) => {
          t.setAttribute("aria-selected", "false");
        });
        panels.forEach((p) => {
          p.hidden = true;
        });
        targetTab.setAttribute("aria-selected", "true");
        const targetId = targetTab.getAttribute("aria-controls");
        if (!targetId) {
          console.warn("aria-controls \u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u306A\u3044\u30BF\u30D6\u304C\u3042\u308A\u307E\u3059:", targetTab);
          return;
        }
        const safeId = "CSS" in window && "escape" in CSS ? CSS.escape(targetId) : targetId;
        const panel = tabsContainer.querySelector(`#${safeId}`);
        if (!panel) {
          console.warn("\u5BFE\u5FDC\u3059\u308B\u30D1\u30CD\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093:", targetId);
          return;
        }
        panel.hidden = false;
      };
      activateTabAndPanel(tabs2[0]);
      tabs2.forEach((tab) => {
        tab.addEventListener("click", () => {
          activateTabAndPanel(tab);
        });
      });
    });
  }
};
var tabs_default = tabs;
export {
  tabs_default as default
};
