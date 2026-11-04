document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const currentYear = document.getElementById("current-year");
  const themeToggle = document.getElementById("theme-toggle");

  const root = document.documentElement;
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("theme");
  } catch (e) {}

  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);

      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navItems.forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const typedRole = document.getElementById("typed-role");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typedRole && !reduceMotion) {
    const roles = [
      "Full Stack Developer",
      "Laravel Developer",
      "Vue.js Developer",
      "TypeScript Enthusiast",
    ];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function typeLoop() {
      const word = roles[roleIndex];

      if (deleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      typedRole.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 85;

      if (!deleting && charIndex === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }

      setTimeout(typeLoop, delay);
    }

    setTimeout(typeLoop, 2200);
  }

  const revealTargets = document.querySelectorAll(
    ".about-text, .about-detail, .section-header, .skill-card, .project-card, .contact-container"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      observer.observe(el);
    });
  }

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  const sections = document.querySelectorAll("section[id]");

  function updateActiveLink() {
    let currentSection = "";
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      currentSection = sections[sections.length - 1].getAttribute("id");
    }

    navItems.forEach(function (link) {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + currentSection
      );
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();
});