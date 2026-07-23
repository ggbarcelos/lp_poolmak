document.addEventListener('DOMContentLoaded', function () {

  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // ─── SCROLL ───
  const progressBar = document.getElementById('scrollProgress');
  const fullbleed = document.querySelector('[data-parallax]');
  const fullbleedBg = fullbleed?.querySelector('.fullbleed-bg');
  const processSteps = document.querySelector('.process-steps');
  const parallaxSections = document.querySelectorAll('[data-parallax-bg]');

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = Math.min((scrollY / docHeight) * 100, 100) + '%';
    }
    nav.classList.toggle('scrolled', scrollY > 80);
    if (fullbleedBg && fullbleed) {
      const rect = fullbleed.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        fullbleedBg.style.transform = `translateY(${rect.top * 0.15}px)`;
      }
    }
    parallaxSections.forEach(section => {
      const bg = section.querySelector('[data-parallax-bg]');
      if (!bg) return;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        bg.style.transform = `translateY(${rect.top * 0.1}px)`;
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── MOUSE SPOTLIGHT ON HERO ───
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--spot-x', x + '%');
      hero.style.setProperty('--spot-y', y + '%');
    });
  }

  // ─── COUNTERS ───
  const counters = document.querySelectorAll('.counter');
  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const update = () => {
      count += step;
      if (count >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = count;
      requestAnimationFrame(update);
    };
    update();
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ─── FAQ ACCORDION ───
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      faqTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = nav.offsetHeight + 14;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
        links.classList.remove('open');
      }
    });
  });

  // ─── REVEAL ON SCROLL ───
  const revealElements = document.querySelectorAll(
    '.step, .v-card, .faq-item, .sobre-card, .features-mini div, .gallery-cell'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentNode;
        const idx = Array.from(parent.children).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach(el => revealObserver.observe(el));

  // ─── PROCESS CONNECTOR ───
  if (processSteps) {
    const stepsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processSteps.classList.add('connected');
          stepsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    stepsObserver.observe(processSteps);
  }

  // ─── 3D TILT ON CARDS ───
  const tiltElements = document.querySelectorAll('.sobre-card, .v-card');
  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.setProperty('--rx', rotateX + 'deg');
      card.style.setProperty('--ry', rotateY + 'deg');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // ─── IMAGE RANDOMIZER ───
  const imageBase = 'img/used/';
  const imageList = [
    'DJI_20250502151754_0025_D.JPG',
    'DJI_20250416143315_0029_D.JPG',
    'DJI_20250502151010_0003_D.JPG',
    'DJI_20250417155849_0013_D.JPG',
    'DJI_20250502151403_0013_D.JPG',
    'DJI_20250724142203_0035_D.JPG',
    'DJI_20250722160110_0001_D.JPG',
    'DJI_20251015153949_0043_D.JPG',
    'DJI_20250724141716_0014_D.JPG',
    'DJI_20250414145300_0079_D.JPG',
    'DJI_20250724142123_0031_D.JPG',
    'DJI_20250417160214_0024_D.JPG',
    'DJI_20250417160815_0037_D.JPG',
    'DJI_20250722160954_0028_D.JPG',
    'DJI_20250724141338_0003_D.JPG',
    'DJI_20250625150406_0015_D.JPG',
    'DJI_20250625150831_0029_D.JPG',
    'DJI_20250414145612_0087_D.JPG',
    'DJI_20251118145704_0010_D.JPG',
    'DJI_20250502151422_0014_D.JPG',
    'DJI_20250724141629_0012_D.JPG',
    'DJI_20250724141735_0016_D.JPG',
    'DJI_20260223131919_0007_D.JPG',
    'DJI_20260223132635_0033_D.JPG'
  ];

  function getRandomImages(count) {
    const shuffled = [...imageList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    heroImg.src = imageBase + getRandomImages(1)[0];
  }

  const fullbleedImg = document.querySelector('.fullbleed-bg');
  if (fullbleedImg) {
    fullbleedImg.src = imageBase + getRandomImages(1)[0];
  }

  const ctaImg = document.querySelector('.cta-bg img');
  if (ctaImg) {
    ctaImg.src = imageBase + getRandomImages(1)[0];
  }

  const galleryCells = document.querySelectorAll('.gallery-cell img');
  if (galleryCells.length) {
    const count = galleryCells.length;
    const initialImages = getRandomImages(count);
    galleryCells.forEach((img, i) => {
      img.src = imageBase + initialImages[i];
    });

    function shuffleGalleryImages() {
      const newImages = getRandomImages(count);
      galleryCells.forEach((img, i) => {
        const cell = img.closest('.gallery-cell');
        cell.classList.add('shuffling');
        setTimeout(() => {
          img.src = imageBase + newImages[i];
        }, 100);
        setTimeout(() => {
          cell.classList.remove('shuffling');
        }, 800);
      });
      updateIndicators();
    }

    let galleryInterval = setInterval(shuffleGalleryImages, 4500);

    const gallerySection = document.getElementById('galeria');
    const observerGal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          galleryInterval = setInterval(shuffleGalleryImages, 4500);
        } else {
          clearInterval(galleryInterval);
        }
      });
    }, { threshold: 0.1 });
    observerGal.observe(gallerySection);

    const indicatorsContainer = document.querySelector('.gallery-indicators');
    if (indicatorsContainer) {
      const totalShuffles = 6;
      for (let i = 0; i < totalShuffles; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Imagem ${i + 1}`);
        dot.addEventListener('click', () => {
          clearInterval(galleryInterval);
          shuffleGalleryImages();
          galleryInterval = setInterval(shuffleGalleryImages, 4500);
        });
        indicatorsContainer.appendChild(dot);
      }
    }

    function updateIndicators() {
      const dots = document.querySelectorAll('.gallery-indicators .dot');
      const activeIdx = Math.floor(Math.random() * dots.length);
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }
  }

  const sobreCards = document.querySelectorAll('.sobre-card:not(.destaque) img');
  if (sobreCards.length) {
    const randomForSobre = getRandomImages(sobreCards.length);
    sobreCards.forEach((img, i) => {
      img.src = imageBase + randomForSobre[i];
    });
  }

  onScroll();
});