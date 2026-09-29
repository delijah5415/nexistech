(() => {
  'use strict';

  const init = () => {
    const header = document.querySelector('header');
    const desktopNav = header?.querySelector('nav');
    if (!header || !desktopNav) return;

    // Add a mobile menu without changing the existing desktop navigation markup.
    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-blue-500 transition-colors';
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';

    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-navigation';
    mobileMenu.className = 'hidden md:hidden absolute top-20 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl';
    mobileMenu.innerHTML = '<div class="max-w-7xl mx-auto px-4 py-4 space-y-2"></div>';

    const links = [...desktopNav.querySelectorAll('a[href^="#"]')];
    const list = mobileMenu.firstElementChild;
    links.forEach((link) => {
      const clone = link.cloneNode(true);
      clone.className = 'flex items-center justify-between w-full px-4 py-3 rounded-lg text-slate-200 hover:text-white hover:bg-slate-900 transition-colors';
      clone.addEventListener('click', () => closeMenu());
      list.appendChild(clone);
    });

    // Insert before the desktop action buttons so it remains visible on mobile.
    const actionGroup = header.querySelector('.flex.items-center.space-x-4');
    actionGroup?.prepend(menuButton);
    header.classList.add('relative');
    header.appendChild(mobileMenu);

    const setIcon = (name) => {
      menuButton.innerHTML = `<i data-lucide="${name}" class="w-5 h-5"></i>`;
      if (window.lucide) window.lucide.createIcons();
    };

    const openMenu = () => {
      mobileMenu.classList.remove('hidden');
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Close navigation menu');
      setIcon('x');
    };

    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      setIcon('menu');
    };

    menuButton.addEventListener('click', () => {
      mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('hashchange', closeMenu);
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });

    // Offset anchor scrolling so the fixed header does not cover section headings.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const headerHeight = header.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.history.pushState(null, '', id);
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    // Refresh icons after injecting the mobile navigation.
    if (window.lucide) window.lucide.createIcons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
