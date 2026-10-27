/* AROOJ MEHMOOD — PORTFOLIO  */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*  Preloader  */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => preloader.classList.add('loaded'), 400);
  });

  /*  Lenis smooth scroll  */
  let lenis;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      normalizeWheel: true
    });

    // Single driver loop (avoid double-driving Lenis, which was causing the stuck/jerky scroll)
    if (window.gsap && window.gsap.ticker) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      });
    }

    // Keep GSAP ScrollTrigger in sync with Lenis' virtual scroll
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Smoothly scroll to in-page anchors (nav links, hero CTA, scroll indicator, back-to-top)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      });
    });
  }

  /*  AOS  */
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic', offset: 40 });
  }

  /*  Cursor glow (desktop only)  */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  /*  Scroll progress bar  */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  }
  window.addEventListener('scroll', updateScrollProgress);

  /*  Navbar scroll state  */
  const navbar = document.getElementById('navbar');
  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNavbar);
  updateNavbar();

  /*  Mobile menu  */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /*  Active section indicator  */
  const sections = document.querySelectorAll('main section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.nav === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(sec => sectionObserver.observe(sec));

  /*  Typed.js  */
  if (window.Typed) {
    new Typed('#typed', {
      strings: ['Frontend Web Developer', 'BSCS Student', 'MERN Stack Learner', 'Problem Solver'],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      showCursor: false
    });
  }

  /*  tsParticles network background  */
  if (window.tsParticles) {
    tsParticles.load('particles-network', {
      fpsLimit: 60,
      particles: {
        number: { value: 46, density: { enable: true, area: 900 } },
        color: { value: ['#EE4540', '#C72C41', '#F7EEF2'] },
        links: { enable: true, color: '#C72C41', distance: 130, opacity: 0.35, width: 1 },
        move: { enable: true, speed: 0.6, outModes: { default: 'out' } },
        size: { value: { min: 1, max: 3 } },
        opacity: { value: 0.55 }
      },
      interactivity: {
        events: { onHover: { enable: true, mode: 'grab' }, resize: true },
        modes: { grab: { distance: 150, links: { opacity: 0.5 } } }
      },
      detectRetina: true
    });
  }

  /*  GSAP counters  */
  const statNums = document.querySelectorAll('.stat-num');
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    statNums.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const isDecimal = el.dataset.decimal === 'true';
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = isDecimal ? obj.val.toFixed(2) : Math.round(obj.val);
            }
          });
        }
      });
    });

    /* Skill bars fill on scroll */
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 90%',
        once: true,
        onEnter: () => { bar.style.width = bar.dataset.level + '%'; }
      });
    });

    /* Hero entrance orchestration */
    if (!reduceMotion) {
      gsap.from('.hero-photo-ring', { opacity: 0, scale: 0.8, duration: 1, delay: 0.2, ease: 'back.out(1.6)' });
      gsap.from('.hero-badge', { opacity: 0, y: 20, stagger: 0.15, delay: 0.6, duration: 0.8, ease: 'power2.out' });
    }
  } else {
    // Fallback if GSAP fails to load
    statNums.forEach(el => { el.textContent = el.dataset.decimal === 'true' ? parseFloat(el.dataset.count).toFixed(2) : el.dataset.count; });
    document.querySelectorAll('.skill-bar-fill').forEach(bar => bar.style.width = bar.dataset.level + '%');
  }

  /*  Magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(btn => {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /*  Vanilla Tilt on project cards  */
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('.project-card-inner'), {
      max: 6,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.01
    });
  }

    /*  Project filtering + Show More  */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const showMoreWrap = document.getElementById('showMoreWrap');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const INITIAL_VISIBLE = 6; // how many cards to show before "Show More"
  let activeFilter = 'all';
  let showAll = false;

  function renderProjects(refreshLayout) {
    // Cards matching the current filter, in page order
    const matching = Array.from(projectCards).filter(card => {
      const cats = card.dataset.category || '';
      return activeFilter === 'all' || cats.split(' ').includes(activeFilter);
    });

    projectCards.forEach(card => {
      const index = matching.indexOf(card);
      const visible = index !== -1 && (showAll || index < INITIAL_VISIBLE);
      card.classList.toggle('hide', !visible);
    });

    // Show the button only when some matching cards are still hidden/expandable
    const extra = matching.length - INITIAL_VISIBLE;
    if (showMoreWrap && showMoreBtn) {
      showMoreWrap.hidden = extra <= 0;
      showMoreBtn.classList.toggle('is-open', showAll);
      showMoreBtn.setAttribute('aria-expanded', showAll);
      showMoreBtn.querySelector('span').textContent =
        showAll ? 'Show Less' : `Show More Projects (${Math.max(extra, 0)})`;
    }

    // Page height changed, so recalculate scroll-based libraries
    if (refreshLayout) {
      if (window.AOS) AOS.refresh();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      showAll = false; // every new filter starts collapsed
      renderProjects(true);
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      showAll = !showAll;
      renderProjects(true);
      // When collapsing, bring the user back to the top of the projects section
      if (!showAll) {
        const section = document.getElementById('work');
        if (lenis) lenis.scrollTo(section, { offset: -70, duration: 1.1 });
        else section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

    renderProjects(false); // initial state: first 6 only

  const refreshScrollLibs = () => {
    if (window.AOS) AOS.refresh();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  };
  refreshScrollLibs();
  window.addEventListener('load', () => setTimeout(refreshScrollLibs, 300));

  /*  Certificates Swiper  */
  // let certSwiper;
  // if (window.Swiper) {
  //   certSwiper = new Swiper('.cert-swiper', {
  //     slidesPerView: 1.2,
  //     spaceBetween: 20,
  //     observer: true,
  //     observeParents: true,
  //     observeSlideChildren: true,
  //     resizeObserver: true,
  //     pagination: { el: '.cert-swiper .swiper-pagination', clickable: true },
  //     breakpoints: {
  //       560: { slidesPerView: 2.2 },
  //       900: { slidesPerView: 3.2 },
  //       1200: { slidesPerView: 4.2 }
  //     }
  //   });
   
  //   window.addEventListener('load', () => certSwiper.update());
  //   setTimeout(() => certSwiper.update(), 600);
  // }

  /*  Certificates Swiper (auto-scrolling + draggable)  */
  let certSwiper;
  if (window.Swiper) {
    // Duplicate the cards once so loop mode has enough slides to scroll endlessly
    const certWrapper = document.querySelector('.cert-swiper .swiper-wrapper');
    certWrapper.innerHTML += certWrapper.innerHTML;

    certSwiper = new Swiper('.cert-swiper', {
      slidesPerView: 1.2,
      spaceBetween: 20,
      loop: true,
      speed: 2500,
      grabCursor: true,
      autoplay: reduceMotion ? false : {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      observer: true,
      observeParents: true,
      resizeObserver: true,
      breakpoints: {
        560: { slidesPerView: 2.2 },
        900: { slidesPerView: 3.2 },
        1200: { slidesPerView: 4.2 }
      }
    });
    window.addEventListener('load', () => certSwiper.update());
  }


  /*  Toast notifications */
  const toastStack = document.getElementById('toastStack');
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toastStack.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 400);
    }, 3400);
  }

  /*  Contact form validation */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameGroup = document.getElementById('nameInput').closest('.form-group');
    const emailGroup = document.getElementById('emailInput').closest('.form-group');
    const subjectGroup = document.getElementById('subjectInput').closest('.form-group');
    const messageGroup = document.getElementById('messageInput').closest('.form-group');

    const name = document.getElementById('nameInput').value.trim();
    const email = document.getElementById('emailInput').value.trim();
    const subject = document.getElementById('subjectInput').value.trim();
    const message = document.getElementById('messageInput').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [nameGroup, emailGroup, subjectGroup, messageGroup].forEach(g => g.classList.remove('invalid'));

    if (!name) { nameGroup.classList.add('invalid'); valid = false; }
    if (!email || !emailPattern.test(email)) { emailGroup.classList.add('invalid'); valid = false; }
    if (!subject) { subjectGroup.classList.add('invalid'); valid = false; }
    if (!message) { messageGroup.classList.add('invalid'); valid = false; }

    if (!valid) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    showToast('Message sent — thanks for reaching out!', 'success');
    contactForm.reset();
  });

  /*  Back to top */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /*  Footer year  */
  document.getElementById('year').textContent = new Date().getFullYear();

});