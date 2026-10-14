document.addEventListener("DOMContentLoaded", () => {

  /* ============ 1. PLACEHOLDERS DE IMÁGENES ============ */
  // Si una imagen no existe, se reemplaza por un SVG con el nombre del archivo.
  function escapeXml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function placeholderSVG(label) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#06b6d4"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="600" fill="url(#g)"/>' +
      '<g fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="6">' +
      '<rect x="300" y="200" width="200" height="140" rx="14"/>' +
      '<circle cx="360" cy="252" r="16"/>' +
      '<path d="M300 320l60-50 50 40 40-30 50 40"/></g>' +
      '<text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#fff" fill-opacity=".9">' +
      escapeXml(label) + '</text>' +
      '<text x="400" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#fff" fill-opacity=".65">Imagen no disponible</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function applyPlaceholder(img) {
    if (img.dataset.phApplied) return; // evita bucles
    img.dataset.phApplied = "1";
    img.src = placeholderSVG("img/" + (img.dataset.label || "imagen"));
  }

  document.querySelectorAll("img[data-label]").forEach(img => {
    img.addEventListener("error", () => applyPlaceholder(img));
    if (img.complete && img.naturalWidth === 0) applyPlaceholder(img);
  });

  /* ============ 2. NAVBAR Y MENÚ MÓVIL ============ */
  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const toTop = document.getElementById("toTop");

  burger.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    toTop.classList.toggle("show", window.scrollY > 600);
  });

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Resaltar el enlace de la sección visible
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".menu a:not(.btn)");
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => sectionObserver.observe(s));

  /* ============ 3. TEMA CLARO / OSCURO ============ */
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("novatech_theme", theme); } catch (e) {}
  }

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("novatech_theme") || "light"; } catch (e) {}
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });

  /* ============ 4. ANIMACIÓN AL HACER SCROLL ============ */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  /* ============ 5. CONTADORES ANIMADOS ============ */
  function animateCounter(el) {
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));

  /* ============ 6. FILTROS DEL PORTAFOLIO ============ */
  const filterButtons = document.querySelectorAll(".filter");
  const works = document.querySelectorAll(".work");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      works.forEach(work => {
        const show = filter === "todos" || work.dataset.category === filter;
        work.classList.toggle("hide", !show);
      });
    });
  });

  /* ============ 7. VISOR DE IMÁGENES (LIGHTBOX) ============ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  works.forEach(work => {
    work.addEventListener("click", () => {
      const img = work.querySelector("img");
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = work.querySelector("strong").textContent;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

  /* ============ 8. CARRUSEL DE TESTIMONIOS ============ */
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("dots");
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Ir al testimonio " + (i + 1));
    dot.addEventListener("click", () => { goToSlide(i); restartTimer(); });
    dotsContainer.appendChild(dot);
  });

  function goToSlide(index) {
    slides[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => goToSlide(current + 1), 5000);
  }
  restartTimer();

  /* ============ 9. PRECIOS MENSUAL / ANUAL ============ */
  const billingToggle = document.getElementById("billingToggle");
  billingToggle.addEventListener("change", () => {
    document.querySelectorAll("[data-monthly]").forEach(el => {
      el.textContent = billingToggle.checked ? el.dataset.yearly : el.dataset.monthly;
    });
  });

  /* ============ 10. FAQ (ACORDEÓN) ============ */
  document.querySelectorAll(".faq-item").forEach(item => {
    const question = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Cierra los demás
      document.querySelectorAll(".faq-item.open").forEach(other => {
        other.classList.remove("open");
        other.querySelector(".faq-a").style.maxHeight = null;
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ============ 11. FORMULARIO DE CONTACTO ============ */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  const fields = {
    name: {
      el: document.getElementById("name"),
      err: document.getElementById("err-name"),
      validate: v => v.trim().length >= 3 ? "" : "Escribe tu nombre (mínimo 3 caracteres)."
    },
    email: {
      el: document.getElementById("email"),
      err: document.getElementById("err-email"),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Ingresa un correo válido."
    },
    subject: {
      el: document.getElementById("subject"),
      err: document.getElementById("err-subject"),
      validate: v => v ? "" : "Selecciona un servicio."
    },
    message: {
      el: document.getElementById("message"),
      err: document.getElementById("err-message"),
      validate: v => v.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres."
    }
  };

  function validateField(field) {
    const message = field.validate(field.el.value);
    field.err.textContent = message;
    field.el.classList.toggle("invalid", Boolean(message));
    return !message;
  }

  Object.values(fields).forEach(field => {
    field.el.addEventListener("blur", () => validateField(field));
    field.el.addEventListener("input", () => {
      if (field.el.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    success.hidden = true;

    const results = Object.values(fields).map(validateField);
    if (results.every(Boolean)) {
      success.hidden = false;
      form.reset();
      setTimeout(() => { success.hidden = true; }, 5000);
    }
  });

  /* ============ 12. AÑO EN EL FOOTER ============ */
  document.getElementById("year").textContent = new Date().getFullYear();
});