/* ==========================================================================
   THE ARCHIVE — magazine engine
   Turns the pages, and builds every spread from assets/js/config.js.
   You shouldn't need to edit this file to change content — edit config.js.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};

  /* ---------- helpers ---------- */

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

  function el(sel, root) { return (root || document).querySelector(sel); }

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* A photograph. Shows the image when there is one, a plate placeholder if not. */
  function plate(src, hint, shape) {
    var cls = "plate__frame" + (shape ? " plate__frame--" + shape : "");
    if (src) {
      return '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(hint || "") + '" loading="lazy">';
    }
    return (
      '<div class="' + cls + ' plate__slot">' +
      '<p class="plate__hint">' + esc(hint || "photograph to come") + "</p>" +
      "</div>"
    );
  }

  function caption(no, text) {
    return (
      '<figcaption><span class="plate__no">' + esc(no) + "</span>" +
      "<span>" + esc(text) + "</span></figcaption>"
    );
  }

  /* ==========================================================================
     THE FLIPBOOK
     ========================================================================== */

  var spreads = [];
  var index = 0;
  var busy = false;

  function chrome() {
    spreads.forEach(function (sp, i) {
      var section = sp.getAttribute("data-section") || "";
      var bare = sp.hasAttribute("data-bare"); // cover: no running head or folio

      // wrap the authored content in the scrolling page area
      var inner = document.createElement("div");
      inner.className = "page__inner";
      while (sp.firstChild) inner.appendChild(sp.firstChild);

      if (bare) {
        // the cover lays itself out — no page chrome, no wrapper
        while (inner.firstChild) sp.appendChild(inner.firstChild);
      } else {
        var head = document.createElement("header");
        head.className = "runninghead";
        head.innerHTML =
          "<span><b>" + esc(S.magazineName || "The Archive") + "</b> &nbsp;/&nbsp; " +
          esc(S.issueLine || "") + "</span><span>" + esc(section) + "</span>";

        var page = document.createElement("div");
        page.className = "page";
        page.appendChild(inner);

        var foot = document.createElement("footer");
        foot.className = "folio";
        foot.innerHTML =
          "<span>" + esc(S.name || "") + " &nbsp;&mdash;&nbsp; " + esc(section) + "</span>" +
          '<span class="folio__no">' + pad(i) + "</span>";

        sp.appendChild(head);
        sp.appendChild(page);
        sp.appendChild(foot);
      }

      // stagger the reveals in reading order
      all(".reveal", sp).forEach(function (node, n) {
        node.style.setProperty("--i", n);
      });
    });
  }

  function goTo(next, opts) {
    opts = opts || {};
    if (busy || next === index || next < 0 || next >= spreads.length) return;

    var from = spreads[index];
    var to = spreads[next];
    var back = next < index;
    var instant = opts.instant || matchMedia("(prefers-reduced-motion: reduce)").matches;

    index = next;
    syncChrome();

    if (instant) {
      from.classList.remove("is-current", "is-turning", "is-turning-back", "is-settling");
      to.classList.add("is-current");
      restage(to);
      return;
    }

    busy = true;

    var mover = back ? to : from;
    var under = back ? from : to;

    to.classList.add("is-current");
    if (!back) under.classList.add("is-settling");
    mover.classList.add("is-turning");
    if (back) mover.classList.add("is-turning-back");

    var done = function () {
      mover.removeEventListener("animationend", done);
      mover.classList.remove("is-turning", "is-turning-back");
      under.classList.remove("is-settling");
      if (!back) from.classList.remove("is-current");
      busy = false;
      restage(to);
    };

    mover.addEventListener("animationend", done);
    setTimeout(function () { if (busy) done(); }, 900); // safety net
  }

  // when a spread arrives: reset its scroll and replay its reveals
  function restage(sp) {
    var page = el(".page", sp);
    if (page) page.scrollTop = 0;

    var id = sp.id;
    if (id && location.hash.slice(1) !== id) {
      history.replaceState(null, "", "#" + id);
    }

    var head = el(".hed", sp) || el(".masthead", sp);
    if (head) document.title = head.textContent.trim() + " — " + (S.magazineName || "The Archive");
  }

  function syncChrome() {
    var prev = el("[data-prev]");
    var next = el("[data-next]");
    var corner = el("[data-corner]");
    var bar = el("[data-progress]");

    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === spreads.length - 1;
    if (corner) corner.disabled = index === spreads.length - 1;
    if (bar) bar.style.width = ((index + 1) / spreads.length) * 100 + "%";
  }

  function wireTurning() {
    var prev = el("[data-prev]");
    var next = el("[data-next]");
    var corner = el("[data-corner]");

    if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1); });
    if (corner) corner.addEventListener("click", function () { goTo(index + 1); });

    document.addEventListener("keydown", function (e) {
      if (e.target.matches("input, textarea")) return;
      if (el(".modal:not([hidden])")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goTo(index + 1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(index - 1); }
      if (e.key === "Home") { e.preventDefault(); goTo(0); }
      if (e.key === "End") { e.preventDefault(); goTo(spreads.length - 1); }
    });

    // swipe, without stealing vertical scrolling inside a page
    var x0 = 0, y0 = 0, t0 = 0;

    document.addEventListener("touchstart", function (e) {
      var t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY; t0 = Date.now();
    }, { passive: true });

    document.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      var dx = t.clientX - x0;
      var dy = t.clientY - y0;
      if (Date.now() - t0 > 800) return;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      goTo(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // contents button
    var tocBtn = el("[data-tocbtn]");
    if (tocBtn) {
      tocBtn.addEventListener("click", function () {
        var toc = document.getElementById("contents");
        goTo(toc ? spreads.indexOf(toc) : 1);
      });
    }

    window.addEventListener("hashchange", function () {
      var target = document.getElementById(location.hash.slice(1));
      var i = spreads.indexOf(target);
      if (i > -1) goTo(i);
    });
  }

  /* ==========================================================================
     SPREAD CONTENT
     ========================================================================== */

  var render = {};

  /* COVER ---------------------------------------------------------------- */
  render.coverlines = function (host) {
    var side = host.getAttribute("data-side");
    var lines = (S.coverlines || []).filter(function (c) { return (c.side || "left") === side; });

    host.innerHTML = lines
      .map(function (c) {
        return (
          '<p class="coverline' + (side === "right" ? " coverline--right" : "") + '">' +
          "<b>" + esc(fill(c.title)) + "</b>" + esc(fill(c.text || "")) + "</p>"
        );
      })
      .join("");
  };

  render.barcode = function (host) {
    var bars = "";
    for (var i = 0; i < 34; i++) bars += "<i></i>";
    host.innerHTML = bars;
  };

  render.countdown = function (host) {
    if (!S.birthday) { host.remove(); return; }

    function tick() {
      var now = new Date();
      var target = new Date(S.birthday + "T00:00:00");
      target.setFullYear(now.getFullYear());
      if (target - now < -86400000) target.setFullYear(now.getFullYear() + 1);

      var days = Math.ceil((target - now) / 86400000);
      host.textContent =
        days <= 0 ? "On sale today" : "On sale in " + days + (days === 1 ? " day" : " days");
    }

    tick();
    setInterval(tick, 60000);
  };

  /* CONTENTS ------------------------------------------------------------- */
  render.toc = function (host) {
    var items = spreads
      .map(function (sp, i) { return { sp: sp, i: i }; })
      .filter(function (o) { return o.sp.hasAttribute("data-section") && !o.sp.hasAttribute("data-hide-toc"); });

    host.innerHTML = items
      .map(function (o, n) {
        return (
          '<button class="toc__item reveal" type="button" data-goto="' + o.i + '">' +
          '<span class="toc__no">' + pad(n + 1) + "</span>" +
          '<span class="toc__title">' + esc(o.sp.getAttribute("data-section")) +
          (o.sp.getAttribute("data-blurb")
            ? "<small>" + esc(o.sp.getAttribute("data-blurb")) + "</small>" : "") +
          "</span>" +
          '<span class="toc__page">' + pad(o.i) + "</span>" +
          "</button>"
        );
      })
      .join("");

    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-goto]");
      if (btn) goTo(+btn.getAttribute("data-goto"));
    });
  };

  /* CONTRIBUTORS (friends) ----------------------------------------------- */
  var modal;

  function openLetter(title, body, sub) {
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "modal";
      modal.hidden = true;
      modal.innerHTML =
        '<article class="letter" role="dialog" aria-modal="true" aria-labelledby="letter-title">' +
        '<button class="letter__close" type="button" aria-label="Close">&times;</button>' +
        '<p class="kicker" data-sub></p>' +
        '<h2 class="hed hed--sm" id="letter-title"></h2>' +
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
    el(".letter__close", modal).focus();
  }

  function closeLetter() {
    if (modal) modal.hidden = true;
  }

  render.contributors = function (host) {
    var list = S.friends || [];

    host.innerHTML = list
      .map(function (f, i) {
        return (
          '<article class="contributor reveal" data-tag="' + esc(f.tag || "") + '">' +
          '<figure class="plate" style="margin:0">' +
          plate(f.photo, f.photoHint, i % 3 === 1 ? "square" : "tall") +
          "</figure>" +
          '<p class="contributor__role">' + esc(f.tag || "") + "</p>" +
          '<h3 class="contributor__name">' + esc(f.name) + "</h3>" +
          '<p class="contributor__quote">&ldquo;' + esc(f.quote || "") + "&rdquo;</p>" +
          '<button class="btn btn--block" type="button" data-letter="' + i + '">' +
          "Read the letter <span aria-hidden=\"true\">&rarr;</span></button>" +
          "</article>"
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

  render.contributorTags = function (host) {
    var tags = ["All"].concat(S.friendTags || []);

    host.innerHTML = tags
      .map(function (t, i) {
        return (
          '<button class="chip" type="button" data-tag="' + esc(t) + '" aria-pressed="' +
          (i === 0) + '">' + esc(t) + "</button>"
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
      all("[data-tag]", el("[data-render='contributors']")).forEach(function (card) {
        card.style.display = want === "All" || card.getAttribute("data-tag") === want ? "" : "none";
      });
    });
  };

  /* THE UNPUBLISHED ARCHIVE (cringe) ------------------------------------- */
  render.plates = function (host) {
    host.innerHTML = (S.cringe || [])
      .map(function (c, i) {
        if (c.style === "note") {
          return (
            '<blockquote class="pullquote reveal" style="margin:0">' +
            esc(c.caption) + "</blockquote>"
          );
        }
        return (
          '<figure class="plate reveal" style="margin:0">' +
          plate(c.photo, c.hint, i % 4 === 0 ? "wide" : i % 3 === 0 ? "square" : "") +
          caption("Plate " + pad(i + 1), c.caption) +
          "</figure>"
        );
      })
      .join("");
  };

  /* MOVING PICTURES (videos) --------------------------------------------- */
  render.stills = function (host) {
    host.innerHTML = (S.videos || [])
      .map(function (v, i) {
        var frame;

        if (v.src && /youtube|youtu\.be|vimeo/.test(v.src)) {
          frame =
            '<iframe class="still__frame" src="' + esc(v.src) + '" title="' + esc(v.title) +
            '" frameborder="0" allowfullscreen loading="lazy"></iframe>';
        } else if (v.src) {
          frame =
            '<video class="still__frame" controls preload="none"' +
            (v.poster ? ' poster="' + esc(v.poster) + '"' : "") +
            '><source src="' + esc(v.src) + '"></video>';
        } else {
          frame =
            '<div class="still__frame" role="img" aria-label="' + esc(v.title) + '"></div>' +
            '<button class="still__play" type="button" aria-label="Film to come: ' +
            esc(v.title) + '"><span aria-hidden="true">&#9658;</span></button>';
        }

        var sprockets = "";
        for (var n = 0; n < 26; n++) sprockets += "<i></i>";

        return (
          '<figure class="plate reveal" style="margin:0">' +
          '<div class="still__sprockets" aria-hidden="true">' + sprockets + "</div>" +
          '<div class="still">' + frame + "</div>" +
          '<div class="still__sprockets" aria-hidden="true">' + sprockets + "</div>" +
          caption("Reel " + pad(i + 1), v.title + (v.note ? " — " + v.note : "")) +
          "</figure>"
        );
      })
      .join("");
  };

  /* A LIFE IN CHAPTERS (timeline) ---------------------------------------- */
  render.chrono = function (host) {
    host.innerHTML = (S.timeline || [])
      .map(function (t) {
        return (
          '<article class="chrono__item reveal">' +
          '<p class="chrono__year">' + esc(t.year) + "</p>" +
          "<div>" +
          '<h3 class="hed hed--xs">' + esc(t.title) + "</h3>" +
          '<p class="body-copy" style="margin:0">' + esc(t.text) + "</p>" +
          "</div></article>"
        );
      })
      .join("");
  };

  /* LETTERS TO THE EDITOR (wishes) --------------------------------------- */
  render.mail = function (host) {
    function item(w) {
      return (
        '<article class="mail__item">' +
        '<p class="mail__text">&ldquo;' + esc(w.text) + "&rdquo;</p>" +
        '<p class="mail__from">' + esc(w.from) + "</p>" +
        "</article>"
      );
    }

    host.innerHTML = (S.wishes || []).map(item).join("");

    // Notes written on the page live in this browser only (localStorage).
    // Copy the good ones into config.js to keep them for everyone.
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem("archive-wishes") || "[]"); }
    catch (err) { saved = []; }

    saved.forEach(function (w) { host.insertAdjacentHTML("beforeend", item(w)); });

    var form = el("[data-wish-form]");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var from = form.elements.from.value.trim();
      var text = form.elements.text.value.trim();
      if (!from || !text) return;

      var wish = { from: from, text: text };
      saved.push(wish);
      try { localStorage.setItem("archive-wishes", JSON.stringify(saved)); }
      catch (err) { /* private browsing — it still shows for this visit */ }

      host.insertAdjacentHTML("afterbegin", item(wish));
      form.reset();

      var said = el("[data-wish-said]");
      if (said) said.textContent = "Received. Thank you — it's on the page.";
    });
  };

  /* THE SOUNDTRACK (playlist) -------------------------------------------- */
  render.chart = function (host) {
    host.innerHTML = (S.tracks || [])
      .map(function (t, i) {
        return (
          '<div class="chart__row reveal">' +
          '<span class="chart__no">' + pad(i + 1) + "</span>" +
          "<div>" +
          '<p class="chart__title">' + esc(t.title) +
          " <span>" + esc(t.artist) + "</span></p>" +
          '<p class="chart__note">' + esc(t.note || "") + "</p>" +
          "</div>" +
          '<span class="chart__len">' + esc(t.len || "") + "</span>" +
          "</div>"
        );
      })
      .join("");
  };

  render.playlistLink = function (host) {
    if (!S.playlistLink) { host.remove(); return; }
    host.innerHTML =
      '<a class="btn btn--ink" href="' + esc(S.playlistLink) +
      '" target="_blank" rel="noopener">Play the record <span aria-hidden="true">&rarr;</span></a>';
  };

  /* THE LAST WORD (final) ------------------------------------------------ */
  function confetti(count) {
    var colors = ["#f2dcdc", "#af2b3e", "#570013", "#e4c4c4", "#fffdf8", "#8e0f28"];
    for (var i = 0; i < (count || 100); i++) {
      var p = document.createElement("i");
      p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2.6 + Math.random() * 2.6 + "s";
      p.style.animationDelay = Math.random() * 0.9 + "s";
      p.style.opacity = 0.7 + Math.random() * 0.3;
      document.body.appendChild(p);
      (function (node) { setTimeout(function () { node.remove(); }, 6500); })(p);
    }
  }

  function lastWord() {
    var cake = el("[data-cake]");
    if (!cake) return;

    var reveal = el("[data-final-message]");
    var prompt = el("[data-final-prompt]");
    var replay = el("[data-replay]");

    function blow() {
      if (cake.classList.contains("is-blown")) return;
      cake.classList.add("is-blown");
      confetti(130);
      if (prompt) prompt.style.visibility = "hidden";
      if (reveal) {
        reveal.hidden = false;
        reveal.style.animation = "rise .7s ease .1s both";
      }
    }

    cake.addEventListener("click", blow);
    cake.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); }
    });

    if (replay) {
      replay.addEventListener("click", function () {
        cake.classList.remove("is-blown");
        if (reveal) { reveal.hidden = true; reveal.style.animation = ""; }
        if (prompt) prompt.style.visibility = "";
        goTo(0);
      });
    }

    var partyBtn = el("[data-confetti]");
    if (partyBtn) partyBtn.addEventListener("click", function () { confetti(90); });
  }

  /* ---------- text bindings: <span data-text="name"></span> ---------- */

  function bindText() {
    all("[data-text]").forEach(function (node) {
      var value = node.getAttribute("data-text").split(".").reduce(function (acc, k) {
        return acc == null ? acc : acc[k];
      }, S);
      if (value != null) node.textContent = fill(value);
    });
  }

  /* ---------- boot ---------- */

  function boot() {
    spreads = all(".spread");
    chrome();
    bindText();

    all("[data-render]").forEach(function (host) {
      var fn = render[host.getAttribute("data-render")];
      if (fn) fn(host);
    });

    // the table of contents needs the spreads measured first, so it runs late
    var toc = el("[data-render='toc']");
    if (toc && !toc.children.length) render.toc(toc);

    wireTurning();
    lastWord();

    var start = spreads.indexOf(document.getElementById(location.hash.slice(1)));
    index = start > 0 ? start : 0;
    spreads[index].classList.add("is-current");
    restage(spreads[index]);
    syncChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
