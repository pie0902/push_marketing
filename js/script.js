/* ============================
   HEADER - 스크롤 효과
============================ */
const header = document.getElementById('header');

function updateHeaderStyle() {
  if (window.scrollY > 50) {
    header.style.background = 'rgba(255,255,255,0.97)';
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    header.style.backdropFilter = 'blur(10px)';
    header.style.webkitBackdropFilter = 'blur(10px)';
    header.style.borderBottomColor = 'rgba(0,0,0,0.07)';
  } else {
    header.style.background = 'transparent';
    header.style.boxShadow = 'none';
    header.style.backdropFilter = 'none';
    header.style.webkitBackdropFilter = 'none';
    header.style.borderBottomColor = 'transparent';
  }
}

window.addEventListener('scroll', updateHeaderStyle);
updateHeaderStyle();

/* ============================
   MOBILE MENU
============================ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu() {
  hamburgerBtn.classList.remove('active');
  mobileNav.classList.remove('open');
}

hamburgerBtn.addEventListener('click', () => {
  hamburgerBtn.classList.toggle('active');
  mobileNav.classList.toggle('open');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

/* ============================
   HERO - VANTA FOG BACKGROUND
============================ */
const heroVantaBg = document.getElementById('heroVantaBg');
let heroFogEffect = null;

if (heroVantaBg && window.VANTA && window.VANTA.FOG) {
  heroFogEffect = window.VANTA.FOG({
    el: heroVantaBg,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    highlightColor: 0xfcfcfc,
    midtoneColor: 0xfcbfef,
    lowlightColor: 0xffe9e9,
    baseColor: 0xf74444,
    blurFactor: 0.58,
    speed: 1.5,
    zoom: 1.4
  });
}

window.addEventListener('beforeunload', () => {
  if (heroFogEffect) {
    heroFogEffect.destroy();
  }
});

/* ============================
   FADE-IN (Intersection Observer)
============================ */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // 연속된 fade-in 요소들에 딜레이 적용
      const parent = entry.target.parentElement;
      const siblings = parent ? [...parent.querySelectorAll('.fade-in')] : [entry.target];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 0.1}s`;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================
   STATS 카운터 애니메이션
============================ */
const statNumbers = document.querySelectorAll('.stat-number');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      animateCounter(el, target);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => countObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});

/* ============================
   SMOOTH SCROLL (앵커)
============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
