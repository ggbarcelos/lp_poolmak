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
  };

  window.addEventListener('scroll', onScroll, { passive: true });

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
    '.step, .v-card, .spec-item, .faq-item, .sobre-card, .features-mini div, .gallery-item'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentNode;
        const idx = Array.from(parent.children).indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 60}ms`;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

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

  // Hero background
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    heroImg.src = imageBase + getRandomImages(1)[0];
  }

  // Fullbleed background
  const fullbleedImg = document.querySelector('.fullbleed-bg');
  if (fullbleedImg) {
    fullbleedImg.src = imageBase + getRandomImages(1)[0];
  }

  // CTA background
  const ctaImg = document.querySelector('.cta-bg img');
  if (ctaImg) {
    ctaImg.src = imageBase + getRandomImages(1)[0];
  }

  // Gallery auto-rotation
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

    // Indicators
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

  // Sobre section card images
  const sobreCards = document.querySelectorAll('.sobre-card:not(.destaque) img');
  if (sobreCards.length) {
    const randomForSobre = getRandomImages(sobreCards.length);
    sobreCards.forEach((img, i) => {
      img.src = imageBase + randomForSobre[i];
    });
  }

  onScroll();
});
