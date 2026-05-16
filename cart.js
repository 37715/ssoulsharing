/* Shared basket — state in localStorage + a hard-cut popup panel.
   In harmony with the site: off-white bed, hairline rules, lowercase
   Akzidenz, concrete-square thumbnails, no smooth motion.
   Depends on catalog.js (CATALOG). Exposes window.Cart. */
(function () {
  "use strict";

  var KEY = "ssoulsharing_basket";
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  };
  var priceNum = function (p) {
    return parseFloat(String(p).replace(/[^0-9.]/g, "")) || 0;
  };

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function write(b) { localStorage.setItem(KEY, JSON.stringify(b)); }
  function count() {
    var b = read(), n = 0;
    for (var k in b) n += b[k];
    return n;
  }

  /* ── popup markup, injected once ── */
  function build() {
    if (document.getElementById("cart-panel")) return;
    var html =
      '<div class="cart-scrim" id="cart-scrim" hidden></div>' +
      '<aside class="cart-panel" id="cart-panel" role="dialog" ' +
        'aria-label="basket" aria-hidden="true" hidden>' +
        '<div class="cart-head">' +
          '<span class="cart-title">basket <span id="cart-ct">(0)</span></span>' +
          '<button class="cart-x" id="cart-x" aria-label="close">close ×</button>' +
        '</div>' +
        '<div class="cart-items" id="cart-items"></div>' +
        '<div class="cart-foot">' +
          '<div class="cart-sub"><span>subtotal</span>' +
            '<span id="cart-sub">€0</span></div>' +
          '<button class="cart-checkout" id="cart-checkout">' +
            '<span>checkout</span><span class="arw">▸</span></button>' +
        '</div>' +
      '</aside>';
    document.body.insertAdjacentHTML("beforeend", html);

    document.getElementById("cart-scrim").addEventListener("click", close);
    document.getElementById("cart-x").addEventListener("click", close);
    document.getElementById("cart-checkout").addEventListener("click", function () {
      if (count()) alert("checkout is not wired up in this prototype.");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.getElementById("cart-items").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-act]");
      if (!btn) return;
      var line = e.target.closest(".cart-line");
      var key = line && line.dataset.key;
      if (!key) return;
      var b = read();
      if (!(key in b)) return;
      var act = btn.dataset.act;
      if (act === "inc") b[key]++;
      else if (act === "dec") b[key] = Math.max(0, b[key] - 1);
      else if (act === "rm") b[key] = 0;
      if (b[key] <= 0) delete b[key];
      write(b);
      paint();
      renderItems();
    });
  }

  function renderItems() {
    var b = read();
    var wrap = document.getElementById("cart-items");
    var keys = Object.keys(b);
    if (!keys.length) {
      wrap.innerHTML =
        '<div class="cart-empty">your basket is empty.<br>' +
        '<a href="index.html">browse the catalogue</a></div>';
      return;
    }
    wrap.innerHTML = keys.map(function (key) {
      var parts = key.split("|"), id = parts[0], size = parts[1] || "—";
      var p = (typeof CATALOG !== "undefined" && CATALOG[id]) || null;
      var qty = b[key];
      var nm = p ? p.name : id;
      var img = p && p.images && p.images[0] ? p.images[0] : "";
      var pr = p ? p.price : "—";
      return (
        '<div class="cart-line" data-key="' + esc(key) + '">' +
          '<div class="cart-thumb">' +
            (img ? '<img src="' + esc(img) + '" alt="' + esc(nm) +
              '" loading="lazy" decoding="async" />' : "") +
          '</div>' +
          '<div class="cart-meta">' +
            '<div class="cart-nm">' + esc(nm) + '</div>' +
            '<div class="cart-sz">size · ' + esc(size) + '</div>' +
            '<div class="cart-qty">' +
              '<button data-act="dec" aria-label="decrease">–</button>' +
              '<span>' + qty + '</span>' +
              '<button data-act="inc" aria-label="increase">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-right">' +
            '<div class="cart-pr">' + esc(pr) + '</div>' +
            '<button class="cart-rm" data-act="rm" aria-label="remove">remove</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  function paint() {
    var n = count();
    var link = document.getElementById("cart-link");
    if (link) link.textContent = "Cart " + n;
    var ct = document.getElementById("cart-ct");
    if (ct) ct.textContent = "(" + n + ")";
    var sub = document.getElementById("cart-sub");
    if (sub) {
      var b = read(), t = 0;
      for (var k in b) {
        var p = (typeof CATALOG !== "undefined" && CATALOG[k.split("|")[0]]);
        if (p) t += priceNum(p.price) * b[k];
      }
      sub.textContent = "€" + t;
    }
  }

  function open() {
    build();
    renderItems();
    paint();
    document.getElementById("cart-scrim").hidden = false;
    var panel = document.getElementById("cart-panel");
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("cart-lock");
  }
  function close() {
    var panel = document.getElementById("cart-panel");
    if (!panel) return;
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    document.getElementById("cart-scrim").hidden = true;
    document.documentElement.classList.remove("cart-lock");
  }

  function add(id, size) {
    var b = read();
    var key = id + "|" + (size || "m");
    b[key] = (b[key] || 0) + 1;
    write(b);
    paint();
  }

  window.Cart = { add: add, open: open, close: close, count: count };

  document.addEventListener("DOMContentLoaded", function () {
    build();
    paint();
    var link = document.getElementById("cart-link");
    if (link) link.addEventListener("click", function (e) {
      e.preventDefault();
      open();
    });
  });
})();
