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
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const langHooks = [];
  const modalApi = {};
  let lang = "en";

  const roles = [
    "Junior Full Stack Developer",
    "Laravel Developer",
    "Vue.js Developer",
    "TypeScript Enthusiast",
  ];
  const khmerRole = "អ្នកអភិវឌ្ឍន៍ Full Stack (Junior)";
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;
  let typingTimer = null;

  function typeLoop() {
    if (lang !== "en") {
      return;
    }

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

    typingTimer = setTimeout(typeLoop, delay);
  }

  function startTyping() {
    clearTimeout(typingTimer);
    roleIndex = 0;
    charIndex = roles[0].length;
    deleting = true;

    if (!typedRole) {
      return;
    }

    typedRole.textContent = roles[0];

    if (!reduceMotion) {
      typingTimer = setTimeout(typeLoop, 2200);
    }
  }

  function stopTyping(text) {
    clearTimeout(typingTimer);

    if (typedRole) {
      typedRole.textContent = text;
    }
  }

  const revealTargets = document.querySelectorAll(
    ".about-text, .about-detail, .section-header, .skill-card, .project-card, .slider, .contact-container",
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
      { threshold: 0.15 },
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
        link.getAttribute("href") === "#" + currentSection,
      );
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  const modalData = {
    schools: {
      title: "Schools using the School ERP System",
      titleKm: "សាលាដែលប្រើប្រព័ន្ធ ERP សម្រាប់សាលា",
      sub: function (n) {
        return "Built with the TechStore team for " + n + " schools.";
      },
      subKm: function (n) {
        return "បង្កើតជាមួយក្រុម TechStore សម្រាប់សាលាចំនួន " + n + "។";
      },
      items: [
        { name: "Spring Education", short: "SE", logo: "spring-education.png" },
        {
          name: "True Vision International School",
          short: "TV",
          logo: "true-vision.png",
        },
        {
          name: "Koh Kong International School (KKIS)",
          short: "KK",
          logo: "kkis.png",
        },
        { name: "Northstar", short: "NS", logo: "northstar.png" },
        {
          name: "Pannasastra International School (PSIS4)",
          short: "PS",
          logo: "psis.png",
        },
        { name: "Berkeley International School", short: "BI", logo: "elt.png" },
        { name: "BTI University", short: "BTI", logo: "bti.png" },
        { name: "ASEAN School", short: "AS", logo: "asean.png" },
        { name: "IDEA School", short: "ID", logo: "idea.png" },
        {
          name: "Brightstar International School of Phnom Penh (BISPP)",
          short: "BR",
          logo: "bispp.png",
        },
        { name: "NIS School", short: "NIS", logo: "nis.png" },
        { name: "USA IS Battambang", short: "USA", logo: "usa-battambang.png" },
        {
          name: "Starlink International Academy",
          short: "SI",
          logo: "starlink.png",
        },
      ],
    },
    loans: {
      title: "Loan management systems",
      titleKm: "ប្រព័ន្ធគ្រប់គ្រងកម្ចី",
      sub: function (n) {
        return n + " loan systems I’ve worked on at TechStore.";
      },
      subKm: function (n) {
        return "ប្រព័ន្ធកម្ចីចំនួន " + n + " ដែលខ្ញុំបានធ្វើនៅ TechStore។";
      },
      items: [
        {
          name: "RPRU",
          short: "RPRU",
          note: "Daily loan",
          noteKm: "កម្ចីប្រចាំថ្ងៃ",
          logo: "assets/images/rpru.png",
        },
        {
          name: "RPRU Pawn Shop",
          short: "PS",
          logo: "assets/images/rpru-pawn-shop.png",
        },
        {
          name: "RPRU Finance PLC",
          short: "RF",
          logo: "assets/images/rpru-finance.png",
        },
      ],
    },
    pos: {
      title: "Projects built on the POS system",
      titleKm: "គម្រោងដែលបង្កើតលើប្រព័ន្ធ POS",
      sub: function (n) {
        return (
          n + " point of sale and business systems I’ve worked on at TechStore."
        );
      },
      subKm: function (n) {
        return (
          "ប្រព័ន្ធលក់ និងប្រព័ន្ធអាជីវកម្មចំនួន " +
          n +
          " ដែលខ្ញុំបានធ្វើនៅ TechStore។"
        );
      },
      items: [
        { name: "TVS-BLS" },
        { name: "MSK Kubota" },
        { name: "VKP POS" },
        {
          name: "Apsor",
          note: "Steam sauna management",
          noteKm: "ប្រព័ន្ធគ្រប់គ្រងសាឡុងចំហាយ",
        },
        { name: "Tec Pro POS" },
        { name: "Manchinery World" },
        { name: "RK POS", note: "Relax Restaurant" },
        {
          name: "SKP POS",
          note: "Vehicle spare parts",
          noteKm: "គ្រឿងបន្លាស់យានយន្ត",
        },
        { name: "RFCD" },
        { name: "Sopheak Food" },
        { name: "VINCA" },
        { name: "Khan Vannak" },
        { name: "SP Cafe" },
        { name: "Meta Shop" },
        { name: "MSK Cambodia" },
        { name: "SCT" },
        { name: "Cloud POS" },
      ],
    },
  };

  const projectModal = document.getElementById("project-modal");
  const modalGrid = document.getElementById("modal-grid");
  const modalTitle = document.getElementById("modal-title");
  const modalSub = document.getElementById("modal-sub");
  const modalClose = document.getElementById("modal-close");
  let lastFocused = null;
  let openKey = null;

  function initialsOf(name) {
    const words = name.split(/[\s-]+/).filter(Boolean);
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  function renderModal(key) {
    const data = modalData[key];
    if (!data) {
      return false;
    }

    modalTitle.textContent =
      lang === "km" && data.titleKm ? data.titleKm : data.title;
    modalSub.textContent = (
      lang === "km" && data.subKm ? data.subKm : data.sub
    )(data.items.length);
    modalGrid.textContent = "";

    data.items.forEach(function (item) {
      const card = document.createElement("div");
      card.className = "school-card";

      const logoBox = document.createElement("div");
      logoBox.className = "school-logo";
      logoBox.textContent = item.short || initialsOf(item.name);

      if (item.logo) {
        const img = document.createElement("img");
        img.src =
          item.logo.indexOf("/") === -1
            ? "assets/schools/" + item.logo
            : item.logo;
        img.alt = item.name + " logo";
        img.loading = "lazy";
        img.addEventListener("error", function () {
          img.remove();
        });
        logoBox.appendChild(img);
      }

      const title = document.createElement("h4");
      title.textContent = item.name;

      card.appendChild(logoBox);
      card.appendChild(title);

      if (item.note) {
        const note = document.createElement("p");
        note.textContent =
          lang === "km" && item.noteKm ? item.noteKm : item.note;
        card.appendChild(note);
      }

      modalGrid.appendChild(card);
    });

    return true;
  }

  if (projectModal && modalGrid) {
    function openModal(key) {
      if (!renderModal(key)) {
        return;
      }
      lastFocused = document.activeElement;
      openKey = key;
      projectModal.classList.add("open");
      projectModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      projectModal.querySelector(".modal-panel").scrollTop = 0;
      if (modalClose) {
        setTimeout(function () {
          modalClose.focus();
        }, 50);
      }
    }

    function closeModal() {
      projectModal.classList.remove("open");
      projectModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      openKey = null;
      if (lastFocused) {
        lastFocused.focus();
      }
    }

    modalApi.open = openModal;
    modalApi.close = closeModal;

    langHooks.push(function () {
      if (openKey) {
        renderModal(openKey);
      }
    });

    document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-open-modal"));
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    projectModal.addEventListener("click", function (event) {
      if (event.target === projectModal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && projectModal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  const sliderEl = document.getElementById("slider");
  const sliderTrack = document.getElementById("slider-track");

  if (sliderEl && sliderTrack) {
    const viewport = sliderEl.querySelector(".slider-viewport");
    const sliderCount = document.getElementById("slider-count");
    const sliderBar = document.getElementById("slider-bar");
    const sliderToggle = document.getElementById("slider-toggle");
    const sliderPrev = document.getElementById("slider-prev");
    const sliderNext = document.getElementById("slider-next");

    const items = [
      {
        src: "assets/images/trip.png",
        caption: "Team trip",
        captionKm: "ដំណើរកម្សាន្តក្រុម",
      },
      {
        src: "assets/images/festival.png",
        caption: "Festival",
        captionKm: "ពិធីបុណ្យ",
      },
      { src: "assets/images/idk.png" },
      { src: "assets/images/photo_2025-05-28_20-58-07.png" },
    ];

    for (let n = 1; n <= 25; n++) {
      items.push({
        src: "assets/images/photo_" + n + "_2026-11-04_20-09-57.jpg",
      });
    }

    const SLIDE_MS = 5500;
    const slides = [];
    let current = 0;
    let timer = null;
    let userPaused = reduceMotion;
    let hovering = false;
    let focusedInside = false;
    let inView = true;
    let startX = null;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    items.forEach(function (item, i) {
      const el = document.createElement("div");
      el.className = "slide";
      el.setAttribute("role", "group");
      el.setAttribute("aria-roledescription", "slide");
      el.setAttribute("aria-label", i + 1 + " of " + items.length);

      const bg = document.createElement("div");
      bg.className = "slide-bg";

      const img = document.createElement("img");
      img.className = "slide-img";
      img.alt = item.caption || "TechStore team photo";
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;

      img.addEventListener("load", function () {
        bg.style.backgroundImage = 'url("' + item.src + '")';
      });

      img.addEventListener("error", function () {
        el.classList.add("broken");
      });

      el.appendChild(bg);
      el.appendChild(img);

      let captionEl = null;

      if (item.caption) {
        captionEl = document.createElement("span");
        captionEl.className = "slide-caption";
        captionEl.textContent = item.caption;
        el.appendChild(captionEl);
      }

      sliderTrack.appendChild(el);
      slides.push({
        el: el,
        img: img,
        loaded: false,
        captionEl: captionEl,
        item: item,
      });
    });

    langHooks.push(function () {
      slides.forEach(function (slide) {
        if (slide.captionEl) {
          slide.captionEl.textContent =
            lang === "km" && slide.item.captionKm
              ? slide.item.captionKm
              : slide.item.caption;
        }
      });
    });

    function loadSlide(i) {
      const slide = slides[i];
      if (!slide || slide.loaded) {
        return;
      }
      slide.loaded = true;
      slide.img.src = items[i].src;
    }

    function stopTimer() {
      clearTimeout(timer);
      timer = null;
      sliderBar.style.animation = "none";
      sliderBar.style.width = "0";
    }

    function startTimer() {
      stopTimer();
      void sliderBar.offsetWidth;
      sliderBar.style.animation =
        "sliderProgress " + SLIDE_MS + "ms linear forwards";
      timer = setTimeout(function () {
        show(current + 1);
      }, SLIDE_MS);
    }

    function refresh() {
      sliderEl.classList.toggle("paused", userPaused);
      sliderToggle.setAttribute(
        "aria-label",
        userPaused ? "Play slideshow" : "Pause slideshow",
      );

      if (
        !userPaused &&
        !hovering &&
        !focusedInside &&
        inView &&
        !document.hidden
      ) {
        startTimer();
      } else {
        stopTimer();
      }
    }

    function show(index) {
      current = (index + items.length) % items.length;

      slides.forEach(function (slide, i) {
        slide.el.classList.toggle("active", i === current);
        slide.el.setAttribute("aria-hidden", String(i !== current));
      });

      loadSlide(current);
      loadSlide((current + 1) % items.length);
      loadSlide((current - 1 + items.length) % items.length);

      sliderCount.textContent = pad(current + 1) + " / " + pad(items.length);
      refresh();
    }

    sliderPrev.addEventListener("click", function () {
      show(current - 1);
    });

    sliderNext.addEventListener("click", function () {
      show(current + 1);
    });

    sliderToggle.addEventListener("click", function () {
      userPaused = !userPaused;
      refresh();
    });

    sliderEl.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        show(current + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(current - 1);
      }
    });

    viewport.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") {
        hovering = true;
        refresh();
      }
    });

    viewport.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse") {
        hovering = false;
        refresh();
      }
    });

    viewport.addEventListener("pointerdown", function (event) {
      startX = event.clientX;
    });

    viewport.addEventListener("pointerup", function (event) {
      if (startX === null) {
        return;
      }
      const dx = event.clientX - startX;
      startX = null;

      if (Math.abs(dx) > 50) {
        show(dx < 0 ? current + 1 : current - 1);
      }
    });

    viewport.addEventListener("pointercancel", function () {
      startX = null;
    });

    sliderEl.addEventListener("focusin", function (event) {
      focusedInside = event.target.matches(":focus-visible");
      refresh();
    });

    sliderEl.addEventListener("focusout", function () {
      focusedInside = false;
      refresh();
    });

    document.addEventListener("visibilitychange", refresh);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          inView = entries[0].isIntersecting;
          refresh();
        },
        { threshold: 0.25 },
      ).observe(sliderEl);
    }

    show(0);
  }

  const khmer = {
    nav_home: "ទំព័រដើម",
    nav_about: "អំពីខ្ញុំ",
    nav_skills: "ជំនាញ",
    nav_projects: "គម្រោង",
    nav_gallery: "វិចិត្រសាល",
    nav_contact: "ទំនាក់ទំនង",
    hero_hello: "សួស្តី ខ្ញុំគឺ",
    hero_desc:
      "អ្នកអភិវឌ្ឍន៍ Full Stack កម្រិតចាប់ផ្តើមនៅ TechStore Creative Solutions ដែលមានបទពិសោធន៍ជិត ៣ ឆ្នាំក្នុងការបង្កើតកម្មវិធីវេបដោយប្រើកូដស្អាត ការរចនាប្រកបដោយការគិតគូរ និងដំណោះស្រាយជាក់ស្តែង។",
    btn_projects: "មើលគម្រោងរបស់ខ្ញុំ",
    btn_contact: "ទាក់ទងខ្ញុំ",
    btn_cv: "ទាញយក CV",
    about_eyebrow: "ស្គាល់ខ្ញុំបន្ថែម",
    about_title: "អំពីខ្ញុំ",
    about_h3:
      "ខ្ញុំគឺ Tol Bovireak អ្នកអភិវឌ្ឍន៍ Full Stack កម្រិតចាប់ផ្តើម ដែលចូលចិត្តបង្កើតអ្វីៗសម្រាប់គេហទំព័រ។",
    about_p1:
      "ខ្ញុំធ្វើការនៅ TechStore Creative Solutions ជាកន្លែងដែលក្រុមរបស់ខ្ញុំ និងខ្ញុំបង្កើតប្រព័ន្ធ ERP សម្រាប់សាលា និងកម្មវិធីវេបផ្សេងៗ។ ខ្ញុំមានបទពិសោធន៍ជាក់ស្តែងជិត ៣ ឆ្នាំលើផ្នែក Frontend, Backend និងមូលដ្ឋានទិន្នន័យ។",
    about_p2:
      "ខ្ញុំធ្វើការជាចម្បងជាមួយ PHP, Laravel, Vue.js, JavaScript, TypeScript និង PostgreSQL ហើយប្រើ Docker និង Linux សម្រាប់គ្រប់គ្រងបរិស្ថានអភិវឌ្ឍន៍។ ខ្ញុំតែងតែរៀនសូត្រ និងស្វែងរកវិធីសរសេរកម្មវិធីឱ្យកាន់តែប្រសើរ។",
    fact_role: "តួនាទី",
    fact_role_val: "អ្នកអភិវឌ្ឍន៍ Full Stack (Junior)",
    fact_company: "ក្រុមហ៊ុន",
    fact_exp: "បទពិសោធន៍",
    fact_exp_val: "ជិត ៣ ឆ្នាំ",
    fact_exp_dates: "២០២៣ – ២០២៦",
    detail_fe: "ការអភិវឌ្ឍ Frontend",
    detail_fe_d: "បង្កើតចំណុចប្រទាក់ដែលសមស្របគ្រប់អេក្រង់ និងងាយស្រួលប្រើ។",
    detail_be: "ការអភិវឌ្ឍ Backend",
    detail_be_d: "អភិវឌ្ឍតក្កវិជ្ជាកម្មវិធី និង API។",
    detail_db: "ការគ្រប់គ្រងមូលដ្ឋានទិន្នន័យ",
    detail_db_d: "ធ្វើការជាមួយមូលដ្ឋានទិន្នន័យ relational និងទិន្នន័យ។",
    detail_env: "បរិស្ថានអភិវឌ្ឍន៍",
    detail_env_d: "ប្រើ Linux, Docker និង Git ក្នុងការអភិវឌ្ឍ។",
    skills_eyebrow: "ជំនាញរបស់ខ្ញុំ",
    skills_title: "ជំនាញបច្ចេកទេស",
    skills_desc:
      "បច្ចេកវិទ្យា និងឧបករណ៍ដែលខ្ញុំប្រើដើម្បីបង្កើត និងថែទាំកម្មវិធីវេប។",
    skill_db: "មូលដ្ឋានទិន្នន័យ",
    skill_tools: "ឧបករណ៍ និងបរិស្ថាន",
    proj_eyebrow: "ស្នាដៃរបស់ខ្ញុំ",
    proj_title: "គម្រោងលេចធ្លោ",
    proj_desc:
      "នេះជាគម្រោងមួយចំនួនដែលខ្ញុំបានធ្វើ។ គម្រោងបន្ថែមនឹងត្រូវបន្ថែមក្នុងពេលឆាប់ៗ។",
    proj_school: "ប្រព័ន្ធ ERP សម្រាប់សាលា",
    proj_school_d:
      "ប្រព័ន្ធពេញលេញសម្រាប់គ្រប់គ្រងសិស្ស គ្រូ ថ្នាក់ និងពិន្ទុ បង្កើតជាមួយក្រុមរបស់យើងនៅ TechStore។",
    proj_school_b: "មើលសាលា",
    proj_pos: "ប្រព័ន្ធ POS",
    proj_pos_d:
      "ប្រព័ន្ធលក់ POS លើ Cloud ដែលសម្របសម្រាប់អាជីវកម្មច្រើនប្រភេទ បង្កើតជាមួយក្រុមរបស់យើងនៅ TechStore។",
    proj_pos_b: "មើលគម្រោង",
    proj_loan: "ប្រព័ន្ធគ្រប់គ្រងកម្ចី",
    proj_loan_d:
      "ប្លាតហ្វមសម្រាប់គ្រប់គ្រងកម្ចី កាលវិភាគសងប្រាក់ និងកំណត់ត្រាអតិថិជន បង្កើតជាមួយក្រុមរបស់យើងនៅ TechStore។",
    proj_loan_b: "មើលប្រព័ន្ធ",
    gal_eyebrow: "លើសពីកូដ",
    gal_title: "ជីវិតនៅ TechStore",
    gal_desc:
      "ពេលវេលាជាមួយក្រុម TechStore ចាប់ពីដំណើរកម្សាន្ត ពិធីបុណ្យ រហូតដល់ការធ្វើការជាក្រុមប្រចាំថ្ងៃ។",
    contact_eyebrow: "ទាក់ទងមក",
    contact_title: "មកធ្វើការជាមួយគ្នា",
    contact_desc: "មានគម្រោង ឬឱកាសអ្វីមួយក្នុងចិត្តទេ? សូមទាក់ទងមកបានតាមចិត្ត។",
    contact_mail: "ឬផ្ញើអ៊ីមែលមកខ្ញុំដោយផ្ទាល់",
    form_name: "ឈ្មោះ",
    form_email: "អ៊ីមែល",
    form_message: "សាររបស់អ្នក",
    form_send: "ផ្ញើសារ",
    status_open: "ទទួលឱកាសការងារ",
    status_city: "ភ្នំពេញ",
    stat_schools: "សាលាដែលបានបម្រើ",
    stat_pos: "គម្រោង POS",
    stat_loans: "ប្រព័ន្ធកម្ចី",
    stat_years: "ឆ្នាំនៃបទពិសោធន៍",
  };

  const statusText = {
    sending: { en: "Sending...", km: "កំពុងផ្ញើ..." },
    success: {
      en: "Thanks! Your message has been sent.",
      km: "អរគុណ! សារបស់អ្នកត្រូវបានផ្ញើហើយ។",
    },
    error: {
      en: "Something went wrong. Please try again or email me directly.",
      km: "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត ឬផ្ញើអ៊ីមែលមកខ្ញុំដោយផ្ទាល់។",
    },
  };

  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  let statusKey = null;

  function renderStatus() {
    if (!formStatus) {
      return;
    }

    if (!statusKey) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
      return;
    }

    formStatus.textContent = statusText[statusKey][lang];
    formStatus.className = "form-status " + statusKey;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const data = new FormData(contactForm);

      if (data.get("_gotcha")) {
        return;
      }

      const action = contactForm.getAttribute("action");

      if (action.indexOf("YOUR_FORM_ID") !== -1) {
        const subject = encodeURIComponent(
          "Portfolio message from " + data.get("name"),
        );
        const body = encodeURIComponent(
          data.get("message") +
            "\n\n" +
            data.get("name") +
            " (" +
            data.get("email") +
            ")",
        );
        window.location.href =
          "mailto:" +
          contactForm.getAttribute("data-fallback") +
          "?subject=" +
          subject +
          "&body=" +
          body;
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      statusKey = "sending";
      renderStatus();

      fetch(action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.reset();
            statusKey = "success";
          } else {
            statusKey = "error";
          }
        })
        .catch(function () {
          statusKey = "error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          renderStatus();
        });
    });
  }

  const i18nEls = Array.from(document.querySelectorAll("[data-i18n]"));
  const langToggle = document.getElementById("lang-toggle");

  i18nEls.forEach(function (el) {
    el.setAttribute("data-en", el.textContent.replace(/\s+/g, " ").trim());
  });

  function applyLang(next) {
    lang = next;
    root.setAttribute("lang", next);

    i18nEls.forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      el.textContent =
        next === "km" && khmer[key] ? khmer[key] : el.getAttribute("data-en");
    });

    if (langToggle) {
      langToggle.textContent = next === "km" ? "EN" : "ខ្មែរ";
      langToggle.setAttribute(
        "aria-label",
        next === "km" ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ",
      );
    }

    if (next === "km") {
      stopTyping(khmerRole);
    } else {
      startTyping();
    }

    langHooks.forEach(function (hook) {
      hook();
    });

    renderStatus();

    try {
      localStorage.setItem("lang", next);
    } catch (e) {}
  }

  if (langToggle) {
    langToggle.addEventListener("click", function () {
      applyLang(lang === "km" ? "en" : "km");
    });
  }

  let savedLang = null;

  try {
    savedLang = localStorage.getItem("lang");
  } catch (e) {}

  if (!savedLang) {
    savedLang =
      (navigator.language || "").toLowerCase().indexOf("km") === 0
        ? "km"
        : "en";
  }

  applyLang(savedLang === "km" ? "km" : "en");

  const timeEl = document.getElementById("local-time");

  function updateTime() {
    if (!timeEl) {
      return;
    }

    try {
      timeEl.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Phnom_Penh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch (e) {
      timeEl.textContent = "";
    }
  }

  updateTime();
  setInterval(updateTime, 30000);

  const statTotals = {
    schools: modalData.schools.items.length,
    pos: modalData.pos.items.length,
    loans: modalData.loans.items.length,
  };

  function formatStat(el, value) {
    el.textContent = (el.getAttribute("data-prefix") || "") + value;
  }

  function countUp(el, target) {
    const start = performance.now();
    const duration = 1400;

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      formatStat(el, Math.round(target * eased));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  const statObserver =
    "IntersectionObserver" in window && !reduceMotion
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                countUp(
                  entry.target,
                  Number(entry.target.getAttribute("data-target")),
                );
                statObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 },
        )
      : null;

  document.querySelectorAll(".stat-num").forEach(function (el) {
    const source = el.getAttribute("data-source");
    const target = source
      ? statTotals[source]
      : Number(el.getAttribute("data-count"));

    el.setAttribute("data-target", target);

    if (statObserver) {
      formatStat(el, 0);
      statObserver.observe(el);
    } else {
      formatStat(el, target);
    }
  });

  const progressBar = document.getElementById("scroll-progress");
  const toTop = document.getElementById("to-top");
  let scrollTicking = false;

  function onScrollFrame() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;

    if (progressBar) {
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }

    if (toTop) {
      toTop.classList.toggle("visible", window.scrollY > 600);
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
      }
    },
    { passive: true },
  );

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  onScrollFrame();

  const palette = document.getElementById("palette");
  const paletteInput = document.getElementById("palette-input");
  const paletteList = document.getElementById("palette-list");
  const paletteHint = document.getElementById("palette-hint");
  const cmdTrigger = document.getElementById("cmd-trigger");
  const cmdKey = document.getElementById("cmd-key");
  const themeBtn = document.getElementById("theme-toggle");

  const paletteText = {
    placeholder: {
      en: "Type a command or search…",
      km: "វាយពាក្យបញ្ជា ឬស្វែងរក…",
    },
    empty: { en: "No results found", km: "រកមិនឃើញលទ្ធផល" },
    hint: {
      en: "↑↓ to navigate · Enter to select · Esc to close",
      km: "↑↓ ដើម្បីរើស · Enter ដើម្បីជ្រើស · Esc ដើម្បីបិទ",
    },
    groups: {
      go: { en: "Go to", km: "ទៅកាន់" },
      projects: { en: "Projects", km: "គម្រោង" },
      actions: { en: "Actions", km: "សកម្មភាព" },
      schools: { en: "Schools", km: "សាលា" },
      pos: { en: "POS projects", km: "គម្រោង POS" },
      loans: { en: "Loan systems", km: "ប្រព័ន្ធកម្ចី" },
    },
  };

  let paletteOpen = false;
  let paletteReturnFocus = null;
  let paletteVisible = [];
  let paletteActive = 0;

  function goTo(id) {
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  function openLink(selector) {
    const link = document.querySelector(selector);

    if (link) {
      window.open(link.href, "_blank", "noopener");
    }
  }

  function highlightCard(name) {
    const cards = modalGrid.querySelectorAll(".school-card");

    cards.forEach(function (card) {
      const title = card.querySelector("h4");

      if (title && title.textContent === name) {
        card.classList.add("flash");
        card.scrollIntoView({ block: "center" });
      }
    });
  }

  function buildCommands(query) {
    const list = [];

    [
      ["home", "Home", khmer.nav_home],
      ["about", "About", khmer.nav_about],
      ["skills", "Skills", khmer.nav_skills],
      ["projects", "Projects", khmer.nav_projects],
      ["gallery", "Gallery", khmer.nav_gallery],
      ["contact", "Contact", khmer.nav_contact],
    ].forEach(function (entry) {
      list.push({
        group: "go",
        en: entry[1],
        km: entry[2],
        run: function () {
          goTo(entry[0]);
        },
      });
    });

    [
      ["schools", "School ERP System", khmer.proj_school],
      ["pos", "POS System", khmer.proj_pos],
      ["loans", "Loan Management System", khmer.proj_loan],
    ].forEach(function (entry) {
      list.push({
        group: "projects",
        en: entry[1],
        km: entry[2],
        run: function () {
          modalApi.open(entry[0]);
        },
      });
    });

    list.push(
      {
        group: "actions",
        en: "Toggle dark mode",
        km: "ប្តូរម៉ូដងងឹត",
        run: function () {
          themeBtn.click();
        },
      },
      {
        group: "actions",
        en: "Switch language",
        km: "ប្តូរភាសា",
        run: function () {
          langToggle.click();
        },
      },
      {
        group: "actions",
        en: "Download CV",
        km: khmer.btn_cv,
        run: function () {
          const link = document.createElement("a");
          link.href = "assets/Tol-Bovireak-CV.pdf";
          link.download = "";
          link.click();
        },
      },
      {
        group: "actions",
        en: "Send me an email",
        km: "ផ្ញើអ៊ីមែលមកខ្ញុំ",
        run: function () {
          window.location.href =
            "mailto:" + contactForm.getAttribute("data-fallback");
        },
      },
      {
        group: "actions",
        en: "Open GitHub",
        km: "បើក GitHub",
        run: function () {
          openLink('.hero-socials a[aria-label="GitHub"]');
        },
      },
      {
        group: "actions",
        en: "Open LinkedIn",
        km: "បើក LinkedIn",
        run: function () {
          openLink('.hero-socials a[aria-label="LinkedIn"]');
        },
      },
    );

    if (query) {
      Object.keys(modalData).forEach(function (key) {
        modalData[key].items.forEach(function (item) {
          list.push({
            group: key,
            en: item.name,
            km: item.name,
            run: function () {
              modalApi.open(key);
              highlightCard(item.name);
            },
          });
        });
      });
    }

    const q = query.trim().toLowerCase();

    return list.filter(function (cmd) {
      return !q || (cmd.en + " " + cmd.km).toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderPalette() {
    const query = paletteInput.value;
    paletteVisible = buildCommands(query);
    paletteActive = Math.min(
      paletteActive,
      Math.max(paletteVisible.length - 1, 0),
    );
    paletteList.textContent = "";
    paletteInput.setAttribute("placeholder", paletteText.placeholder[lang]);
    paletteHint.textContent = paletteText.hint[lang];

    if (!paletteVisible.length) {
      const empty = document.createElement("li");
      empty.className = "palette-empty";
      empty.textContent = paletteText.empty[lang];
      paletteList.appendChild(empty);
      paletteInput.removeAttribute("aria-activedescendant");
      return;
    }

    let lastGroup = "";

    paletteVisible.forEach(function (cmd, i) {
      if (cmd.group !== lastGroup) {
        lastGroup = cmd.group;
        const heading = document.createElement("li");
        heading.className = "palette-group";
        heading.setAttribute("role", "presentation");
        heading.textContent = paletteText.groups[cmd.group][lang];
        paletteList.appendChild(heading);
      }

      const row = document.createElement("li");
      row.id = "palette-opt-" + i;
      row.className = "palette-item" + (i === paletteActive ? " active" : "");
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(i === paletteActive));
      row.textContent = lang === "km" ? cmd.km : cmd.en;

      row.addEventListener("mousemove", function () {
        if (paletteActive !== i) {
          setActive(i);
        }
      });

      row.addEventListener("click", function () {
        runCommand(i);
      });

      paletteList.appendChild(row);
    });

    paletteInput.setAttribute(
      "aria-activedescendant",
      "palette-opt-" + paletteActive,
    );
  }

  function setActive(index) {
    const rows = paletteList.querySelectorAll(".palette-item");

    if (!rows.length) {
      return;
    }

    paletteActive = (index + rows.length) % rows.length;

    rows.forEach(function (row, i) {
      row.classList.toggle("active", i === paletteActive);
      row.setAttribute("aria-selected", String(i === paletteActive));
    });

    rows[paletteActive].scrollIntoView({ block: "nearest" });
    paletteInput.setAttribute(
      "aria-activedescendant",
      "palette-opt-" + paletteActive,
    );
  }

  function openPalette() {
    if (!palette || paletteOpen) {
      return;
    }

    if (projectModal.classList.contains("open")) {
      modalApi.close();
    }

    paletteReturnFocus = document.activeElement;
    paletteOpen = true;
    paletteInput.value = "";
    paletteActive = 0;
    renderPalette();
    palette.classList.add("open");
    palette.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(function () {
      paletteInput.focus();
    }, 50);
  }

  function closePalette() {
    if (!paletteOpen) {
      return;
    }

    paletteOpen = false;
    palette.classList.remove("open");
    palette.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (paletteReturnFocus) {
      paletteReturnFocus.focus();
    }
  }

  function runCommand(index) {
    const cmd = paletteVisible[index];

    if (!cmd) {
      return;
    }

    closePalette();
    setTimeout(cmd.run, 60);
  }

  if (palette && paletteInput) {
    if (cmdKey && /Mac|iPhone|iPad/.test(navigator.platform)) {
      cmdKey.textContent = "⌘ K";
    }

    if (cmdTrigger) {
      cmdTrigger.addEventListener("click", openPalette);
    }

    paletteInput.addEventListener("input", function () {
      paletteActive = 0;
      renderPalette();
    });

    paletteInput.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive(paletteActive + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive(paletteActive - 1);
      } else if (event.key === "Enter") {
        event.preventDefault();
        runCommand(paletteActive);
      }
    });

    palette.addEventListener("click", function (event) {
      if (event.target === palette) {
        closePalette();
      }
    });

    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        if (paletteOpen) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (event.key === "Escape" && paletteOpen) {
        closePalette();
      }
    });

    langHooks.push(function () {
      if (paletteOpen) {
        renderPalette();
      }
    });
  }
});
