/* ============================================
   Carlos Buosi — main.js
   ============================================ */

const frases = [
  "I speak fluent C#, broken English and enough coffee to survive a Monday.",
  "Meu código funciona. Não sei por quê. Não mexa.",
  "Transforming caffeine into systems since the dial-up era.",
  "404: social life not found. But the API is working fine.",
  "Debugo código de dia, debugo a vida de noite.",
  "Passei 3 horas num bug. Era um ponto e vírgula. Estou bem. Obrigado.",
  "I don't have bugs. I have undocumented features with great potential.",
  "Senior developer: alguém que erra mais rápido e com mais confiança.",
  "Building things that last — and occasionally breaking things that shouldn't.",
  "Se funciona em produção, não toca. Se não funciona… também não toca.",
  "My code is self-documenting. Unfortunately, I also can't read it.",
  "Legado não é dívida técnica. É história viva. (Tá, é dívida técnica.)",
  "Eu não procrastino. Estou em modo de processamento assíncrono.",
  "Stack Overflow me criou. A documentação oficial me assombra.",
  "Works on my machine™ — certificado de qualidade desde 2003.",
  "Resolvo em 5 minutos o que levou 3 dias pra aparecer.",
  "O cliente pediu um botão. Entreguei um sistema. É minha natureza.",
  "Git blame? Prefiro git forgive.",
  "Não é gambiarra. É uma solução criativa com alto acoplamento.",
  "Durmo bem à noite. O servidor de produção que não dorme.",
];

function fraseAleatoria() {
  const idx = Math.floor(Math.random() * frases.length);
  return frases[idx];
}

$(document).ready(function () {
  $(".hero-tagline").text(fraseAleatoria());
});


/* ---------- NAVBAR scroll effect ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---------- Smooth active link ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => revealObserver.observe(el));

/* ---------- Trigger hero reveals on load ---------- */
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal').forEach(el => {
    el.classList.add('visible');
  });
});

/* ---------- Canvas particle field ---------- */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const GOLD = '201,168,76';
  const WHITE = '232,228,216';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticles(n) {
    return Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      a:  Math.random(),
      gold: Math.random() < 0.3,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle gradient overlay at bottom
    const grad = ctx.createLinearGradient(0, H * 0.5, 0, H);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(5,6,15,0.8)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = `rgba(${GOLD},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    particles.forEach(p => {
      const col = p.gold ? GOLD : WHITE;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.a * 0.6})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.a += (Math.random() - 0.5) * 0.01;
      p.a = Math.max(0.1, Math.min(1, p.a));
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
  }

  let raf;
  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    resize();
    particles = createParticles(120);
    cancelAnimationFrame(raf);
    loop();
  }

  window.addEventListener('resize', () => {
    resize();
    particles = createParticles(120);
  }, { passive: true });

  start();
})();

/* ---------- Mouse parallax on hero ---------- */
(function heroParallax() {
  const hero = document.getElementById('hero');
  const content = hero.querySelector('.hero-content');
  if (!content) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 18;
    my = (e.clientY / window.innerHeight - 0.5) * 10;
  }, { passive: true });

  function tick() {
    content.style.transform = `translate(${mx * 0.04}px, ${my * 0.04}px)`;
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ---------- Number counter animation ---------- */
function animateNumber(el) {
  const text = el.textContent.trim();
  const match = text.match(/(\d+)/);
  if (!match) return;
  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateNumber(e.target);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => {
  if (/\d/.test(el.textContent)) statObserver.observe(el);
});

/* ---------- Cursor glow (desktop only) ---------- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: opacity .4s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
