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

  /* data-from / data-to let one list be split across two facing pages */
  function slice(list, host) {
    var from = parseInt(host.getAttribute("data-from"), 10) || 0;
    var to = host.hasAttribute("data-to")
      ? parseInt(host.getAttribute("data-to"), 10)
      : list.length;
    return list.slice(from, to).map(function (item, n) {
      return { item: item, i: from + n };
    });
  }

  /* A photograph. Shows the image when there is one, a plate placeholder if not. */
  function plate(src, hint, shape) {
    var cls = "plate__frame" + (shape ? " plate__frame--" + shape : "");
    if (src) {
      return (
        '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(hint || "") +
        '" data-hint="' + esc(src) + '" loading="lazy">'
      );
    }
    return (
      '<div class="' + cls + ' plate__slot">' +
      '<p class="plate__hint">' + esc(hint || "photograph to come") + "</p>" +
      "</div>"
    );
  }

  function caption(no, text) {
    return (
      "<figcaption>" +
      (no ? '<span class="plate__no">' + esc(no) + "</span>" : "") +
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

      all(".leaf", sp).forEach(function (leaf, side) {
        if (leaf.hasAttribute("data-bare")) return; // cover and board carry no chrome

        var pageNo = i * 2 + side;

        var inner = document.createElement("div");
        inner.className = "page__inner";
        while (leaf.firstChild) inner.appendChild(leaf.firstChild);

        var head = document.createElement("header");
        head.className = "runninghead";
        head.innerHTML = side === 0
          ? "<span><b>" + esc(S.magazineName || "The Archive") + "</b></span><span>" +
            esc(S.issueLine || "") + "</span>"
          : "<span>" + esc(section) + "</span><span>" + esc(S.name || "") + "</span>";

        var page = document.createElement("div");
        page.className = "page";
        page.appendChild(inner);

        var foot = document.createElement("footer");
        foot.className = "folio";
        foot.innerHTML =
          '<span class="folio__no">' + pad(pageNo) + "</span>" +
          "<span>" + (side === 0 ? esc(section) : "") + "</span>";

        leaf.appendChild(head);
        leaf.appendChild(page);
        leaf.appendChild(foot);
      });

      // stagger the reveals in reading order
      all(".reveal", sp).forEach(function (node, n) {
        node.style.setProperty("--i", n);
      });
    });
  }

  function flat() {
    return window.matchMedia("(max-width: 900px)").matches ||
           window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function goTo(next) {
    if (busy || next === index || next < 0 || next >= spreads.length) return;

    var from = spreads[index];
    var to = spreads[next];
    var back = next < index;

    index = next;
    syncChrome();

    if (flat()) {
      from.classList.remove("is-current");
      to.classList.add("is-current", "is-revealed");
      restage(to);
      return;
    }

    busy = true;

    var book = el(".book");

    /* The leaf that swings. Going forward it is the current right-hand page,
       and its back is the left-hand page you land on. Going back, the reverse. */
    var frontLeaf = el(".leaf--right", back ? to : from);
    var backLeaf = el(".leaf--left", back ? from : to);

    to.classList.add("is-revealed");

    var settle = function (node) {
      all(".reveal", node).forEach(function (r) { r.classList.add("is-in"); });
      return node;
    };

    var flipper = document.createElement("div");
    flipper.className = "flipper " + (back ? "flipper--back" : "flipper--fwd");
    flipper.setAttribute("aria-hidden", "true");
    flipper.innerHTML =
      '<div class="flipper__face flipper__front"></div>' +
      '<div class="flipper__face flipper__back"></div>';
    el(".flipper__front", flipper).appendChild(settle(frontLeaf.cloneNode(true)));
    el(".flipper__back", flipper).appendChild(settle(backLeaf.cloneNode(true)));

    /* The half revealed as the leaf lifts: the page arriving underneath it.
       The other half is still supplied by the spread we are leaving. */
    var under = document.createElement("div");
    under.className = "under " + (back ? "under--left" : "under--right");
    under.setAttribute("aria-hidden", "true");
    under.appendChild(settle(el(back ? ".leaf--left" : ".leaf--right", to).cloneNode(true)));

    book.appendChild(under);
    book.appendChild(flipper);

    var done = function () {
      flipper.removeEventListener("animationend", done);
      flipper.remove();
      under.remove();
      from.classList.remove("is-current");
      to.classList.add("is-current");
      busy = false;
      restage(to);
    };

    flipper.addEventListener("animationend", done);
    setTimeout(function () { if (busy) done(); }, 1200); // safety net
  }

  // when a spread arrives: reset both pages and replay their reveals
  function restage(sp) {
    all(".page", sp).forEach(function (page) { page.scrollTop = 0; });
    sp.scrollTop = 0;

    var id = sp.id;
    if (id && location.hash.slice(1) !== id) {
      history.replaceState(null, "", "#" + id);
    }

    guardOnArrival(sp);

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
          '<span class="toc__page">' + pad(o.i * 2) + "</span>" +
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
    var list = S[host.getAttribute("data-source") || "friends"] || [];

    host.className = "mosaic";

    host.innerHTML = slice(list, host)
      .map(function (entry, n) {
        var f = entry.item, i = entry.i;

        var words =
          '<p class="contributor__role">' + esc(f.tag || "") + "</p>" +
          '<h3 class="contributor__name">' + esc(f.name) + "</h3>" +
          '<p class="contributor__quote">&ldquo;' + esc(f.quote || "") + "&rdquo;</p>" +
          '<button class="btn btn--block" type="button" data-letter="' + i + '">' +
          "Read the letter <span aria-hidden=\"true\">&rarr;</span></button>";

        var picture =
          '<figure class="plate contributor__plate">' +
          '<span class="contributor__index" aria-hidden="true">' + pad(i + 1) + "</span>" +
          plate(f.photo, f.photoHint, n === 0 ? "wide" : "square") +
          "</figure>";

        // the first on the page runs wide, with its words set against its foot
        if (n === 0) {
          return (
            '<article class="contributor contributor--lead duo-plate reveal" data-tag="' +
            esc(f.tag || "") + '">' + picture +
            '<div class="duo-plate__words">' + words + "</div></article>"
          );
        }

        return (
          '<article class="contributor reveal" data-tag="' + esc(f.tag || "") + '">' +
          picture + words + "</article>"
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

  /* THE GALLERY — a page of photographs -------------------------------- */
  render.gallery = function (host) {
    host.className = "mosaic";

    host.innerHTML = slice(S.gallery || [], host)
      .map(function (entry) {
        var g = entry.item;
        return (
          '<figure class="plate plate--inset reveal" style="margin:0">' +
          plate(g.src, g.src, "tall") +
          caption("", g.caption || "") +
          "</figure>"
        );
      })
      .join("");
  };

  /* ABOUT YOU — the facts list -------------------------------------------- */
  render.facts = function (host) {
    var facts = (S.about && S.about.facts) || [];

    host.innerHTML = facts
      .map(function (f) {
        return (
          '<div class="fact reveal">' +
          "<dt>" + esc(f.label) + "</dt>" +
          "<dd>" + esc(fill(f.value)) + "</dd>" +
          "</div>"
        );
      })
      .join("");
  };

  /* THE UNPUBLISHED ARCHIVE (cringe) ------------------------------------- */
  render.plates = function (host) {
    host.className = "mosaic";

    host.innerHTML = slice(S.cringe || [], host)
      .map(function (entry, n) {
        var c = entry.item, i = entry.i;

        if (c.style === "note") {
          return (
            '<blockquote class="pullquote reveal mosaic__hero" style="margin:6px 0">' +
            esc(c.caption) + "</blockquote>"
          );
        }

        var lead = n === 0;

        return (
          '<figure class="plate plate--inset reveal' + (lead ? " mosaic__hero" : "") + '" style="margin:0">' +
          plate(c.photo, c.hint, lead ? "pano" : "square") +
          caption("", c.caption) +
          "</figure>"
        );
      })
      .join("");
  };

  /* FILMSTRIP — a column of small frames, like a strip of negatives ------- */
  render.filmstrip = function (host) {
    var perf = '<div class="filmstrip__perf" aria-hidden="true">' +
      new Array(5).join("<i></i>") + "<i></i></div>";

    var cells = (S.filmstrip || []).map(function (src) {
      return src
        ? '<img class="filmstrip__cell" src="' + esc(src) + '" alt="" loading="lazy" ' +
          'data-hint="' + esc(src) + '">'
        : '<div class="filmstrip__cell"></div>';
    });

    if (!cells.length) cells = ["", "", "", ""].map(function () {
      return '<div class="filmstrip__cell"></div>';
    });

    host.innerHTML =
      '<div class="filmstrip">' + perf +
      cells.join(perf) + perf + "</div>";
  };

  /* NOW PLAYING — the song card that floats over a full-page photo -------- */
  render.nowplaying = function (host) {
    var np = S.nowPlaying || {};

    var code = "";
    for (var i = 0; i < 23; i++) {
      code += '<i style="height:' + (26 + ((i * 37) % 62)) + '%"></i>';
    }

    var art = np.art
      ? '<img class="nowplaying__art" src="' + esc(np.art) + '" alt="">'
      : '<div class="nowplaying__art">Sleeve<br>assets/img/song-art.jpg</div>';

    host.innerHTML =
      '<div class="nowplaying">' + art +
      '<p class="nowplaying__title">' + esc(np.title || "Our song") + "</p>" +
      '<p class="nowplaying__sub">' + esc(np.sub || "") + "</p>" +
      '<div class="nowplaying__bar"><i></i></div>' +
      '<div class="nowplaying__times"><span>' + esc(np.elapsed || "0:02") +
      "</span><span>-" + esc(np.total || "3:12") + "</span></div>" +
      '<div class="nowplaying__controls">' +
      '<span aria-hidden="true">&#9198;</span>' +
      (np.link
        ? '<a class="nowplaying__play" href="' + esc(np.link) +
          '" target="_blank" rel="noopener" aria-label="Play the song">&#9654;</a>'
        : '<button class="nowplaying__play" type="button" aria-label="Play the song">&#9654;</button>') +
      '<span aria-hidden="true">&#9197;</span>' +
      "</div>" +
      '<div class="nowplaying__scan">' +
      '<span class="nowplaying__code" aria-hidden="true">' + code + "</span>" +
      "</div></div>";
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
          caption("", v.title + (v.note ? " — " + v.note : "")) +
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
    var waiting = el("[data-final-waiting]");

    function blow() {
      if (cake.classList.contains("is-blown")) return;
      cake.classList.add("is-blown");
      confetti(130);
      if (prompt) prompt.style.visibility = "hidden";
      if (waiting) waiting.hidden = true;
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
        if (waiting) waiting.hidden = false;
        if (prompt) prompt.style.visibility = "";
        goTo(0);
      });
    }

    var partyBtn = el("[data-confetti]");
    if (partyBtn) partyBtn.addEventListener("click", function () { confetti(90); });

    var home = el("[data-goto-cover]");
    if (home) home.addEventListener("click", function () { goTo(0); });
  }

  /* ---------- missing photographs fall back to their slot ---------- */
  /* Until a file is actually dropped into assets/img/, show the labelled
     placeholder rather than a broken image icon. */
  function guardPhotos(root) {
    all("img[data-hint]", root || document).forEach(function (img) {
      function fallback() {
        var slot = document.createElement("div");
        slot.className = img.className + " plate__slot";
        slot.innerHTML =
          '<p class="plate__hint">' + esc(img.getAttribute("data-hint")) + "</p>";
        if (img.parentNode) img.parentNode.replaceChild(slot, img);
      }

      img.addEventListener("error", fallback);
      // an image that already failed before this ran
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  /* lazy images only try to load once their spread is shown, so re-check then */
  function guardOnArrival(sp) { guardPhotos(sp); }

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
    guardPhotos();

    var start = spreads.indexOf(document.getElementById(location.hash.slice(1)));
    index = start > 0 ? start : 0;
    spreads[index].classList.add("is-current", "is-revealed");
    restage(spreads[index]);
    syncChrome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
