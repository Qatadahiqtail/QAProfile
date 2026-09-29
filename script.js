// ============ Language Persistence (init) ============
let currentLang = 'en';
try {
  if (localStorage.getItem('lang') === 'ar') currentLang = 'ar';
} catch (e) {}

// ============ Scroll Progress Bar ============
const scrollProgressBar = document.getElementById('scrollProgressBar');

if (scrollProgressBar) {
  let scrollTicking = false;

  function updateScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollableHeight = doc.scrollHeight - doc.clientHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    scrollProgressBar.style.width = progress + '%';
    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });

  updateScrollProgress();
}

// ============ Mobile Menu ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ============ Active Link on Scroll ============
const sections = document.querySelectorAll('main .section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

sections.forEach(section => spyObserver.observe(section));

// ============ Reveal on Scroll ============
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ============ Language Toggle (EN / AR) ============
const langToggle = document.getElementById('langToggle');

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-en]').forEach(el => {
    const value = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (value !== null) el.textContent = value;
  });

  langToggle.textContent = lang === 'ar' ? 'AR / EN' : 'EN / AR';
}

applyLanguage(currentLang);

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLanguage(currentLang);
  try { localStorage.setItem('lang', currentLang); } catch (e) {}
});

// ============ Footer: hide empty links ============
document.querySelectorAll('.footer-pill').forEach(link => {
  const href = (link.getAttribute('href') || '').trim();
  if (href === '' || href === '#' || href === 'mailto:') {
    link.style.display = 'none';
  }
});

// ============ Preloader ============
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem('preloaderShown') === '1';
  } catch (e) {}

  if (alreadyShown) {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    return;
  }

  try { sessionStorage.setItem('preloaderShown', '1'); } catch (e) {}

  const countStatEls = preloader.querySelectorAll('.preloader-stat-num:not(.preloader-stat-static)');
  const staticStatEls = preloader.querySelectorAll('.preloader-stat-static');
  const loadingWordEl = document.getElementById('preloaderLoadingWord');
  const progressBar = document.getElementById('preloaderProgressBar');
  const phrases = {
    en: ['Compiling experience', 'Loading projects', 'Launching portfolio'],
    ar: ['تجميع الخبرات', 'تحميل المشاريع', 'تشغيل الموقع']
  };
  const list = phrases[currentLang] || phrases.en;

  let phraseInterval = null;
  let finishTimer = null;
  let finished = false;

  function finishPreloader() {
    if (finished) return;
    finished = true;
    clearInterval(phraseInterval);
    clearTimeout(finishTimer);
    preloader.removeEventListener('click', finishPreloader);
    preloader.classList.add('preloader-hidden');
    document.body.classList.remove('preloader-active');
    setTimeout(() => preloader.remove(), 650);
  }

  preloader.addEventListener('click', finishPreloader);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    countStatEls.forEach(el => { el.textContent = el.getAttribute('data-count'); });
    if (loadingWordEl) loadingWordEl.textContent = list[0];
    if (progressBar) progressBar.style.width = '100%';
    finishTimer = setTimeout(finishPreloader, 800);
    return;
  }

  const countDuration = 1500;
  const startTime = performance.now();

  function tickCounters(now) {
    const progress = Math.min((now - startTime) / countDuration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    countStatEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      el.textContent = Math.round(target * eased).toString();
    });
    if (progress < 1 && !finished) requestAnimationFrame(tickCounters);
  }
  requestAnimationFrame(tickCounters);

  requestAnimationFrame(() => {
    staticStatEls.forEach(el => el.classList.add('is-visible'));
  });

  if (loadingWordEl) loadingWordEl.textContent = list[0];
  let phraseIndex = 0;
  phraseInterval = setInterval(() => {
    phraseIndex = (phraseIndex + 1) % list.length;
    if (loadingWordEl) loadingWordEl.textContent = list[phraseIndex];
  }, 730);

  if (progressBar) {
    requestAnimationFrame(() => {
      progressBar.style.width = '100%';
    });
  }

  finishTimer = setTimeout(finishPreloader, 2200);
})();
