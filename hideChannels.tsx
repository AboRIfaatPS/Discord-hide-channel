import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { addStyle, removeStyle } from "@utils/style";
import { createButton } from "@utils/dom";

export default definePlugin({
  name: "HideChannels",
  description: "Adds a button to hide/show the channel list sidebar in Discord",
  authors: [{ name: "Farcrada", id: "original" }, { name: "Modified by الزنجي الشهواني" }],
  dependencies: [],
  async start() {
    const sidebarSelector = "[class*='sidebar-']";
    const buttonId = "vencord-hide-channels-btn";

    // Add toggle function
    const toggleSidebar = () => {
      const sidebar = document.querySelector<HTMLElement>(sidebarSelector);
      if (!sidebar) return;
      sidebar.style.display = (sidebar.style.display === "none") ? "" : "none";
    };

    // Insert toggle button
    const insertButton = () => {
      if (document.getElementById(buttonId)) return;

      const toolbar = document.querySelector('[class*="toolbar-"]');
      if (!toolbar) return;

      const btn = createButton("📂", {
        id: buttonId,
        style: {
          fontSize: "18px",
          marginRight: "8px",
          cursor: "pointer",
        },
        onClick: toggleSidebar,
      });

      toolbar.prepend(btn);
    };

    // Setup global keybind (Ctrl + H)
    const onKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "h") {
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", onKeydown);
    const observer = new MutationObserver(insertButton);
    observer.observe(document.body, { childList: true, subtree: true });

    insertButton(); // Run immediately
    this._cleanup = () => {
      document.removeEventListener("keydown", onKeydown);
      observer.disconnect();
      document.getElementById(buttonId)?.remove();
    };
  },

  stop() {
    this._cleanup?.();
  }
});
