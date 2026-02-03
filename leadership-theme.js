// ============================================
// LEADERSHIP THEME - Organic Particle Animation
// Completely different visual system from technical theme
// ============================================

(function() {
  'use strict';

  // Leadership Canvas Animation - Warm, Organic, Flowing
  class LeadershipParticleSystem {
    constructor() {
      this.canvas = document.getElementById('leadership-canvas');
      if (!this.canvas) return;
      
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.connections = [];
      this.mouseX = 0;
      this.mouseY = 0;
      this.isRunning = false;
      this.isVisible = false;
      
      // Warm golden color palette
      this.colors = {
        primary: '212, 165, 116',
        secondary: '232, 192, 144',
        tertiary: '245, 212, 168',
        glow: '212, 165, 116'
      };
      
      this.config = {
        particleCount: 80,
        connectionDistance: 180,
        particleSpeed: 0.3,
        mouseInfluence: 150,
        glowIntensity: 0.4
      };
      
      this.init();
      this.setupEventListeners();
    }
    
    init() {
      this.resize();
      this.createParticles();
    }
    
    resize() {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    }
    
    createParticles() {
      this.particles = [];
      
      for (let i = 0; i < this.config.particleCount; i++) {
        this.particles.push(new OrganicParticle(this));
      }
    }
    
    setupEventListeners() {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });
      
      window.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
      });
      
      // Visibility observer
      const observer = new IntersectionObserver((entries) => {
        this.isVisible = entries[0].isIntersecting;
        if (this.isVisible && !this.isRunning) {
          this.start();
        }
      }, { threshold: 0 });
      
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        observer.observe(heroSection);
      }
    }
    
    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.animate();
    }
    
    stop() {
      this.isRunning = false;
    }
    
    animate() {
      if (!this.isVisible || !document.body.classList.contains('leadership-theme')) {
        this.isRunning = false;
        return;
      }
      
      this.ctx.clearRect(0, 0, this.width, this.height);
      
      // Draw connections first (behind particles)
      this.drawConnections();
      
      // Update and draw particles
      this.particles.forEach(particle => {
        particle.update();
        particle.draw(this.ctx);
      });
      
      // Draw ambient glow
      this.drawAmbientGlow();
      
      requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          
          if (dist < this.config.connectionDistance) {
            const alpha = (1 - dist / this.config.connectionDistance) * 0.15;
            
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            
            // Curved connection for organic feel
            const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 20;
            const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 20;
            this.ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            
            this.ctx.strokeStyle = `rgba(${this.colors.primary}, ${alpha})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }
    }
    
    drawAmbientGlow() {
      // Subtle ambient glow in corners
      const gradient = this.ctx.createRadialGradient(
        this.width * 0.2, this.height * 0.3, 0,
        this.width * 0.2, this.height * 0.3, this.width * 0.4
      );
      gradient.addColorStop(0, `rgba(${this.colors.glow}, 0.03)`);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
  
  // Organic Particle Class - Flowing, Natural Movement
  class OrganicParticle {
    constructor(system) {
      this.system = system;
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * this.system.width;
      this.y = Math.random() * this.system.height;
      this.size = 2 + Math.random() * 4;
      this.baseSize = this.size;
      
      // Organic movement - sinusoidal paths
      this.vx = (Math.random() - 0.5) * this.system.config.particleSpeed;
      this.vy = (Math.random() - 0.5) * this.system.config.particleSpeed;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.02;
      this.amplitude = 20 + Math.random() * 30;
      
      // Pulsing
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
      
      // Color variation
      this.colorIndex = Math.floor(Math.random() * 3);
      this.opacity = 0.3 + Math.random() * 0.4;
    }
    
    update() {
      // Organic sinusoidal movement
      this.angle += this.angleSpeed;
      const waveX = Math.sin(this.angle) * this.amplitude * 0.01;
      const waveY = Math.cos(this.angle * 0.7) * this.amplitude * 0.01;
      
      this.x += this.vx + waveX;
      this.y += this.vy + waveY;
      
      // Gentle mouse interaction
      const dx = this.system.mouseX - this.x;
      const dy = this.system.mouseY - this.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < this.system.config.mouseInfluence && dist > 0) {
        const force = (this.system.config.mouseInfluence - dist) / this.system.config.mouseInfluence;
        this.x -= (dx / dist) * force * 0.5;
        this.y -= (dy / dist) * force * 0.5;
      }
      
      // Pulsing size
      this.pulsePhase += this.pulseSpeed;
      this.size = this.baseSize + Math.sin(this.pulsePhase) * 1.5;
      
      // Wrap around edges smoothly
      if (this.x < -50) this.x = this.system.width + 50;
      if (this.x > this.system.width + 50) this.x = -50;
      if (this.y < -50) this.y = this.system.height + 50;
      if (this.y > this.system.height + 50) this.y = -50;
    }
    
    draw(ctx) {
      const colors = this.system.colors;
      let color;
      
      switch(this.colorIndex) {
        case 0: color = colors.primary; break;
        case 1: color = colors.secondary; break;
        default: color = colors.tertiary;
      }
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.opacity * 0.1})`;
      ctx.fill();
      
      // Inner glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.opacity * 0.3})`;
      ctx.fill();
      
      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
      ctx.fill();
    }
  }
  
  // Initialize when DOM is ready
  let particleSystem = null;
  
  function initLeadershipCanvas() {
    if (!particleSystem) {
      particleSystem = new LeadershipParticleSystem();
    }
    
    if (document.body.classList.contains('leadership-theme')) {
      particleSystem.start();
    }
  }
  
  // Theme Toggle Functionality
  function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle-btn');
    if (!toggleBtn) return;
    
    // Check for saved preference
    const savedTheme = localStorage.getItem('sunera-theme');
    if (savedTheme === 'leadership') {
      document.body.classList.add('leadership-theme');
      updateThemeContent('leadership');
    }
    
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('leadership-theme');
      
      const isLeadership = document.body.classList.contains('leadership-theme');
      localStorage.setItem('sunera-theme', isLeadership ? 'leadership' : 'technical');
      
      updateThemeContent(isLeadership ? 'leadership' : 'technical');
      
      // Trigger canvas switch
      if (isLeadership && particleSystem) {
        particleSystem.start();
      }
      
      // Announce theme change for accessibility
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Switched to ${isLeadership ? 'Leadership' : 'Technical'} profile`;
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    });
  }
  
  function updateThemeContent(theme) {
    // Update page title
    const pageTitle = document.querySelector('title');
    if (pageTitle) {
      pageTitle.textContent = theme === 'leadership' 
        ? 'Sunera Samuditha | Leadership & Impact'
        : 'Sunera Samuditha | AI/ML Engineer';
    }
    
    // Update hero eyebrow
    const eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) {
      eyebrow.textContent = theme === 'leadership'
        ? 'Visionary Leader · Change Maker · Community Builder'
        : 'AI/ML Engineer · Real-world Intelligent Systems';
    }
    
    // Update hero lede
    const lede = document.querySelector('.hero .lede');
    if (lede) {
      lede.textContent = theme === 'leadership'
        ? 'I lead transformative initiatives that empower communities, develop future leaders, and create lasting positive change through strategic vision and collaborative action.'
        : 'I design, deploy, and monitor machine learning systems that matter: vision-led automation, streaming anomaly detection, and learning experiences that adapt in real time.';
    }
    
    // Update floating badge
    const badgeChip = document.querySelector('.floating-badge .chip');
    const badgeText = document.querySelector('.floating-badge p');
    if (badgeChip && badgeText) {
      badgeChip.textContent = theme === 'leadership' ? 'Impact Driven' : 'AI in the wild';
      badgeText.textContent = theme === 'leadership' 
        ? 'Building bridges between vision and action.'
        : 'Edge + cloud synergy with observability baked in.';
    }
    
    // Update CTA buttons
    const primaryBtn = document.querySelector('.cta-group .btn.primary');
    const ghostBtn = document.querySelector('.cta-group .btn.ghost');
    if (primaryBtn && ghostBtn) {
      primaryBtn.textContent = theme === 'leadership' ? 'View Impact' : 'View portfolio';
      ghostBtn.textContent = theme === 'leadership' ? 'Connect with me' : 'Book a build session';
    }
    
    // Update meta cards
    updateMetaCards(theme);
    
    // Update signal board
    updateSignalBoard(theme);
    
    // Update section kickers and headers
    updateSectionHeaders(theme);
    
    // Update floating card
    updateFloatingCard(theme);
    
    // Update labs section
    updateLabsSection(theme);
    
    // Update contact section
    updateContactSection(theme);
    
    // Update footer
    updateFooter(theme);
  }
  
  function updateMetaCards(theme) {
    const metaCards = document.querySelectorAll('.meta-card');
    if (metaCards.length < 2) return;
    
    if (theme === 'leadership') {
      // First meta card - Impact metrics
      metaCards[0].innerHTML = `
        <p class="meta-label">Impact Reach</p>
        <div class="meta-stats">
          <div><span id="stat-requests">80k+</span><small>lives touched</small></div>
          <div><span id="stat-uptime">25</span><small>districts</small></div>
          <div><span id="stat-latency">1.5k+</span><small>seminars</small></div>
        </div>
      `;
      
      // Second meta card - Leadership focus
      metaCards[1].innerHTML = `
        <p class="meta-label">Leadership Focus</p>
        <ul>
          <li>National Program Coordination</li>
          <li>Team & Community Building</li>
          <li>Strategic Initiative Design</li>
        </ul>
      `;
    } else {
      // Reset to technical content
      metaCards[0].innerHTML = `
        <p class="meta-label">Live Signals</p>
        <div class="meta-stats">
          <div><span id="stat-requests">14.2k</span><small>req/min</small></div>
          <div><span id="stat-uptime">99.97%</span><small>uptime</small></div>
          <div><span id="stat-latency">58ms</span><small>p95</small></div>
        </div>
      `;
      
      metaCards[1].innerHTML = `
        <p class="meta-label">Deploy focus</p>
        <ul>
          <li>Edge AI for field devices</li>
          <li>Vision safety + QA pipelines</li>
          <li>Adaptive learning platforms</li>
        </ul>
      `;
    }
  }
  
  function updateSignalBoard(theme) {
    const signalCards = document.querySelectorAll('.signal-card');
    if (signalCards.length < 3) return;
    
    if (theme === 'leadership') {
      signalCards[0].innerHTML = `
        <div class="signal-top">
          <span class="chip">Education</span>
          <span class="light"></span>
        </div>
        <h3>Ganitha Saviya Initiative</h3>
        <p>National STEM empowerment program reaching students across all 25 districts of Sri Lanka with quality mathematics education.</p>
        <div class="signal-metrics">
          <div><strong>80k+</strong><small>students</small></div>
          <div><strong>1,543</strong><small>seminars</small></div>
          <div><strong>25</strong><small>districts</small></div>
        </div>
      `;
      
      signalCards[1].innerHTML = `
        <div class="signal-top">
          <span class="chip">Leadership</span>
          <span class="light"></span>
        </div>
        <h3>IEEE Technical Leadership</h3>
        <p>Driving innovation through technical programs, mentorship initiatives, and community building activities.</p>
        <div class="signal-metrics">
          <div><strong>8+</strong><small>roles held</small></div>
          <div><strong>20+</strong><small>workshops</small></div>
          <div><strong>500+</strong><small>members engaged</small></div>
        </div>
      `;
      
      signalCards[2].innerHTML = `
        <div class="signal-top">
          <span class="chip">Development</span>
          <span class="light"></span>
        </div>
        <h3>Corporate Training Excellence</h3>
        <p>Facilitating transformative team experiences and leadership development for diverse organizations.</p>
        <div class="signal-metrics">
          <div><strong>20+</strong><small>programs</small></div>
          <div><strong>High</strong><small>satisfaction</small></div>
          <div><strong>Repeat</strong><small>clients</small></div>
        </div>
      `;
    } else {
      signalCards[0].innerHTML = `
        <div class="signal-top">
          <span class="chip">Computer Vision</span>
          <span class="light"></span>
        </div>
        <h3>Quality gates for manufacturing</h3>
        <p>On-device defect detection with federated fine-tuning, tuned for low light and motion blur.</p>
        <div class="signal-metrics">
          <div><strong id="metric-vision">97.3%</strong><small>accuracy</small></div>
          <div><strong>24ms</strong><small>edge latency</small></div>
          <div><strong>0</strong><small>manual reviews</small></div>
        </div>
      `;
      
      signalCards[1].innerHTML = `
        <div class="signal-top">
          <span class="chip">Streaming</span>
          <span class="light"></span>
        </div>
        <h3>Anomaly detection at scale</h3>
        <p>Streaming detectors for financial risk and ops incidents using online learning.</p>
        <div class="signal-metrics">
          <div><strong id="metric-stream">1.6k</strong><small>events/sec</small></div>
          <div><strong>43ms</strong><small>p99 latency</small></div>
          <div><strong>auto</strong><small>self-heal playbooks</small></div>
        </div>
      `;
      
      signalCards[2].innerHTML = `
        <div class="signal-top">
          <span class="chip">Learning</span>
          <span class="light"></span>
        </div>
        <h3>Adaptive learning journeys</h3>
        <p>Recommendation stacks for personalized coursework and cohort analytics.</p>
        <div class="signal-metrics">
          <div><strong id="metric-learn">+38%</strong><small>completion</small></div>
          <div><strong>3.2x</strong><small>session depth</small></div>
          <div><strong>GDPR</strong><small>privacy first</small></div>
        </div>
      `;
    }
  }
  
  function updateSectionHeaders(theme) {
    // Signal board section
    const signalHeader = document.querySelector('.signal-board .section-header');
    if (signalHeader) {
      const kicker = signalHeader.querySelector('.section-kicker');
      const h2 = signalHeader.querySelector('h2');
      const desc = signalHeader.querySelector('.section-desc');
      
      if (kicker) kicker.textContent = theme === 'leadership' ? '01 — Impact Dashboard' : '01 — Live AI Posture';
      if (h2) h2.textContent = theme === 'leadership' ? 'Making a difference' : 'Operational overview';
      if (desc) desc.textContent = theme === 'leadership' ? 'Highlights from initiatives I lead and contribute to.' : 'Snapshots from the systems I build and maintain.';
    }
    
    // About section
    const aboutHeader = document.querySelector('.about .section-header');
    if (aboutHeader) {
      const desc = aboutHeader.querySelector('.section-desc');
      if (desc) {
        desc.textContent = theme === 'leadership'
          ? 'A passionate leader committed to empowering communities and developing the next generation of change-makers.'
          : 'Computer Engineering student building production-grade AI systems that bridge cutting-edge research and real-world impact.';
      }
    }
    
    // Labs section
    const labsHeader = document.querySelector('.labs .section-header');
    if (labsHeader) {
      const kicker = labsHeader.querySelector('.section-kicker');
      const h2 = labsHeader.querySelector('h2');
      
      if (kicker) kicker.textContent = theme === 'leadership' ? '05 — Initiatives' : '05 — Lab Notes';
      if (h2) h2.textContent = theme === 'leadership' ? 'Current initiatives' : 'Experimental builds';
    }
    
    // Stack section
    const stackHeader = document.querySelector('.stack .section-header');
    if (stackHeader) {
      const kicker = stackHeader.querySelector('.section-kicker');
      const h2 = stackHeader.querySelector('h2');
      const desc = stackHeader.querySelector('.section-desc');
      
      if (kicker) kicker.textContent = theme === 'leadership' ? '06 — Strengths' : '06 — Stack';
      if (h2) h2.textContent = theme === 'leadership' ? 'Leadership qualities' : 'Tools in rotation';
      if (desc) desc.textContent = theme === 'leadership' ? 'Core competencies that drive my leadership approach' : 'Technologies I work with daily';
    }
    
    // Contact section
    const contactHeader = document.querySelector('.contact .section-header');
    if (contactHeader) {
      const h2 = contactHeader.querySelector('h2');
      const desc = contactHeader.querySelector('.section-desc');
      
      if (h2) h2.textContent = theme === 'leadership' ? 'Let\'s create impact together' : 'Let us build something smart';
      if (desc) desc.textContent = theme === 'leadership' 
        ? 'I\'m always open to discussing new initiatives, partnerships, or opportunities for collaboration.'
        : 'Tell me about your product, dataset, or idea. I will respond within 24 hours.';
    }
  }
  
  function updateFloatingCard(theme) {
    const floatingCard = document.querySelector('.hero-visual .floating-card');
    if (!floatingCard) return;
    
    if (theme === 'leadership') {
      floatingCard.innerHTML = `
        <p class="chip">Leadership Philosophy</p>
        <h3>Empowering Others</h3>
        <p>True leadership is about lifting others up and creating environments where everyone can thrive and contribute.</p>
        <div class="pill-row">
          <span class="pill">Vision</span>
          <span class="pill">Empathy</span>
          <span class="pill">Action</span>
        </div>
      `;
    } else {
      floatingCard.innerHTML = `
        <p class="chip">Realtime ML Ops</p>
        <h3>Signals dashboard</h3>
        <p>Continuously streaming metrics with automated rollbacks and guardrails.</p>
        <div class="pill-row">
          <span class="pill">Canary</span>
          <span class="pill">Shadow</span>
          <span class="pill">A/B</span>
        </div>
      `;
    }
  }
  
  function updateLabsSection(theme) {
    const labCards = document.querySelectorAll('.lab-card');
    if (labCards.length < 3) return;
    
    if (theme === 'leadership') {
      labCards[0].innerHTML = `
        <p class="chip">CSR</p>
        <h3>Artha Initiative</h3>
        <p>Corporate social responsibility program focused on educational equity and community development.</p>
      `;
      
      labCards[1].innerHTML = `
        <p class="chip">Youth</p>
        <h3>SkillBridge Program</h3>
        <p>Industry-aligned skill development sessions bridging the gap between academia and professional requirements.</p>
      `;
      
      labCards[2].innerHTML = `
        <p class="chip">Media</p>
        <h3>Reka Ira Studio</h3>
        <p>Creative media production house delivering impactful digital and traditional media solutions.</p>
      `;
    } else {
      labCards[0].innerHTML = `
        <p class="chip">3D</p>
        <h3>Neural latent playground</h3>
        <p>WebGL point-cloud explorer to visualize latent traversals for VAEs and diffusion models.</p>
      `;
      
      labCards[1].innerHTML = `
        <p class="chip">LLM</p>
        <h3>Guardrailed copilots</h3>
        <p>Policy-driven assistants with prompt hardening, telemetry hooks, and retrieval over private docs.</p>
      `;
      
      labCards[2].innerHTML = `
        <p class="chip">Edge</p>
        <h3>Micro vision agents</h3>
        <p>Onboard anomaly detection for low-power devices with adaptive frame skipping and quantization.</p>
      `;
    }
  }
  
  function updateContactSection(theme) {
    const submitBtn = document.querySelector('.contact-form .btn');
    if (submitBtn) {
      submitBtn.textContent = theme === 'leadership' ? 'Start conversation' : 'Send message';
    }
    
    // Update textarea label
    const textareaLabel = document.querySelector('.contact-form label:last-of-type');
    if (textareaLabel) {
      const labelText = textareaLabel.childNodes[0];
      if (labelText && labelText.nodeType === Node.TEXT_NODE) {
        labelText.textContent = theme === 'leadership' 
          ? 'How can we collaborate?'
          : 'Project or challenge';
      }
    }
  }
  
  function updateFooter(theme) {
    const footerBrand = document.querySelector('.footer-brand h4');
    if (footerBrand) {
      footerBrand.innerHTML = theme === 'leadership'
        ? 'Let\'s create <span class="accent">positive change</span> together'
        : 'Let\'s build something <span class="accent">intelligent</span> together';
    }
  }
  
  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initLeadershipCanvas();
    });
  } else {
    initThemeToggle();
    initLeadershipCanvas();
  }
  
  // Expose functions globally for potential external use
  window.LeadershipTheme = {
    toggle: () => {
      document.body.classList.toggle('leadership-theme');
      const isLeadership = document.body.classList.contains('leadership-theme');
      updateThemeContent(isLeadership ? 'leadership' : 'technical');
      localStorage.setItem('sunera-theme', isLeadership ? 'leadership' : 'technical');
    },
    setTheme: (theme) => {
      if (theme === 'leadership') {
        document.body.classList.add('leadership-theme');
      } else {
        document.body.classList.remove('leadership-theme');
      }
      updateThemeContent(theme);
      localStorage.setItem('sunera-theme', theme);
    }
  };
  
})();
