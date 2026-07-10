/* ============================================================
   ORE-YX — script.js
   Minimal vanilla JS:
   1. Header shadow once the page is scrolled
   2. Mobile nav toggle
   3. Scroll-reveal via IntersectionObserver
   4. Contact form → pre-filled mailto: link
   5. Auto-updating copyright year
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // apply correct state on load (e.g. reload mid-page)

  /* ---------- 1b. Hero mark parallax ---------- */
  // The chrome oryx drifts slightly slower than the page — a subtle
  // depth cue. Skipped for users who prefer reduced motion.
  var heroMark = document.querySelector(".hero-mark");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroMark && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        // Drives the --parallax offset used in .hero-mark's transform
        heroMark.style.setProperty("--parallax", (y * 0.12).toFixed(1) + "px");
      }
    }, { passive: true });
  }

  /* ---------- 2. Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close the mobile menu after a link is chosen
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- 3. Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Very old browsers: just show everything
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- 3b. Card spotlight ---------- */
  // A silver glow follows the cursor across each trade card
  // (.card::after in style.css). Pointer devices only, rAF-throttled.
  if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    document.querySelectorAll(".card").forEach(function (card) {
      var ticking = false;

      card.addEventListener("pointermove", function (e) {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
          card.style.setProperty("--my", (e.clientY - rect.top) + "px");
          ticking = false;
        });
      });
    });
  }

  /* ---------- 4. Contact form → mailto ---------- */
  // Front-end only: builds a pre-filled mailto: link and opens the
  // visitor's mail client. Swap this for a real endpoint later if needed.
  var form = document.getElementById("contact-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var name = form.elements.name.value.trim();
    var company = form.elements.company.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();

    var subject = "Enquiry from " + company + " — ore-yx.com";
    var body =
      "Name: " + name + "\n" +
      "Company: " + company + "\n" +
      "Email: " + email + "\n\n" +
      message;

    window.location.href =
      "mailto:info@ore-yx.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });

  /* ---------- 5. Copyright year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
