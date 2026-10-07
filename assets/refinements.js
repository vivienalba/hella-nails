/* Progressive enhancements: the original React app owns all booking state. */
(() => {
  let keyboard = false;
  document.addEventListener('keydown', () => { keyboard = true; }, true);
  document.addEventListener('pointerdown', () => { keyboard = false; }, true);
  const animations = new Set();
  function animate(element, frames, options = {}) {
    if (!element || keyboard || !window.Motion) return;
    const controls = Motion.animate(element, frames, {
      duration: .22, ease: [.23, 1, .32, 1], ...options
    });
    animations.add(controls);
    controls.then(() => animations.delete(controls));
  }
  let heroMedia;
  function setupHeroMotion() {
    const hero = document.querySelector('.hero');
    if (!hero || !window.gsap) return;
    // GSAP owns only the hero; Motion owns drawer and inquiry feedback; Anime.js owns content transitions.
    heroMedia = gsap.context(() => {
      if (keyboard || scrollY > 40) return;
      gsap.timeline({ defaults: { ease: 'expo.out', clearProps: 'opacity,transform' } })
        .fromTo(hero.querySelector('h1'), { opacity: .7, y: 12 }, { opacity: 1, y: 0, duration: .55 }, 0)
        .fromTo(hero.querySelector('.hero-hand img'), { opacity: .8, y: 18 }, { opacity: 1, y: 0, duration: .65 }, .04);
    }, hero);
  }
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
    const ribbon = track.parentElement;
    ribbon.setAttribute('aria-label', 'Studio highlights. Focus to pause scrolling.');
    setupHeroMotion();
    return true;
  }
  const processed = new WeakSet();
  window.addEventListener('beforeprint', () => {
    heroMedia?.revert();
    animations.forEach(control => control.complete());
  });
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
    const form = document.querySelector('.booking-form-panel form');
    if (form) {
      let hint = form.querySelector('.inquiry-hint');
      if (!hint) {
        hint = document.createElement('p'); hint.className = 'inquiry-hint no-payment';
        hint.id = 'inquiry-hint'; hint.setAttribute('aria-live', 'polite');
        form.querySelector('.submit-button').before(hint);
        form.querySelector('.submit-button').setAttribute('aria-describedby', hint.id);
      }
      const hasDate = !!document.querySelector('.day-card.selected');
      const hasConsent = form.querySelector('#consent')?.getAttribute('data-state') === 'checked';
      const text = hasDate && !hasConsent ? 'Please check the consent box to prepare your inquiry.' : '';
      if (hint.textContent !== text) hint.textContent = text;
      hint.hidden = !text;
    }
    document.querySelectorAll('.navigation-drawer[data-state="open"], .navigation-overlay[data-state="open"], .inquiry-result').forEach(element => {
      if (processed.has(element)) return;
      processed.add(element);
      if (element.matches('.navigation-drawer')) {
        animate(element, { transform: ['translateX(-100%)', 'translateX(0%)'] });
        element.querySelectorAll('nav a').forEach((link, index) => {
          animate(link, { opacity: [0, 1], transform: ['translateX(-12px)', 'translateX(0px)'] }, {
            duration: .24, delay: index * .045
          });
        });
      } else if (element.matches('.navigation-overlay')) {
        animate(element, { opacity: [0, 1] }, { duration: .18 });
      } else if (element.matches('.inquiry-result')) {
        animate(element, { opacity: [.6, 1], transform: ['translateY(6px)', 'translateY(0px)'] });
        const copy = document.createElement('button');
        copy.type = 'button'; copy.className = 'text-link copy-inquiry'; copy.textContent = 'Copy inquiry';
        copy.setAttribute('aria-live', 'polite');
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
      }
    });
  }
  let initialized = false;
  const observer = new MutationObserver(() => {
    if (!initialized) initialized = initialize();
    if (initialized) enhanceStates();
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['data-state'] });
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    observer.disconnect();
    animations.forEach(control => control.complete()); animations.clear();
    heroMedia?.revert();
  });
  initialized = initialize();
  if (initialized) enhanceStates();
})();
