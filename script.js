/* ============================================
   YACHT SEASON — Interactions & WOW Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // CUSTOM CURSOR
  // ========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow with lerp
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state for interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic, .nav-links a, .footer-social a');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Gallery cursor state
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-gallery');
        document.body.classList.remove('cursor-hover');
      });
      item.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-gallery');
      });
    });
  }

  // ========================================
  // NAVBAR
  // ========================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offset = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });

        if (mobileMenu.classList.contains('open')) {
          closeMobileMenu();
        }
      }
    });
  });

  // ========================================
  // MOBILE MENU
  // ========================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (parent && parent.classList.contains('stagger')) {
          const children = Array.from(parent.children);
          const index = children.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.12}s`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // HERO PARALLAX & FLOATING SHAPES
  // ========================================
  const heroBgImg = document.getElementById('heroBgImg');
  const heroShapes = document.getElementById('heroShapes');
  const shapes = heroShapes ? heroShapes.querySelectorAll('.shape') : [];

  // Mouse parallax for floating shapes
  if (heroShapes && !isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      shapes.forEach(shape => {
        const speed = parseFloat(shape.dataset.speed) || 0.03;
        const moveX = deltaX * speed * 100;
        const moveY = deltaY * speed * 100;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  // Hero background parallax on scroll
  if (heroBgImg) {
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = window.innerHeight;
          if (scrollY <= heroHeight) {
            const translateY = scrollY * 0.3;
            heroBgImg.style.transform = `translateY(${translateY}px) scale(1.08)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });

    heroBgImg.style.transition = 'transform 0.1s linear';
  }

  // ========================================
  // 3D TILT EFFECT
  // ========================================
  if (!isTouchDevice) {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
        
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        el.style.transition = 'transform 0.5s ease';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease';
      });
    });

    // Gallery 3D tilt (stronger effect)
    const tiltGallery = document.querySelectorAll('[data-tilt-gallery]');
    
    tiltGallery.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -3;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 3;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease';
      });
    });
  }

  // ========================================
  // MAGNETIC BUTTONS
  // ========================================
  if (!isTouchDevice) {
    const magneticBtns = document.querySelectorAll('.magnetic');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ========================================
  // TIMELINE DRAWING ON SCROLL
  // ========================================
  const timeline = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineItems = document.querySelectorAll('[data-timeline]');

  if (timeline && timelineProgress) {
    const updateTimeline = () => {
      const timelineRect = timeline.getBoundingClientRect();
      const timelineHeight = timeline.offsetHeight;
      const viewportCenter = window.innerHeight * 0.6;

      // Calculate how far through the timeline we've scrolled
      const progress = Math.min(1, Math.max(0,
        (viewportCenter - timelineRect.top) / timelineHeight
      ));

      // Update the SVG line
      const totalLength = timelineHeight;
      timelineProgress.style.strokeDasharray = `${totalLength}`;
      timelineProgress.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

      // Reveal timeline items based on scroll position
      timelineItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < window.innerHeight * 0.75) {
          setTimeout(() => {
            item.classList.add('visible');
          }, index * 80);
        }
      });
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateTimeline);
    }, { passive: true });

    // Initial call
    updateTimeline();
  }

  // ========================================
  // GALLERY LIGHTBOX
  // ========================================
  const galleryClickItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentLightboxIndex = 0;
  const galleryImages = [];

  galleryClickItems.forEach((item, index) => {
    const img = item.querySelector('img');
    galleryImages.push(img.src);

    item.addEventListener('click', () => {
      currentLightboxIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightboxImg.src = galleryImages[currentLightboxIndex];
    lightboxImg.style.transform = 'scale(0.9)';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Animate in
    requestAnimationFrame(() => {
      lightboxImg.style.transform = 'scale(1)';
    });
  }

  function closeLightbox() {
    lightboxImg.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }, 200);
  }

  function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
    
    const dirX = direction > 0 ? 40 : -40;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `translateX(${dirX}px) scale(0.95)`;
    
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex];
      lightboxImg.style.transform = `translateX(${-dirX}px) scale(0.95)`;
      
      requestAnimationFrame(() => {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'translateX(0) scale(1)';
      });
    }, 200);
  }

  lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ========================================
  // COUNTER ANIMATION
  // ========================================
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  function animateCounter(el, target) {
    let current = 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================
  // INITIAL STATE
  // ========================================
  updateNavbar();

});
