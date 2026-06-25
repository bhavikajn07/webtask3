/* ============================================================
   TASK 3 — PARALLAX ENGINE + ROBOT PET
   Multi-layer scroll & mouse parallax + interactive robot
   ============================================================ */

'use strict';

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  //  PARALLAX LAYERS
  // ============================================================
  if (!prefersReducedMotion) {
    const layers = document.querySelectorAll('.parallax-layer');
    const contentLayer = document.querySelector('.parallax-content');
    const depthBg = document.querySelector('.depth-parallax-bg');

    // Particle Generation
    const particleContainer = document.getElementById('parallax-particles');
    if (particleContainer) {
      const colors = ['#a855f7', '#e879f9', '#c4b5fd'];
      for (let i = 0; i < 40; i++) {
        const dot = document.createElement('div');
        dot.className = 'parallax-particle';
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        dot.style.opacity = Math.random() * 0.5 + 0.2;
        dot.style.width = `${Math.random() * 3 + 1}px`;
        dot.style.height = dot.style.width;
        dot.style.boxShadow = `0 0 ${Math.random() * 6 + 2}px ${dot.style.backgroundColor}`;
        particleContainer.appendChild(dot);
      }
    }

    let mouseX = 0, mouseY = 0, scrollY = 0, ticking = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!ticking) requestAnimationFrame(updateParallax);
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
      if (!ticking) requestAnimationFrame(updateParallax);
    }, { passive: true });

    function updateParallax() {
      ticking = true;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed) || 0.5;
        const yOffset = scrollY * speed * 0.3;
        const xOffset = mouseX * speed * 15;
        layer.style.transform = `translate3d(${xOffset}px, ${-yOffset}px, 0)`;
      });
      if (contentLayer) {
        contentLayer.style.transform = `translate3d(${mouseX * 10}px, ${mouseY * 8}px, 0)`;
      }
      if (depthBg) {
        depthBg.style.transform = `translate3d(${mouseX * 20}px, ${-scrollY * 0.15}px, 0)`;
      }
      ticking = false;
    }

    // Floating Orbs
    const orbs = document.querySelectorAll('.parallax-orb');
    let orbTime = 0;
    function animateOrbs() {
      orbTime += 0.005;
      orbs.forEach((orb, i) => {
        const dx = Math.sin(orbTime + i * 1.5) * 30 + mouseX * 20;
        const dy = Math.cos(orbTime + i * 2) * 20 + mouseY * 15;
        orb.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      requestAnimationFrame(animateOrbs);
    }
    if (orbs.length) animateOrbs();
  }

  // ============================================================
  //  SCROLL REVEAL
  // ============================================================
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    reveals.forEach((el) => observer.observe(el));
  }

  // ============================================================
  //  ROBOT PET — Drag, Typing, Angry State
  // ============================================================
  const robot = document.getElementById('robot-pet');
  if (!robot) return;

  let isDragging = false;
  let dragCount = 0;
  let dragTimestamps = [];
  let isAngry = false;
  let isResting = false;
  let cooldownTimer = null;
  let isTyping = false;

  const DRAG_THRESHOLD = 5;       // drags within window to trigger angry
  const DRAG_WINDOW = 60000;      // 1 minute in ms
  const REST_DURATION = 5000;     // 5 seconds rest

  // ── Dragging ──
  robot.addEventListener('mousedown', (e) => {
    if (isResting || isAngry) return;
    isDragging = true;
    robot.style.cursor = 'grabbing';
    robot.style.transition = 'none';

    const rect = robot.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    function onMove(ev) {
      if (!isDragging) return;
      const x = ev.clientX - offsetX;
      const y = ev.clientY - offsetY;
      robot.style.left = `${Math.max(0, Math.min(window.innerWidth - 70, x))}px`;
      robot.style.top = `${Math.max(0, Math.min(window.innerHeight - 100, y))}px`;
      robot.style.right = 'auto';
      robot.style.bottom = 'auto';
    }

    function onUp() {
      isDragging = false;
      robot.style.cursor = 'grab';
      robot.style.transition = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);

      // Track drag
      const now = Date.now();
      dragTimestamps.push(now);
      dragTimestamps = dragTimestamps.filter((t) => now - t < DRAG_WINDOW);
      dragCount = dragTimestamps.length;

      if (dragCount >= DRAG_THRESHOLD && !isAngry && !isResting) {
        triggerAngry();
      }
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Touch support
  robot.addEventListener('touchstart', (e) => {
    if (isResting || isAngry) return;
    isDragging = true;
    const touch = e.touches[0];
    const rect = robot.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    function onMove(ev) {
      if (!isDragging) return;
      const t = ev.touches[0];
      const x = t.clientX - offsetX;
      const y = t.clientY - offsetY;
      robot.style.left = `${Math.max(0, Math.min(window.innerWidth - 70, x))}px`;
      robot.style.top = `${Math.max(0, Math.min(window.innerHeight - 100, y))}px`;
      robot.style.right = 'auto';
      robot.style.bottom = 'auto';
    }

    function onEnd() {
      isDragging = false;
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);

      const now = Date.now();
      dragTimestamps.push(now);
      dragTimestamps = dragTimestamps.filter((t) => now - t < DRAG_WINDOW);
      dragCount = dragTimestamps.length;

      if (dragCount >= DRAG_THRESHOLD && !isAngry && !isResting) {
        triggerAngry();
      }
    }

    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
  }, { passive: true });

  // ── Angry State ──
  function triggerAngry() {
    isAngry = true;
    robot.classList.add('angry');
    robot.classList.remove('resting');

    const label = robot.querySelector('.robot-label');
    if (label) label.textContent = 'STOP IT!';

    // After 2 seconds of angry, go to rest
    setTimeout(() => {
      if (isAngry) triggerRest();
    }, 2000);
  }

  // ── Rest State ──
  function triggerRest() {
    isAngry = false;
    isResting = true;
    robot.classList.remove('angry');
    robot.classList.add('resting');

    const label = robot.querySelector('.robot-label');
    if (label) label.textContent = 'zzZ...';

    cooldownTimer = setTimeout(() => {
      isResting = false;
      robot.classList.remove('resting');
      dragTimestamps = [];
      dragCount = 0;
      if (label) label.textContent = 'DRAG ME!';
    }, REST_DURATION);
  }

  // ── Typing Detection ──
  const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

  textInputs.forEach((input) => {
    input.addEventListener('focus', () => {
      isTyping = true;
      robot.classList.add('typing');
      const label = robot.querySelector('.robot-label');
      if (label) label.textContent = 'TYPING...';
    });

    input.addEventListener('blur', () => {
      isTyping = false;
      robot.classList.remove('typing');
      if (!isAngry && !isResting) {
        const label = robot.querySelector('.robot-label');
        if (label) label.textContent = 'DRAG ME!';
      }
    });

    // Typing animation — robot types along with user
    input.addEventListener('input', () => {
      if (!isTyping || isResting) return;
      // Quick arm wiggle on each keystroke
      const rightArm = robot.querySelector('.robot-arm-right');
      if (rightArm) {
        rightArm.style.transform = `rotate(${-20 + Math.random() * 40}deg)`;
        setTimeout(() => {
          rightArm.style.transform = 'rotate(-15deg)';
        }, 100);
      }
    });
  });

  // ── Idle bounce on hover ──
  robot.addEventListener('mouseenter', () => {
    if (!isAngry && !isResting && !isDragging) {
      const head = robot.querySelector('.robot-head');
      if (head) {
        head.style.transform = 'rotate(-5deg) scale(1.05)';
        setTimeout(() => { head.style.transform = ''; }, 300);
      }
    }
  });

})();
