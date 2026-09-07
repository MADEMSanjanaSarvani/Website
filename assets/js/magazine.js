/* ==========================================================================
   THE ARCHIVE — magazine engine
   Turns the pages, and builds every spread from assets/js/config.js.
   You shouldn't need to edit this file to change content — edit config.js.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};

  /* ---------- helpers ---------- */

  /* Everything rendered goes through here, so {age} and {name} are resolved
     here too — a token left raw in a running head is the kind of thing that
     only shows up on the page. */
  function esc(str) {
    return fill(str)
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
    all("[data-count]").forEach(function (stat) {
      var n = countOf(stat.getAttribute("data-count"));
      var b = el("b", stat);
      if (n != null && b) b.textContent = n;
    });

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

  /* A page is never split, only resized, so the magazine keeps its page count
     on any screen. The bounds are wide because a browser window is not a
     sheet of paper: a maximized laptop window with tabs, an address bar and a
     favourites bar leaves far less height than its screen size suggests. */
  var MIN_FIT = 0.42;
  var MAX_FIT = 2.3;

  /* The page height the design is drawn for. Enlargement is tied to the sheet,
     not to how sparse a page happens to be: on a photograph-led page, scaling
     up narrows the measure, which shrinks the photograph, which frees height,
     which invites more scaling — left alone it runs to the ceiling and sets a
     small page in enormous type. */
  var DESIGN_PAGE_H = 450;

  function setFit(inner, f) {
    if (f === 1) {
      inner.style.width = "";
      inner.style.transform = "";
      return;
    }
    inner.style.transformOrigin = "top left";
    inner.style.width = (100 / f) + "%";
    inner.style.transform = "scale(" + f + ")";
  }

  /* The largest size this page can be shown whole at.

     Scaling changes the measure, which reflows the text, which changes the
     height, so the ratio cannot be solved directly — and chasing it by ratio
     oscillates. A bisection cannot overshoot: halve the range towards the
     largest size that still fits. */
  function fitFor(page) {
    var inner = el(".page__inner", page);
    if (!inner) return 1;

    var target = page.clientHeight * 0.985;   // a hair of air above the folio
    if (target <= 0) return 1;

    var ceiling = Math.min(MAX_FIT, Math.max(MIN_FIT, page.clientHeight / DESIGN_PAGE_H));

    function fits(f) {
      setFit(inner, f);
      return inner.scrollHeight * f <= target;
    }

    if (fits(ceiling)) return ceiling;
    if (!fits(MIN_FIT)) { setFit(inner, MIN_FIT); return MIN_FIT; }

    var lo = MIN_FIT, hi = ceiling;
    for (var i = 0; i < 12; i++) {
      var mid = (lo + hi) / 2;
      if (fits(mid)) lo = mid; else hi = mid;
    }

    setFit(inner, lo);
    return lo;
  }

  /* Both pages take the same reduction so the spread reads as one sheet. */
  function fitSpread(pages) {
    /* Stickers hang off the page itself rather than the page body, so what is
       measured here is only the writing — pasting one on cannot shrink it. */
    var f = Math.min.apply(null, pages.map(fitFor));
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
  /* A stat may name a figure the magazine counts for itself, so the contents
     page cannot claim ten pages and five friends once the list has changed. */
  function countOf(key) {
    if (key === "pages") return pad(spreads.length * 2);
    if (key === "spreads") return pad(spreads.length);
    if (key === "besties") return pad((S.besties || []).length);
    if (key === "chapters") return pad(all(".spread[data-ch]").length);
    if (key === "photos") return pad(((S.gallery || {}).photos || []).length);
    if (key === "family") return pad((S.family || []).length);
    return null;
  }

  render.stats = function (host) {
    host.innerHTML = (S.issueStats || [])
      .map(function (t) {
        var counted = t.count ? countOf(t.count) : null;
        return '<div class="stat"' + (t.count ? ' data-count="' + esc(t.count) + '"' : "") +
               "><b>" + esc(counted != null ? counted : t.n) + "</b><span>" +
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
    /* A friend with a page to herself gets a portrait: the photographs people
       actually send are taken on a phone, held upright. */
    var shape = compact ? "polaroid__img--square" : "polaroid__img--tall";

    return (
      '<article class="bestie reveal">' +
      '<figure class="polaroid" style="--tilt:' + TILTS[i % TILTS.length] + 'deg">' +
      (compact ? "" : '<span class="washi washi--tl">Confidential</span>') +
      plate(b.photo, b.photo, shape) +
      (b.caption ? "<figcaption>" + esc(b.caption) + "</figcaption>" : "") +
      "</figure>" +

      '<div class="bestie__body">' +
      '<p class="bestie__entry">Entry ' + pad(i + 1) + "</p>" +
      '<h2 class="bestie__name">' + esc(b.name) + "</h2>" +
      (b.full ? '<span class="tag">' + esc(b.full) + "</span>" : "") +
      '<p class="bestie__quote">&ldquo;' + esc(b.quote || "") + "&rdquo;</p>" +
      '<button class="btn" type="button" data-letter="' + i + '">Read the letter</button>' +
      "</div>" +
      "</article>"
    );
  }

  /* The chapter is as long as the friendship list: one friend to a page.

     Pages come in facing pairs, so an odd number of friends leaves one page
     over — it becomes the chapter's closing note rather than a blank. */
  function bestiePageCount(n) {
    if (!n) return 0;
    return n + (n % 2 ? 1 : 0);
  }

  /* Build the chapter before anything is dressed or measured, by copying the
     template spread as many times as the list needs. */
  function buildBesties() {
    var list = S.besties || [];
    var template = document.getElementById("besties");
    if (!template) return;

    if (!list.length) { template.remove(); spreads = all(".spread"); return; }

    var wanted = bestiePageCount(list.length) / 2;
    var previous = template;

    for (var i = 0; i < wanted; i++) {
      var sp = template;

      if (i > 0) {
        sp = template.cloneNode(true);
        sp.id = "besties-" + (i + 1);
        sp.setAttribute("data-hide-toc", "");   // one contents line for the chapter
        sp.removeAttribute("data-blurb");
        sp.removeAttribute("data-ch");
        previous.parentNode.insertBefore(sp, previous.nextSibling);
      }

      all(".leaf", sp).forEach(function (leaf, side) {
        leaf.setAttribute("data-bestie", i * 2 + side);
      });

      previous = sp;
    }

    spreads = all(".spread");
  }

  render.bestieSlot = function (host) {
    var list = S.besties || [];
    var leaf = host.closest(".leaf");
    var index = parseInt(leaf && leaf.getAttribute("data-bestie"), 10);
    var kicker = leaf && el(".kicker", leaf);

    /* The page past the last friend closes the chapter. Not a list of names —
       every one of them already has a page — but the terms they all signed. */
    if (index === list.length) {
      var pact = S.pact || {};
      if (kicker) kicker.textContent = pact.kicker || "Filed";
      host.className = "reveal";
      host.innerHTML =
        '<h2 class="hed hed--sm">' + esc(pact.title || "The Pact") + "</h2>" +
        (pact.dek ? '<p class="dek">' + esc(pact.dek) + "</p>" : "") +

        (pact.photo
          ? '<figure class="pact__photo">' +
            plate(pact.photo, pact.photo, "") +
            (pact.photoCaption
              ? "<figcaption>" + esc(pact.photoCaption) + "</figcaption>" : "") +
            "</figure>"
          : "") +

        '<ol class="pact">' +
        (pact.clauses || []).map(function (c) {
          return "<li>" + esc(c) + "</li>";
        }).join("") +
        "</ol>" +

        '<p class="pact__sign">' + esc(pact.signature || "") + "</p>" +
        '<p class="pact__seal">' + esc(pact.seal || "") + "</p>";
      return;
    }

    if (!list[index]) { if (kicker) kicker.remove(); host.remove(); return; }

    if (kicker) {
      kicker.textContent = index === 0
        ? "Chapter 03 \u00b7 Besties Confidential"
        : "Entry " + pad(index + 1) + " \u00b7 Confidential";
    }

    host.className = "reveal";
    host.innerHTML = bestieCard(list[index], index, false);
    wireLetters(host, list);

    /* the last page of the chapter is where it can be made longer */
    if (index === list.length - 1) {
      var add = document.createElement("button");
      add.className = "btn btn--quiet addfriend";
      add.type = "button";
      add.textContent = "+ Add a friend";
      add.addEventListener("click", openFriendForm);
      var body = el(".bestie__body", host);
      if (body) body.appendChild(add);
    }
  };

  function wireLetters(host, list) {
    host.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-letter]");
      if (!btn) return;
      var b = list[+btn.getAttribute("data-letter")];
      openLetter(b.name, fill(b.letter || ""), b.full || "");
    });
  }

  /* The Archive is as long as the album: the spread is a template the
     magazine copies as many times as the photographs need. Pages come in
     facing pairs, so the count is rounded up to an even number and the
     photographs shared out evenly — no page left holding three while its
     neighbour holds six. */
  function galleryPages(n) {
    if (!n) return [];

    var pages = Math.max(2, Math.ceil(n / 6));
    if (pages % 2) pages++;

    var sizes = [];
    var base = Math.floor(n / pages);
    var extra = n % pages;
    for (var i = 0; i < pages; i++) sizes.push(base + (i < extra ? 1 : 0));
    return sizes;
  }

  function buildGallery() {
    var list = (S.gallery || {}).photos || [];
    var template = document.getElementById("gallery");
    if (!template) return;

    if (!list.length) { template.remove(); spreads = all(".spread"); return; }

    var sizes = galleryPages(list.length);
    var wanted = sizes.length / 2;
    var previous = template;
    var lastLeaf = null;
    var from = 0;

    for (var i = 0; i < wanted; i++) {
      var sp = template;

      if (i > 0) {
        sp = template.cloneNode(true);
        sp.id = "gallery-" + (i + 1);
        sp.setAttribute("data-hide-toc", "");   // one contents line for the chapter
        sp.removeAttribute("data-blurb");
        sp.removeAttribute("data-ch");
        all("[data-gallery-head]", sp).forEach(function (n) { n.remove(); });
        previous.parentNode.insertBefore(sp, previous.nextSibling);
      }

      all(".leaf", sp).forEach(function (leaf, side) {
        var host = el("[data-render='gallery']", leaf);
        var count = sizes[i * 2 + side] || 0;
        if (!host) return;

        if (!count) { host.remove(); return; }

        host.setAttribute("data-from", from);
        host.setAttribute("data-to", from + count);
        from += count;
        lastLeaf = leaf;
      });

      previous = sp;
    }

    /* the closing line belongs at the end of the chapter, not on every page */
    all("[data-gallery-foot]").forEach(function (n) {
      if (!lastLeaf || !lastLeaf.contains(n)) n.remove();
    });

    spreads = all(".spread");
  }

  /* GALLERY ------------------------------------------------------------- */
  render.gallery = function (host) {
    var g = S.gallery || {};
    var list = g.photos || [];
    var span = slice(list, host);

    host.innerHTML = span
      .map(function (entry, k) {
        var ph = entry.item;
        return (
          '<figure class="shot" style="--tilt:' + TILTS[entry.i % TILTS.length] + 'deg">' +
          plate(ph.src, ph.src, "polaroid__img--tall") +
          (ph.caption ? "<figcaption>" + esc(ph.caption) + "</figcaption>" : "") +
          "</figure>"
        );
      })
      .join("");

    shapePhotos(host);
  };

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
    /* Letters are written where **stars** mean emphasis, so honour them here
       rather than printing the stars. Everything is escaped first; the only
       markup that gets through is the emphasis itself. */
    el(".letter__body", modal).innerHTML =
      esc(body).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
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

  /* ---------- stickers you place yourself ----------

     In Photos mode a sticker can be dropped onto any page and dragged where
     you want it. Position, size and tilt are held as shares of the page, so a
     sticker stays where it was put whatever size the window is. Kept in this
     browser, like a chosen photograph. */

  var STICKER_STORE = "raveen:stickers";

  function myStickers() {
    try { return JSON.parse(localStorage.getItem(STICKER_STORE) || "[]"); }
    catch (e) { return []; }
  }

  function saveStickers(list) {
    try { localStorage.setItem(STICKER_STORE, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  function stickerNode(st, i) {
    var img = document.createElement("img");
    /* sticker--float is what makes it positioned; without it the sticker sits
       in the flow at the foot of the page and cannot be picked up */
    img.className = "sticker--float sticker-img sticker-mine";
    img.src = st.src;
    img.alt = "";
    img.setAttribute("data-mine", i);
    img.style.left = st.x + "%";
    img.style.top = st.y + "%";
    img.style.width = st.w + "%";
    img.style.transform = "rotate(" + (st.tilt || 0) + "deg)";
    return img;
  }

  function drawMyStickers() {
    all(".sticker-mine").forEach(function (n) { n.remove(); });

    myStickers().forEach(function (st, i) {
      var sp = document.getElementById(st.on);
      if (!sp) return;
      var leaves = all(".leaf", sp);
      var leaf = st.side === "right" ? leaves[1] : leaves[0];
      var page = leaf && el(".page", leaf);
      if (!page) return;
      page.appendChild(stickerNode(st, i));
    });
  }

  /* Which page is under the pointer, and where on it, as shares of the page */
  function pageUnder(x, y) {
    var found = null;
    all(".spread.is-current .page").forEach(function (page) {
      var r = page.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        var leaf = page.closest(".leaf");
        var sp = page.closest(".spread");
        found = {
          inner: page,
          on: sp.id,
          side: all(".leaf", sp).indexOf(leaf) === 1 ? "right" : "left",
          x: ((x - r.left) / r.width) * 100,
          y: ((y - r.top) / r.height) * 100
        };
      }
    });
    return found;
  }

  function stickerTools(say) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);

    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      if (!file) return;

      shrink(file, function (url) {
        if (!url) { say("That file could not be read."); return; }

        var sp = spreads[index];
        var list = myStickers();
        list.push({
          src: url, on: sp.id || "", side: "left",
          x: 38, y: 40, w: 18, tilt: -6
        });

        if (!saveStickers(list)) {
          say("This browser will not hold another sticker. Remove one first.");
          return;
        }

        drawMyStickers();
        say("Drag it where you want it. Wheel over it to resize, shift+wheel to tilt, double-click to remove.");
      });
    });

    /* dragging, on the sticker itself */
    var dragging = null;

    document.addEventListener("pointerdown", function (e) {
      if (!document.body.classList.contains("is-picking")) return;
      var st = e.target.closest(".sticker-mine");
      if (!st) return;

      e.preventDefault();
      e.stopPropagation();
      dragging = st;
      st.setPointerCapture(e.pointerId);
      st.classList.add("is-held");
    }, true);

    document.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var spot = pageUnder(e.clientX, e.clientY);
      if (!spot) return;

      if (spot.inner !== dragging.parentNode) spot.inner.appendChild(dragging);
      dragging.style.left = spot.x + "%";
      dragging.style.top = spot.y + "%";
      dragging.__spot = spot;
    });

    document.addEventListener("pointerup", function () {
      if (!dragging) return;

      var i = +dragging.getAttribute("data-mine");
      var spot = dragging.__spot;
      var list = myStickers();

      if (list[i] && spot) {
        list[i].on = spot.on;
        list[i].side = spot.side;
        list[i].x = Math.round(spot.x * 10) / 10;
        list[i].y = Math.round(spot.y * 10) / 10;
        saveStickers(list);
      }

      dragging.classList.remove("is-held");
      dragging = null;
    });

    /* resize and tilt on the wheel, remove on a double-click */
    document.addEventListener("wheel", function (e) {
      if (!document.body.classList.contains("is-picking")) return;
      var st = e.target.closest(".sticker-mine");
      if (!st) return;

      e.preventDefault();
      var i = +st.getAttribute("data-mine");
      var list = myStickers();
      if (!list[i]) return;

      if (e.shiftKey) {
        list[i].tilt = (list[i].tilt || 0) + (e.deltaY > 0 ? 3 : -3);
        st.style.transform = "rotate(" + list[i].tilt + "deg)";
      } else {
        list[i].w = Math.min(70, Math.max(4, (list[i].w || 18) + (e.deltaY > 0 ? -1.5 : 1.5)));
        st.style.width = list[i].w + "%";
      }
      saveStickers(list);
    }, { passive: false });

    document.addEventListener("dblclick", function (e) {
      if (!document.body.classList.contains("is-picking")) return;
      var st = e.target.closest(".sticker-mine");
      if (!st) return;

      e.preventDefault();
      var list = myStickers();
      list.splice(+st.getAttribute("data-mine"), 1);
      saveStickers(list);
      drawMyStickers();
      say("Sticker removed.");
    }, true);

    return input;
  }

  /* ---------- adding a friend to the chapter ----------

     The chapter is as long as the list, so a friend added here becomes a page
     like any other. Kept in this browser, the same way a chosen photograph is:
     enough for her to add whoever she likes to her own copy. The form hands
     back the lines for config.js so an addition can be made permanent. */

  var FRIENDS_STORE = "raveen:friends";

  function addedFriends() {
    try { return JSON.parse(localStorage.getItem(FRIENDS_STORE) || "[]"); }
    catch (e) { return []; }
  }

  function saveFriends(list) {
    try { localStorage.setItem(FRIENDS_STORE, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  }

  /* config.js lines for everyone added here, ready to paste in */
  function friendsAsConfig(list) {
    return list.map(function (f) {
      function q(v) { return JSON.stringify(v || ""); }
      return "    {\n" +
        "      name: " + q(f.name) + ",\n" +
        "      full: " + q(f.full) + ",\n" +
        "      photo: " + q(f.photo) + ",\n" +
        "      caption: " + q(f.caption) + ",\n" +
        "      quote: " + q(f.quote) + ",\n" +
        "      letter: " + q(f.letter) + "\n" +
        "    }";
    }).join(",\n");
  }

  var friendForm = null;

  function openFriendForm() {
    if (!friendForm) {
      friendForm = document.createElement("div");
      friendForm.className = "modal";
      friendForm.innerHTML =
        '<article class="letter form" role="dialog" aria-modal="true">' +
        '<button class="letter__close" type="button" aria-label="Close">&times;</button>' +
        '<p class="kicker">Chapter 03 · Best Friends Confidential</p>' +
        '<h2 class="hed hed--sm">Add a friend</h2>' +
        '<p class="dek">She gets a page of her own, the same as everyone else.</p>' +

        '<label>Name<input type="text" data-f="name" placeholder="What you call her"></label>' +
        '<label>Full name<input type="text" data-f="full" placeholder="Shown on the little badge"></label>' +
        '<label>Her line<input type="text" data-f="quote" placeholder="Something she always says"></label>' +
        '<label>Photo caption<input type="text" data-f="caption" placeholder="A line under the photograph"></label>' +
        '<label>The letter<textarea data-f="letter" rows="7" placeholder="Blank lines separate paragraphs."></textarea></label>' +

        '<p class="form__note"></p>' +
        '<p class="form__row">' +
        '<button class="btn" type="button" data-save>Add her page</button>' +
        '<button class="btn btn--quiet" type="button" data-export hidden>Copy for config.js</button>' +
        "</p>" +
        '<div data-added></div>' +
        "</article>";
      document.body.appendChild(friendForm);

      friendForm.addEventListener("click", function (e) {
        if (e.target === friendForm || e.target.classList.contains("letter__close")) {
          friendForm.hidden = true;
        }
      });

      el("[data-save]", friendForm).addEventListener("click", function () {
        var get = function (k) {
          var f = el('[data-f="' + k + '"]', friendForm);
          return f ? f.value.trim() : "";
        };
        var note = el(".form__note", friendForm);

        if (!get("name")) { note.textContent = "She needs a name at least."; return; }

        var list = addedFriends();
        list.push({
          name: get("name"),
          full: get("full"),
          quote: get("quote"),
          caption: get("caption"),
          letter: get("letter"),
          photo: "assets/img/friend-" + ((S.besties || []).length + list.length + 1) + ".jpg"
        });

        if (!saveFriends(list)) {
          note.textContent = "This browser would not store her. Try removing a photograph first.";
          return;
        }

        note.textContent = "Added. Reopening the magazine with her page in it…";
        setTimeout(function () { location.reload(); }, 700);
      });

      el("[data-export]", friendForm).addEventListener("click", function () {
        var text = friendsAsConfig(addedFriends());
        var note = el(".form__note", friendForm);
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(
            function () { note.textContent = "Copied. Paste it into the besties list in config.js."; },
            function () { note.textContent = text; }
          );
        } else {
          note.textContent = text;
        }
      });
    }

    /* everyone added here, with a way to take one back out */
    var added = addedFriends();
    var box = el("[data-added]", friendForm);
    box.innerHTML = added.length
      ? '<p class="form__label">Added on this computer</p>' +
        '<ul class="form__list">' + added.map(function (f, i) {
          return "<li>" + esc(f.name) +
                 '<button type="button" data-drop="' + i + '" aria-label="Remove">&times;</button></li>';
        }).join("") + "</ul>"
      : "";

    el("[data-export]", friendForm).hidden = !added.length;

    all("[data-drop]", box).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var list = addedFriends();
        list.splice(+btn.getAttribute("data-drop"), 1);
        saveFriends(list);
        location.reload();
      });
    });

    el(".form__note", friendForm).textContent =
      "Saved in this browser, so she stays on this computer. Use Copy for config.js to keep her for good.";
    friendForm.hidden = false;
    var first = el("input", friendForm);
    if (first) first.focus();
  }

  /* ---------- putting a photograph in from this computer ----------

     Every photograph has to reach the magazine as a file in assets/img, and
     getting it there — finding it, copying it, renaming it — is the part that
     goes wrong. So the page can take one directly: turn on Photos, click the
     picture you want to replace, choose the file, and it is in.

     What you pick is scaled down and kept in this browser, so it survives a
     refresh on this computer. That is enough to see it and check the crop —
     but only this computer has it. For the magazine to carry the photograph
     to anyone else, the file still has to be committed, so the panel hands
     back a correctly named copy to drop into assets/img. */

  var PHOTO_STORE = "raveen:photo:";
  var MAX_EDGE = 1600;

  function savedPhoto(src) {
    try { return localStorage.getItem(PHOTO_STORE + src); } catch (e) { return null; }
  }

  function applySavedPhotos(root) {
    all("img[data-hint]", root || document).forEach(function (img) {
      var key = img.getAttribute("data-hint");
      var saved = savedPhoto(key);
      if (saved) img.src = saved;
    });
  }

  /* Scaled down before it is stored: a phone photograph as a data URL is
     several megabytes, and the browser's store holds about five in total. */
  function shrink(file, done) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        done(c.toDataURL("image/jpeg", 0.86));
      };
      img.onerror = function () { done(null); };
      img.src = reader.result;
    };
    reader.onerror = function () { done(null); };
    reader.readAsDataURL(file);
  }

  function photoPicker() {
    var btn = el("[data-photobtn]");
    if (!btn) return;

    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.position = "fixed";      /* off-screen rather than display:none,
                                            which can stop the picker opening */
    input.style.left = "-9999px";
    document.body.appendChild(input);

    var note = document.createElement("p");
    note.className = "photonote";
    note.hidden = true;
    document.body.appendChild(note);

    var target = null;

    function say(text) {
      note.textContent = text;
      note.hidden = false;
    }

    var stickerInput = stickerTools(say);

    var addSticker = document.createElement("button");
    addSticker.className = "photobtn stickerbtn";
    addSticker.type = "button";
    addSticker.textContent = "+ Sticker";
    addSticker.hidden = true;
    addSticker.addEventListener("click", function () {
      stickerInput.value = "";
      stickerInput.click();
    });
    btn.parentNode.insertBefore(addSticker, btn.nextSibling);

    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("is-picking");
      btn.textContent = on ? "Done" : "Photos";
      addSticker.hidden = !on;
      if (on) say("Click a photograph to replace it, or add a sticker and drag it where you like.");
      else note.hidden = true;
    });

    document.addEventListener("click", function (e) {
      if (!document.body.classList.contains("is-picking")) return;

      /* The whole frame is the target, not just the picture: a cover has its
         name plate laid over the photograph, and clicking that is clicking
         the photograph as far as anyone is concerned. */
      var spot = e.target.closest(".polaroid__img, .slot");
      if (!spot) {
        var frame = e.target.closest(".polaroid, .shot, .cover__photo, .letter-card");
        if (frame) spot = el(".polaroid__img, .slot", frame);
      }
      if (!spot) return;

      e.preventDefault();
      e.stopPropagation();
      target = spot;
      input.value = "";
      input.click();
    }, true);

    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      if (!file || !target) return;

      var slot = target.getAttribute("data-hint") ||
                 (el("span", target) && el("span", target).textContent) || "";
      slot = slot.trim();

      say("Reading " + file.name + "…");

      shrink(file, function (url) {
        if (!url) { say("That file could not be read. If it is a .HEIC from an iPhone, save it as JPG first."); return; }

        /* an empty slot is a div; a photograph is an img — swap in an img */
        var img = target;
        if (target.tagName !== "IMG") {
          img = document.createElement("img");
          img.className = target.className.replace(" slot", "");
          img.setAttribute("data-hint", slot);
          target.parentNode.replaceChild(img, target);
        }

        img.src = url;
        img.setAttribute("data-hint", slot);

        try {
          localStorage.setItem(PHOTO_STORE + slot, url);
        } catch (err) {
          say("Shown, but too large for this browser to remember. It will go when you refresh.");
        }

        shapePhotos(img.closest(".spread") || document);
        refit();

        var name = slot.split("/").pop() || "photo.jpg";
        note.innerHTML =
          "In. It is kept on this computer only — to put it in the magazine " +
          "for good, " +
          '<a href="' + url + '" download="' + esc(name) + '">save ' + esc(name) + "</a>" +
          " and drop it into assets/img, then commit.";
        note.hidden = false;
      });
    });
  }

  /* ---------- a photograph keeps its own shape ---------- */

  /* These arrive from phones: some held upright, some turned sideways. A
     single fixed frame has to cut one or the other, and on a group photograph
     what it cuts is a person. Each dossier photograph takes its own
     proportions instead, within limits the page can hold. */
  function shapePhoto(img) {
    if (!img.naturalWidth || !img.naturalHeight) return;

    var ratio = img.naturalWidth / img.naturalHeight;
    img.style.aspectRatio = Math.min(1.4, Math.max(0.62, ratio));

    /* A landscape photograph is short: standing it beside the writing leaves
       half the page empty. It takes the full measure instead, with the
       writing underneath — the same page, laid out the other way round. */
    var card = img.closest(".bestie");
    if (card) card.classList.toggle("bestie--wide", ratio > 1.1);

    var shot = img.closest(".shot");
    if (shot) shot.classList.toggle("shot--wide", ratio > 1.1);
  }

  function shapePhotos(root) {
    all(".bestie .polaroid__img, .shot .polaroid__img", root || document).forEach(function (img) {
      if (!img.tagName || img.tagName !== "IMG") return;
      if (img.complete) shapePhoto(img);
      else img.addEventListener("load", function () { shapePhoto(img); }, { once: true });
    });
  }

  /* ---------- stickers ----------

     A sticker is pasted onto a page rather than laid out with it: it goes
     inside the page body, so it is carried by the same scaling as everything
     else, and it is pinned to a corner so it never pushes the writing about.
     A sticker whose file is missing removes itself rather than leaving a
     labelled hole where a decoration should be. */

  var CORNERS = {
    "top-left":     { top: "4%",  left: "3%" },
    "top-right":    { top: "4%",  right: "3%" },
    "bottom-left":  { bottom: "4%", left: "3%" },
    "bottom-right": { bottom: "4%", right: "3%" },
    "mid-left":     { top: "44%", left: "2%" },
    "mid-right":    { top: "44%", right: "2%" }
  };

  function placeStickers() {
    (S.stickers || []).forEach(function (st) {
      var sp = document.getElementById(st.on);
      if (!sp) return;

      var leaves = all(".leaf", sp);
      var leaf = st.side === "right" ? leaves[1] : leaves[0];
      var page = leaf && el(".page", leaf);
      if (!page) return;

      var img = document.createElement("img");
      img.className = "sticker--float sticker-img";
      img.src = st.src;
      img.alt = "";
      img.addEventListener("error", function () { img.remove(); });

      var spot = CORNERS[st.at] || CORNERS["bottom-right"];
      Object.keys(spot).forEach(function (k) { img.style[k] = spot[k]; });

      img.style.width = (st.size || 0.18) * 100 + "%";
      img.style.transform = "rotate(" + (st.tilt == null ? -6 : st.tilt) + "deg)";

      page.appendChild(img);
    });
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

  function guardOnArrival(sp) { guardPhotos(sp); drawMyStickers(); }

  /* Resolve once the typefaces have arrived AND every photograph has either
     loaded or failed. Bodoni is a good deal wider than the fallback serif, so
     a page measured before the webfonts land is measured at the wrong size. */
  function whenReady(done) {
    var fonts = (document.fonts && document.fonts.ready) || null;
    if (!fonts) return whenImagesSettle(done);

    var moved = false;
    function go() { if (moved) return; moved = true; whenImagesSettle(done); }

    fonts.then(go, go);
    setTimeout(go, 3000);          // never wait on a font server forever
  }

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

  /* The window can change shape after the book is built — a resize, a rotate,
     a zoom. Re-fitting is safe to repeat: each spread is measured again from
     full size, so it grows back as well as shrinks. */
  function refit() {
    all(".spread").forEach(function (sp) {
      var pages = all(".page", sp);
      if (pages.length) fitSpread(pages);
    });
  }

  function watchWindow() {
    var pending;
    window.addEventListener("resize", function () {
      clearTimeout(pending);
      pending = setTimeout(refit, 150);
    });
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

  /* A spread every renderer declined to fill is not a page of the magazine.
     Look at the page body, not the leaf: by now every leaf carries a running
     head and a folio, so a leaf is never literally empty. */
  function dropEmptySpreads() {
    all(".spread[data-optional]").forEach(function (sp) {
      var used = all(".leaf", sp).some(function (leaf) {
        var body = el(".page__inner", leaf) || leaf;
        return body.children.length > 0;
      });
      if (!used) sp.remove();
    });
    spreads = all(".spread");
  }

  /* ---------- boot ---------- */

  function boot() {
    spreads = all(".spread");

    /* anyone added on this computer joins the list before the chapter is
       built, so she gets a page like everyone else */
    var extra = addedFriends();
    if (extra.length) S.besties = (S.besties || []).concat(extra);

    buildGallery();
    buildBesties();
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

    // Reflow only once the typefaces and photographs have resolved — a page
    // measured while either is still loading reports the wrong height.
    whenReady(function () {
      applySavedPhotos();
      guardPhotos();
      shapePhotos();
      paginate();
      placeStickers();
      drawMyStickers();
      refit();
      numberPages();
      syncChrome();
      watchWindow();
      photoPicker();
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
