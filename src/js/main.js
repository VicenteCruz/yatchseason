/* ============================================
   YACHT SEASON â€” Interactions & WOW Animations
   Mobile-First Premium Experience
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth <= 768;

  // ========================================
  // CUSTOM CURSOR (desktop only)
  // ========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (!isTouchDevice && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic, .nav-links a, .footer-social a, .destino-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

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

    // Active section
    let currentSection = 'hero';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + section.offsetHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    // Update body class for cursor shape
    const sectionClasses = Array.from(sections).map(s => 'section-' + s.getAttribute('id'));
    document.body.classList.remove(...sectionClasses, 'section-hero'); // Ensure section-hero is removed too in case it's not in sections array
    if (currentSection) {
      document.body.classList.add('section-' + currentSection);
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateNavbar); ticking = true; }
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
        lenis.scrollTo(target, { offset: -navbar.offsetHeight });

        if (mobileMenu.classList.contains('open')) closeMobileMenu();
      }
    });
  });

  // ========================================
  // MOBILE MENU (enhanced with stagger)
  // ========================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Hide mobile CTA while menu is open
    const cta = document.getElementById('mobileCta');
    if (cta) cta.style.display = 'none';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    // Restore mobile CTA
    const cta = document.getElementById('mobileCta');
    if (cta) cta.style.display = '';
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ========================================
  // FLOATING MOBILE CTA
  // ========================================
  const mobileCta = document.getElementById('mobileCta');

  if (mobileCta) {
    let lastScrollY = window.scrollY;
    let ctaVisible = false;
    const heroSection = document.getElementById('hero');

    function updateMobileCta() {
      const scrollY = window.scrollY;
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : window.innerHeight;
      const isScrollingDown = scrollY > lastScrollY;
      const isScrollingUp = scrollY < lastScrollY;

      // Only show when scrolling UP and past the hero section
      if (scrollY > heroBottom && isScrollingUp) {
        mobileCta.classList.add('visible');
      } 
      // Hide when scrolling DOWN
      else if (isScrollingDown) {
        mobileCta.classList.remove('visible');
      }

      // Always hide if we are back at the top
      if (scrollY < heroBottom * 0.5) {
        mobileCta.classList.remove('visible');
      }

      // Always hide if we reach the pricing section (redundant)
      const precosSection = document.getElementById('precos');
      if (precosSection) {
        const precosTop = precosSection.getBoundingClientRect().top;
        if (precosTop < window.innerHeight * 0.7) {
          mobileCta.classList.remove('visible');
        }
      }

      lastScrollY = scrollY;
    }

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateMobileCta);
    }, { passive: true });
  }

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
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: isMobile ? 0.08 : 0.12,
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================
  // HERO PARALLAX & FLOATING SHAPES
  // ========================================
  const heroBgImg = document.getElementById('heroBgImg');
  const heroShapes = document.getElementById('heroShapes');
  const shapes = heroShapes ? heroShapes.querySelectorAll('.shape') : [];

  // Mouse parallax for shapes (desktop)
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

  // Scroll parallax for hero bg (both mobile and desktop, GPU-accelerated)
  if (heroBgImg) {
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY <= window.innerHeight) {
            const rate = isMobile ? 0.15 : 0.3;
            heroBgImg.style.transform = `translate3d(0, ${scrollY * rate}px, 0) scale(1.08)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });

    heroBgImg.style.willChange = 'transform';
    heroBgImg.style.transition = 'none'; // Remove transition for smooth GPU animation
  }

  // ========================================
  // 3D TILT EFFECT (desktop only)
  // ========================================
  if (!isTouchDevice) {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -1.5;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 1.5;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
        el.style.transition = 'transform 0.5s ease';
      });
      el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.15s ease'; });
    });

    const tiltGallery = document.querySelectorAll('[data-tilt-gallery]');

    tiltGallery.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -1.2;
        const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 1.2;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
      el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.15s ease'; });
    });
  }

  // ========================================
  // MAGNETIC BUTTONS (desktop only)
  // ========================================
  if (!isTouchDevice) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
      btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.1s ease'; });
    });
  }

  // ========================================
  // HORIZONTAL SCROLL â€” DESTAQUES
  // ========================================
  const hscrollWrapper = document.getElementById('hscrollWrapper');
  const hscrollTrack = document.getElementById('hscrollTrack');

  if (hscrollWrapper && hscrollTrack && !isMobile) {
    const updateHorizontalScroll = () => {
      const wrapperRect = hscrollWrapper.getBoundingClientRect();
      const wrapperHeight = hscrollWrapper.offsetHeight;
      const viewportHeight = window.innerHeight;
      const trackWidth = hscrollTrack.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = trackWidth - viewportWidth;

      // Calculate how far through the wrapper we've scrolled
      const scrollStart = wrapperRect.top;
      const scrollRange = wrapperHeight - viewportHeight;
      const progress = Math.min(1, Math.max(0, -scrollStart / scrollRange));

      hscrollTrack.style.transform = `translate3d(${-progress * maxScroll}px, 0, 0)`;
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateHorizontalScroll);
    }, { passive: true });
  }

  // ========================================
      // TIMELINE SCROLL PROGRESS
  // ========================================
  const updateTimeline = () => {
    // Find the currently visible timeline
    const isCroatia = document.body.classList.contains('theme-croacia');
    const activeTimeline = document.getElementById(isCroatia ? 'timeline-croacia' : 'timeline');
    
    if (!activeTimeline) return;

    // Get items only from the active timeline
    const timelineItems = activeTimeline.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    const timelineRect = activeTimeline.getBoundingClientRect();
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    const viewportMid = window.innerHeight * 0.6;

    // Calculate how far the progress bar should fill
    const scrolled = viewportMid - timelineTop;
    const progress = Math.max(0, Math.min(1, scrolled / timelineHeight));
    activeTimeline.style.setProperty('--timeline-progress', (progress * 100) + '%');

    // Activate items that have scrolled past the viewport midpoint
    let activeIndex = 0;
    timelineItems.forEach((item, index) => {
      const itemRect = item.getBoundingClientRect();
      const dotCenter = itemRect.top + 20;

      if (dotCenter < viewportMid) {
        item.classList.add('is-active');
        activeIndex = index;
      } else {
        item.classList.remove('is-active');
      }
    });

    // Update background image crossfade
    const bgImages = document.querySelectorAll('.timeline-bg-image');
    bgImages.forEach((bg, index) => {
      if (index === activeIndex) {
        bg.classList.add('active');
      } else {
        bg.classList.remove('active');
      }
    });
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateTimeline);
  }, { passive: true });

  // Initial update
  updateTimeline();

  // Also update when clicking to swap themes
  document.addEventListener('click', (e) => {
    if (e.target.closest('#card-grecia') || e.target.closest('#card-croacia') || e.target.closest('#tab-grecia') || e.target.closest('#tab-croacia')) {
      setTimeout(() => requestAnimationFrame(updateTimeline), 50);
    }
  });

  // ========================================
  // BEFORE/AFTER COMPARISON (SCROLL-DRIVEN)
  // ========================================
  const compareContainer = document.getElementById('compareContainer');
  const compareBefore = document.getElementById('compareBefore');
  const compareHandle = document.getElementById('compareHandle');

  if (compareContainer && compareBefore && compareHandle) {
    const updateCompareOnScroll = () => {
      const rect = compareContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startPoint = viewportHeight * 0.35;
      const endPoint = viewportHeight * 0.15;

      const scrolled = startPoint - rect.top;
      const totalDistance = startPoint - endPoint;
      const progress = Math.max(0, Math.min(1, scrolled / totalDistance));

      const clipPercentage = progress * 100;
      const handlePosition = 100 - clipPercentage;

      compareBefore.style.clipPath = `inset(0 ${clipPercentage}% 0 0)`;
      compareHandle.style.left = `${handlePosition}%`;
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateCompareOnScroll);
    }, { passive: true });

    // Initial update
    updateCompareOnScroll();
  }



  // ========================================
  // GALLERY LIGHTBOX + SWIPE GESTURES
  // ========================================
  const galleryClickItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
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

  function updateCounter() {
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }
  }

  function openLightbox() {
    lightboxImg.src = galleryImages[currentLightboxIndex];
    lightboxImg.style.transform = 'scale(0.9)';
    lightboxImg.style.opacity = '0';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCounter();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.opacity = '1';
      });
    });
  }

  function closeLightbox() {
    lightboxImg.style.transform = 'scale(0.9)';
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }, 250);
  }

  function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;

    const dirX = direction > 0 ? 50 : -50;
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `translate3d(${dirX}px, 0, 0) scale(0.95)`;

    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex];
      lightboxImg.style.transform = `translate3d(${-dirX}px, 0, 0) scale(0.95)`;
      updateCounter();

      requestAnimationFrame(() => {
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
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
  // TOUCH SWIPE FOR LIGHTBOX
  // ========================================
  if (isTouchDevice) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoveX = 0;
    let isDragging = false;
    const swipeThreshold = 50;

    lightbox.addEventListener('touchstart', (e) => {
      if (!lightbox.classList.contains('open')) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchMoveX = 0;
      isDragging = true;
      lightboxImg.style.transition = 'none';
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
      if (!isDragging || !lightbox.classList.contains('open')) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;

      // If more vertical than horizontal, don't interfere
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && Math.abs(deltaX) < 20) return;

      touchMoveX = deltaX;

      // Live drag feedback: move image with finger
      const dampened = deltaX * 0.6;
      const scale = 1 - Math.abs(deltaX) * 0.0003;
      lightboxImg.style.transform = `translate3d(${dampened}px, 0, 0) scale(${Math.max(0.9, scale)})`;
      lightboxImg.style.opacity = `${1 - Math.abs(deltaX) * 0.002}`;
    }, { passive: true });

    lightbox.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      lightboxImg.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease';

      if (Math.abs(touchMoveX) > swipeThreshold) {
        const direction = touchMoveX > 0 ? -1 : 1;
        navigateLightbox(direction);
      } else {
        // Snap back with spring
        lightboxImg.style.transform = 'translate3d(0, 0, 0) scale(1)';
        lightboxImg.style.opacity = '1';
      }
    }, { passive: true });

    // Swipe down to close
    let touchStartYClose = 0;
    let touchMoveYClose = 0;

    lightboxImg.addEventListener('touchstart', (e) => {
      touchStartYClose = e.touches[0].clientY;
    }, { passive: true });

    lightboxImg.addEventListener('touchmove', (e) => {
      touchMoveYClose = e.touches[0].clientY - touchStartYClose;
    }, { passive: true });

    lightboxImg.addEventListener('touchend', () => {
      if (touchMoveYClose > 100) {
        closeLightbox();
      }
      touchMoveYClose = 0;
    }, { passive: true });
  }

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
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ========================================
  // MOBILE: HAPTIC GALLERY SCROLL FEEDBACK
  // ========================================
  if (isTouchDevice) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
      let lastSnappedIndex = -1;

      galleryGrid.addEventListener('scroll', () => {
        const scrollLeft = galleryGrid.scrollLeft;
        const itemWidth = galleryGrid.querySelector('.gallery-item')?.offsetWidth || 1;
        const gap = 12;
        const currentIndex = Math.round(scrollLeft / (itemWidth + gap));

        if (currentIndex !== lastSnappedIndex) {
          lastSnappedIndex = currentIndex;
          // Subtle vibration on snap (if supported)
          if (navigator.vibrate) {
            navigator.vibrate(5);
          }
        }
      }, { passive: true });
    }
  }

  // ========================================
  // MOBILE: PRICING CARD SNAP SCROLL
  // ========================================
  if (isMobile) {
    const pricingGrid = document.querySelector('.pricing-grid');
    if (pricingGrid) {
      // Scroll to featured card on load
      const featuredCard = pricingGrid.querySelector('.pricing-card.featured');
      if (featuredCard) {
        setTimeout(() => {
          featuredCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 300);
      }
    }
  }

  // ========================================
  // FAQ ACCORDION
  // ========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ========================================
  // INITIAL STATE
  // ========================================
  updateNavbar();

  // ========================================
  // FLOATING COUNTDOWN
  // ========================================
  const countdownTimer = document.getElementById('countdownTimer');
  const floatingCountdown = document.getElementById('floatingCountdown');

  if (countdownTimer && floatingCountdown) {
    // Target date: June 10 of next year
    const currentYear = new Date().getFullYear();
    const targetDate = new Date(`June 10, ${currentYear + 1} 00:00:00`).getTime();

    // Show after a small delay
    setTimeout(() => {
      floatingCountdown.classList.add('visible');
      
      // Collapse after 4 seconds
      setTimeout(() => {
        floatingCountdown.classList.add('collapsed');
      }, 4000);
    }, 1500);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        countdownTimer.innerHTML = "A ÉPOCA COMEÇOU!";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ========================================
  // PRICING ANIMATION TRIGGER
  // ========================================
  const priceWrapper = document.querySelector('.price-promo-wrapper');
  if (priceWrapper) {
    const pricingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.5 });
    pricingObserver.observe(priceWrapper);
  }

  // ========================================
  // DESTINOS & ITINERARIO THEME TOGGLE
  // ========================================
  const cardGrecia = document.getElementById('card-grecia');
  const cardCroacia = document.getElementById('card-croacia');
  const tabGrecia = document.getElementById('tab-grecia');
  const tabCroacia = document.getElementById('tab-croacia');

  const setGrecia = () => {
    document.body.classList.remove('theme-croacia');
    if (document.getElementById('itinerario-subtitle')) document.getElementById('itinerario-subtitle').innerText = 'A tua semana nas Cíclades, dia a dia.';
    if (tabGrecia && tabCroacia) {
      tabGrecia.classList.add('active');
      tabCroacia.classList.remove('active');
    }
  };

  const setCroacia = () => {
    document.body.classList.add('theme-croacia');
    if (document.getElementById('itinerario-subtitle')) document.getElementById('itinerario-subtitle').innerText = 'A tua semana na Dalmácia, dia a dia.';
    if (tabGrecia && tabCroacia) {
      tabCroacia.classList.add('active');
      tabGrecia.classList.remove('active');
    }
  };

  if (cardGrecia) cardGrecia.addEventListener('click', setGrecia);
  if (cardCroacia) cardCroacia.addEventListener('click', setCroacia);
  if (tabGrecia) tabGrecia.addEventListener('click', setGrecia);
  if (tabCroacia) tabCroacia.addEventListener('click', setCroacia);

});




