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
let currentLang = 'en';

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-en]').forEach(el => {
    const value = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
    if (value !== null) el.textContent = value;
  });

  langToggle.textContent = lang === 'ar' ? 'AR / EN' : 'EN / AR';
}

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  applyLanguage(currentLang);
});

// ============ Footer: hide empty links ============
document.querySelectorAll('.footer-pill').forEach(link => {
  const href = (link.getAttribute('href') || '').trim();
  if (href === '' || href === '#' || href === 'mailto:') {
    link.style.display = 'none';
  }
});
