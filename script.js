(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileWhatsApp = document.querySelector('.mobile-whatsapp');
  const finalCta = document.querySelector('.final-cta');

  const startPage = async () => {
    try {
      await document.fonts.ready;
    } catch (_) {
      // Font loading is an enhancement; the page should always reveal.
    }

    requestAnimationFrame(() => {
      body.classList.remove('is-loading');
      body.classList.add('is-ready');
    });
  };

  startPage();

  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  const onScroll = () => {
    header?.classList.toggle('is-stuck', window.scrollY > 38);
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const revealItems = document.querySelectorAll('.split-reveal, .reveal-label');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  // IntersectionObserver can delay its first callback after a direct hash jump.
  // This lightweight geometry check keeps headings visible in that edge case.
  const revealVisible = () => {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    revealItems.forEach((item) => {
      if (item.classList.contains('in-view')) return;
      const rect = item.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
        item.classList.add('in-view');
      }
    });
  };

  revealVisible();
  window.addEventListener('scroll', revealVisible, { passive: true });
  window.addEventListener('resize', revealVisible);

  const lessons = [...document.querySelectorAll('.lesson')];
  const currentStep = document.querySelector('.system-current');
  const progressFill = document.querySelector('.system-progress-line span');

  const setLesson = (lesson) => {
    const step = Number(lesson.dataset.step);
    lessons.forEach((item) => item.classList.toggle('is-active', item === lesson));
    if (currentStep) currentStep.textContent = lesson.dataset.step;
    if (progressFill) progressFill.style.height = `${((step - 1) / (lessons.length - 1)) * 100}%`;
  };

  const lessonObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visible[0]) setLesson(visible[0].target);
  }, {
    threshold: [0.35, 0.55, 0.75],
    rootMargin: '-18% 0px -34% 0px'
  });

  lessons.forEach((lesson) => lessonObserver.observe(lesson));

  const programRows = [...document.querySelectorAll('.program-row')];
  programRows.forEach((row) => {
    row.addEventListener('toggle', () => {
      if (!row.open) return;
      programRows.forEach((other) => {
        if (other !== row) other.open = false;
      });
    });
  });

  const faqRows = [...document.querySelectorAll('.faq-list details')];
  faqRows.forEach((row) => {
    row.addEventListener('toggle', () => {
      if (!row.open) return;
      faqRows.forEach((other) => {
        if (other !== row) other.open = false;
      });
    });
  });

  const magneticActions = document.querySelectorAll('.action');
  const allowsPointerMotion = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (allowsPointerMotion) {
    magneticActions.forEach((action) => {
      action.addEventListener('pointermove', (event) => {
        const rect = action.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        action.style.setProperty('--magnetic-x', `${x * 0.08}px`);
        action.style.setProperty('--magnetic-y', `${y * 0.13}px`);
        action.classList.add('is-magnetic');
      });

      action.addEventListener('pointerleave', () => {
        action.classList.remove('is-magnetic');
        action.style.removeProperty('--magnetic-x');
        action.style.removeProperty('--magnetic-y');
      });
    });
  }

  const navigationLinks = [...document.querySelectorAll('.desktop-nav a')];
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.desktop-nav a, .mobile-menu a, .site-footer nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('#')[0] || 'index.html';
    if (linkFile === currentFile && !href.startsWith('#')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  const sections = navigationLinks
    .map((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, {
    threshold: 0.12,
    rootMargin: '-20% 0px -65% 0px'
  });

  sections.forEach((section) => navObserver.observe(section));

  if (mobileWhatsApp && finalCta) {
    const mobileCtaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        mobileWhatsApp.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    mobileCtaObserver.observe(finalCta);
  }

  const carousel = document.querySelector('[data-testimonial-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
    const previous = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const toggle = carousel.querySelector('[data-carousel-toggle]');
    const toggleLabel = carousel.querySelector('[data-carousel-toggle-label]');
    const status = carousel.querySelector('[data-carousel-status]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timer = null;
    let userPaused = reduceMotion;
    let temporarilyPaused = false;

    const paintCarousel = () => {
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      slides.forEach((slide, index) => {
        const isCurrent = index === activeIndex;
        slide.classList.toggle('is-current', isCurrent);
        slide.setAttribute('aria-hidden', String(!isCurrent));
      });
      status.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };

    const stopAutoplay = () => {
      window.clearInterval(timer);
      timer = null;
    };

    const startAutoplay = () => {
      stopAutoplay();
      if (userPaused || temporarilyPaused || document.hidden || slides.length < 2) return;
      timer = window.setInterval(() => {
        activeIndex = (activeIndex + 1) % slides.length;
        paintCarousel();
      }, 5200);
    };

    const moveCarousel = (direction) => {
      activeIndex = (activeIndex + direction + slides.length) % slides.length;
      paintCarousel();
      startAutoplay();
    };

    previous?.addEventListener('click', () => moveCarousel(-1));
    next?.addEventListener('click', () => moveCarousel(1));
    toggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggleLabel.textContent = userPaused ? 'Resume' : 'Pause';
      if (userPaused) stopAutoplay();
      else startAutoplay();
    });

    carousel.addEventListener('mouseenter', () => {
      temporarilyPaused = true;
      stopAutoplay();
    });
    carousel.addEventListener('mouseleave', () => {
      temporarilyPaused = false;
      startAutoplay();
    });
    carousel.addEventListener('focusin', () => {
      temporarilyPaused = true;
      stopAutoplay();
    });
    carousel.addEventListener('focusout', (event) => {
      if (carousel.contains(event.relatedTarget)) return;
      temporarilyPaused = false;
      startAutoplay();
    });
    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveCarousel(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveCarousel(1);
      }
    });
    document.addEventListener('visibilitychange', startAutoplay);

    paintCarousel();
    startAutoplay();
  }

  const journeyEntries = [...document.querySelectorAll('.journey-entry')];
  if (journeyEntries.length) {
    const journeyVisibility = new Map();
    const journeyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed');
        journeyVisibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const currentEntry = [...journeyVisibility.entries()]
        .sort((a, b) => b[1] - a[1])
        .find(([, ratio]) => ratio >= 0.12)?.[0];
      journeyEntries.forEach((entry) => entry.classList.toggle('is-current', entry === currentEntry));
    }, {
      threshold: [0.12, 0.28, 0.55],
      rootMargin: '-16% 0px -28% 0px'
    });

    journeyEntries.forEach((entry) => journeyObserver.observe(entry));
  }

  const movableNotes = [...document.querySelectorAll('.community-note')];
  const clampNotePosition = (value, limit) => Math.min(limit, Math.max(-limit, value));
  movableNotes.forEach((note) => {
    let x = 0;
    let y = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let originX = 0;
    let originY = 0;
    let activePointer = null;

    const paintNote = () => {
      note.style.setProperty('--drag-x', `${x}px`);
      note.style.setProperty('--drag-y', `${y}px`);
    };

    if (allowsPointerMotion) {
      note.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        activePointer = event.pointerId;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        originX = x;
        originY = y;
        note.setPointerCapture(activePointer);
        note.classList.add('is-dragging');
      });

      note.addEventListener('pointermove', (event) => {
        if (event.pointerId !== activePointer) return;
        x = clampNotePosition(originX + event.clientX - pointerStartX, 160);
        y = clampNotePosition(originY + event.clientY - pointerStartY, 110);
        paintNote();
      });

      const finishDrag = (event) => {
        if (event.pointerId !== activePointer) return;
        note.classList.remove('is-dragging');
        activePointer = null;
      };

      note.addEventListener('pointerup', finishDrag);
      note.addEventListener('pointercancel', finishDrag);
    }

    note.addEventListener('keydown', (event) => {
      const movement = event.shiftKey ? 28 : 12;
      if (event.key === 'ArrowLeft') x -= movement;
      else if (event.key === 'ArrowRight') x += movement;
      else if (event.key === 'ArrowUp') y -= movement;
      else if (event.key === 'ArrowDown') y += movement;
      else return;

      event.preventDefault();
      x = clampNotePosition(x, 160);
      y = clampNotePosition(y, 110);
      paintNote();
    });
  });
})();
