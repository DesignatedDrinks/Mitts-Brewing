(() => {
  const navItems = [
    ["Our Beers", "beers.html"],
    ["Our Story", "story.html"],
    ["About", "about.html"],
    ["Find Mitt's", "find.html"],
    ["Shop", "shop.html"],
    ["Journal", "journal.html"],
    ["Contact", "contact.html"]
  ];

  const current = location.pathname.split("/").pop() || "index.html";
  const activeFor = (href) => {
    if (current === href) return true;
    if (current === "premium-lager.html" && href === "beers.html") return true;
    if (current.startsWith("journal-") && href === "journal.html") return true;
    return false;
  };

  const headerTarget = document.querySelector("[data-site-header]");
  if (headerTarget) {
    headerTarget.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="announcement">Premium non-alcoholic beer. Canadian made. Launching soon.</div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="Mitt's Brewing Co. home">
            <span class="brand-word">MITT'S</span>
            <span class="brand-sub">Brewing Co.</span>
          </a>
          <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
            ${navItems.map(([label, href]) => `<a href="${href}" ${activeFor(href) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          </nav>
          <div class="header-cta">
            <a class="button" href="shop.html">Join the launch</a>
            <button class="menu-toggle" type="button" aria-label="Open menu" aria-controls="site-nav" aria-expanded="false"><span></span></button>
          </div>
        </div>
      </header>`;

    const toggle = headerTarget.querySelector(".menu-toggle");
    const nav = headerTarget.querySelector(".site-nav");
    toggle?.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    }));
  }

  const footerTarget = document.querySelector("[data-site-footer]");
  if (footerTarget) {
    const year = new Date().getFullYear();
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div class="footer-brand stack">
            <a class="brand" href="index.html"><span class="brand-word">MITT'S</span><span class="brand-sub">Brewing Co.</span></a>
            <p>Modern Canadian non-alcoholic beer made for carefree moments, good company and the road ahead.</p>
            <div class="socials" aria-label="Social media coming soon"><span aria-label="Instagram">IG</span><span aria-label="Facebook">FB</span><span aria-label="TikTok">TT</span></div>
          </div>
          <div><h3>Explore</h3><a href="beers.html">Our beers</a><a href="story.html">Our story</a><a href="find.html">Find Mitt's</a><a href="journal.html">Journal</a></div>
          <div><h3>Company</h3><a href="about.html">About</a><a href="wholesale.html">Wholesale</a><a href="contact.html">Contact</a><a href="shop.html">Shop</a></div>
          <div><h3>Stay in the moment</h3><p>Be first to hear about launch dates, stockists and new releases.</p><form class="newsletter" data-newsletter><input type="email" name="email" placeholder="Email address" aria-label="Email address" required><button class="button button-light" type="submit">Join</button></form><p class="form-status" data-newsletter-status aria-live="polite"></p></div>
        </div>
        <div class="container footer-bottom"><span>© ${year} Mitt's Brewing Co. A brand of Designated Drinks Inc.</span><span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span></div>
      </footer>`;
  }

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = String(new FormData(form).get("email") || "");
      const status = form.parentElement.querySelector("[data-newsletter-status]") || document.querySelector("[data-newsletter-status]");
      if (status) status.textContent = "Opening your email app to complete the request…";
      const subject = encodeURIComponent("Add me to the Mitt's launch list");
      const body = encodeURIComponent(`Please add ${email} to the Mitt's Brewing Co. launch list.`);
      window.location.href = `mailto:hello@mittsbrewing.com?subject=${subject}&body=${body}`;
    });
  });

  document.querySelectorAll("[data-contact-form]").forEach((contactForm) => {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(`Website inquiry: ${data.get("topic") || "General"}`);
      const lines = [];
      for (const [key, value] of data.entries()) {
        if (!value || key === "message") continue;
        const label = key.replace(/(^|_)(\w)/g, (_, space, letter) => `${space ? " " : ""}${letter.toUpperCase()}`);
        lines.push(`${label}: ${value}`);
      }
      lines.push("", String(data.get("message") || ""));
      const body = encodeURIComponent(lines.join("\n"));
      const status = contactForm.querySelector("[data-form-status]") || document.querySelector("[data-form-status]");
      if (status) status.textContent = "Opening your email app…";
      window.location.href = `mailto:hello@mittsbrewing.com?subject=${subject}&body=${body}`;
    });
  });
})();
