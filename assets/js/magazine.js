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
    var cls = "polaroid__img" + (shape ? " " + shape : "");
    if (src) {
      return (
        '<img class="' + cls + '" src="' + esc(src) + '" alt="' + esc(hint || "") +
        '" data-hint="' + esc(src) + '" loading="lazy">'
      );
    }
    return (
      '<div class="' + cls + ' slot">' +
      "<span>" + esc(hint || "photograph to come") + "</span>" +
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

  /* Build a page's chrome: running head, the page body, the folio. */
  function dressLeaf(leaf, section, side) {
    if (leaf.hasAttribute("data-bare")) return;
    if (el(".page", leaf)) return; // already dressed

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
      '<span class="folio__no"></span>' +
      "<span>" + (side === 0 ? esc(section) : "") + "</span>";

    leaf.appendChild(head);
    leaf.appendChild(page);
    leaf.appendChild(foot);
  }

  function chrome() {
    spreads.forEach(function (sp) {
      var section = sp.getAttribute("data-section") || "";
      all(".leaf", sp).forEach(function (leaf, side) { dressLeaf(leaf, section, side); });
    });
  }

  /* Folios are numbered only once pagination has settled. */
  function numberPages() {
    spreads.forEach(function (sp, i) {
      all(".leaf", sp).forEach(function (leaf, side) {
        var no = el(".folio__no", leaf);
        if (no) no.textContent = pad(i * 2 + side + 1);
      });
    });

    spreads.forEach(function (sp) {
      all(".reveal", sp).forEach(function (node, n) { node.style.setProperty("--i", n); });
    });
  }

  /* ==========================================================================
     PAGINATION
     Pages do not scroll. Anything that will not fit is lifted off the page and
     carried onto a continuation spread, as many times as it takes.
     ========================================================================== */

  function overflows(page) {
    return page.scrollHeight > page.clientHeight + 1;
  }

  /* Take content off the end of a page until what is left fits. Returns the
     removed nodes in reading order, ready to be placed on the next page. */
  function liftOverflow(page) {
    var inner = el(".page__inner", page);
    if (!inner) return [];

    var moved = [];
    var guard = 0;

    while (overflows(page) && inner.lastElementChild && guard++ < 400) {
      var last = inner.lastElementChild;

      // A container of many things (a grid of photographs, a list of letters)
      // is split item by item rather than moved whole.
      if (last.children.length > 1) {
        var carry = last.__carry;
        if (!carry || carry.parentNode) {
          carry = last.cloneNode(false);
          last.__carry = carry;
          moved.unshift(carry);
        }
        carry.insertBefore(last.lastElementChild, carry.firstChild);
        if (!last.children.length) {
          inner.removeChild(last);
          last.__carry = null;
        }
        continue;
      }

      moved.unshift(last);
      inner.removeChild(last);
    }

    return moved;
  }

  function continuationOf(sp) {
    var copy = document.createElement("section");
    copy.className = sp.className.replace(/\bis-[\w-]+/g, "").trim();
    copy.setAttribute("data-section", sp.getAttribute("data-section") || "");
    copy.setAttribute("data-hide-toc", "");
    copy.setAttribute("data-continued", "");

    var left = document.createElement("div");
    left.className = "leaf leaf--left " + carriedLeafClasses(el(".leaf--left", sp));
    var right = document.createElement("div");
    right.className = "leaf leaf--right " + carriedLeafClasses(el(".leaf--right", sp));

    copy.appendChild(left);
    copy.appendChild(right);
    sp.parentNode.insertBefore(copy, sp.nextSibling);
    return copy;
  }

  // keep the page's character (dark, full-bleed, cover) on its continuation
  function carriedLeafClasses(leaf) {
    if (!leaf) return "";
    return (leaf.className.match(/leaf--(dark|back)/g) || []).join(" ");
  }

  /* ---------- fitting a designed page to the window ---------- */

  /* A spread is composed, not poured: its two pages are meant to be read
     side by side. On a short laptop screen the same content simply has less
     room, so rather than spill half a page onto a continuation the whole page
     is laid out at its natural size and then optically scaled down, the way a
     printed spread is reduced to fit a smaller sheet. */

  var FIT_STEPS = [1, 0.96, 0.92, 0.88, 0.84, 0.8, 0.76, 0.72, 0.68, 0.64];

  function setFit(inner, f) {
    if (f >= 1) {
      inner.style.width = "";
      inner.style.transform = "";
      return;
    }
    inner.style.transformOrigin = "top left";
    inner.style.width = (100 / f) + "%";
    inner.style.transform = "scale(" + f + ")";
  }

  /* The smallest step at which this page fits, or 0 if even the last is short. */
  function fitFor(page) {
    var inner = el(".page__inner", page);
    if (!inner) return 1;

    for (var i = 0; i < FIT_STEPS.length; i++) {
      setFit(inner, FIT_STEPS[i]);
      if (inner.scrollHeight * FIT_STEPS[i] <= page.clientHeight + 1) {
        return FIT_STEPS[i];
      }
    }

    setFit(inner, 1);
    return 0;
  }

  /* Both pages take the same reduction so the spread reads as one sheet. */
  function fitSpread(pages) {
    var factors = pages.map(fitFor);
    if (factors.some(function (f) { return !f; })) {
      pages.forEach(function (pg) {
        var inner = el(".page__inner", pg);
        if (inner) setFit(inner, 1);
      });
      return false;
    }

    var f = Math.min.apply(null, factors);
    pages.forEach(function (pg) {
      var inner = el(".page__inner", pg);
      if (inner) setFit(inner, f);
    });
    return true;
  }

  function paginate() {
    var guard = 0;

    for (var i = 0; i < spreads.length && guard++ < 80; i++) {
      var sp = spreads[i];
      if (sp.hasAttribute("data-no-paginate")) continue;

      var leaves = all(".leaf", sp);
      var leftPage = leaves[0] && el(".page", leaves[0]);
      var rightPage = leaves[1] && el(".page", leaves[1]);
      if (!leftPage && !rightPage) continue;

      /* Scale the spread to fit before considering a continuation — a page
         that can be shown whole should never be broken in two. */
      if (fitSpread([leftPage, rightPage].filter(Boolean))) continue;

      var carry = leftPage ? liftOverflow(leftPage) : [];

      /* On a continuation the facing page is still empty, so what came off the
         left page belongs there — the text carries on in reading order rather
         than skipping a page. */
      var rightInner = rightPage && el(".page__inner", rightPage);
      if (carry.length && rightInner && !rightInner.children.length) {
        carry.forEach(function (node) { rightInner.appendChild(node); });
        carry = [];
        leaves[1].classList.remove("leaf--blank");
      }

      if (rightPage) carry = carry.concat(liftOverflow(rightPage));
      if (!carry.length) continue;

      /* If lifting emptied a page completely, the thing that came off is taller
         than any page and will never fit. Put it back rather than pushing it
         from page to page forever. */
      var emptied = all(".page__inner", sp).some(function (inner) {
        return !inner.children.length;
      });

      if (emptied) {
        var home = el(".page__inner", leaves[0]) || el(".page__inner", leaves[1]);
        if (home) carry.forEach(function (node) { home.appendChild(node); });
        sp.setAttribute("data-no-paginate", "");
        continue;
      }

      var next = continuationOf(sp);
      var section = sp.getAttribute("data-section") || "";
      var placed = 0;

      all(".leaf", next).forEach(function (leaf, side) {
        dressLeaf(leaf, section, side);
        if (side !== 0) return; // everything lands on the left page and flows on
        var inner = el(".page__inner", leaf);
        if (!inner) return;
        carry.forEach(function (node) { inner.appendChild(node); placed++; });
      });

      all(".leaf", next).forEach(function (leaf) {
        var inner = el(".page__inner", leaf);
        if (inner && !inner.children.length) leaf.classList.add("leaf--blank");
      });

      if (!placed) { next.remove(); continue; }

      spreads = all(".spread");
    }

    spreads = all(".spread");
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

  /* COVER — the barcode and the countdown strap ------------------------- */
  render.barcode = function (host) {
    var bars = "";
    for (var i = 0; i < 30; i++) bars += "<i></i>";
    host.innerHTML = bars;
  };

  render.countdown = function (host) {
    if (!S.birthday) { host.textContent = "P. 01"; return; }

    function tick() {
      var now = new Date();
      var target = new Date(S.birthday + "T00:00:00");
      target.setFullYear(now.getFullYear());
      if (target - now < -86400000) target.setFullYear(now.getFullYear() + 1);

      var days = Math.ceil((target - now) / 86400000);
      host.textContent = days <= 0 ? "Out today" : "Out in " + days + " days";
    }

    tick();
    setInterval(tick, 60000);
  };

  /* CONTENTS ------------------------------------------------------------ */
  render.toc = function (host) {
    var items = spreads
      .map(function (sp, i) { return { sp: sp, i: i }; })
      .filter(function (o) {
        return o.sp.hasAttribute("data-section") && !o.sp.hasAttribute("data-hide-toc");
      });

    host.innerHTML = items
      .map(function (o, n) {
        return (
          '<button class="toc__item" type="button" data-goto="' + o.i + '">' +
          '<span class="toc__title">' + pad(n + 1) + " " +
          esc(o.sp.getAttribute("data-section")) + "</span>" +
          '<span class="toc__ch">' + esc(o.sp.getAttribute("data-ch") || "") + "</span>" +
          '<p class="toc__sub">' + esc(o.sp.getAttribute("data-blurb") || "") + "</p>" +
          "</button>"
        );
      })
      .join("");

    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-goto]");
      if (btn) goTo(+btn.getAttribute("data-goto"));
    });
  };

  /* CONTENTS — the little stats strip -------------------------------------- */
  render.stats = function (host) {
    host.innerHTML = (S.issueStats || [])
      .map(function (t) {
        return '<div class="stat"><b>' + esc(t.n) + "</b><span>" +
               esc(t.label) + "</span></div>";
      })
      .join("");
  };

  /* THE LORE — the field biography -------------------------------------- */
  render.lore = function (host) {
    host.innerHTML = ((S.lore && S.lore.entries) || [])
      .map(function (e) {
        return (
          '<div class="lore-entry">' +
          "<dt>" + esc(e.label) + "</dt>" +
          "<dd>" + esc(fill(e.text)) + "</dd>" +
          "</div>"
        );
      })
      .join("");
  };

  /* THE REPORT CARD ----------------------------------------------------- */
  render.metrics = function (host) {
    host.innerHTML = ((S.reportCard && S.reportCard.rows) || [])
      .map(function (r) {
        return (
          '<div class="metric">' +
          '<span class="metric__label">' + esc(r.label) + "</span>" +
          '<span class="metric__val">' + esc(r.shown || (+r.pct || 0) + "%") + "</span>" +
          '<span class="metric__bar"><i style="width:' + (+r.pct || 0) + '%"></i></span>' +
          "</div>"
        );
      })
      .join("");
  };

  /* BESTIES — one to a page, or two side by side ------------------------ */
  var TILTS = [-2, 1.5, -1.5, 2, -1];

  function bestieCard(b, i, compact) {
    var shape = compact ? "polaroid__img--square" : "polaroid__img--wide";

    return (
      '<article class="bestie reveal">' +
      '<figure class="polaroid" style="--tilt:' + TILTS[i % TILTS.length] + 'deg">' +
      (compact ? "" : '<span class="washi washi--tl">Confidential</span>') +
      plate(b.photo, b.photo, shape) +
      (b.caption ? "<figcaption>" + esc(b.caption) + "</figcaption>" : "") +
      "</figure>" +

      '<p class="bestie__entry" style="margin-top:14px">Entry ' + pad(i + 1) + "</p>" +
      '<h2 class="bestie__name">' + esc(b.name) + "</h2>" +
      (b.full ? '<span class="tag">' + esc(b.full) + "</span>" : "") +
      '<p class="bestie__quote">&ldquo;' + esc(b.quote || "") + "&rdquo;</p>" +
      '<button class="btn" type="button" data-letter="' + i + '">Read the letter</button>' +
      "</article>"
    );
  }

  render.bestie = function (host) {
    var list = S.besties || [];
    var i = parseInt(host.getAttribute("data-index"), 10) || 0;
    if (!list[i]) { host.remove(); return; }

    host.innerHTML = bestieCard(list[i], i, false);
    wireLetters(host, list);
  };

  render.bestiePair = function (host) {
    var list = S.besties || [];

    host.innerHTML = slice(list, host)
      .map(function (entry) { return bestieCard(entry.item, entry.i, true); })
      .join("");

    wireLetters(host, list);
  };

  function wireLetters(host, list) {
    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-letter]");
      if (!btn) return;
      var b = list[+btn.getAttribute("data-letter")];
      openLetter(b.name, fill(b.letter || ""), b.full || "");
    });
  }

  /* FAMILY -------------------------------------------------------------- */
  render.family = function (host) {
    var list = S.family || [];

    host.innerHTML = list
      .map(function (f, i) {
        return (
          '<article class="letter-card">' +
          '<figure class="polaroid" style="--tilt:' + TILTS[i % TILTS.length] +
          'deg;float:right;width:34%;margin:0 0 10px 14px">' +
          plate(f.photo, f.photo, "polaroid__img--square") +
          "</figure>" +
          '<p class="letter-card__to">' + esc(f.name) + "</p>" +
          '<p class="letter-card__from">' + esc(f.from || "") + "</p>" +
          "<p>" + esc(fill(f.letter || "")) + "</p>" +
          '<div style="clear:both"></div>' +
          "</article>"
        );
      })
      .join("");
  };

  /* ---------- the letter modal ---------- */

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

  function closeLetter() { if (modal) modal.hidden = true; }

  /* ---------- the finale: candle and confetti ---------- */

  function confetti(count) {
    var colors = ["#ff2a85", "#7b5cfa", "#ffdf6d", "#ffa3d7", "#7dd3fc", "#ff5e5b"];
    for (var i = 0; i < (count || 110); i++) {
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

    function blow() {
      if (cake.classList.contains("is-blown")) return;
      cake.classList.add("is-blown");
      confetti(140);
      /* The message takes the room the teaser furniture was holding. */
      var stage = cake.closest(".finale");
      if (stage) stage.classList.add("is-open");
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

    var party = el("[data-confetti]");
    if (party) party.addEventListener("click", function () { confetti(90); });
  }

  /* ---------- a missing photograph falls back to its labelled slot ---------- */

  function guardPhotos(root) {
    all("img[data-hint]", root || document).forEach(function (img) {
      function fallback() {
        var slot = document.createElement("div");
        slot.className = img.className + " slot";
        slot.innerHTML = "<span>" + esc(img.getAttribute("data-hint")) + "</span>";
        if (img.parentNode) img.parentNode.replaceChild(slot, img);
      }

      img.addEventListener("error", fallback);
      if (img.complete && img.naturalWidth === 0) fallback();
    });
  }

  function guardOnArrival(sp) { guardPhotos(sp); }

  /* Resolve once every photograph has either loaded or failed. */
  function whenImagesSettle(done) {
    var imgs = all("img").filter(function (i) { return !i.complete; });
    if (!imgs.length) return requestAnimationFrame(done);

    var pending = imgs.length;
    var finished = false;

    function tick() {
      if (--pending > 0 || finished) return;
      finished = true;
      requestAnimationFrame(done);
    }

    imgs.forEach(function (img) {
      img.addEventListener("load", tick, { once: true });
      img.addEventListener("error", tick, { once: true });
    });

    setTimeout(function () {
      if (finished) return;
      finished = true;
      requestAnimationFrame(done);
    }, 2000);
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
    guardPhotos();

    // Reflow only once every photograph has resolved — a page measured while an
    // image is still loading reports the wrong height.
    whenImagesSettle(function () {
      guardPhotos();
      paginate();
      numberPages();
      syncChrome();
    });

    numberPages();

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
