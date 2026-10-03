/* Progressive enhancements: the original React app owns all booking state. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let keyboard = false;
  document.addEventListener('keydown', () => { keyboard = true; showPendingContent(); }, true);
  document.addEventListener('pointerdown', () => { keyboard = false; }, true);
  const animations = new Set();
  function animate(element, frames, options = {}) {
    if (!element || reduced.matches || keyboard || !window.Motion) return;
    const controls = Motion.animate(element, frames, {
      duration: .24, ease: [.23, 1, .32, 1], ...options
    });
    animations.add(controls);
    controls.then(() => animations.delete(controls));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      animations.forEach(control => control.complete());
      animations.clear();
      showPendingContent();
    }
  });
  function initialize() {
    const header = document.querySelector('.header-layout');
    if (!header) return false;
    const menu = header.querySelector('.header-menu-toggle');
    menu.innerHTML = '<svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 5h16M4 12h16M4 19h16"/></svg>';
    const instagram = document.querySelector('.hero-bottom a');
    instagram.href = 'https://www.instagram.com/hellanailsbykristel/';
    instagram.target = '_blank';
    instagram.rel = 'noopener noreferrer';
    instagram.setAttribute('aria-label', 'Hella Nails by Kristel on Instagram, opens in a new tab');
    instagram.insertAdjacentHTML('afterbegin', '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>');
    const track = document.querySelector('.marquee-track');
    track.parentElement.setAttribute('aria-label', 'Studio highlights.');
    animate(document.querySelector('.hero-hand img'), {
      opacity: [.8, 1], transform: ['translateY(12px)', 'translateY(0px)']
    }, { duration: .45 });
    return true;
  }
  const processed = new WeakSet();
  const revealed = new WeakSet();
  const pendingReveals = new Set();
  function showPendingContent() {
    pendingReveals.forEach(element => {
      element.classList.remove('scroll-reveal-pending');
      scrollReveals?.unobserve(element);
    });
    pendingReveals.clear();
  }
  window.addEventListener('beforeprint', () => {
    showPendingContent();
    animations.forEach(control => control.complete());
  });
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.scroll-reveal-pending');
    if (!element) return;
    element.classList.remove('scroll-reveal-pending');
    pendingReveals.delete(element);
    scrollReveals?.unobserve(element);
  });
  const scrollReveals = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      scrollReveals.unobserve(target);
      pendingReveals.delete(target);
      target.classList.remove('scroll-reveal-pending');
      animate(target, { opacity: [0, 1] }, { duration: .65, ease: [.16, 1, .3, 1] });
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' }) : null;
  function cleanDashes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest('script, style, textarea, input, .inquiry-result')) continue;
      if (!/[-\u2010-\u2015]/.test(node.data)) continue;
      node.data = node.data.replace(/(\d)[\u2010-\u2015](?=[₱\d])/g, '$1 to ')
        .replace(/\s+[\u2010-\u2015]\s+/g, ' to ')
        .replace(/[\u2010-\u2015]/g, ' to ').replace(/-/g, ' ');
    }
  }
  function enhanceStates() {
    cleanDashes();
    pendingReveals.forEach(element => {
      if (element.isConnected) return;
      scrollReveals?.unobserve(element);
      pendingReveals.delete(element);
    });
    document.querySelectorAll('.section-heading, .category-tabs, .service-card, .price-intro, .price-category, .booking-calendar, .booking-form-panel, .studio-note, .footer-top, .footer-bottom, .brochure-section > .section-note, .price-menu > .section-note').forEach(element => {
      if (revealed.has(element)) return;
      revealed.add(element);
      // Hide only offscreen content when Motion and the observer are ready.
      // Keyboard, print and reduced-motion paths show it immediately.
      if (window.Motion && scrollReveals && !keyboard && !reduced.matches && element.getBoundingClientRect().top >= innerHeight) {
        element.classList.add('scroll-reveal-pending');
        pendingReveals.add(element);
        scrollReveals.observe(element);
      }
    });
    document.querySelectorAll('.navigation-drawer[data-state="open"], .navigation-overlay[data-state="open"], .inquiry-result, [role="tabpanel"][data-state="active"]').forEach(element => {
      if (processed.has(element)) return;
      processed.add(element);
      if (element.matches('.navigation-drawer')) {
        animate(element, { transform: ['translateX(-100%)', 'translateX(0%)'] });
        element.querySelectorAll('nav a').forEach((link, index) => {
          animate(link, { opacity: [0, 1], transform: ['translateX(-24px)', 'translateX(0px)'] }, {
            duration: .42, delay: .08 + index * .1
          });
        });
      } else if (element.matches('.navigation-overlay')) {
        animate(element, { opacity: [0, 1] }, { duration: .18 });
      } else if (element.matches('.inquiry-result')) {
        animate(element, { opacity: [.6, 1], transform: ['translateY(6px)', 'translateY(0px)'] });
        const copy = document.createElement('button');
        copy.type = 'button'; copy.className = 'text-link copy-inquiry'; copy.textContent = 'Copy inquiry';
        copy.addEventListener('click', async () => {
          const message = element.querySelector('p');
          try {
            await navigator.clipboard.writeText(message.textContent);
            copy.textContent = 'Inquiry copied';
          } catch {
            const range = document.createRange(); range.selectNodeContents(message);
            const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
            copy.textContent = 'Message selected. Copy to continue';
          }
        });
        element.append(copy);
      } else {
        animate(element, { opacity: [.7, 1] }, { duration: .18 });
      }
    });
  }
  let initialized = false;
  const observer = new MutationObserver(() => {
    if (!initialized) initialized = initialize();
    if (initialized) enhanceStates();
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  initialized = initialize();
  if (initialized) enhanceStates();
})();
