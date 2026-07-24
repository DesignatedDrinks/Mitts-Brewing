(() => {
  const siteEmail = "hello@mittsbrewing.com";
  const mobileQuery = window.matchMedia("(max-width: 1050px)");

  const runtimeStyles = document.createElement("style");
  runtimeStyles.textContent = `
    [aria-disabled="true"].button {
      cursor: default;
      opacity: .72;
      pointer-events: none;
    }
    @media (max-width: 1050px) {
      [data-site-header] {
        position: relative;
        z-index: 2000;
      }
      .site-header {
        z-index: 2001;
        background: var(--paper);
        -webkit-backdrop-filter: none;
        backdrop-filter: none;
      }
      .site-nav {
        z-index: 2002;
        bottom: auto;
        height: calc(100vh - var(--mobile-nav-top));
        height: calc(100dvh - var(--mobile-nav-top));
        max-height: calc(100vh - var(--mobile-nav-top));
        max-height: calc(100dvh - var(--mobile-nav-top));
      }
      .nav-backdrop {
        z-index: 2000;
      }
    }
  `;
  document.head.appendChild(runtimeStyles);

  const navGroups = [
    {
      label: "Beer",
      items: [["Premium Lager", "beers.html"]]
    },
    {
      label: "Brand",
      items: [
        ["Our Story", "story.html"],
        ["About", "about.html"],
        ["Journal", "journal.html"]
      ]
    },
    {
      label: "Get Mitt's",
      items: [
        ["Find Mitt's", "find.html"],
        ["Shop", "shop.html"],
        ["Contact", "contact.html"]
      ]
    }
  ];

  const currentPage = location.pathname.split("/").pop() || "index.html";
  const isActivePage = (href) => {
    if (currentPage === href) return true;
    if (currentPage === "premium-lager.html" && href === "beers.html") return true;
    if (currentPage.startsWith("journal-") && href === "journal.html") return true;
    return false;
  };

  const headerTarget = document.querySelector("[data-site-header]");
  if (headerTarget) {
    const navMarkup = navGroups.map(({ label, items }) => `
      <div class="nav-group">
        <span class="nav-group-label">${label}</span>
        <div class="nav-group-links">
          ${items.map(([itemLabel, href]) => `<a href="${href}" ${isActivePage(href) ? 'aria-current="page"' : ""}>${itemLabel}</a>`).join("")}
        </div>
      </div>
    `).join("");

    headerTarget.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="announcement">Mitt's Premium Lager. Launching soon.</div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="Mitt's Brewing Co. home">
            <span class="brand-word">MITT'S</span>
            <span class="brand-sub">Brewing Co.</span>
          </a>
          <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
            ${navMarkup}
            <a class="button mobile-nav-cta" href="shop.html">Join the launch</a>
          </nav>
          <div class="header-cta">
            <a class="button" href="shop.html">Join the launch</a>
            <button class="menu-toggle" type="button" aria-label="Open menu" aria-controls="site-nav" aria-expanded="false"><span></span></button>
          </div>
        </div>
      </header>
      <button class="nav-backdrop" type="button" aria-label="Close menu" aria-hidden="true" tabindex="-1"></button>`;

    const siteHeader = headerTarget.querySelector(".site-header");
    const toggle = headerTarget.querySelector(".menu-toggle");
    const nav = headerTarget.querySelector(".site-nav");
    const backdrop = headerTarget.querySelector(".nav-backdrop");
    let menuOpen = false;

    const syncNavTop = () => {
      if (!siteHeader) return;
      const headerBottom = Math.max(0, Math.round(siteHeader.getBoundingClientRect().bottom));
      document.documentElement.style.setProperty("--mobile-nav-top", `${headerBottom}px`);
    };

    const updateNavInteractivity = () => {
      if (!nav) return;
      nav.toggleAttribute("inert", mobileQuery.matches && !menuOpen);
    };

    const setMenu = (open, restoreFocus = false) => {
      if (!nav || !toggle) return;

      menuOpen = Boolean(open && mobileQuery.matches);
      if (menuOpen) syncNavTop();

      nav.classList.toggle("open", menuOpen);
      document.body.classList.toggle("nav-open", menuOpen);
      toggle.setAttribute("aria-expanded", String(menuOpen));
      toggle.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");
      backdrop?.setAttribute("aria-hidden", String(!menuOpen));
      updateNavInteractivity();

      if (menuOpen) {
        requestAnimationFrame(() => {
          const currentLink = nav.querySelector('[aria-current="page"]');
          const firstLink = nav.querySelector("a[href]");
          (currentLink || firstLink)?.focus({ preventScroll: true });
        });
      } else if (restoreFocus) {
        toggle.focus({ preventScroll: true });
      }
    };

    toggle?.addEventListener("click", () => setMenu(!menuOpen));
    backdrop?.addEventListener("click", () => setMenu(false, true));

    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (!menuOpen || !nav || !toggle) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setMenu(false, true);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [toggle, ...nav.querySelectorAll("a[href]")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const handleViewportChange = () => {
      syncNavTop();
      if (!mobileQuery.matches) setMenu(false);
      updateNavInteractivity();
    };

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleViewportChange);
    } else {
      mobileQuery.addListener(handleViewportChange);
    }

    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener("orientationchange", handleViewportChange, { passive: true });
    window.addEventListener("pageshow", handleViewportChange);
    handleViewportChange();
  }

  const footerTarget = document.querySelector("[data-site-footer]");
  if (footerTarget) {
    const year = new Date().getFullYear();
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div class="footer-brand stack">
            <a class="brand" href="index.html" aria-label="Mitt's Brewing Co. home"><span class="brand-word">MITT'S</span><span class="brand-sub">Brewing Co.</span></a>
            <p>Canadian non-alcoholic beer. Make the moment.</p>
          </div>
          <div><h3>Explore</h3><a href="beers.html">Premium Lager</a><a href="story.html">Our story</a><a href="find.html">Find Mitt's</a><a href="journal.html">Journal</a></div>
          <div><h3>Company</h3><a href="about.html">About</a><a href="wholesale.html">Wholesale</a><a href="contact.html">Contact</a><a href="shop.html">Shop</a></div>
          <div><h3>Make the moment</h3><p>Launch dates, stockists and new releases.</p><form class="newsletter" data-newsletter><input type="email" name="email" placeholder="Email address" aria-label="Email address" autocomplete="email" inputmode="email" required><button class="button button-light" type="submit">Join</button></form><p class="form-status" data-newsletter-status aria-live="polite"></p></div>
        </div>
        <div class="container footer-bottom"><span>© ${year} Mitt's Brewing Co.</span><span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span></div>
      </footer>`;
  }

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = String(new FormData(form).get("email") || "").trim();
      const status = form.parentElement?.querySelector("[data-newsletter-status]") || document.querySelector("[data-newsletter-status]");

      if (!email) {
        if (status) status.textContent = "Enter your email address.";
        form.querySelector('input[type="email"]')?.focus();
        return;
      }

      if (status) status.textContent = "Opening your email app…";
      const subject = encodeURIComponent("Add me to the Mitt's launch list");
      const body = encodeURIComponent(`Please add ${email} to the Mitt's launch list.`);
      location.href = `mailto:${siteEmail}?subject=${subject}&body=${body}`;
    });
  });

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(`Website inquiry: ${data.get("topic") || "General"}`);
      const lines = [];

      for (const [key, value] of data.entries()) {
        if (!value || key === "message") continue;
        const label = key.replace(/(^|_)(\w)/g, (_, space, letter) => `${space ? " " : ""}${letter.toUpperCase()}`);
        lines.push(`${label}: ${value}`);
      }

      lines.push("", String(data.get("message") || ""));
      const body = encodeURIComponent(lines.join("\n"));
      const status = form.querySelector("[data-form-status]") || document.querySelector("[data-form-status]");
      if (status) status.textContent = "Opening your email app…";
      location.href = `mailto:${siteEmail}?subject=${subject}&body=${body}`;
    });
  });
})();