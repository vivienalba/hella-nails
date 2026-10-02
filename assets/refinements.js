/* Progressive enhancements: the original React app owns all booking state. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let keyboard = false;
  document.addEventListener('keydown', () => { keyboard = true; }, true);
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
    track.parentElement.setAttribute('aria-label', 'Studio highlights. Scroll horizontally to read.');
    animate(document.querySelector('.hero-hand img'), {
      opacity: [.8, 1], transform: ['translateY(12px)', 'translateY(0px)']
    }, { duration: .45 });
    return true;
  }
  const processed = new WeakSet();
  const revealed = new WeakSet();
  const scrollReveals = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      scrollReveals.unobserve(target);
      animate(target, { opacity: [.65, 1], transform: ['translateY(14px)', 'translateY(0px)'] }, { duration: .4 });
    });
  }, { threshold: .12 });
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
    document.querySelectorAll('.service-card, .price-layout, .booking-layout, .studio-note').forEach(element => {
      if (revealed.has(element)) return;
      revealed.add(element);
      // Content stays visible before JS, when printing, and with reduced motion.
      if (element.getBoundingClientRect().top >= innerHeight) scrollReveals.observe(element);
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
