/* ═══════════════════════════════════════════════
   PORTFOLIO — PREMIUM JAVASCRIPT
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── 1. Loading Screen ─────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('loaded');
    // Trigger skill bar animations after load
    animateSkillBars();
  }, 1600);
});

/* ─── 2. AOS Init ───────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 750,
    once: true,
    easing: 'ease-out-cubic',
    offset: 60,
  });

  // Initialize all features
  initCursor();
  initScrollProgress();
  initNavbar();
  initTyped();
  initParticles();
  initTestimonials();
  initSectionObserver();
  updateFooterYear();
});

/* ─── 3. Custom Cursor ──────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outline lag
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.14;
    outlineY += (mouseY - outlineY) * 0.14;
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });
}

/* ─── 4. Scroll Progress Bar ────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── 5. Sticky Navbar ─────────────────────── */
function initNavbar() {
  const nav       = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 50);
    backToTop.classList.toggle('visible', y > 400);
  }, { passive: true });
}

/* ─── 6. Typed.js Effect ─────────────────────
   Custom lightweight typed effect (no external lib needed)
   ─────────────────────────────────────────── */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Front-End Developer',
    'UI/UX Enthusiast',
    'CS Student',
    'Java Programmer',
    'Creative Problem Solver',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.slice(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      el.textContent = currentPhrase.slice(0, charIdx + 1);
      charIdx++;
      delay = 120;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short delay
  setTimeout(type, 1000);
}

/* ─── 7. Particle Canvas ────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const COUNT   = 60;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particle pool
  function createParticle() {
    return {
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.5,
      dx:    (Math.random() - 0.5) * 0.4,
      dy:    (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(createParticle());

  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 212, ${p.alpha})`;
      ctx.fill();

      // Draw lines between close particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse attraction
      if (mouse.x !== null) {
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (md < 150) {
          p.x += (mouse.x - p.x) * 0.01;
          p.y += (mouse.y - p.y) * 0.01;
        }
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── 8. Skill Bars Animation ───────────────── */
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const target = fill.getAttribute('data-width');
    setTimeout(() => {
      fill.style.width = target + '%';
    }, 300);
  });
}

// Also trigger when About section comes into view
const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars();
      aboutObserver.disconnect();
    }
  });
}, { threshold: 0.2 });

const aboutSection = document.getElementById('about');
if (aboutSection) aboutObserver.observe(aboutSection);

/* ─── 9. Testimonials Slider ────────────────── */
function initTestimonials() {
  const track  = document.getElementById('testimonialTrack');
  const prev   = document.getElementById('testiPrev');
  const next   = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track) return;

  const cards  = track.querySelectorAll('.testimonial-card');
  let current  = 0;
  let visible  = getVisible();
  let total    = Math.ceil(cards.length / visible);
  let autoplay;

  function getVisible() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768)  return 2;
    return 1;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    visible = getVisible();
    total   = Math.ceil(cards.length / visible);
    for (let i = 0; i < total; i++) {
      const d = document.createElement('div');
      d.className = 'testi-dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const offset = current * (100 / visible) * visible;
    track.style.transform = `translateX(-${current * (100 / total)}%)`;
    // Update dots
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  // Recalculate on resize
  window.addEventListener('resize', () => {
    current = 0;
    buildDots();
    goTo(0);
  });

  buildDots();

  prev.addEventListener('click', () => {
    goTo(current - 1 < 0 ? total - 1 : current - 1);
    resetAutoplay();
  });
  next.addEventListener('click', () => {
    goTo((current + 1) % total);
    resetAutoplay();
  });

  // Autoplay
  function startAutoplay() {
    autoplay = setInterval(() => {
      goTo((current + 1) % total);
    }, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }
  startAutoplay();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
      resetAutoplay();
    }
  });
}

/* ─── 10. Active Nav Link Observer ──────────── */
function initSectionObserver() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}

/* ─── 11. Form Validation ───────────────────── */
function submitForm() {
  const name    = document.getElementById('contactName');
  const email   = document.getElementById('contactEmail');
  const subject = document.getElementById('contactSubject');
  const msg     = document.getElementById('contactMsg');
  const btn     = document.getElementById('sendBtn');
  const btnText = document.getElementById('btnText');
  const btnLoad = document.getElementById('btnLoader');

  let valid = true;

  function setErr(input, errId, msg) {
    const err = document.getElementById(errId);
    if (!msg) {
      input.classList.remove('is-invalid');
      err.textContent = '';
    } else {
      input.classList.add('is-invalid');
      err.textContent = msg;
      valid = false;
    }
  }

  // Reset errors
  [name, email, subject, msg].forEach(el => el.classList.remove('is-invalid'));

  // Validate
  if (!name.value.trim())
    setErr(name, 'errName', 'Please enter your full name.');
  else
    setErr(name, 'errName', '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim())
    setErr(email, 'errEmail', 'Email address is required.');
  else if (!emailRegex.test(email.value.trim()))
    setErr(email, 'errEmail', 'Please enter a valid email address.');
  else
    setErr(email, 'errEmail', '');

  if (!subject.value.trim())
    setErr(subject, 'errSubject', 'Please provide a subject.');
  else
    setErr(subject, 'errSubject', '');

  if (!msg.value.trim() || msg.value.trim().length < 10)
    setErr(msg, 'errMsg', 'Message must be at least 10 characters.');
  else
    setErr(msg, 'errMsg', '');

  if (!valid) return;

  // Simulate send
  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoad.style.display = 'flex';

  setTimeout(() => {
    document.getElementById('contactFormInner').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'flex';
    document.getElementById('formSuccess').style.flexDirection = 'column';
    document.getElementById('formSuccess').style.alignItems = 'center';
  }, 1800);
}

/* ─── 12. Footer Year ───────────────────────── */
function updateFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── 13. Smooth Page Transition ────────────── */
// Smooth nav link scrolling (enhance Bootstrap's default)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();

    // Close mobile menu if open
    const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('show')) {
      const toggler = document.querySelector('.navbar-toggler');
      toggler.click();
    }

    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── 14. Ambient Glow on Hero Mouse Move ───── */
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    heroSection.style.setProperty('--mx', x + '%');
    heroSection.style.setProperty('--my', y + '%');
  });
}
