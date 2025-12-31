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
    circuitDensity: 180,       // More circuits
    neuronCount: 100,          // More neurons
    signalSpeed: 2.8,          // Slightly faster
    transmissionRate: 0.12,    // More frequent signals
    colorCircuit: '100, 255, 218',
    colorNeuron: '120, 200, 255',
    connectionDistance: 180,   // Neuron connection range
  };

  let circuits = [];
  let neurons = [];
  let signals = [];

  // --- CIRCUIT CLASS (PCB-style traces - now spread across page) ---
  class Circuit {
    constructor() {
      this.path = [];
      this.side = Math.random() > 0.5 ? 'left' : 'right'; // Circuits from both sides
      this.generatePath();
    }

    generatePath() {
      let x, y, targetX;
      
      if (this.side === 'left') {
        // Start from left, go toward center
        x = Math.random() * (w * 0.25);
        targetX = centerX - 100 + Math.random() * 200; // End near center (distributed)
      } else {
        // Start from right, go toward center
        x = w - Math.random() * (w * 0.25);
        targetX = centerX - 100 + Math.random() * 200;
      }
      
      y = Math.random() * h;
      x = Math.floor(x / 20) * 20;
      y = Math.floor(y / 20) * 20;
      this.path.push({ x, y });

      let steps = Math.floor(Math.random() * 5) + 3;
      for (let i = 0; i < steps; i++) {
        if (Math.random() > 0.4) {
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
      ctx.strokeStyle = `rgba(${cfg.colorCircuit}, 0.12)`; // Brighter traces
      ctx.lineWidth = 1;
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) {
        ctx.lineTo(this.path[i].x, this.path[i].y);
      }
      ctx.stroke();
      
      // Brighter terminal pads
      ctx.fillStyle = `rgba(${cfg.colorCircuit}, 0.25)`;
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
      ctx.fillStyle = `rgba(${cfg.colorCircuit}, 0.3)`;
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
      // Neurons distributed around center with some spread
      const angle = Math.random() * Math.PI * 2;
      const radius = 50 + Math.random() * (w * 0.4);
      this.x = centerX + Math.cos(angle) * radius * (Math.random() * 0.5 + 0.5);
      this.y = h * 0.5 + Math.sin(angle) * (h * 0.4) * (Math.random() * 0.5 + 0.5);
      
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
      const size = this.baseSize + this.energy * 4;
      
      // Core neuron - brighter
      ctx.beginPath();
      ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.colorNeuron}, 0.7)`;
      ctx.fill();

      // Flash effect
      if (this.energy > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, size + this.energy * 15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.energy * 0.5})`;
        ctx.fill();
        
        // Secondary glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, size + this.energy * 25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cfg.colorCircuit}, ${this.energy * 0.3})`;
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
          let alpha = 0.15 * (1 - d / cfg.connectionDistance);
          if (n1.energy > 0 || n2.energy > 0) {
            alpha = 0.5 * (1 - d / cfg.connectionDistance);
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
  learny: {
    title: 'Project Manager @ LEARNY',
    date: 'August 24 - Present',
    points: [
      'Led the development of a user-friendly learning platform with instructor dashboards and cohort analytics.',
      'Integrated multiple data sources and access control, enabling reliable course delivery.',
      'Coordinated a 4-person team across design, backend, and QA with agile rituals.',
      'Established A/B content experiments and telemetry for continuous improvement.'
    ]
  },
  drysmart: {
    title: 'Project Lead @ DrySmart+',
    date: 'March 24 - Present',
    points: [
      'Built a weather-aware drying system with rain detection and automated cover control.',
      'Designed energy-aware firmware with telemetry hooks for reliability in varied conditions.',
      'Led prototyping, testing, and rollout with multidisciplinary contributors.',
      'Implemented guardrails for safety and remote observability for maintenance.'
    ]
  },
  rekaira: {
    title: 'Founder & CCO @ Reka Ira Media',
    date: 'Oct 23 - Present',
    points: [
      'Launched a studio producing impactful digital and traditional media informed by data.',
      'Directed creative strategy with measurable performance goals and experimentation.',
      'Built cross-functional collaborations between designers, developers, and marketers.',
      'Grew client relationships through insights dashboards and rapid iterations.'
    ]
  },
  stem: {
    title: 'National Coordinator, STEM Education @ Sasnaka Sansada',
    date: 'March 24 - Present',
    points: [
      'Coordinated the Ganitha Saviya initiative supporting 80k+ students across 25 districts.',
      'Built dashboards for district progress, educator training, and learner outcomes.',
      'Standardized feedback loops and analytics to improve program delivery.',
      'Mentored volunteers and educators on data-driven decision making.'
    ]
  },
  leader: {
    title: 'Resource Person, Leadership and Grooming @ Sasnaka Sansada',
    date: 'April 23 - Present',
    points: [
      'Designed leadership training with interactive workshops and measurable takeaways.',
      'Facilitated sessions that grow teamwork, communication, and personal brand.',
      'Aligned programs with organizational goals and participant feedback.',
      'Mentored cohorts to convert learning into actionable plans.'
    ]
  },
  popcorn: {
    title: 'Facilitator @ Popcorn Teams',
    date: 'Sept 23 - Present',
    points: [
      'Delivered corporate training focused on team performance and collaboration.',
      'Developed hands-on exercises to strengthen communication and trust.',
      'Provided feedback loops that map to organizational objectives.',
      'Partnered with clients to tailor facilitation to their teams.'
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
renderExperience('learny');

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
