/* Anime.js 4.1.3: content reveals and interaction feedback.
   GSAP owns the hero title/hand; Motion owns the menu/inquiry result.
   No shared animated properties. Content remains visible without this file. */
(() => {
  if (!window.anime?.animate) return;
  const { animate } = window.anime;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const active = new Map();
  const seen = new WeakSet();
  const awaiting = new Set();
  const controller = new AbortController();
  const managedProperties = ['transform', 'opacity', 'stroke-dasharray', 'stroke-dashoffset'];
  let weekText = '', summaryText = '', started = false;

  function restore(element, entry) {
    entry.animation?.cancel();
    for (const [property, value, priority] of entry.baseline) {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
    active.delete(element);
  }
  function play(element, values, options = {}, restoreOnComplete = true) {
    if (!element?.isConnected) return;
    const previous = active.get(element);
    previous?.animation?.cancel();
    const entry = {
      baseline: previous?.baseline || managedProperties.map(property => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]),
      animation: null
    };
    active.set(element, entry);
    entry.animation = animate(element, {
      ...values, duration: 560, ease: 'outExpo', ...options,
      onComplete: () => {
        if (active.get(element) === entry && restoreOnComplete) restore(element, entry);
      }
    });
  }
  function finishAll() {
    for (const [element, entry] of active) restore(element, entry);
  }
  function reveal(element, delay = 0) {
    const card = element.matches('.service-card');
    const heading = element.matches('.section-heading, .price-intro');
    // Short travel and a gentle fade avoid the old sudden jump on entry.
    play(element, {
      opacity: [heading ? .9 : .82, 1],
      y: [card ? 14 : 10, 0]
    }, { duration: heading ? 900 : 850, ease: 'outCubic', delay });
  }
  const observer = new IntersectionObserver(entries => {
    let cardIndex = 0;
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target); awaiting.delete(target);
      const delay = target.matches('.service-card') ? Math.min(cardIndex++ * 45, 135) : 0;
      reveal(target, delay);
    }
  // Start just before content enters the viewport, instead of moving it after it appears.
  }, { threshold: 0, rootMargin: '0px 0px 64px 0px' });

  function startHeroAccents() {
    play(document.querySelector('.hero-side-left p'), {opacity: [.5,1], y: [16,0]}, {duration:650,delay:100});
    play(document.querySelector('.hero-side-left .text-link'), {opacity: [.5,1], x: [-12,0]}, {duration:550,delay:160});
    play(document.querySelector('.hero-bottom'), {opacity: [.5,1], y: [10,0]}, {duration:600,delay:200});
    const path = document.querySelector('.hero-side-left .starburst path');
    if (path) {
      const length = path.getTotalLength();
      play(path, {strokeDasharray:[length,length], strokeDashoffset:[length,0]}, {duration:1100,delay:100});
    }
  }
  function scan() {
    if (!document.querySelector('.hero')) return;
    if (!started) { started = true; if (scrollY < 40) startHeroAccents(); }
    for (const [element, entry] of active) if (!element.isConnected) restore(element, entry);
    for (const element of awaiting) if (!element.isConnected) { observer.unobserve(element); awaiting.delete(element); }
    document.querySelectorAll('.section-heading, .service-card, .price-intro, .price-category, .booking-calendar, .booking-form-panel, .studio-note, .footer-top').forEach(element => {
      if (seen.has(element)) return;
      seen.add(element); awaiting.add(element); observer.observe(element);
    });
    const week = document.querySelector('.week-controls h4');
    if (week && weekText !== week.textContent) {
      if (weekText) play(document.querySelector('.week-grid'), {opacity:[.55,1], x:[10,0]}, {duration:320});
      weekText = week.textContent;
    }
    const summary = document.querySelector('.booking-summary');
    if (summary && summaryText !== summary.textContent) {
      if (summaryText) play(summary, {opacity:[.55,1], y:[6,0]}, {duration:360});
      summaryText = summary.textContent;
    }
  }

  // Event delegation also supports cards recreated when a category changes.
  function feedback(element, engaged) {
    if (element.matches('.service-card')) {
      play(element.querySelector('.salon-photo'), {scale:engaged ? 1.055 : 1}, {duration:engaged ? 450 : 380}, !engaged);
    } else if (element.matches('.price-row')) {
      play(element.querySelector('span:first-child'), {x:engaged ? 6 : 0}, {duration:240}, !engaged);
    }
  }
  function pointer(event) {
    if (!finePointer.matches) return;
    const item = event.target.closest('.service-card, .price-row');
    if (!item || item.contains(event.relatedTarget)) return;
    const engaged = event.type === 'pointerover' || item.contains(document.activeElement);
    feedback(item, engaged);
  }
  function focus(event) {
    const item = event.target.closest('.service-card, .price-row');
    if (!item || item.contains(event.relatedTarget)) return;
    feedback(item, event.type === 'focusin' || (finePointer.matches && item.matches(':hover')));
    // Bring keyboard focus to an immediately usable, fully opaque ancestor.
    if (event.type === 'focusin') {
      const revealTarget = event.target.closest('.service-card, .booking-calendar, .booking-form-panel');
      if (revealTarget) {
        observer.unobserve(revealTarget); awaiting.delete(revealTarget);
        const entry = active.get(revealTarget); if (entry) restore(revealTarget, entry);
      }
    }
  }
  document.addEventListener('pointerover', pointer, {signal:controller.signal});
  document.addEventListener('pointerout', pointer, {signal:controller.signal});
  document.addEventListener('focusin', focus, {signal:controller.signal});
  document.addEventListener('focusout', focus, {signal:controller.signal});
  const mutations = new MutationObserver(scan);
  mutations.observe(document.body, {childList:true, characterData:true, subtree:true, attributes:true, attributeFilter:['data-state']});
  window.addEventListener('beforeprint', finishAll, {signal:controller.signal});
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    mutations.disconnect(); observer.disconnect(); awaiting.clear();
    finishAll(); controller.abort();
  }, {signal:controller.signal});
  scan();
})();
