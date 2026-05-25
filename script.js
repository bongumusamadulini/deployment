/* =============================================
   BONGUMUSA MADULINI — PORTFOLIO SCRIPT
   ============================================= */

// ─── CUSTOM CURSOR ───────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor scale on hover
document.querySelectorAll('a, button, .skill-card, .project-card, .social-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '14px';
    cursor.style.height = '14px';
    follower.style.width = '50px';
    follower.style.height = '50px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '8px';
    cursor.style.height = '8px';
    follower.style.width = '30px';
    follower.style.height = '30px';
  });
});

// ─── NAVIGATION ──────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Scroll effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveLink();
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active link on scroll
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ─── GSAP ANIMATIONS ─────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Hero entrance
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .from('.hero-available', { y: 30, opacity: 0, duration: 0.6 })
  .from('.hero-title', { y: 50, opacity: 0, duration: 0.8 }, '-=0.3')
  .from('.hero-roles', { y: 30, opacity: 0, duration: 0.6 }, '-=0.5')
  .from('.hero-desc', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.hero-actions', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
  .from('.hero-stats', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
  .from('.profile-ring-outer', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.8')
  .from('.profile-badge', { y: 20, opacity: 0, duration: 0.5, stagger: 0.2 }, '-=0.4');

// Section reveals
gsap.utils.toArray('.section-container').forEach(container => {
  gsap.from(container.querySelector('.section-tag'), {
    scrollTrigger: { trigger: container, start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.5
  });
  gsap.from(container.querySelector('.section-title'), {
    scrollTrigger: { trigger: container, start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.6, delay: 0.1
  });
});

// About grid
gsap.from('.about-text', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
  x: -40, opacity: 0, duration: 0.7, ease: 'power2.out'
});
gsap.from('.about-code-card', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
  x: 40, opacity: 0, duration: 0.7, ease: 'power2.out'
});

// Skill cards stagger
gsap.from('.skill-card', {
  scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' },
  y: 40, opacity: 0, duration: 0.5,
  stagger: 0.07, ease: 'power2.out',
  onComplete: () => {
    // Animate skill bars after cards appear
    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = bar.style.width;
    });
  }
});

// Trigger skill bars
ScrollTrigger.create({
  trigger: '.skills-grid',
  start: 'top 75%',
  onEnter: () => {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = targetWidth; }, 300);
    });
  }
});

// Education cards
gsap.from('.edu-card', {
  scrollTrigger: { trigger: '.education-grid', start: 'top 80%' },
  y: 40, opacity: 0, duration: 0.6,
  stagger: 0.15, ease: 'power2.out'
});

// Project cards
gsap.from('.project-card', {
  scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
  y: 50, opacity: 0, duration: 0.6,
  stagger: 0.12, ease: 'power2.out'
});

// Contact section
gsap.from('.contact-form-wrap', {
  scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
  x: -40, opacity: 0, duration: 0.7, ease: 'power2.out'
});
gsap.from('.contact-info', {
  scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
  x: 40, opacity: 0, duration: 0.7, ease: 'power2.out'
});

// ─── CONTACT FORM (Mailto) ───────────────────
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }

  // Show loading state
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'flex';
  submitBtn.disabled = true;

  // Build mailto link
  // ⚠️  REPLACE the email address below with your actual email
  const yourEmail = 'bongumusamadulini@gmail.com';
  const mailtoSubject = encodeURIComponent(`[Portfolio] ${subject}`);
  const mailtoBody = encodeURIComponent(
    `Hi Bongumusa,\n\nMy name is ${name} (${email}).\n\n${message}\n\nSent from your portfolio contact form.`
  );
  const mailtoLink = `mailto:${yourEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  // Small delay for UX then open mail client
  setTimeout(() => {
    window.location.href = mailtoLink;

    // Restore button
    submitBtn.querySelector('.btn-text').style.display = 'flex';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
    submitBtn.disabled = false;

    showStatus('✓ Your email client has been opened. Hit Send to deliver your message!', 'success');
    contactForm.reset();
  }, 900);
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
  setTimeout(() => {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }, 6000);
}

// ─── SMOOTH SCROLL ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
