// Helper: select
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Year
$("#year").textContent = new Date().getFullYear();

// Mobile menu toggle with ARIA
const menuBtn = $("#menuToggle");
const nav = $("#primaryNav");
menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

// Smooth scroll + focus for accessibility
$$(".nav__link").forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const target = $(href);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.focus({ preventScroll: true });
      }
      // close menu on mobile after click
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});

// Projects filter
const grid = $("#projectGrid");
const chips = $$(".chip");
chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    const cat = chip.dataset.filter;
    $$(".card", grid).forEach(card => {
      const show = cat === "all" || card.dataset.category === cat;
      card.style.display = show ? "" : "none";
    });
  });
});

// Lightbox using <dialog>
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
const lightboxTriggers = $$(".lightbox-trigger");
const closeBtns = $$("[data-lightbox-close]");

lightboxTriggers.forEach(btn => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-lightbox-src");
    if (src) {
      lightboxImg.src = src;
      try { lightbox.showModal(); } catch { lightbox.setAttribute("open",""); } // Fallback
    }
  });
});

closeBtns.forEach(btn => btn.addEventListener("click", () => {
  try { lightbox.close(); } catch { lightbox.removeAttribute("open"); }
}));

lightbox.addEventListener("click", (e) => {
  // close when backdrop area is clicked
  const rect = lightbox.getBoundingClientRect();
  const inDialog = e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right;
  if (!inDialog) {
    try { lightbox.close(); } catch { lightbox.removeAttribute("open"); }
  }
});

// Contact form validation (real-time)
const form = $("#contactForm");
const fields = {
  name: $("#name"),
  email: $("#email"),
  message: $("#message")
};
const errors = {
  name: $("#err-name"),
  email: $("#err-email"),
  message: $("#err-message")
};

function validateName() {
  const v = fields.name.value.trim();
  if (!v) { errors.name.textContent = "Please enter your name."; return false; }
  errors.name.textContent = ""; return true;
}

function validateEmail() {
  const v = fields.email.value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  if (!ok) { errors.email.textContent = "Please enter a valid email."; return false; }
  errors.email.textContent = ""; return true;
}

function validateMessage() {
  const v = fields.message.value.trim();
  if (v.length < 5) { errors.message.textContent = "Your message must be at least 5 characters long."; return false; }
  errors.message.textContent = ""; return true;
}

fields.name.addEventListener("input", validateName);
fields.email.addEventListener("input", validateEmail);
fields.message.addEventListener("input", validateMessage);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = validateName() & validateEmail() & validateMessage();
  if (ok) {
    alert("Thanks! Your message has been sent.");
    form.reset();
  }
});
