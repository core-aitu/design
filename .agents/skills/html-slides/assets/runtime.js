/* Inline after markup, or before DOMContentLoaded. DOM: #viewport > #deck >
 * .slide[data-slide-id][data-title]. data-width/height on #deck default1920/1080.
 * Required controls: #prev/#next/#fullscreen/#counter. Optional #status live
 * region, and .demo-frame > video + button.poster-play. See controls.html.
 * No resource fetching, autoplay, looping, or automatic slide advancement.
 */
(() => {
  'use strict';
  function initialize() {
    const required = selector => {
      const node = document.querySelector(selector);
      if (!node) throw new Error(`Presentation runtime: missing ${selector}.`);
      return node;
    };
    const viewport = required('#viewport'), deck = required('#deck');
    const slides = Array.from(deck.children).filter(node => node.matches('.slide'));
    if (!slides.length) throw new Error('Presentation runtime: the deck has no slides.');
    const previous = required('#prev'), next = required('#next');
    const fullscreen = required('#fullscreen'), counter = required('#counter');
    const liveStatus = document.querySelector('#status');
    const dimension = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
    const width = dimension(deck.dataset.width, 1920), height = dimension(deck.dataset.height, 1080);
    let index = -1, statusTimer;
    deck.style.width = `${width}px`;
    deck.style.height = `${height}px`;

    function resize() {
      const scale = Math.min(viewport.clientWidth / width, viewport.clientHeight / height);
      deck.style.transform = `scale(${Math.max(0, scale)})`;
    }
    function status(message) {
      if (!liveStatus) {
        fullscreen.setAttribute('aria-description', message);
        return;
      }
      clearTimeout(statusTimer);
      liveStatus.textContent = message;
      liveStatus.hidden = false;
      statusTimer = setTimeout(() => { liveStatus.hidden = true; liveStatus.textContent = ''; }, 5000);
    }
    function go(requested) {
      const target = Math.max(0, Math.min(slides.length - 1, requested));
      const old = slides[index];
      const restoreFocus = old && target !== index && old.contains(document.activeElement);
      if (old && target !== index) old.querySelectorAll('video, audio').forEach(media => media.pause());
      index = target;
      slides.forEach((slide, position) => {
        const active = position === index;
        slide.classList.toggle('active', active);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
        if (!active) slide.querySelectorAll('video, audio').forEach(media => media.pause());
      });
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${slides.length}`;
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      const title = slides[index].dataset.title || slides[index].querySelector('h1, h2')?.textContent || 'Presentation';
      document.title = `${index + 1}/${slides.length} · ${title.trim()}`;
      const hash = `#${index + 1}`;
      if (location.hash !== hash) {
        try { history.replaceState(null, '', hash); }
        catch (_) { location.hash = hash; }
      }
      if (restoreFocus) slides[index].focus({ preventScroll: true });
    }
    function fromHash() {
      const text = location.hash.slice(1);
      const number = /^-?\d+$/.test(text) ? Number(text) : 1;
      go(Number.isFinite(number) ? number - 1 : 0);
    }
    slides.forEach((slide, position) => {
      if (!slide.hasAttribute('aria-label')) slide.setAttribute('aria-label', `Slide ${position + 1}: ${slide.dataset.title || ''}`.trim());
      if (!slide.hasAttribute('tabindex')) slide.tabIndex = -1;
      slide.querySelectorAll('video, audio').forEach(media => {
        media.autoplay = false;
        media.loop = false;
        media.removeAttribute('autoplay');
        media.removeAttribute('loop');
        media.controls = true;
        if (!media.hasAttribute('preload')) media.preload = 'none';
        if (media.matches('video')) media.playsInline = true;
        media.addEventListener('play', () => { if (!slide.classList.contains('active')) media.pause(); });
      });
    });
    previous.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));
    function fullscreenState() {
      const active = Boolean(document.fullscreenElement);
      fullscreen.setAttribute('aria-pressed', String(active));
      fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
      // Keep the accepted button width in both modes; announce state through ARIA.
      resize();
      requestAnimationFrame(resize);
    }
    fullscreen.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
        else status('Fullscreen is unavailable in this browser. Use its fullscreen command if available.');
      } catch (_) { status('Fullscreen could not be started. Use your browser fullscreen command (for example F11).'); }
    });
    deck.querySelectorAll('.demo-frame .poster-play').forEach(button => {
      const video = button.closest('.demo-frame').querySelector('video');
      if (!video) throw new Error('Presentation runtime: .poster-play requires a video in .demo-frame.');
      video.tabIndex = -1;
      button.addEventListener('click', async () => {
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        try {
          await video.play();
          button.hidden = true;
          video.tabIndex = 0;
          if (video.closest('.slide').classList.contains('active')) video.focus();
          else video.pause();
        } catch (_) {
          button.hidden = false;
          status('The embedded video could not be played. Try the Play demo button again.');
          button.disabled = false;
          if (video.closest('.slide').classList.contains('active')) button.focus();
        } finally { button.disabled = false; button.removeAttribute('aria-busy'); }
      });
    });
    document.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || document.querySelector('dialog[open]')) return;
      if (target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), video, audio, [data-player], [role="slider"], [role="textbox"]')) return;
      if (target.closest('button, a, [role="button"]') && [' ', 'Enter'].includes(event.key)) return;
      let destination;
      if (['ArrowRight', ' ', 'PageDown'].includes(event.key)) destination = index + 1;
      if (['ArrowLeft', 'PageUp'].includes(event.key)) destination = index - 1;
      if (event.key === 'Home') destination = 0;
      if (event.key === 'End') destination = slides.length - 1;
      if (destination !== undefined) { event.preventDefault(); go(destination); }
    });
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('resize', resize);
    document.addEventListener('fullscreenchange', fullscreenState);
    if (typeof ResizeObserver === 'function') new ResizeObserver(resize).observe(viewport);
    fromHash();
    fullscreenState();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
