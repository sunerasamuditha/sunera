// Navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));

// Close nav on link click (mobile)
navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navList.classList.remove('open'));
});

// Neural Network + Circuit Animation (High-Density Neural Interface)
(function() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');
  let w, h, centerX;
  let isVisible = true;
  
  // Configuration - ENHANCED for better visibility
  const cfg = {
    circuitDensity: 220,       // More circuits
    neuronCount: 130,          // More neurons
    signalSpeed: 2.8,          // Slightly faster
    transmissionRate: 0.14,    // Even more frequent signals
    colorCircuit: '100, 255, 218',
    colorNeuron: '120, 200, 255',
    connectionDistance: 220,   // Neuron connection range
    leftBias: 0.2,
    centerBias: 0.15,
  };

  let circuits = [];
  let neurons = [];
  let signals = [];

  // --- CIRCUIT CLASS (PCB-style traces - now spread across page) ---
  class Circuit {
    constructor() {
      this.path = [];
      const rand = Math.random();
      if (rand < cfg.leftBias) {
        this.side = 'left';
      } else if (rand < cfg.leftBias + cfg.centerBias) {
        this.side = 'center';
      } else {
        this.side = 'right'; // Majority lean toward the right half
      }
      this.generatePath();
    }

    generatePath() {
      let x, y, targetX;
      
      if (this.side === 'left') {
        // Start from left, go toward center
        x = Math.random() * (w * 0.25);
        targetX = centerX - 100 + Math.random() * 200;
      } else if (this.side === 'right') {
        // Start from right, go toward center
        x = w - Math.random() * (w * 0.25);
        targetX = centerX - 100 + Math.random() * 200;
      } else {
        // Center circuits - start and stay in center zone
        x = centerX - 150 + Math.random() * 300;
        targetX = centerX - 150 + Math.random() * 300;
      }
      
      y = Math.random() * h;
      x = Math.floor(x / 20) * 20;
      y = Math.floor(y / 20) * 20;
      this.path.push({ x, y });

      let steps = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < steps; i++) {
        if (this.side === 'center') {
          // Center circuits move in any direction
          if (Math.random() > 0.5) {
            x += (Math.floor(Math.random() * 4) - 2) * 20;
          } else {
            y += (Math.floor(Math.random() * 6) - 3) * 20;
          }
          // Keep within center zone
          if (x < centerX - 200) x = centerX - 200;
          if (x > centerX + 200) x = centerX + 200;
        } else if (Math.random() > 0.4) {
          // Move toward target
          const dir = this.side === 'left' ? 1 : -1;
          x += dir * (Math.floor(Math.random() * 4) + 2) * 20;
        } else {
          // Move vertical
          y += (Math.floor(Math.random() * 6) - 3) * 20;
        }
        
        // Clamp to bounds
        if (this.side === 'left' && x > targetX) x = targetX;
        if (this.side === 'right' && x < targetX) x = targetX;
        if (y < 10) y = 10;
        if (y > h - 10) y = h - 10;
        
        this.path.push({ x, y });
      }
      
      this.endX = x;
      this.endY = y;
    }

    drawStatic() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${cfg.colorCircuit}, 0.2)`; // Brighter traces
      ctx.lineWidth = 1;
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      ctx.stroke();
      
      // Brighter terminal pads
      ctx.fillStyle = `rgba(${cfg.colorCircuit}, 0.4)`;
      ctx.fillRect(this.endX - 3, this.endY - 3, 6, 6);
    }
  }

  // --- SIGNAL CLASS (Traveling data packets) ---
  class Signal {
    constructor(circuit) {
      this.circuit = circuit;
      this.segIdx = 0;
      this.t = 0;
      this.alive = true;
      const p = circuit.path[0];
      this.x = p.x;
      this.y = p.y;
    }

    update() {
      const p1 = this.circuit.path[this.segIdx];
      const p2 = this.circuit.path[this.segIdx + 1];
      if (!p2) {
        this.fireSynapse();
        this.alive = false;
        return;
      }
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const step = cfg.signalSpeed / Math.max(dist, 1);
      this.t += step;
      if (this.t >= 1) {
        this.t = 0;
        this.segIdx++;
      } else {
        this.x = p1.x + (p2.x - p1.x) * this.t;
        this.y = p1.y + (p2.y - p1.y) * this.t;
      }
    }

    draw() {
      // Brighter, larger signal
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${cfg.colorCircuit})`;
      ctx.fill();
      
      // Glow effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.colorCircuit}, 0.5)`;
      ctx.fill();
    }

    fireSynapse() {
      // Find nearest neuron anywhere near the center zone
      let target = null;
      let minDist = 9999;
      for (let n of neurons) {
        let d = Math.hypot(n.x - this.x, n.y - this.y);
        if (d < minDist && d < 400) {
          minDist = d;
          target = n;
        }
      }
      if (target) {
        signals.push(new BridgeSignal(this.x, this.y, target));
      }
    }
  }

  // --- BRIDGE SIGNAL CLASS (Circuit to Neuron connection) ---
  class BridgeSignal {
    constructor(sx, sy, targetNeuron) {
      this.sx = sx;
      this.sy = sy;
      this.target = targetNeuron;
      this.t = 0;
      this.alive = true;
      // Curved control point for organic feel
      this.cp1x = sx + (targetNeuron.x - sx) * 0.5 + (Math.random() - 0.5) * 60;
      this.cp1y = sy + (targetNeuron.y - sy) * 0.3 + (Math.random() - 0.5) * 60;
    }

    update() {
      this.t += 0.04;
      if (this.t >= 1) {
        this.alive = false;
        this.target.flash();
      }
    }

    draw() {
      const t = this.t;
      const invT = 1 - t;
      const x = (invT * invT * this.sx) + (2 * invT * t * this.cp1x) + (t * t * this.target.x);
      const y = (invT * invT * this.sy) + (2 * invT * t * this.cp1y) + (t * t * this.target.y);

      // Bright energy particle
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      
      // Glow around particle
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.colorCircuit}, 0.4)`;
      ctx.fill();

      // Brighter trace path
      ctx.beginPath();
      ctx.moveTo(this.sx, this.sy);
      ctx.quadraticCurveTo(this.cp1x, this.cp1y, this.target.x, this.target.y);
      ctx.strokeStyle = `rgba(${cfg.colorCircuit}, ${0.6 * (1 - t)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // --- NEURON CLASS (Brain cells distributed around center) ---
  class Neuron {
    constructor() {
      // Neurons concentrated toward the right half for density
      const rightBase = centerX + Math.random() * (w - centerX);
      const drift = (Math.random() - 0.5) * 120;
      this.x = Math.min(w - 40, Math.max(centerX + 30, rightBase + drift));
      if (Math.random() < 0.15) {
        this.x = Math.max(40, centerX - Math.random() * (centerX * 0.2));
      }
      const verticalBand = h * 0.7;
      this.y = (h - verticalBand) / 2 + Math.random() * verticalBand;
      
      // Keep in bounds
      this.x = Math.max(50, Math.min(w - 50, this.x));
      this.y = Math.max(50, Math.min(h - 50, this.y));
      
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.energy = 0;
      this.baseSize = 2 + Math.random() * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Soft boundary - push back toward center zone
      if (this.x < 50) this.vx = Math.abs(this.vx);
      if (this.x > w - 50) this.vx = -Math.abs(this.vx);
      if (this.y < 50) this.vy = Math.abs(this.vy);
      if (this.y > h - 50) this.vy = -Math.abs(this.vy);
      
      if (this.energy > 0) this.energy -= 0.03;
      if (this.energy < 0) this.energy = 0;
    }

    flash() {
      this.energy = 1.5;
    }

    draw() {
      const size = this.baseSize + this.energy * 2.2;
      
      // Core neuron - brighter
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.colorNeuron}, 0.85)`;
      ctx.fill();

      // Flash effect
      if (this.energy > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size + this.energy * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.energy * 0.2})`;
        ctx.fill();
        
        // Secondary glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, size + this.energy * 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cfg.colorCircuit}, ${this.energy * 0.25})`;
        ctx.fill();
      }
    }
  }

  // --- INITIALIZATION ---
  function init() {
    const rect = heroSection.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
    centerX = w / 2;

    circuits = [];
    neurons = [];
    signals = [];

    for (let i = 0; i < cfg.circuitDensity; i++) {
      circuits.push(new Circuit());
    }
    for (let i = 0; i < cfg.neuronCount; i++) {
      neurons.push(new Neuron());
    }
  }

  // --- ANIMATION LOOP ---
  function animate() {
    if (!isVisible) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    // Draw static circuit traces
    circuits.forEach(c => c.drawStatic());

    // Spawn new signals more frequently
    if (Math.random() < cfg.transmissionRate) {
      const randomCircuit = circuits[Math.floor(Math.random() * circuits.length)];
      signals.push(new Signal(randomCircuit));
    }

    // Update and draw neurons with connections
    for (let i = 0; i < neurons.length; i++) {
      let n1 = neurons[i];
      n1.update();

      for (let j = i + 1; j < neurons.length; j++) {
        let n2 = neurons[j];
        let d = Math.hypot(n1.x - n2.x, n1.y - n2.y);
        if (d < cfg.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          
          // Brighter base connections, even brighter when energized
          let alpha = 0.25 * (1 - d / cfg.connectionDistance);
          if (n1.energy > 0 || n2.energy > 0) {
            alpha = 0.7 * (1 - d / cfg.connectionDistance);
          }
          
          ctx.strokeStyle = `rgba(${cfg.colorNeuron}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    neurons.forEach(n => n.draw());

    // Update and draw signals
    for (let i = signals.length - 1; i >= 0; i--) {
      let s = signals[i];
      s.update();
      s.draw();
      if (!s.alive) signals.splice(i, 1);
    }

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(animate);
  }

  // Visibility observer
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(heroSection);

  // Initialize and start
  window.addEventListener('resize', init);
  init();
  animate();
})();

// Tilt effect for interactive cards
const tiltItems = document.querySelectorAll('[data-tilt]');
const maxTilt = 10;

tiltItems.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

// Cursor glow + scroll progress
const cursorGlow = document.querySelector('.cursor-glow');
const progressBar = document.querySelector('.scroll-progress');

window.addEventListener('pointermove', (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

const updateProgress = () => {
  if (!progressBar) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;
  const pct = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
  progressBar.style.width = `${pct}%`;
};
window.addEventListener('scroll', updateProgress);
updateProgress();

// Parallax background motion
const parallaxLayers = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxLayers.forEach((layer, idx) => {
    const depth = (idx + 1) * 10;
    layer.style.transform = `translate3d(0, ${scrollY / depth}px, 0)`;
  });
});

// Parallax for foreground elements
const parallaxItems = document.querySelectorAll('[data-parallax]');
const runParallax = () => {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const depth = Number(item.dataset.parallax) || 24;
    const offset = scrollY / depth;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
};
window.addEventListener('scroll', runParallax);
runParallax();

// Magnetic buttons
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach((el) => {
  const strength = 12;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

// Animated stats
const randomRange = (min, max) => Math.random() * (max - min) + min;

const updateStats = () => {
  const requests = (randomRange(12, 16)).toFixed(1);
  document.getElementById('stat-requests').textContent = `${requests}k`;
  const uptime = (randomRange(99.8, 99.99)).toFixed(2);
  document.getElementById('stat-uptime').textContent = `${uptime}%`;
  const latency = Math.round(randomRange(42, 70));
  document.getElementById('stat-latency').textContent = `${latency}ms`;
  const stream = Math.round(randomRange(1400, 1800));
  document.getElementById('metric-stream').textContent = `${stream}`;
  const vision = (randomRange(96.8, 98.8)).toFixed(1);
  document.getElementById('metric-vision').textContent = `${vision}%`;
  const learn = (randomRange(32, 44)).toFixed(0);
  document.getElementById('metric-learn').textContent = `+${learn}%`;
};
setInterval(updateStats, 2600);
updateStats();

// Experience data
const experience = {
  ieee: {
    title: 'IEEE Technical & Program Leadership',
    date: '2024 - Present',
    points: [
      '<strong>Project Chair — TensorForge (IEEE CS KDU, 2025)</strong>: Owned roadmap and execution on an extremely tight schedule; delegated technical tasks, tracked milestones, and presented results to stakeholders.',
      '<strong>Program Lead — Luminary (IEEE CS KDU, 2025)</strong>: Planned program schedule, curated speaker lineup, recruited mentors, and managed attendee engagement and post-event follow-up.',
      '<strong>Project Chair — Artha CSR (IEEE CS KDU, present)</strong>: Coordinate CSR initiatives, partner outreach, and volunteer teams; oversee on-ground execution and impact monitoring.',
      '<strong>Project Chair — SkillBridge (IEEE SB KDU, 2025–present)</strong>: Initiated and delivered multiple skill-development sessions; built industry links, developed modules, and supervised assessments.'
    ]
  },
  national: {
    title: 'National Coordination & Social Impact',
    date: '2023 - Present',
    points: [
      '<strong>National Coordinator — Ganitha Saviya (STEM, 2024–2025)</strong>: Oversaw national rollout achieving 1,543 seminars across Sri Lanka; built connections with Northern Province and Tamil-speaking districts; developed state-of-the-art dashboard for program data visualization.',
      '<strong>National Coordinator — Sisu Saviya (Leadership, 2025–present)</strong>: Leadership development resource since 2023; contributed to HNB Central Schools project; currently driving ongoing national rollout and quality assurance.',
      '<strong>Project Lead — ReGreen Earth / Galle (2023)</strong>: Led project planning and execution for an initiative valued at over LKR 500,000; coordinated volunteers, vendors, and delivered measurable environmental outcomes.',
      '<strong>District Coordinator — SALE Project (Entrepreneurship, 2023)</strong>: Coordinated and executed a 3-day residential entrepreneurship program; managed logistics, trainers, and participant outcomes.'
    ]
  },
  corporate: {
    title: 'Senior Facilitator @ Popcorn Teams',
    date: '2023 - Present',
    points: [
      'Designed and delivered 20+ successful corporate workshops and team-building programs for diverse organizations.',
      'Coached leaders on effective communication, collaboration, and measurable performance improvement.',
      'Collected feedback and iterated curricula to drive continuous improvement and client satisfaction.',
      'Developed hands-on exercises to strengthen team trust, communication, and alignment with organizational objectives.'
    ]
  },
  products: {
    title: 'Product Development & Project Management',
    date: '2023 - Present',
    points: [
      '<strong>Project Manager @ LEARNY (Aug 2024–present)</strong>: Led development of user-friendly learning platform with instructor dashboards and cohort analytics; integrated multiple data sources and access control; coordinated 4-person team with agile rituals.',
      '<strong>Project Lead @ DrySmart+ (Mar 2024–present)</strong>: Built weather-aware drying system with rain detection and automated cover control; designed energy-aware firmware with telemetry; implemented safety guardrails and remote observability.',
      '<strong>Founder & CCO @ Reka Ira Media (Oct 2023–present)</strong>: Launched studio producing impactful digital and traditional media; directed creative strategy with measurable performance goals; built cross-functional collaborations; grew client relationships through insights dashboards.'
    ]
  },
  academic: {
    title: 'Academic & Institutional Leadership',
    date: '2024 - Present',
    points: [
      '<strong>Committee Head — Skill Development & Training (MCPPA, 2024)</strong>: Initiated and led discussions on academic–extracurricular balance and a code of ethics; designed training curricula, coordinated trainers and logistics, and measured participant outcomes.',
      '<strong>Faculty Coordinator — Faculty of Computing (KDU, 2024–present)</strong>: Coordinate faculty–student activities, organize academic events and seminars, and handle administrative communications.',
      '<strong>Co-coordinator — Katina Maha Magalya / Galle (2023)</strong>: Supported planning and logistics for a large social and cultural event; managed stakeholder liaison and volunteer assignments during execution.'
    ]
  }
};

const expTitle = document.getElementById('exp-title');
const expDate = document.getElementById('exp-date');
const expPoints = document.getElementById('exp-points');

const renderExperience = (key) => {
  const item = experience[key];
  if (!item) return;
  expTitle.textContent = item.title;
  expDate.textContent = item.date;
  expPoints.innerHTML = item.points.map(point => `<li>${point}</li>`).join('');
};

const expTabs = document.querySelectorAll('.exp-tab');
expTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    expTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderExperience(tab.dataset.role);
  });
});
renderExperience('ieee');

// Reveal on scroll
const revealables = [
  ...document.querySelectorAll('.signal-card'),
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.lab-card'),
  ...document.querySelectorAll('.meta-card'),
  ...document.querySelectorAll('.holo-card'),
  ...document.querySelectorAll('.exp-detail'),
  ...document.querySelectorAll('.floating-card')
];

revealables.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealables.forEach(el => observer.observe(el));

// 3D Showcase Scroll Effect (Performance Optimized)
(function() {
  const showcaseContainer = document.querySelector('.showcase-3d-container');
  const camera = document.querySelector('.showcase-camera');
  const projects3D = document.querySelectorAll('.project-3d');

  if (!showcaseContainer || !camera || projects3D.length === 0 || window.innerWidth <= 1024) return;

  let currentZ = 0;
  let targetZ = 0;
  let isRunning = false;
  let isInView = false;
  let activeProjectIndex = -1;
  
  // Cache values to avoid recalculation
  let containerTop = 0;
  let containerHeight = 0;
  let viewportHeight = window.innerHeight;
  
  const projectZPositions = [-400, -1200, -2000, -2800, -3600];

  // Use IntersectionObserver to only animate when visible
  const visibilityObserver = new IntersectionObserver((entries) => {
    isInView = entries[0].isIntersecting;
    if (isInView && !isRunning) {
      isRunning = true;
      requestAnimationFrame(animate);
    }
  }, { threshold: 0 });
  
  visibilityObserver.observe(showcaseContainer);

  // Cache dimensions on resize (debounced)
  let resizeTimer;
  const updateDimensions = () => {
    viewportHeight = window.innerHeight;
    const rect = showcaseContainer.getBoundingClientRect();
    containerTop = rect.top + window.scrollY;
    containerHeight = rect.height;
  };
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateDimensions, 150);
  });
  
  // Initial dimension calculation
  updateDimensions();

  // Optimized scroll handler with passive listener
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking && isInView) {
      scrollTicking = true;
      
      // Calculate progress using cached values
      const scrollY = window.scrollY;
      const scrolled = scrollY - containerTop;
      const totalScrollable = containerHeight - viewportHeight;
      
      let progress = scrolled / totalScrollable;
      progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      
      targetZ = progress * -4000;
      scrollTicking = false;
    }
  }, { passive: true });

  // Ultra-smooth animation loop
  function animate() {
    if (!isInView) {
      isRunning = false;
      return;
    }

    // Gentler lerp for buttery smooth movement
    const diff = targetZ - currentZ;
    
    // Use a softer easing factor for natural feel
    currentZ += diff * 0.05;

    // Apply transform (GPU accelerated)
    camera.style.transform = `translate3d(0, 0, ${-currentZ}px)`;

    // Find active project
    let newActiveIndex = -1;
    let closestDist = 400;

    for (let i = 0; i < projectZPositions.length; i++) {
      const dist = Math.abs(currentZ - projectZPositions[i]);
      if (dist < closestDist) {
        closestDist = dist;
        newActiveIndex = i;
      }
    }

    if (newActiveIndex !== activeProjectIndex) {
      if (activeProjectIndex >= 0) {
        projects3D[activeProjectIndex].classList.remove('active');
      }
      activeProjectIndex = newActiveIndex;
      if (activeProjectIndex >= 0) {
        projects3D[activeProjectIndex].classList.add('active');
      }
    }

    requestAnimationFrame(animate);
  }
})();
