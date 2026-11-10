
(function () {
  'use strict';

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCE = mqReduce.matches;

  var html = document.documentElement;
  html.classList.add('js');

  var HAS_GSAP = typeof window.gsap !== 'undefined';
  var HAS_ST = HAS_GSAP && typeof window.ScrollTrigger !== 'undefined';

  if (!HAS_GSAP) {

    html.classList.remove('js');
    document.body.classList.remove('is-loading');
    var pl = document.getElementById('preloader');
    if (pl) pl.style.display = 'none';
    initCursorPlain();
    return;
  }

  if (HAS_ST) gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  var preloader = document.getElementById('preloader');

  function runPreloader(onDone) {
    if (REDUCE) { onDone(); return; }

    var progress = preloader.querySelector('.preloader__progress');
    var letters = preloader.querySelectorAll('.preloader__word span');
    var tag = preloader.querySelector('.preloader__tag');
    var core = preloader.querySelector('.preloader__core');
    var panels = preloader.querySelectorAll('.preloader__panel');
    var LEN = 553;

    var tl = gsap.timeline({ onComplete: onDone });

    tl.to(progress, {
      strokeDashoffset: LEN * 0.3, duration: 0.32, ease: 'power1.inOut'
    })
      .to(progress, {
        strokeDashoffset: 0, duration: 0.44, ease: 'power2.inOut'
    }, '+=0.04')

      .to(progress, { opacity: 0, scale: 0.85, duration: 0.26, ease: 'power2.in' }, '+=0.08')
      .fromTo(core.querySelector('.preloader__glow'),
        { scale: 0.4, opacity: 0 },
        { scale: 1.25, opacity: 1, duration: 0.4 }, '<')
      .fromTo(letters,
        { opacity: 0, yPercent: 28, scale: 0.9 },
        {
          opacity: 1, yPercent: 0, scale: 1,
          duration: 0.5, stagger: 0.09, ease: 'back.out(1.8)'
        }, '-=0.26')
      .fromTo(letters,
        { filter: 'blur(12px)' },
        { filter: 'blur(0px)', duration: 0.5 }, '<')

      .to('.preloader__glow', { scale: 1.7, opacity: 0.55, duration: 0.3, yoyo: true, repeat: 1 }, '+=0.05')
      .to(tag, { opacity: 1, duration: 0.27 }, '-=0.2')

      .to(panels[0], { yPercent: -101, duration: 0.65, ease: 'power4.inOut' }, '+=0.12')
      .to(panels[1], { yPercent: 101, duration: 0.65, ease: 'power4.inOut' }, '<')
      .to(preloader, { opacity: 0, duration: 0.25 }, '-=0.22')
      .set(preloader, { display: 'none' });

    return tl;
  }

  var q  = function (s, c) { return (c || document).querySelector(s); };
  var qa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function buildParticles() {
    if (REDUCE) return;
    var box = document.getElementById('particles');
    if (!box) return;
    var frag = document.createDocumentFragment();
    var count = window.innerWidth < 760 ? 14 : 30;

    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      var size = 2 + Math.random() * 6;
      p.className = 'particle' + (Math.random() > 0.68 ? ' particle--v' : '');
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
      p.style.insetInlineStart = (Math.random() * 100).toFixed(2) + '%';
      p.style.top = (Math.random() * 100).toFixed(2) + '%';
      frag.appendChild(p);

      gsap.to(p, {
        x: (Math.random() - 0.5) * 140,
        y: -(60 + Math.random() * 180),
        duration: 9 + Math.random() * 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 6
      });
      gsap.to(p, {
        opacity: 0.05,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3
      });
    }
    box.appendChild(frag);
  }

  function initCursor() {
    if (REDUCE) return;

    if (window.matchMedia('(hover: none)').matches) {
      document.body.classList.add('is-touch');
      return;
    }

    var cur = document.getElementById('cursor');
    if (!cur) return;
    var ring = q('.cursor__ring', cur);
    var dot = q('.cursor__dot', cur);
    var shown = false;

    var ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    var ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    var dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    var dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

    window.addEventListener('mousemove', function (e) {
      if (!shown) { shown = true; gsap.to(cur, { opacity: 1, duration: 0.4 }); }
      ringX(e.clientX); ringY(e.clientY);
      dotX(e.clientX); dotY(e.clientY);
    }, { passive: true });

    window.addEventListener('mousedown', function () { cur.classList.add('is-down'); });
    window.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { gsap.to(cur, { opacity: 0, duration: 0.3 }); shown = false; });
    document.addEventListener('mouseenter', function () { gsap.to(cur, { opacity: 1, duration: 0.3 }); shown = true; });

    qa('a, button, .card, .work, .nav__link').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cur.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cur.classList.remove('is-hover'); });
    });
  }

  function initCursorPlain() {
    var cur = document.getElementById('cursor');
    if (!cur || window.matchMedia('(hover: none)').matches) return;
    window.addEventListener('mousemove', function (e) {
      cur.style.opacity = 1;
      cur.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }, { passive: true });
  }

  function heroIntro() {
    var letters = qa('.hero__letter');
    var box = q('.hero__title');
    var tagEl = q('.hero__eyebrow');
    var titleEl = q('.hero__tagline');
    var actions = qa('.hero__actions .btn');
    var scroll = q('.hero__scroll');
    var shine = q('.hero__shine');

    var tl = gsap.timeline({ delay: 0.1 });

    tl.fromTo(box, { filter: 'blur(16px)' }, { filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' })

      .fromTo(letters,
        { yPercent: 118, opacity: 0, scale: 0.86 },
        {
          yPercent: 0, opacity: 1, scale: 1,
          duration: 0.95, stagger: 0.12, ease: 'power3.out'
        }, '-=0.5')

      .fromTo(box,
        { filter: 'blur(0px) drop-shadow(0 0 16px rgba(245,181,68,.30))' },
        {
          filter: 'blur(0px) drop-shadow(0 0 58px rgba(255,107,61,.85))',
          duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut'
        }, '+=0.1')

      .fromTo(tagEl, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=1.2')
      .fromTo(titleEl, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
      .fromTo(actions, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.55')
      .fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');

    if (shine && !REDUCE) {
      gsap.fromTo(shine,
        { xPercent: -40, opacity: 0 },
        {
          xPercent: 40, opacity: 1, duration: 1,
          repeat: -1, repeatDelay: 4.2, ease: 'power2.inOut'
        });
    }
    return tl;
  }

  function backgroundMotion() {
    if (REDUCE) return;

    var page = { trigger: document.body, start: 'top top', end: 'bottom bottom' };

    var blobs = [
      { el: q('.blob--gold'),   y: 260,  s: 1.25 },
      { el: q('.blob--fire'),   y: -320, s: 1.5 },
      { el: q('.blob--violet'), y: 340,  s: 1.35 },
      { el: q('.blob--gold-2'), y: -240, s: 1.15 }
    ];
    blobs.forEach(function (b, i) {
      if (!b.el) return;
      gsap.to(b.el, {
        y: b.y, scale: b.s, ease: 'none',
        scrollTrigger: { trigger: page.trigger, start: page.start, end: page.end, scrub: 1.2 }
      });

      gsap.to(b.el, {
        x: (i % 2 ? 90 : -90), yoyo: true, repeat: -1,
        duration: 16 + i * 4, ease: 'sine.inOut'
      });
    });

    qa('.geo').forEach(function (g, i) {
      gsap.to(g, {
        rotation: i % 2 ? -360 : 360,
        ease: 'none',
        scrollTrigger: { trigger: page.trigger, start: page.start, end: page.end, scrub: 2 }
      });
      gsap.to(g, {
        opacity: 0.22,
        yoyo: true, repeat: -1, duration: 7 + i * 2,
        ease: 'sine.inOut'
      });
    });
  }

  function revealOnScroll() {
    qa('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el,
        { y: 46, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.95,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
    });
  }

  function aboutMotion() {

    qa('[data-words]').forEach(function (p) {
      var raw = p.textContent.trim().split(/\s+/);
      p.innerHTML = raw.map(function (w) {
        return '<span class="word"><span class="word__i">' + w + '</span></span>';
      }).join(' ');

      var items = qa('.word__i', p);

      gsap.set(items, { yPercent: 105, opacity: 0 });

      if (REDUCE) {
        gsap.set(items, { yPercent: 0, opacity: 1, clearProps: 'transform' });
        return;
      }

      gsap.to(items, {
        yPercent: 0, opacity: 1,
        duration: 0.85, ease: 'power3.out', stagger: 0.045,
        scrollTrigger: { trigger: p, start: 'top 82%', once: true }
      });
    });

    qa('[data-count]').forEach(function (num) {
      var end = parseInt(num.getAttribute('data-count'), 10) || 0;
      var obj = { v: 0 };
      num.textContent = '0';
      gsap.to(obj, {
        v: end, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: num, start: 'top 90%', once: true },
        onUpdate: function () { num.textContent = Math.round(obj.v); }
      });
    });
  }

  function servicesMotion() {
    var cards = qa('.card');

    gsap.fromTo(cards,
      { y: 70, opacity: 0, rotateX: -12 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.cards', start: 'top 82%', once: true }
      });

    if (REDUCE || window.matchMedia('(hover: none)').matches) return;

    cards.forEach(function (card) {
      var glow = q('.card__glow', card);
      var rx = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power3.out' });
      var ry = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power3.out' });
      var ty = gsap.quickTo(card, 'y', { duration: 0.55, ease: 'power3.out' });

      function onMove(e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;

        ry((px - 0.5) * 18);
        rx(-(py - 0.5) * 14);

        if (glow) {
          glow.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          glow.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        }
      }

      card.addEventListener('mouseenter', function () { ty(-12); });
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', function () {
        ry(0); rx(0); ty(0);
      });
    });
  }

  function worksMotion() {
    var items = qa('[data-work]');

    items.forEach(function (it, i) {
      var bg = q('.work__bg', it);
      var inner = q('.work__in', it);
      var shine = q('.work__shine', it);

      if (bg) {
        gsap.fromTo(bg,
          { scale: 0.78, opacity: 0.2 },
          {
            scale: 1, opacity: 1, ease: 'power2.out',
            scrollTrigger: { trigger: it, start: 'top 92%', end: 'top 48%', scrub: 0.9 }
          });
      }

      if (inner) {
        gsap.fromTo(inner,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: it, start: 'top 86%', once: true }
          });
      }

      if (inner && !REDUCE) {
        it.addEventListener('mouseenter', function () {
          gsap.to(inner, { y: -8, scale: 1.03, duration: 0.6, ease: 'power3.out' });
        });
        it.addEventListener('mouseleave', function () {
          gsap.to(inner, { y: 0, scale: 1, duration: 0.7, ease: 'power3.out' });
        });
      }

      it.addEventListener('mousemove', function (e) {
        if (!shine) return;
        var r = it.getBoundingClientRect();
        shine.style.setProperty('--wx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        shine.style.setProperty('--wy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      });
    });
  }

  function contactMotion() {

    gsap.fromTo(qa('.socials .social'),
      { y: 24, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.08,
        scrollTrigger: { trigger: '.socials', start: 'top 90%', once: true }
      });
  }

  function navBehaviour() {
    var nav = q('#nav');
    var burger = q('#burger');
    var links = q('.nav__links');

    if (HAS_ST) {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: function (self) {
          nav.classList.toggle('is-stuck', self.scroll() > 80);
        }
      });
    } else {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('is-stuck', window.scrollY > 80);
      }, { passive: true });
    }

    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = links.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      qa('.nav__link', links).forEach(function (a) {
        a.addEventListener('click', function () {
          links.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    qa('.nav__link').forEach(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var sec = q(id);
      if (!sec) return;

      if (HAS_ST) {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: function (self) { a.classList.toggle('is-active', self.isActive); }
        });
      } else {

        if (window.IntersectionObserver) {
          new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { a.classList.toggle('is-active', e.isIntersecting); });
          }, { threshold: 0.2 }).observe(sec);
        }
      }
    });
  }

  function finishTouches() {

    var y = q('#year');
    if (y) y.textContent = new Date().getFullYear();

    qa('[data-work]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); });
    });

    if (!HAS_ST) return;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  function heroParallax() {
    if (REDUCE || !HAS_ST) return;
    gsap.to('.hero__title, .hero__tagline, .hero__actions', {
      yPercent: -18, opacity: 0.15, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
    });
  }

  function afterIntro(tl, fn) {
    if (!tl || typeof tl.eventCallback !== 'function') { fn(); return; }

    tl.eventCallback('onComplete', fn);
  }

  function boot() {
    initCursor();
    buildParticles();

    if (REDUCE) {

      gsap.set('[data-reveal], .hero__letter', { opacity: 1, y: 0, clearProps: 'filter' });

      qa('[data-count]').forEach(function (n) {
        n.textContent = n.getAttribute('data-count');
      });
      document.body.classList.remove('is-loading');
      var pl = q('#preloader');
      if (pl) pl.remove();
      navBehaviour();
      finishTouches();
      return;
    }

    runPreloader(function () {
      document.body.classList.remove('is-loading');

      var intro = heroIntro();
      backgroundMotion();
      revealOnScroll();
      aboutMotion();
      servicesMotion();
      worksMotion();
      contactMotion();
      navBehaviour();
      finishTouches();

      afterIntro(intro, function () {
        heroParallax();
        if (HAS_ST) ScrollTrigger.refresh();
      });
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 0);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }

  var onChange = function () {
    REDUCE = mqReduce.matches;
    if (REDUCE) {
      gsap.set('[data-reveal], .hero__letter', { opacity: 1, y: 0 });
      if (HAS_ST) ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      gsap.globalTimeline.clear();
    }
  };
  if (mqReduce.addEventListener) mqReduce.addEventListener('change', onChange);
  else if (mqReduce.addListener) mqReduce.addListener(onChange);

})();
