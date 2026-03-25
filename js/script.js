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
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
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

/* ============================
   REVIEWS SLIDER
============================ */
const slider = document.getElementById('reviewsSlider');
const dotsContainer = document.getElementById('reviewDots');
const prevBtn = document.getElementById('reviewPrev');
const nextBtn = document.getElementById('reviewNext');
const cards = slider.querySelectorAll('.review-card');

let currentIndex = 0;
let cardsPerView = getCardsPerView();
let totalSlides = Math.ceil(cards.length / cardsPerView);
let autoSlideTimer = null;

function getCardsPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

// 도트 생성
function buildDots() {
  dotsContainer.innerHTML = '';
  cardsPerView = getCardsPerView();
  totalSlides = Math.ceil(cards.length / cardsPerView);
  currentIndex = Math.min(currentIndex, totalSlides - 1);

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function goTo(index) {
  currentIndex = index;
  const cardWidth = cards[0].offsetWidth + 24; // gap: 24px
  slider.style.transform = `translateX(-${currentIndex * cardsPerView * cardWidth}px)`;

  // 도트 업데이트
  dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });

  resetAutoSlide();
}

function goNext() {
  goTo((currentIndex + 1) % totalSlides);
}

function goPrev() {
  goTo((currentIndex - 1 + totalSlides) % totalSlides);
}

prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);

function startAutoSlide() {
  autoSlideTimer = setInterval(goNext, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  startAutoSlide();
}

// 터치 스와이프
let touchStartX = 0;
slider.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

slider.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? goNext() : goPrev();
  }
});

// 초기화 및 리사이즈 대응
function initSlider() {
  buildDots();
  goTo(0);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }

  const newCpv = getCardsPerView();
  if (newCpv !== cardsPerView) {
    initSlider();
  }
});

initSlider();
startAutoSlide();

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
