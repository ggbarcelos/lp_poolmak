document.addEventListener('DOMContentLoaded', function () {

  // NAVBAR TOGGLE
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

    // Progress bar
    if (progressBar) {
      progressBar.style.width = Math.min((scrollY / docHeight) * 100, 100) + '%';
    }

    // Navbar
    nav.classList.toggle('scrolled', scrollY > 80);

    // Parallax fullbleed
    if (fullbleedBg && fullbleed) {
      const rect = fullbleed.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.15;
        const offset = rect.top * speed;
        fullbleedBg.style.transform = `translateY(${offset}px)`;
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
        el.parentNode.style.animation = 'countPop 0.3s ease';
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

  // FAQ ACCORDION
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

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = nav.offsetHeight + 12;
        const pos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: pos, behavior: 'smooth' });
        links.classList.remove('open');
      }
    });
  });

  // ─── REVEAL ON SCROLL (enhanced) ───
  const revealElements = document.querySelectorAll(
    '.step, .v-card, .spec-item, .faq-item, .sobre-card, .features-mini div'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentNode;
        const idx = Array.from(parent.children).indexOf(entry.target);
        const delay = idx * 60;
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
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

  // Trigger initial scroll
  onScroll();

});
