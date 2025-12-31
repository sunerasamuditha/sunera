// Navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));

// Close nav on link click (mobile)
navList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navList.classList.remove('open'));
});

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
