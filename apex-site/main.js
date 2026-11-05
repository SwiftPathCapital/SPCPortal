(function () {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Projects
  const grid = document.getElementById("project-grid");
  const projects = window.APEX_PROJECTS || [];

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render(filter) {
    const list = projects.filter((p) => filter === "all" || p.type === filter);
    grid.innerHTML = list.length
      ? list.map((p) => `
        <article class="card project">
          <div class="project-media">
            ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : ""}
            <span class="tag">${esc(p.type)}</span>
          </div>
          <div class="project-body">
            <h3>${esc(p.name)}</h3>
            <div class="project-meta">${esc(p.location)} · ${esc(p.status)}</div>
            <p>${esc(p.summary)}</p>
          </div>
        </article>`).join("")
      : `<p class="muted">No projects in this category yet.</p>`;
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => {
        c.classList.toggle("active", c === chip);
        c.setAttribute("aria-selected", String(c === chip));
      });
      render(chip.dataset.filter);
    });
  });
  render("all");

  // Lead form
  const form = document.getElementById("lead-form");
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector("button[type=submit]");

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");

    // Validation
    let firstBad = null;
    form.querySelectorAll("[required]").forEach((el) => {
      const ok = el.checkValidity();
      el.setAttribute("aria-invalid", String(!ok));
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) {
      firstBad.focus();
      setStatus("Please fill in your name, a valid email and what you're interested in.", "err");
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return; // honeypot tripped — silently drop bots
    delete data.website;

    // Consent record: only meaningful with a phone number
    data.sms_consent = data.sms_consent === "yes" && !!data.phone;
    data.consent_text = data.sms_consent ? form.querySelector(".consent span").textContent.trim() : null;
    data.submitted_at = new Date().toISOString();
    data.page = location.href;

    const endpoint = (window.APEX_CONFIG || {}).formEndpoint;
    if (!endpoint) {
      setStatus("Our form isn't connected yet. Please email us directly for now.", "err");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending…");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      setStatus("Thanks — we'll be in touch within one business day.", "ok");
    } catch (err) {
      setStatus("Something went wrong sending your message. Please email us directly.", "err");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
