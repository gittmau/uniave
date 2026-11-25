const Navigation = {
  basePath() {
    return document.body.dataset.base || "./";
  },
  init() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    const dropdown = nav.querySelector(".nav-dropdown");
    const dropdownToggle = nav.querySelector(".nav-dropdown-toggle");
    const dropdownMenu = nav.querySelector(".nav-dropdown-menu");

    const setDropdownOpen = (open) => {
      if (!dropdownToggle || !dropdownMenu) return;
      dropdownToggle.setAttribute("aria-expanded", String(open));
      dropdownMenu.classList.toggle("open", open);
    };

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
      if (!open) setDropdownOpen(false);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
      setDropdownOpen(false);
    }));

    if (dropdown && dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener("click", () => {
        setDropdownOpen(dropdownToggle.getAttribute("aria-expanded") !== "true");
      });

      if (window.matchMedia("(min-width: 1061px)").matches) {
        dropdown.addEventListener("mouseenter", () => setDropdownOpen(true));
        dropdown.addEventListener("mouseleave", () => setDropdownOpen(false));
      }

      document.addEventListener("pointerdown", (event) => {
        if (!dropdown.contains(event.target)) setDropdownOpen(false);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("menu-open");
          toggle.focus();
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1060 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
        setDropdownOpen(false);
      }
    });

    this.initClientArea(nav.closest(".header-inner"));
  },

  initClientArea(header) {
    if (!header || header.querySelector(".client-area-trigger")) return;

    const trigger = document.createElement("button");
    trigger.className = "client-area-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", "client-area-dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="4"></circle>
        <path d="M5 21a7 7 0 0 1 14 0"></path>
      </svg>
      <span>Área do Cliente / Representante</span>`;

    const dialog = document.createElement("dialog");
    dialog.id = "client-area-dialog";
    dialog.className = "client-area-dialog";
    dialog.setAttribute("aria-labelledby", "client-area-title");
    dialog.setAttribute("aria-describedby", "client-area-description");
    dialog.innerHTML = `
      <div class="client-area-dialog-header">
        <p class="client-area-dialog-brand">UNIAVE SP</p>
        <button class="client-area-dialog-dismiss" type="button" aria-label="Fechar janela">×</button>
      </div>
      <h2 id="client-area-title">Área do cliente e do representante</h2>
      <p class="client-area-dialog-description" id="client-area-description">O acesso ao sistema de pedidos, histórico e suporte técnico está em implantação em ambiente externo. Enquanto isso, fale com a nossa equipe para solicitar o acesso ou tirar dúvidas.</p>
      <div class="client-area-dialog-actions">
        <a class="button" href="${this.basePath()}pages/contato.html">Falar com a UNIAVE SP</a>
        <button class="client-area-dialog-close" type="button">FECHAR</button>
      </div>`;

    const menuToggle = header.querySelector(".menu-toggle");
    if (menuToggle) header.insertBefore(trigger, menuToggle);
    else header.append(trigger);
    document.body.append(dialog);

    trigger.addEventListener("click", () => {
      dialog.showModal();
      trigger.setAttribute("aria-expanded", "true");
    });

    dialog.querySelector(".client-area-dialog-dismiss").addEventListener("click", () => dialog.close());
    dialog.querySelector(".client-area-dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialog.close();
      }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    });
  }
};
