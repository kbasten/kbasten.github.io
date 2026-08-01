/* =========================================================================
   Kawthoolei Landmeters — interactie
   Vanilla JS, geen afhankelijkheden. De site werkt ook zonder dit bestand:
   alles hieronder is aanvulling, geen voorwaarde.
   ========================================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ jaartal */

  var jaar = $('#jaar');
  if (jaar) jaar.textContent = new Date().getFullYear();

  /* --------------------------------------------------------- mobiel menu */

  var toggle = $('#navToggle');
  var nav    = $('#hoofdnav');

  function sluitMenu() {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Na het kiezen van een menu-item het paneel dichtklappen.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) sluitMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) sluitMenu();
    });

    // Bij terugkeer naar desktop de inline-staat opruimen.
    window.matchMedia('(min-width: 941px)').addEventListener('change', sluitMenu);
  }

  /* ------------------------------------------------- header + zweefknop */

  var header = $('.site-header');
  var fab    = $('.call-fab');
  var hero   = $('.hero');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (fab && hero) fab.classList.toggle('is-visible', y > hero.offsetHeight * 0.75);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------ actief menu-item ---- */

  var secties  = $$('main section[id]');
  var navLinks = $$('.site-nav a[href^="#"]');

  if ('IntersectionObserver' in window && secties.length && navLinks.length) {
    var zichtbaar = new Set();

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) zichtbaar.add(entry.target.id);
        else zichtbaar.delete(entry.target.id);
      });

      // De bovenste zichtbare sectie wint.
      var actief = secties.filter(function (s) { return zichtbaar.has(s.id); })[0];
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', !!actief && link.getAttribute('href') === '#' + actief.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secties.forEach(function (s) { navObserver.observe(s); });
  }

  /* ----------------------------------------------------- scroll-reveal -- */

  var revealItems = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------- galerij --- */

  var gallery  = $('#gallery');
  var moreWrap = $('.gallery-more');
  var moreBtn  = $('#galleryMore');

  function checkGalleryOverflow() {
    if (!gallery || !moreWrap) return;
    if (gallery.classList.contains('is-expanded')) return;
    var items = gallery.children;
    var laatste = items[items.length - 1];
    // offsetParent is null zodra CSS het item op display:none zet.
    var verborgen = laatste && laatste.offsetParent === null;
    moreWrap.classList.toggle('is-visible', !!verborgen);
  }

  if (gallery && moreBtn) {
    moreBtn.addEventListener('click', function () {
      gallery.classList.add('is-expanded');
      moreWrap.classList.remove('is-visible');
      // Nieuw zichtbare foto's meteen laten meedoen met de animatie.
      $$('.reveal', gallery).forEach(function (el) { el.classList.add('is-in'); });
    });

    checkGalleryOverflow();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkGalleryOverflow, 150);
    });
  }

  /* --------------------------------------------------------- lightbox --- */

  var lb        = $('#lightbox');
  var lbImg     = $('#lbImg');
  var lbCaption = $('#lbCaption');
  var lbClose   = $('#lbClose');
  var lbPrev    = $('#lbPrev');
  var lbNext    = $('#lbNext');
  var shots     = $$('.shot');

  if (lb && lbImg && shots.length) {
    var index = 0;
    var laatsteFocus = null;

    function toon(i) {
      index = (i + shots.length) % shots.length;
      var knop = shots[index];
      var thumb = $('img', knop);

      lbImg.src = knop.dataset.full;
      lbImg.alt = thumb ? thumb.alt : '';
      lbCaption.textContent = knop.dataset.caption || '';

      // Buren vast inladen zodat doorbladeren niet hapert.
      [index - 1, index + 1].forEach(function (n) {
        var buur = shots[(n + shots.length) % shots.length];
        if (buur) { var pre = new Image(); pre.src = buur.dataset.full; }
      });
    }

    function open(i) {
      laatsteFocus = document.activeElement;
      toon(i);
      lb.hidden = false;
      document.body.classList.add('lb-locked');
      // Eerst renderen, dan pas de fade starten.
      requestAnimationFrame(function () { lb.classList.add('is-open'); });
      lbClose.focus();
    }

    function sluit() {
      lb.classList.remove('is-open');
      document.body.classList.remove('lb-locked');
      var klaar = function () { lb.hidden = true; lbImg.src = ''; };
      if (reduceMotion) klaar(); else setTimeout(klaar, 200);
      if (laatsteFocus) laatsteFocus.focus();
    }

    shots.forEach(function (knop, i) {
      knop.addEventListener('click', function () { open(i); });
    });

    lbClose.addEventListener('click', sluit);
    lbPrev.addEventListener('click', function () { toon(index - 1); });
    lbNext.addEventListener('click', function () { toon(index + 1); });

    // Klik naast de foto sluit; klik op de foto zelf niet.
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-figure')) sluit();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape')     { sluit(); }
      if (e.key === 'ArrowLeft')  { toon(index - 1); }
      if (e.key === 'ArrowRight') { toon(index + 1); }
      // Focus binnen de lightbox houden zolang die openstaat.
      if (e.key === 'Tab') {
        var focusbaar = [lbClose, lbPrev, lbNext];
        var pos = focusbaar.indexOf(document.activeElement);
        e.preventDefault();
        var volgende = e.shiftKey ? pos - 1 : pos + 1;
        focusbaar[(volgende + focusbaar.length) % focusbaar.length].focus();
      }
    });

    // Vegen op de telefoon.
    var startX = null;
    lb.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 55) toon(delta > 0 ? index - 1 : index + 1);
      startX = null;
    }, { passive: true });
  }
})();
