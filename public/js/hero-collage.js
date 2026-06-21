/**
 * STC Hero Training Showcase — Three-Panel Engine
 * Reads window.STC_HERO_COLLAGE from hero-collage-data.js
 */
(function () {
    'use strict';

    var LAYERS = ['bg', 'mg', 'fg'];
    var REVEAL_DIRECTIONS = ['reveal-ltr', 'reveal-rtl', 'reveal-ttb'];
    var PARALLAX_FACTORS = { bg: 0.1, mg: 0.22, fg: 0.38 };

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.innerWidth < 768;

    var panels = {};
    var galleryTimers = {};
    var sceneTimer = null;
    var activeSceneIndex = 0;
    var isTransitioning = false;
    var filteredScenes = [];

    function getConfig() {
        return window.STC_HERO_COLLAGE || null;
    }

    function hasEnoughImages(dept, minImages) {
        return dept && Array.isArray(dept.images) && dept.images.length >= minImages;
    }

    function resolveActiveDepartments(config) {
        var keys = (config.launchDepartments || []).slice();
        var optional = config.optionalDepartments || [];
        var minImages = config.minImages || 2;

        optional.forEach(function (key) {
            var dept = config.departments[key];
            if (hasEnoughImages(dept, minImages)) {
                keys.push(key);
            }
        });

        return keys.filter(function (key, index) {
            return keys.indexOf(key) === index && config.departments[key];
        });
    }

    function filterScenes(config, activeKeys) {
        var scenes = config.scenes || [];
        return scenes.filter(function (scene) {
            return LAYERS.every(function (layer) {
                return activeKeys.indexOf(scene[layer]) !== -1;
            });
        });
    }

    function createGallery(images, maxImages) {
        var wrap = document.createElement('div');
        wrap.className = 'training-panel-gallery';

        images.slice(0, maxImages).forEach(function (src, index) {
            var img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.className = 'training-panel-img' + (index === 0 ? ' is-active' : '');
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.decoding = 'async';
            wrap.appendChild(img);
        });

        return wrap;
    }

    function createPlaceholder(dept) {
        var wrap = document.createElement('div');
        wrap.className = 'training-panel-gallery training-panel-gallery--placeholder';

        var pattern = document.createElement('div');
        pattern.className = 'training-panel-placeholder-pattern';
        pattern.setAttribute('aria-hidden', 'true');

        var logo = document.createElement('img');
        logo.src = '/photos/logo.png';
        logo.alt = '';
        logo.className = 'training-panel-placeholder-logo';
        logo.loading = 'lazy';

        var title = document.createElement('p');
        title.className = 'training-panel-placeholder-title';
        title.textContent = dept.placeholderTitle || dept.label + ' — Training Gallery Coming Soon';

        wrap.appendChild(pattern);
        wrap.appendChild(logo);
        wrap.appendChild(title);
        return wrap;
    }

    function buildPanelContent(panel, deptKey, config) {
        var dept = config.departments[deptKey];
        var minImages = config.minImages || 2;
        var maxImages = config.maxImagesPerPanel || 8;

        panel.dataset.dept = deptKey;
        panel.classList.remove('training-panel--photo', 'training-panel--placeholder');

        var frame = panel.querySelector('.training-panel-frame');
        var oldGallery = frame.querySelector('.training-panel-gallery');
        var oldTag = frame.querySelector('.training-panel-tag');

        if (oldGallery) oldGallery.remove();
        if (oldTag) oldTag.remove();

        var gallery;

        if (hasEnoughImages(dept, minImages)) {
            gallery = createGallery(dept.images, maxImages);
            panel.classList.add('training-panel--photo');
        } else {
            gallery = createPlaceholder(dept);
            panel.classList.add('training-panel--placeholder');
        }

        var tag = document.createElement('span');
        tag.className = 'training-panel-tag';
        tag.textContent = dept.label || deptKey;

        frame.insertBefore(gallery, frame.querySelector('.training-panel-corners'));
        frame.appendChild(tag);
    }

    function createPanel(layer) {
        var panel = document.createElement('article');
        panel.className = 'training-panel panel-layer-' + layer;
        panel.dataset.layer = layer;

        var frame = document.createElement('div');
        frame.className = 'training-panel-frame';

        var corners = document.createElement('div');
        corners.className = 'training-panel-corners';
        corners.setAttribute('aria-hidden', 'true');

        frame.appendChild(corners);
        panel.appendChild(frame);

        return panel;
    }

    function revealImage(img, direction) {
        if (!img || prefersReducedMotion) return;

        img.classList.remove('is-hiding', 'reveal-ltr', 'reveal-rtl', 'reveal-ttb');
        void img.offsetWidth;
        img.classList.add(direction || 'reveal-ltr');

        img.addEventListener('animationend', function onEnd() {
            img.classList.remove('reveal-ltr', 'reveal-rtl', 'reveal-ttb');
            img.removeEventListener('animationend', onEnd);
        });
    }

    function hideImage(img, direction, callback) {
        if (!img || prefersReducedMotion) {
            if (callback) callback();
            return;
        }

        img.classList.remove('reveal-ltr', 'reveal-rtl', 'reveal-ttb');
        img.classList.add('is-hiding', direction || 'hide-ltr');

        img.addEventListener('animationend', function onEnd() {
            img.classList.remove('is-active', 'is-hiding', 'hide-ltr', 'hide-rtl');
            img.removeEventListener('animationend', onEnd);
            if (callback) callback();
        });
    }

    function startGalleryRotation(layer, panel) {
        if (prefersReducedMotion) return;

        if (galleryTimers[layer]) {
            clearTimeout(galleryTimers[layer]);
        }

        var images = panel.querySelectorAll('.training-panel-img');
        if (images.length < 2) return;

        var config = getConfig();
        var minMs = config.galleryRotateMinMs || 6000;
        var maxMs = config.galleryRotateMaxMs || 10000;
        var current = 0;
        var dirIndex = 0;

        function tick() {
            var outgoing = images[current];
            var next = (current + 1) % images.length;
            var incoming = images[next];
            var revealDir = REVEAL_DIRECTIONS[dirIndex % REVEAL_DIRECTIONS.length];
            var hideDir = revealDir.replace('reveal', 'hide');
            dirIndex += 1;

            hideImage(outgoing, hideDir, function () {
                incoming.classList.add('is-active');
                revealImage(incoming, revealDir);
                current = next;
            });

            var delay = minMs + Math.floor(Math.random() * (maxMs - minMs));
            galleryTimers[layer] = setTimeout(tick, delay);
        }

        galleryTimers[layer] = setTimeout(tick, minMs + Math.floor(Math.random() * (maxMs - minMs)));
    }

    function clearGalleryTimers() {
        Object.keys(galleryTimers).forEach(function (layer) {
            clearTimeout(galleryTimers[layer]);
        });
        galleryTimers = {};
    }

    function enterPanel(panel, delay) {
        if (prefersReducedMotion) {
            panel.classList.remove('is-exiting');
            panel.classList.add('is-visible');
            return;
        }

        panel.classList.remove('is-exiting', 'is-entering', 'is-visible');
        void panel.offsetWidth;

        setTimeout(function () {
            panel.classList.add('is-entering');
            panel.addEventListener('animationend', function onEnd(e) {
                if (e.target !== panel) return;
                panel.classList.remove('is-entering');
                panel.classList.add('is-visible');
                panel.removeEventListener('animationend', onEnd);
            });
        }, delay || 0);
    }

    function exitPanel(panel, delay, callback) {
        if (prefersReducedMotion) {
            if (callback) callback();
            return;
        }

        setTimeout(function () {
            panel.classList.remove('is-entering', 'is-visible');
            panel.classList.add('is-exiting');
            panel.addEventListener('animationend', function onEnd(e) {
                if (e.target !== panel) return;
                panel.classList.remove('is-exiting');
                panel.removeEventListener('animationend', onEnd);
                if (callback) callback();
            });
        }, delay || 0);
    }

    function applyScene(scene, config, animate) {
        var stagger = [0, 220, 440];
        var pending = 0;
        var completed = 0;

        function checkDone() {
            completed += 1;
            if (completed >= pending) {
                isTransitioning = false;
                LAYERS.forEach(function (layer) {
                    startGalleryRotation(layer, panels[layer]);
                });
            }
        }

        LAYERS.forEach(function (layer, index) {
            var panel = panels[layer];
            var nextDept = scene[layer];
            var currentDept = panel.dataset.dept;

            if (!animate || currentDept === nextDept) {
                if (currentDept !== nextDept) {
                    buildPanelContent(panel, nextDept, config);
                }
                panel.classList.add('is-visible');
                if (!animate) {
                    var activeImg = panel.querySelector('.training-panel-img.is-active');
                    if (activeImg) revealImage(activeImg, REVEAL_DIRECTIONS[index % 3]);
                }
                return;
            }

            pending += 1;
            exitPanel(panel, stagger[index], function () {
                buildPanelContent(panel, nextDept, config);
                enterPanel(panel, 0);
                var activeImg = panel.querySelector('.training-panel-img.is-active');
                if (activeImg) revealImage(activeImg, REVEAL_DIRECTIONS[index % 3]);
                checkDone();
            });
        });

        if (animate && pending === 0) {
            isTransitioning = false;
            LAYERS.forEach(function (layer) {
                startGalleryRotation(layer, panels[layer]);
            });
        }
    }

    function scheduleSceneCycle(config) {
        if (prefersReducedMotion || isMobile || filteredScenes.length < 2) return;

        if (sceneTimer) clearTimeout(sceneTimer);

        var minMs = config.sceneIntervalMinMs || 15000;
        var maxMs = config.sceneIntervalMaxMs || 20000;
        var delay = minMs + Math.floor(Math.random() * (maxMs - minMs));

        sceneTimer = setTimeout(function () {
            if (isTransitioning) {
                scheduleSceneCycle(config);
                return;
            }

            isTransitioning = true;
            clearGalleryTimers();
            activeSceneIndex = (activeSceneIndex + 1) % filteredScenes.length;
            applyScene(filteredScenes[activeSceneIndex], config, true);
            scheduleSceneCycle(config);
        }, delay);
    }

    function updateScrollParallax(hero) {
        var scrollY = Math.min(window.scrollY * 0.28, 56);
        hero.style.setProperty('--hero-scroll-y', scrollY + 'px');

        LAYERS.forEach(function (layer) {
            var factor = PARALLAX_FACTORS[layer] || 0.1;
            panels[layer].style.setProperty('--scroll-parallax', (scrollY * factor).toFixed(2) + 'px');
        });
    }

    function initCollageParallax(hero) {
        if (prefersReducedMotion || isMobile) return;

        function onScroll() {
            updateScrollParallax(hero);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function pauseOnHidden(config) {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                clearGalleryTimers();
                if (sceneTimer) {
                    clearTimeout(sceneTimer);
                    sceneTimer = null;
                }
            } else if (filteredScenes.length) {
                LAYERS.forEach(function (layer) {
                    startGalleryRotation(layer, panels[layer]);
                });
                scheduleSceneCycle(config);
            }
        });
    }

    function renderShowcase(container) {
        var config = getConfig();
        if (!config || !config.departments) {
            console.warn('STC Hero Showcase: missing STC_HERO_COLLAGE data.');
            return;
        }

        var activeKeys = resolveActiveDepartments(config);
        filteredScenes = filterScenes(config, activeKeys);

        if (!filteredScenes.length) {
            console.warn('STC Hero Showcase: no valid scenes for active departments.');
            return;
        }

        container.innerHTML = '';
        panels = {};

        LAYERS.forEach(function (layer) {
            panels[layer] = createPanel(layer);
            container.appendChild(panels[layer]);
        });

        activeSceneIndex = 0;
        applyScene(filteredScenes[0], config, false);

        LAYERS.forEach(function (layer) {
            startGalleryRotation(layer, panels[layer]);
        });

        scheduleSceneCycle(config);
    }

    window.initHeroCollage = function () {
        var hero = document.querySelector('.hero');
        var container = document.querySelector('.hero-collage');
        if (!hero || !container) return;

        isMobile = window.innerWidth < 768;
        renderShowcase(container);
        initCollageParallax(hero);

        var config = getConfig();
        if (config) {
            pauseOnHidden(config);
        }
    };
})();
