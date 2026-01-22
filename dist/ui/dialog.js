const dialog = {
  phase: "init",
  init() {
    const dialogs = document.querySelectorAll("dialog.dialog");
    const openButtons = document.querySelectorAll(".js-dialog-open");
    if (dialogs.length === 0) return;
    const dispatchDialogEvent = (dialog2, name) => {
      dialog2.dispatchEvent(
        new CustomEvent(name, {
          bubbles: true,
          detail: { dialog: dialog2 }
        })
      );
    };
    const resetDialogScroll = (dialog2) => {
      const targets = dialog2.querySelectorAll("[data-dialog-scroll]");
      if (targets.length > 0) {
        targets.forEach((el) => {
          el.scrollTop = 0;
        });
        return;
      }
      const overlay = dialog2.querySelector(".dialog__overlay");
      if (overlay) overlay.scrollTop = 0;
    };
    const dialogMap = /* @__PURE__ */ new Map();
    dialogs.forEach((d) => {
      dialogMap.set(d.id, d);
    });
    const isHashControlEnabled = (dialog2) => dialog2.dataset.hashControl === "true";
    const closeDialogAnimated = (dialog2) => {
      if (!dialog2.open || dialog2.classList.contains("is-closing")) return;
      dispatchDialogEvent(dialog2, "dialog:close:start");
      if (isHashControlEnabled(dialog2) && window.location.hash === `#${dialog2.id}`) {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      }
      dialog2.classList.remove("is-open");
      dialog2.classList.add("is-closing");
      const onTransitionEnd = (e) => {
        if (e.target !== dialog2 || e.propertyName !== "opacity") return;
        dialog2.removeEventListener("transitionend", onTransitionEnd);
        dialog2.classList.remove("is-closing");
        dialog2.close();
      };
      dialog2.addEventListener("transitionend", onTransitionEnd);
      const duration = parseFloat(getComputedStyle(dialog2).transitionDuration) * 1e3 || 400;
      setTimeout(() => {
        if (dialog2.open) {
          dialog2.removeEventListener("transitionend", onTransitionEnd);
          dialog2.classList.remove("is-closing");
          dialog2.close();
        }
      }, duration + 50);
    };
    openButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-haspopup", "dialog");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = button.dataset.dialogTarget;
        if (!targetId) return;
        const targetDialog = dialogMap.get(targetId);
        if (!targetDialog) return;
        targetDialog._lastFocus = button;
        targetDialog.classList.remove("is-closing");
        if (!targetDialog.open) targetDialog.showModal();
        requestAnimationFrame(() => {
          targetDialog.classList.add("is-open");
          resetDialogScroll(targetDialog);
          dispatchDialogEvent(targetDialog, "dialog:open");
        });
        button.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
        if (isHashControlEnabled(targetDialog)) {
          window.location.hash = targetId;
        }
      });
    });
    dialogs.forEach((dialog2) => {
      const inner = dialog2.querySelector(".dialog__inner");
      dialog2.querySelectorAll(".js-dialog-close").forEach((button) => {
        button.addEventListener("click", () => closeDialogAnimated(dialog2));
      });
      dialog2.addEventListener("click", (e) => {
        if (inner && !inner.contains(e.target)) {
          closeDialogAnimated(dialog2);
        }
      });
      dialog2.addEventListener("cancel", (e) => {
        e.preventDefault();
        closeDialogAnimated(dialog2);
      });
      dialog2.addEventListener("close", () => {
        document.body.style.overflow = "";
        dispatchDialogEvent(dialog2, "dialog:close:end");
        const opener = dialog2._lastFocus;
        if (opener) {
          setTimeout(() => opener.focus(), 0);
          opener.setAttribute("aria-expanded", "false");
        }
        dialog2._lastFocus = null;
      });
    });
    const shouldEnableHashControl = Array.from(dialogs).some(isHashControlEnabled);
    if (shouldEnableHashControl) {
      const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        dialogs.forEach((dialog2) => {
          if (!isHashControlEnabled(dialog2)) return;
          const opener = document.querySelector(
            `.js-dialog-open[data-dialog-target="${dialog2.id}"]`
          );
          if (dialog2.id === hash) {
            if (!dialog2.open) dialog2.showModal();
            requestAnimationFrame(() => {
              dialog2.classList.add("is-open");
              resetDialogScroll(dialog2);
              dispatchDialogEvent(dialog2, "dialog:open");
            });
            if (opener) opener.setAttribute("aria-expanded", "true");
            dialog2._lastFocus = null;
            document.body.style.overflow = "hidden";
          } else if (dialog2.open && dialog2.id !== hash) {
            if (opener) opener.setAttribute("aria-expanded", "false");
            closeDialogAnimated(dialog2);
          }
        });
      };
      window.addEventListener("load", handleHashChange);
      window.addEventListener("hashchange", handleHashChange);
    }
  }
};
var dialog_default = dialog;
export {
  dialog_default as default
};
