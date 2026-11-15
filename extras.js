/*
 * Extra features, loaded after script.js:
 * skill -> project links, live GitHub activity,
 * interactive terminal, Konami easter egg, toast.
 *
 * Decoupled from script.js: language comes from <html lang>, theme from
 * <html data-theme>. Command-menu entries are registered through
 * window.portfolioCommands (read lazily by buildCommands in script.js).
 */
(function () {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const GH_USER = "vireaksokheng2-dot";

  function getLang() {
    return root.getAttribute("lang") === "km" ? "km" : "en";
  }

  function t(entry) {
    return entry[getLang()];
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);

    if (cls) {
      node.className = cls;
    }

    if (text !== undefined) {
      node.textContent = text;
    }

    return node;
  }

  function store(key, value) {
    try {
      if (value === undefined) {
        return localStorage.getItem(key);
      }

      localStorage.setItem(key, value);
    } catch (e) {}

    return null;
  }

  const langCallbacks = [];

  new MutationObserver(function () {
    langCallbacks.forEach(function (fn) {
      fn();
    });
  }).observe(root, { attributes: true, attributeFilter: ["lang"] });

  const commands = (window.portfolioCommands = []);

  /* ---------- Toast ---------- */

  const toastEl = document.getElementById("toast");
  let toastTimer;

  function toast(message) {
    if (!toastEl) {
      return;
    }

    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 3500);
  }

  try {
    localStorage.removeItem("accent");
  } catch (e) {}

  /* ---------- Skill -> project links ---------- */

  (function skillLinks() {
    const skillTags = Array.from(
      document.querySelectorAll(".skill-card .tags span"),
    );
    const status = document.getElementById("skill-status");
    const targets = Array.from(
      document.querySelectorAll(".project-card, .exp-card"),
    );
    let selected = "";

    function norm(node) {
      return node.textContent.trim().toLowerCase();
    }

    function statusText(name, projects, inRole) {
      if (getLang() === "km") {
        if (!projects && !inRole) {
          return name + "៖ មិនទាន់បានដាក់ស្លាកលើគម្រោងលេចធ្លោនៅឡើយទេ។";
        }

        return (
          name +
          "៖ ប្រើក្នុង " +
          projects +
          " គម្រោង" +
          (inRole ? " និងតួនាទីបច្ចុប្បន្នរបស់ខ្ញុំ" : "") +
          "។"
        );
      }

      if (!projects && !inRole) {
        return name + ": not tagged on a featured project yet.";
      }

      return (
        name +
        ": used in " +
        projects +
        (projects === 1 ? " project" : " projects") +
        (inRole ? " and in my current role." : ".")
      );
    }

    function apply() {
      let projects = 0;
      let inRole = false;

      skillTags.forEach(function (tag) {
        const on = !!selected && norm(tag) === selected;
        tag.classList.toggle("active", on);
        tag.setAttribute("aria-pressed", String(on));
      });

      targets.forEach(function (card) {
        const tags = Array.from(card.querySelectorAll(".tags span"));
        let match = false;

        tags.forEach(function (tag) {
          const hit = !!selected && norm(tag) === selected;
          tag.classList.toggle("hl", hit);
          match = match || hit;
        });

        card.classList.toggle("dim", !!selected && !match);

        if (match) {
          if (card.classList.contains("exp-card")) {
            inRole = true;
          } else {
            projects++;
          }
        }
      });

      if (status) {
        status.textContent = selected
          ? statusText(
              skillTags.find(function (tag) {
                return norm(tag) === selected;
              }).textContent,
              projects,
              inRole,
            )
          : "";
      }
    }

    function toggle(tag) {
      const name = norm(tag);
      selected = selected === name ? "" : name;
      apply();
    }

    skillTags.forEach(function (tag) {
      tag.setAttribute("role", "button");
      tag.setAttribute("tabindex", "0");
      tag.setAttribute("aria-pressed", "false");
      tag.addEventListener("click", function () {
        toggle(tag);
      });
      tag.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(tag);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && selected) {
        selected = "";
        apply();
      }
    });

    langCallbacks.push(apply);
  })();

  /* ---------- Live GitHub activity ---------- */

  (function githubActivity() {
    const section = document.getElementById("github");
    const summary = document.getElementById("gh-summary");
    const barsWrap = document.getElementById("gh-activity");
    const bars = document.getElementById("gh-bars");
    const barsTitle = document.getElementById("gh-bars-title");
    const reposEl = document.getElementById("gh-repos");
    const statusEl = document.getElementById("gh-status");

    if (!section || !reposEl) {
      return;
    }

    const LANG_COLORS = {
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      PHP: "#4f5d95",
      Vue: "#41b883",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Python: "#3572a5",
      Blade: "#f7523f",
      Shell: "#89e051",
    };

    const TXT = {
      loading: { en: "Loading GitHub data…", km: "កំពុងផ្ទុកទិន្នន័យ GitHub…" },
      error: {
        en: "Couldn't load GitHub data right now. You can still visit my profile.",
        km: "មិនអាចផ្ទុកទិន្នន័យ GitHub បានទេឥឡូវនេះ។ អ្នកនៅតែអាចចូលមើលប្រវត្តិរូបរបស់ខ្ញុំ។",
      },
      empty: {
        en: "No public repositories yet.",
        km: "មិនទាន់មាន repository សាធារណៈនៅឡើយទេ។",
      },
      repos: { en: "Public repos", km: "Repo សាធារណៈ" },
      followers: { en: "Followers", km: "អ្នកតាមដាន" },
      lastPush: { en: "Last push", km: "ការ push ចុងក្រោយ" },
      activity: {
        en: "Public activity · last 14 days",
        km: "សកម្មភាពសាធារណៈ · ១៤ ថ្ងៃចុងក្រោយ",
      },
      updated: { en: "Updated", km: "ធ្វើបច្ចុប្បន្នភាព" },
      noDesc: { en: "No description", km: "គ្មានការពិពណ៌នា" },
    };

    let data = null;
    let failed = false;
    let started = false;

    function ago(iso) {
      const diff = (new Date(iso).getTime() - Date.now()) / 1000;
      const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
      ];

      try {
        const rtf = new Intl.RelativeTimeFormat(getLang(), { numeric: "auto" });

        for (let i = 0; i < units.length; i++) {
          if (Math.abs(diff) >= units[i][1] || i === units.length - 1) {
            return rtf.format(Math.round(diff / units[i][1]), units[i][0]);
          }
        }
      } catch (e) {}

      return new Date(iso).toLocaleDateString();
    }

    function chip(label, value) {
      const box = el("div", "gh-chip");
      box.appendChild(el("strong", "", value));
      box.appendChild(el("span", "", label));
      return box;
    }

    function render() {
      statusEl.textContent = "";

      if (failed) {
        statusEl.textContent = t(TXT.error);
        return;
      }

      if (!data) {
        statusEl.textContent = t(TXT.loading);
        return;
      }

      summary.textContent = "";
      summary.appendChild(chip(t(TXT.repos), String(data.user.public_repos)));
      summary.appendChild(chip(t(TXT.followers), String(data.user.followers)));

      if (data.repos[0]) {
        summary.appendChild(
          chip(t(TXT.lastPush), ago(data.repos[0].pushed_at)),
        );
      }

      bars.textContent = "";
      barsWrap.hidden = !data.days;

      if (data.days) {
        const max = Math.max.apply(null, data.days.map(function (d) {
          return d.count;
        }).concat(1));
        let total = 0;

        data.days.forEach(function (day) {
          total += day.count;
          const bar = el("span", "gh-bar");
          bar.style.height = Math.max(6, (day.count / max) * 100) + "%";
          bar.classList.toggle("empty", day.count === 0);
          bar.title = day.label + ": " + day.count;
          bars.appendChild(bar);
        });

        barsTitle.textContent = t(TXT.activity) + " · " + total;
        bars.setAttribute("aria-label", barsTitle.textContent);
      }

      reposEl.textContent = "";

      if (!data.repos.length) {
        reposEl.appendChild(el("p", "gh-empty", t(TXT.empty)));
      }

      data.repos.forEach(function (repo) {
        const card = el("a", "gh-repo");
        card.href = repo.html_url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.appendChild(el("h3", "", repo.name));
        card.appendChild(
          el("p", "", repo.description || t(TXT.noDesc)),
        );

        const meta = el("div", "gh-meta");

        if (repo.language) {
          const langTag = el("span", "gh-lang", repo.language);
          langTag.style.setProperty(
            "--lang",
            LANG_COLORS[repo.language] || "#94a3b8",
          );
          meta.appendChild(langTag);
        }

        meta.appendChild(el("span", "", "★ " + repo.stargazers_count));
        meta.appendChild(
          el("span", "", t(TXT.updated) + " " + ago(repo.pushed_at)),
        );
        card.appendChild(meta);
        reposEl.appendChild(card);
      });
    }

    function api(path) {
      return fetch("https://api.github.com" + path, {
        headers: { Accept: "application/vnd.github+json" },
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub " + response.status);
        }

        return response.json();
      });
    }

    function buildDays(events) {
      const days = [];
      const counts = {};

      events.forEach(function (event) {
        const key = new Date(event.created_at).toDateString();
        counts[key] = (counts[key] || 0) + 1;
      });

      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
          label: d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          count: counts[d.toDateString()] || 0,
        });
      }

      return days;
    }

    function load() {
      let cached = null;

      try {
        cached = JSON.parse(sessionStorage.getItem("gh-cache"));
      } catch (e) {}

      if (cached && Date.now() - cached.t < 15 * 60 * 1000) {
        data = cached.data;
        render();
        return;
      }

      Promise.all([
        api("/users/" + GH_USER),
        api("/users/" + GH_USER + "/repos?sort=pushed&per_page=30"),
        api("/users/" + GH_USER + "/events/public?per_page=100").catch(
          function () {
            return null;
          },
        ),
      ])
        .then(function (results) {
          data = {
            user: results[0],
            repos: results[1]
              .filter(function (repo) {
                return (
                  !repo.fork &&
                  !repo.archived &&
                  repo.html_url.indexOf("https://github.com/") === 0
                );
              })
              .slice(0, 6),
            days: results[2] ? buildDays(results[2]) : null,
          };

          try {
            sessionStorage.setItem(
              "gh-cache",
              JSON.stringify({ t: Date.now(), data: data }),
            );
          } catch (e) {}

          render();
        })
        .catch(function () {
          failed = true;
          render();
        });
    }

    function start() {
      if (!started) {
        started = true;
        render();
        load();
      }
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries, observer) {
          if (entries[0].isIntersecting) {
            observer.disconnect();
            start();
          }
        },
        { rootMargin: "300px" },
      ).observe(section);
    } else {
      start();
    }

    langCallbacks.push(function () {
      if (started) {
        render();
      }
    });
  })();

  /* ---------- Confetti + Konami code ---------- */

  function confetti() {
    if (reduceMotion) {
      return;
    }

    const canvas = el("canvas", "confetti");
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = (canvas.width = window.innerWidth * dpr);
    const h = (canvas.height = window.innerHeight * dpr);
    const colors = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ef4444"];
    const pieces = [];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: w / 2,
        y: h * 0.35,
        vx: (Math.random() - 0.5) * 18 * dpr,
        vy: (Math.random() * -14 - 4) * dpr,
        size: (Math.random() * 6 + 4) * dpr,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        color: colors[i % colors.length],
      });
    }

    const born = performance.now();

    function frame(now) {
      const age = now - born;
      ctx.clearRect(0, 0, w, h);

      pieces.forEach(function (p) {
        p.vy += 0.35 * dpr;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - age / 3500);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (age < 3500) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
      }
    }

    requestAnimationFrame(frame);
  }

  (function konami() {
    const code = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let pos = 0;

    document.addEventListener("keydown", function (event) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      pos = key === code[pos] ? pos + 1 : key === code[0] ? 1 : 0;

      if (pos === code.length) {
        pos = 0;
        confetti();
        toast(
          t({
            en: "🎉 Konami code unlocked! You found the secret.",
            km: "🎉 បើកកូដ Konami បានហើយ! អ្នករកឃើញអាថ៌កំបាំង។",
          }),
        );
      }
    });
  })();

  /* ---------- Terminal ---------- */

  (function terminal() {
    const term = document.getElementById("terminal");
    const log = document.getElementById("term-log");
    const input = document.getElementById("term-input");
    const closeBtn = document.getElementById("term-close");
    const body = document.getElementById("term-body");

    if (!term || !log || !input) {
      return;
    }

    let isOpen = false;
    let returnFocus = null;
    let welcomed = false;
    const history = [];
    let historyPos = 0;

    const SECTIONS = [
      "home",
      "about",
      "skills",
      "experience",
      "projects",
      "github",
      // "gallery", // gallery disabled
      "contact",
    ];

    function print(text, cls) {
      String(text)
        .split("\n")
        .forEach(function (line) {
          log.appendChild(el("div", "term-out" + (cls ? " " + cls : ""), line));
        });
      body.scrollTop = body.scrollHeight;
    }

    function pick(en, km) {
      return getLang() === "km" ? km : en;
    }

    function goTo(id) {
      const target = document.getElementById(id);

      if (target) {
        close();
        setTimeout(function () {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        }, 80);
      }
    }

    function projectList() {
      return Array.from(
        document.querySelectorAll(".project-card h3"),
      ).map(function (h) {
        return "  • " + h.textContent.trim();
      });
    }

    const cmds = {
      help: function () {
        print(
          pick(
            "Available commands:\n" +
              "  whoami        who am I\n" +
              "  skills        my tech stack\n" +
              "  experience    where I work\n" +
              "  projects      what I've built\n" +
              "  contact       how to reach me\n" +
              "  github        my GitHub profile\n" +
              "  open <name>   jump to a section (" +
              SECTIONS.join(", ") +
              ")\n" +
              "  theme <light|dark>   switch theme\n" +
              "  lang <en|km>  switch language\n" +
              "  confetti      🎉\n" +
              "  clear         clear the screen\n" +
              "  exit          close the terminal",
            "ពាក្យបញ្ជាដែលមាន៖\n" +
              "  whoami        ខ្ញុំជានរណា\n" +
              "  skills        ជំនាញបច្ចេកទេស\n" +
              "  experience    កន្លែងធ្វើការ\n" +
              "  projects      គម្រោងដែលបានធ្វើ\n" +
              "  contact       របៀបទាក់ទងខ្ញុំ\n" +
              "  github        ប្រវត្តិរូប GitHub\n" +
              "  open <ឈ្មោះ>   ទៅកាន់ផ្នែក (" +
              SECTIONS.join(", ") +
              ")\n" +
              "  theme <light|dark>   ប្តូរម៉ូដ\n" +
              "  lang <en|km>  ប្តូរភាសា\n" +
              "  confetti      🎉\n" +
              "  clear         សម្អាតអេក្រង់\n" +
              "  exit          បិទ terminal",
          ),
        );
      },
      whoami: function () {
        print(
          pick(
            "Tol Bovireak — Junior Full Stack Developer\n" +
              "Phnom Penh, Cambodia · TechStore Creative Solutions\n" +
              "Almost 3 years building web apps with Laravel, Vue.js,\n" +
              "TypeScript and PostgreSQL.",
            "Tol Bovireak — អ្នកអភិវឌ្ឍន៍ Full Stack (Junior)\n" +
              "ភ្នំពេញ កម្ពុជា · TechStore Creative Solutions\n" +
              "មានបទពិសោធន៍ជិត ៣ ឆ្នាំក្នុងការបង្កើតកម្មវិធីវេបជាមួយ Laravel, Vue.js,\n" +
              "TypeScript និង PostgreSQL។",
          ),
        );
      },
      skills: function () {
        document.querySelectorAll(".skill-card").forEach(function (card) {
          const name = card.querySelector("h3").textContent.trim();
          const tags = Array.from(card.querySelectorAll(".tags span"))
            .map(function (s) {
              return s.textContent.trim();
            })
            .join(", ");
          print(name + ": " + tags);
        });
      },
      experience: function () {
        print(
          pick(
            "Junior Full Stack Developer @ TechStore Creative Solutions\n2023 – 2026",
            "អ្នកអភិវឌ្ឍន៍ Full Stack (Junior) @ TechStore Creative Solutions\n២០២៣ – ២០២៦",
          ),
        );
      },
      projects: function () {
        print(projectList().join("\n"));
        print(pick("Tip: open projects", "ណែនាំ៖ open projects"), "term-dim");
      },
      contact: function () {
        const mail = document
          .getElementById("contact-form")
          .getAttribute("data-fallback");
        print("email    " + mail);
        print("github   https://github.com/" + GH_USER);
        print("linkedin https://www.linkedin.com/in/tol-b-9a7172435/");
      },
      github: function () {
        print("https://github.com/" + GH_USER);
        print(pick("Tip: open github", "ណែនាំ៖ open github"), "term-dim");
      },
      open: function (args) {
        const name = (args[0] || "").toLowerCase();

        if (SECTIONS.indexOf(name) !== -1) {
          goTo(name);
        } else if (name === "linkedin") {
          window.open(
            "https://www.linkedin.com/in/tol-b-9a7172435/",
            "_blank",
            "noopener",
          );
        } else {
          print(
            pick(
              "Usage: open <" + SECTIONS.join("|") + ">",
              "របៀបប្រើ៖ open <" + SECTIONS.join("|") + ">",
            ),
            "term-err",
          );
        }
      },
      theme: function (args) {
        const want = (args[0] || "").toLowerCase();
        const toggle = document.getElementById("theme-toggle");
        const now = root.getAttribute("data-theme") === "dark" ? "dark" : "light";

        if (want !== "light" && want !== "dark") {
          print("Usage: theme <light|dark>", "term-err");
        } else {
          if (want !== now && toggle) {
            toggle.click();
          }

          print("theme → " + want);
        }
      },
      lang: function (args) {
        const want = (args[0] || "").toLowerCase();
        const toggle = document.getElementById("lang-toggle");

        if (want !== "en" && want !== "km") {
          print("Usage: lang <en|km>", "term-err");
        } else {
          if (want !== getLang() && toggle) {
            toggle.click();
          }

          print("lang → " + want);
        }
      },
      confetti: function () {
        confetti();
        print("🎉");
      },
      clear: function () {
        log.textContent = "";
      },
      exit: function () {
        close();
      },
    };

    function run(raw) {
      const line = raw.trim();
      print("$ " + line, "term-cmd");

      if (!line) {
        return;
      }

      history.push(line);
      historyPos = history.length;

      const parts = line.split(/\s+/);
      const name = parts[0].toLowerCase();

      if (name === "sudo" && /^hire\s+me$/i.test(parts.slice(1).join(" "))) {
        print(
          pick(
            "[sudo] permission granted. 🎉 Send an email to start the conversation.",
            "[sudo] ការអនុញ្ញាតត្រូវបានផ្តល់។ 🎉 ផ្ញើអ៊ីមែលមកដើម្បីចាប់ផ្តើមការសន្ទនា។",
          ),
        );
        cmds.contact();
        return;
      }

      if (Object.prototype.hasOwnProperty.call(cmds, name)) {
        cmds[name](parts.slice(1));
      } else {
        print(
          pick(
            "command not found: " + name + " — type 'help'",
            "រកមិនឃើញពាក្យបញ្ជា៖ " + name + " — វាយ 'help'",
          ),
          "term-err",
        );
      }
    }

    const hintsEl = document.getElementById("term-hints");
    const keysEl = document.getElementById("term-keys");
    const SUGGEST = [
      "help",
      "whoami",
      "skills",
      "projects",
      "contact",
      "open github",
      "sudo hire me",
    ];
    const EXAMPLES = ["help", "whoami", "skills", "open contact", "sudo hire me"];
    let exIndex = 0;
    let exTimer = 0;

    function renderPlaceholder() {
      input.setAttribute(
        "placeholder",
        pick("Try: ", "សាកល្បង៖ ") + EXAMPLES[exIndex],
      );
    }

    function renderTermHints() {
      renderPlaceholder();

      if (keysEl) {
        keysEl.textContent = pick(
          "Tab to autocomplete · ↑ ↓ for history · Esc to close",
          "Tab ដើម្បីបំពេញ · ↑ ↓ សម្រាប់ប្រវត្តិ · Esc ដើម្បីបិទ",
        );
      }
    }

    if (hintsEl) {
      SUGGEST.forEach(function (cmd) {
        const chip = el("button", "term-chip", cmd);
        chip.type = "button";
        chip.addEventListener("click", function () {
          run(cmd);
          input.focus();
        });
        hintsEl.appendChild(chip);
      });
    }

    langCallbacks.push(renderTermHints);
    renderTermHints();

    function open() {
      if (isOpen) {
        return;
      }

      isOpen = true;
      returnFocus = document.activeElement;
      term.classList.add("open");
      term.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      if (!welcomed) {
        welcomed = true;
        print(
          pick(
            "Welcome to Tol Bovireak's terminal. Type 'help' to get started.",
            "សូមស្វាគមន៍មកកាន់ terminal របស់ Tol Bovireak។ វាយ 'help' ដើម្បីចាប់ផ្តើម។",
          ),
          "term-dim",
        );
        print(
          pick(
            "Not sure where to start? Click a suggestion below, or try: whoami",
            "មិនដឹងចាប់ផ្តើមពីណា? ចុចលើការណែនាំខាងក្រោម ឬសាកល្បង៖ whoami",
          ),
          "term-dim",
        );
      }

      if (!reduceMotion && !exTimer) {
        exTimer = setInterval(function () {
          exIndex = (exIndex + 1) % EXAMPLES.length;
          renderPlaceholder();
        }, 2500);
      }

      setTimeout(function () {
        input.focus();
      }, 50);
    }

    function close() {
      if (!isOpen) {
        return;
      }

      isOpen = false;
      clearInterval(exTimer);
      exTimer = 0;
      term.classList.remove("open");
      term.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");

      if (returnFocus && returnFocus.focus) {
        returnFocus.focus();
      }
    }

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const value = input.value;
        input.value = "";
        run(value);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();

        if (historyPos > 0) {
          historyPos--;
          input.value = history[historyPos];
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        historyPos = Math.min(historyPos + 1, history.length);
        input.value = history[historyPos] || "";
      } else if (event.key === "Tab") {
        event.preventDefault();
        const prefix = input.value.trim().toLowerCase();
        const matches = Object.keys(cmds).filter(function (name) {
          return prefix && name.indexOf(prefix) === 0;
        });

        if (matches.length === 1) {
          input.value = matches[0] + " ";
        } else if (matches.length > 1) {
          print(matches.join("  "), "term-dim");
        }
      } else if (event.key === "l" && event.ctrlKey) {
        event.preventDefault();
        cmds.clear();
      }
    });

    term.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "Tab" && !event.defaultPrevented) {
        event.preventDefault();
        (document.activeElement === closeBtn ? input : closeBtn).focus();
      }
    });

    term.addEventListener("click", function (event) {
      if (event.target === term) {
        close();
      } else if (!window.getSelection().toString()) {
        input.focus();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", close);
    }

    document.querySelectorAll("[data-open-terminal]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });

    document.addEventListener("keydown", function (event) {
      const target = event.target;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (
        event.key === "`" &&
        !typing &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();

        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    });

    commands.push({
      group: "actions",
      en: "Open terminal",
      km: "បើក terminal",
      run: open,
    });
  })();

  commands.push({
    group: "go",
    en: "GitHub activity",
    km: "សកម្មភាព GitHub",
    run: function () {
      const target = document.getElementById("github");

      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    },
  });
})();
