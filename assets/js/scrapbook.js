/* ==========================================================================
   The Birthday Archive — page engine
   Reads assets/js/config.js and builds every page. You shouldn't need to
   edit this file to change content — edit config.js instead.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};

  /* ---------- tiny helpers ---------- */

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // {name} / {age} / {nickname} placeholders inside config text
  function fill(str) {
    return String(str == null ? "" : str).replace(/\{(\w+)\}/g, function (m, key) {
      return S[key] != null ? S[key] : m;
    });
  }

  function el(sel, root) {
    return (root || document).querySelector(sel);
  }

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  // a small, stable tilt so the page looks hand-placed but never re-shuffles
  function tilt(i, spread) {
    var steps = [-2.5, 1.8, -1.2, 2.4, -1.9, 1.1, -2.1, 2.8];
    return (steps[i % steps.length] * (spread || 1)).toFixed(2) + "deg";
  }

  /* A photo slot: shows the image if there is one, a soft placeholder if not. */
  function photo(src, hint, shape) {
    var cls = "photo " + (shape || "");
    if (src) {
      return '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(hint || "") + '" loading="lazy">';
    }
    return (
      '<div class="' + cls + ' photo-slot">' +
      '<p class="photo-slot__hint">' + esc(hint || "drop a photo here") + "</p>" +
      "</div>"
    );
  }

  /* ---------- navigation ---------- */

  function buildNav() {
    var host = el("[data-nav]");
    if (!host || !S.nav) return;

    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    var links = S.nav
      .map(function (item) {
        var current = item.href.toLowerCase() === here;
        return (
          '<a class="navlink" href="' + esc(item.href) + '"' +
          (current ? ' aria-current="page"' : "") + ">" +
          '<span class="ico" aria-hidden="true">' + esc(item.icon || "•") + "</span>" +
          esc(item.label) +
          "</a>"
        );
      })
      .join("");

    host.innerHTML =
      '<div class="sidebar__brand">' +
      "<h1>Our Story</h1>" +
      '<p class="hand">' + esc(S.since || "") + "</p>" +
      "</div>" +
      '<div class="sidebar__links">' + links + "</div>" +
      '<div class="sidebar__foot">for ' + esc(S.name || "you") + " ♡</div>";
  }

  function wireDrawer() {
    var burger = el("[data-burger]");
    var sidebar = el("[data-nav]");
    if (!burger || !sidebar) return;

    var scrim = null;

    function close() {
      sidebar.classList.remove("is-open");
      if (scrim) { scrim.remove(); scrim = null; }
    }

    burger.addEventListener("click", function () {
      if (sidebar.classList.contains("is-open")) return close();
      sidebar.classList.add("is-open");
      scrim = document.createElement("div");
      scrim.className = "scrim";
      scrim.addEventListener("click", close);
      document.body.appendChild(scrim);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- letter modal (friends + wishes) ---------- */

  var modal;

  function openLetter(title, body, sub) {
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal";
      modal.hidden = true;
      modal.innerHTML =
        '<article class="letter" role="dialog" aria-modal="true" aria-labelledby="letter-title">' +
        '<button class="letter__close" type="button" aria-label="Close">&times;</button>' +
        '<span class="tape tape--top" aria-hidden="true"></span>' +
        '<h2 class="headline" id="letter-title"></h2>' +
        '<p class="label muted" data-sub></p>' +
        '<div class="letter__body"></div>' +
        "</article>";
      document.body.appendChild(modal);

      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.classList.contains("letter__close")) closeLetter();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeLetter();
      });
    }

    el("#letter-title", modal).textContent = title;
    el("[data-sub]", modal).textContent = sub || "";
    el(".letter__body", modal).textContent = body;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    el(".letter__close", modal).focus();
  }

  function closeLetter() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- page renderers ---------- */

  var render = {};

  /* FRIENDS ------------------------------------------------------------- */
  render.friends = function (host) {
    var list = S.friends || [];

    host.innerHTML = list
      .map(function (f, i) {
        var body =
          '<h3 class="headline" style="font-size:1.5rem">' + esc(f.name) + "</h3>" +
          '<p class="label" style="color:var(--secondary)">' +
          (f.emoji ? esc(f.emoji) + " " : "") + esc(f.tag || "") + "</p>" +
          '<p class="hand" style="margin:12px 0 18px">' + esc(f.quote || "") + "</p>" +
          '<button class="inklink" type="button" data-letter="' + i + '">' +
          "Read their message <span aria-hidden=\"true\">&rarr;</span></button>";

        if (f.style === "note") {
          return (
            '<article class="note reveal" style="--tilt:' + tilt(i) + '" data-tag="' + esc(f.tag || "") + '">' +
            '<span class="tape tape--tl" aria-hidden="true"></span>' + body +
            "</article>"
          );
        }

        return (
          '<figure class="polaroid reveal" style="--tilt:' + tilt(i) + ';margin:0" data-tag="' + esc(f.tag || "") + '">' +
          '<span class="tape tape--top" aria-hidden="true"></span>' +
          photo(f.photo, f.photoHint) +
          '<figcaption style="text-align:left;padding-top:16px">' + body + "</figcaption>" +
          "</figure>"
        );
      })
      .join("");

    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-letter]");
      if (!btn) return;
      var f = list[+btn.getAttribute("data-letter")];
      openLetter(f.name, fill(f.letter || ""), f.tag);
    });
  };

  render.friendTags = function (host) {
    var tags = ["All"].concat(S.friendTags || []);

    host.innerHTML = tags
      .map(function (t, i) {
        return (
          '<button class="chip" type="button" data-tag="' + esc(t) + '"' +
          (i === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"') + ">" +
          esc(t) + "</button>"
        );
      })
      .join("");

    host.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;

      all(".chip", host).forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });

      var want = chip.getAttribute("data-tag");
      all("[data-tag]", el("[data-render='friends']")).forEach(function (card) {
        var show = want === "All" || card.getAttribute("data-tag") === want;
        card.style.display = show ? "" : "none";
      });
    });
  };

  /* CRINGE -------------------------------------------------------------- */
  render.cringe = function (host) {
    host.innerHTML = (S.cringe || [])
      .map(function (c, i) {
        if (c.style === "note") {
          return (
            '<article class="note reveal" style="--tilt:' + tilt(i, 1.4) + '">' +
            '<p class="hand" style="font-size:1.4rem;text-align:center;margin:0">' +
            esc(c.caption) + "</p></article>"
          );
        }
        return (
          '<figure class="polaroid reveal" style="--tilt:' + tilt(i, 1.4) + ';margin:0">' +
          '<span class="tape ' + (i % 2 ? "tape--tr" : "tape--tl") + '" aria-hidden="true"></span>' +
          photo(c.photo, c.hint) +
          "<figcaption>" + esc(c.caption) + "</figcaption>" +
          "</figure>"
        );
      })
      .join("");
  };

  /* VIDEOS -------------------------------------------------------------- */
  render.videos = function (host) {
    host.innerHTML = (S.videos || [])
      .map(function (v, i) {
        var frame;

        if (v.src && /youtube|youtu\.be|vimeo/.test(v.src)) {
          frame =
            '<iframe class="film__frame" src="' + esc(v.src) + '" title="' + esc(v.title) +
            '" frameborder="0" allowfullscreen loading="lazy"></iframe>';
        } else if (v.src) {
          frame =
            '<video class="film__frame" controls preload="none"' +
            (v.poster ? ' poster="' + esc(v.poster) + '"' : "") +
            '><source src="' + esc(v.src) + '"></video>';
        } else {
          frame =
            '<div class="film__frame" role="img" aria-label="' + esc(v.title) + '"></div>' +
            '<button class="film__play" type="button" aria-label="Add a video for: ' + esc(v.title) + '">' +
            "<span aria-hidden=\"true\">&#9658;</span></button>";
        }

        return (
          '<figure class="reveal" style="margin:0;transform:rotate(' + tilt(i, 0.7) + ')">' +
          '<div class="film">' + frame + "</div>" +
          '<figcaption class="film-caption">' + esc(v.title) +
          (v.note ? '<br><span class="label muted" style="font-family:var(--font-label)">' + esc(v.note) + "</span>" : "") +
          "</figcaption></figure>"
        );
      })
      .join("");
  };

  /* TIMELINE ------------------------------------------------------------ */
  render.timeline = function (host) {
    host.innerHTML = (S.timeline || [])
      .map(function (t) {
        return (
          '<article class="timeline__item reveal">' +
          '<p class="timeline__year">' + esc(t.year) + "</p>" +
          '<h3 class="headline" style="font-size:1.25rem;margin:2px 0 6px">' + esc(t.title) + "</h3>" +
          '<p class="lede" style="font-size:1rem">' + esc(t.text) + "</p>" +
          "</article>"
        );
      })
      .join("");
  };

  /* WISHES -------------------------------------------------------------- */
  render.wishes = function (host) {
    function card(w, i) {
      return (
        '<article class="wish reveal" style="--tilt:' + tilt(i, 0.8) + ';position:relative">' +
        '<span class="pin" aria-hidden="true"></span>' +
        '<p class="wish__text">' + esc(w.text) + "</p>" +
        '<p class="wish__from">— ' + esc(w.from) + "</p>" +
        "</article>"
      );
    }

    host.innerHTML = (S.wishes || []).map(card).join("");

    // Anyone can add a wish from the page. It lives in this browser only
    // (localStorage) — copy the good ones into config.js to keep them forever.
    var saved = [];
    try {
      saved = JSON.parse(localStorage.getItem("archive-wishes") || "[]");
    } catch (err) {
      saved = [];
    }

    saved.forEach(function (w, i) {
      host.insertAdjacentHTML("beforeend", card(w, i + (S.wishes || []).length));
    });

    var form = el("[data-wish-form]");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var from = form.elements.from.value.trim();
      var text = form.elements.text.value.trim();
      if (!from || !text) return;

      var wish = { from: from, text: text };
      saved.push(wish);
      try {
        localStorage.setItem("archive-wishes", JSON.stringify(saved));
      } catch (err) {
        /* private browsing — the wish still shows for this visit */
      }

      host.insertAdjacentHTML("afterbegin", card(wish, 0));
      revealAll();
      form.reset();

      var said = el("[data-wish-said]");
      if (said) said.textContent = "Pinned to the wall ♡";
    });
  };

  /* PLAYLIST ------------------------------------------------------------ */
  render.tracks = function (host) {
    host.innerHTML = (S.tracks || [])
      .map(function (t, i) {
        return (
          '<div class="track reveal">' +
          '<span class="track__no">' + (i + 1) + "</span>" +
          "<div>" +
          '<p class="track__title" style="margin:0">' + esc(t.title) +
          '<span class="muted" style="font-weight:400"> — ' + esc(t.artist) + "</span></p>" +
          '<p class="track__note" style="margin:0">' + esc(t.note || "") + "</p>" +
          "</div>" +
          '<span class="track__len">' + esc(t.len || "") + "</span>" +
          "</div>"
        );
      })
      .join("");
  };

  /* PLAYLIST LINK — only shows when config.playlistLink is filled in */
  render.playlistLink = function (host) {
    if (!S.playlistLink) { host.remove(); return; }
    host.innerHTML =
      '<a class="tape-btn" href="' + esc(S.playlistLink) +
      '" target="_blank" rel="noopener">&#9834; Play the real thing</a>';
  };

  /* ---------- text bindings: <span data-text="name"></span> ---------- */

  function bindText() {
    all("[data-text]").forEach(function (node) {
      var key = node.getAttribute("data-text");
      var value = key.split(".").reduce(function (acc, k) {
        return acc == null ? acc : acc[k];
      }, S);
      if (value != null) node.textContent = fill(value);
    });

    if (S.name) {
      document.title = document.title.replace(/\{name\}/g, S.name);
    }
  }

  /* ---------- home: countdown ---------- */

  function countdown() {
    var host = el("[data-countdown]");
    if (!host || !S.birthday) return;

    function box(n, label) {
      return '<div class="count"><b>' + n + "</b><span>" + label + "</span></div>";
    }

    function tick() {
      var now = new Date();
      var target = new Date(S.birthday + "T00:00:00");

      // roll forward to the next occurrence of the date
      target.setFullYear(now.getFullYear());
      if (target - now < -86400000) target.setFullYear(now.getFullYear() + 1);

      var diff = target - now;

      if (diff <= 0) {
        host.innerHTML = '<p class="hero__ribbon">it\'s today ♡</p>';
        return;
      }

      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff / 3600000) % 24);
      var m = Math.floor((diff / 60000) % 60);
      var s = Math.floor((diff / 1000) % 60);

      host.innerHTML = box(d, "days") + box(h, "hours") + box(m, "mins") + box(s, "secs");
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- final: candle + confetti ---------- */

  function confetti(count) {
    var colors = ["#ffb3b5", "#fdcbcb", "#800020", "#f2dee0", "#af2b3e", "#ffdada"];
    for (var i = 0; i < (count || 90); i++) {
      var p = document.createElement("i");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2.6 + Math.random() * 2.4 + "s";
      p.style.animationDelay = Math.random() * 0.8 + "s";
      p.style.opacity = 0.75 + Math.random() * 0.25;
      document.body.appendChild(p);
      (function (node) {
        setTimeout(function () { node.remove(); }, 6000);
      })(p);
    }
  }

  function finalScreen() {
    var cake = el("[data-cake]");
    if (!cake) return;

    var reveal = el("[data-final-message]");
    var prompt = el("[data-final-prompt]");
    var replay = el("[data-replay]");

    function blow() {
      if (cake.classList.contains("is-blown")) return;
      cake.classList.add("is-blown");
      confetti(120);
      if (prompt) prompt.style.display = "none";
      if (reveal) {
        reveal.hidden = false;
        requestAnimationFrame(function () { reveal.classList.add("is-in"); });
      }
    }

    cake.addEventListener("click", blow);
    cake.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); }
    });

    if (replay) {
      replay.addEventListener("click", function () {
        cake.classList.remove("is-blown");
        if (reveal) { reveal.hidden = true; reveal.classList.remove("is-in"); }
        if (prompt) prompt.style.display = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------- reveal on scroll ---------- */

  function revealAll() {
    var items = all(".reveal:not(.is-in)");

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var node = entry.target;
          setTimeout(function () { node.classList.add("is-in"); }, i * 60);
          io.unobserve(node);
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );

    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------- boot ---------- */

  function boot() {
    buildNav();
    wireDrawer();
    bindText();

    all("[data-render]").forEach(function (host) {
      var fn = render[host.getAttribute("data-render")];
      if (fn) fn(host);
    });

    countdown();
    finalScreen();
    revealAll();

    var partyBtn = el("[data-confetti]");
    if (partyBtn) partyBtn.addEventListener("click", function () { confetti(80); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
