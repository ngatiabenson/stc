(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- Scroll reveal --- */
    function initReveal() {
        var targets = document.querySelectorAll('.reveal, .reveal-stagger');
        if (!targets.length) return;

        if (prefersReducedMotion) {
            targets.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach(function (el) {
            observer.observe(el);
        });
    }

    /* --- Header glass on scroll --- */
    function initHeaderScroll() {
        var header = document.querySelector('.global-header');
        if (!header) return;

        function onScroll() {
            header.classList.toggle('is-scrolled', window.scrollY > 40);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --- Hero carousel (legacy slideshow — replaced by training collage on homepage) --- */
    function initHeroCarousel() {
        var hero = document.querySelector('.hero');
        if (!hero || hero.querySelector('.hero-collage')) return;

        var slides = hero.querySelectorAll('.hero-slide');
        var labels = hero.querySelectorAll('.hero-theme-label');
        if (slides.length < 2) return;

        var current = 0;
        var intervalMs = 7000;
        var timer = null;

        function goTo(index) {
            slides[current].classList.remove('is-active');
            if (labels[current]) labels[current].classList.remove('is-active');
            current = index;
            slides[current].classList.add('is-active');
            if (labels[current]) labels[current].classList.add('is-active');
        }

        function next() {
            goTo((current + 1) % slides.length);
        }

        function start() {
            if (prefersReducedMotion) return;
            stop();
            timer = setInterval(next, intervalMs);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        if (!prefersReducedMotion) {
            start();
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) stop();
                else start();
            });
        }
    }

    /* --- Hero parallax (legacy slideshow) --- */
    function initHeroParallax() {
        var hero = document.querySelector('.hero');
        if (!hero || hero.querySelector('.hero-collage') || prefersReducedMotion || window.innerWidth < 768) return;

        window.addEventListener(
            'scroll',
            function () {
                var y = Math.min(window.scrollY * 0.3, 60);
                hero.style.setProperty('--parallax-y', y + 'px');
            },
            { passive: true }
        );
    }

    function initHeroTrainingCollage() {
        if (typeof window.initHeroCollage === 'function') {
            window.initHeroCollage();
        }
    }

    /* --- Mobile navigation --- */
    function initMobileNav() {
        var toggle = document.querySelector('.nav-toggle');
        var drawer = document.querySelector('.nav-drawer');
        var overlay = document.querySelector('.nav-overlay');
        if (!toggle || !drawer) return;

        function closeNav() {
            toggle.setAttribute('aria-expanded', 'false');
            drawer.classList.remove('is-open');
            if (overlay) overlay.classList.remove('is-open');
            document.body.classList.remove('nav-open');
        }

        function openNav() {
            toggle.setAttribute('aria-expanded', 'true');
            drawer.classList.add('is-open');
            if (overlay) overlay.classList.add('is-open');
            document.body.classList.add('nav-open');
        }

        toggle.addEventListener('click', function () {
            if (drawer.classList.contains('is-open')) closeNav();
            else openNav();
        });

        if (overlay) overlay.addEventListener('click', closeNav);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });

        drawer.querySelectorAll('.nav-drawer-dropdown-toggle').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var expanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                var panel = btn.nextElementSibling;
                if (panel) panel.classList.toggle('is-open', !expanded);
            });
        });
    }

    /* --- Video play overlay --- */
    function initVideoOverlay() {
        var wrap = document.querySelector('.video-showcase-player');
        if (!wrap) return;

        var overlay = wrap.querySelector('.video-play-overlay');
        var video = wrap.querySelector('video');
        if (!overlay || !video) return;

        overlay.addEventListener('click', function () {
            overlay.classList.add('is-hidden');
            video.play();
        });

        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initReveal();
        initHeaderScroll();
        initHeroTrainingCollage();
        initHeroCarousel();
        initHeroParallax();
        initMobileNav();
        initVideoOverlay();
    });
})();
