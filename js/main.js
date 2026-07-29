/* ==========================================================================
   OBELIX - Main JavaScript (Canvas background, Navbar, Common Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCanvasBackground();
  initWorkflowPipeline();
  initEcosystemNodes();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & NAVIGATION CONTROLLER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  hamburger?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.className = navMenu?.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    }
  });

  // Highlight current page link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. AMBIENT PARTICLES & GRID MESH CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.3 ? '#00A859' : '#0288D1';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00A859';
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   3. WORKFLOW PIPELINE INTERACTION (01 COLLECT -> 06 EVOLVE)
   -------------------------------------------------------------------------- */
const pipelineData = {
  '01': {
    title: '01 COLLECT - Real-time On-Chain Ingestion',
    desc: 'OBELIX streams every raw transaction, block header, mempool state, and event log across Robinhood Chain sub-second nodes.',
    details: ['WebSocket & RPC high-throughput ingestion', 'Sub-second event parsing', 'Decentralized node data validation']
  },
  '02': {
    title: '02 ANALYZE - AI Engine Processing',
    desc: 'Deep learning models decode smart contract calls, identify wallet clustering, token transfers, and liquidity pool shifts.',
    details: ['Semantic contract execution tracing', 'Multi-layer transaction graph analysis', 'Token flow velocity metrics']
  },
  '03': {
    title: '03 INTELLIGENCE - Pattern & Anomaly Detection',
    desc: 'Detects unusual volume spikes, flash loan exploits, honeypot contracts, and suspicious arbitrage patterns before block finality.',
    details: ['Real-time risk scoring (0-100)', 'Predictive gas volatility forecasting', 'Exploit pattern matching engine']
  },
  '04': {
    title: '04 DELIVER - Multi-Channel Insights',
    desc: 'Streams actionable intelligence to dashboards, webhooks, Telegram, Discord, and REST API endpoints in under 400ms.',
    details: ['Customizable alert filter triggers', 'Developer SDK notifications', 'Institutional feed integration']
  },
  '05': {
    title: '05 ACT - Autonomous Execution',
    desc: 'AI Agents trigger automated smart contract safety pauses, fund rebalancing, liquidity withdrawal, or automated arbitrage.',
    details: ['Autonomous keeper bot triggers', 'Risk mitigation automation', 'On-chain DAO notification protocols']
  },
  '06': {
    title: '06 EVOLVE - Continuous AI Learning',
    desc: 'Self-improving neural models refine detection accuracy, adapt to novel exploit vectors, and update risk algorithms continuously.',
    details: ['Reinforcement learning from on-chain history', 'Automated model weight updates', 'Community feedback verification loop']
  }
};

function initWorkflowPipeline() {
  const cards = document.querySelectorAll('.pipeline-card');
  const detailBox = document.getElementById('pipeline-detail-content');
  if (!cards.length || !detailBox) return;

  let activeIndex = 0;
  let autoTimer = null;

  function updateStep(stepCode) {
    cards.forEach(c => {
      if (c.dataset.step === stepCode) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    const data = pipelineData[stepCode];
    if (data) {
      detailBox.innerHTML = `
        <div>
          <h4 style="color: var(--accent-primary); font-size: 1.4rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.6rem;">
            <i class="fas fa-microchip"></i> ${data.title}
          </h4>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; max-width: 750px;">
            ${data.desc}
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${data.details.map(d => `<span class="pulse-badge"><i class="fas fa-check-circle"></i> ${d}</span>`).join('')}
          </div>
        </div>
        <a href="explorer.html" class="btn btn-primary" style="white-space: nowrap;">
          Test Live Feed <i class="fas fa-arrow-right"></i>
        </a>
      `;
    }
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      activeIndex = index;
      updateStep(card.dataset.step);
      resetTimer();
    });
  });

  function startAutoPlay() {
    autoTimer = setInterval(() => {
      activeIndex = (activeIndex + 1) % cards.length;
      const step = cards[activeIndex].dataset.step;
      updateStep(step);
    }, 4500);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startAutoPlay();
  }

  // Initialize step 01
  updateStep('01');
  startAutoPlay();
}

/* --------------------------------------------------------------------------
   4. ECOSYSTEM NODES HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initEcosystemNodes() {
  const nodes = document.querySelectorAll('.node-chip');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const type = node.innerText.trim();
      alert(`OBELIX Live Intelligence Node: ${type}\nMonitoring 24/7 on Robinhood Chain for real-time state changes.`);
    });
  });
}
