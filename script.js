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

// 3D Showcase Scroll Effect - Tunnel Animation
(function() {
  const container = document.querySelector('.showcase-3d-container');
  const camera = document.querySelector('.showcase-camera');
  const projects = document.querySelectorAll('.project-3d');
  const scrollHint = document.querySelector('.scroll-hint');
  
  if (!container || !camera || window.innerWidth <= 1024) return;
  
  // Get the z-positions of all projects
  const projectData = Array.from(projects).map(project => {
    const zValue = parseFloat(project.style.getPropertyValue('--z')) || 0;
    return { element: project, z: zValue };
  });
  
  // Sort by z-depth (closest first)
  projectData.sort((a, b) => b.z - a.z);
  
  // Calculate the total depth range
  const minZ = Math.min(...projectData.map(p => p.z));
  const maxZ = Math.max(...projectData.map(p => p.z));
  const totalDepth = Math.abs(minZ) + 800; // Extra buffer at the end
  
  let ticking = false;
  let scrollHintHidden = false;
  
  const update3DShowcase = () => {
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;
    const containerHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate scroll progress through the section (0 to 1)
    const scrollableDistance = containerHeight - viewportHeight;
    const scrolled = Math.max(0, -containerTop);
    const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));
    
    // Hide scroll hint after user starts scrolling
    if (progress > 0.02 && !scrollHintHidden && scrollHint) {
      scrollHint.style.opacity = '0';
      scrollHint.style.transition = 'opacity 0.5s ease';
      scrollHintHidden = true;
    } else if (progress < 0.01 && scrollHintHidden && scrollHint) {
      scrollHint.style.opacity = '1';
      scrollHintHidden = false;
    }
    
    // Camera moves forward through z-space
    const cameraZ = progress * totalDepth;
    camera.style.transform = `translateZ(${cameraZ}px)`;
    
    // Update each project card
    projectData.forEach(({ element, z }) => {
      const relativeZ = z + cameraZ; // Position relative to camera
      
      // Calculate opacity based on distance from camera
      let opacity;
      if (relativeZ > 200) {
        // Card is far ahead - fade it out
        opacity = Math.max(0.2, 1 - (relativeZ - 200) / 1500);
      } else if (relativeZ < -300) {
        // Card is behind camera - fade out quickly
        opacity = Math.max(0, 1 + (relativeZ + 300) / 300);
      } else {
        // Card is in the sweet spot
        opacity = 1;
      }
      
      element.style.opacity = opacity;
      
      // Add blur effect for distant cards
      const blur = relativeZ > 400 ? Math.min(4, (relativeZ - 400) / 300) : 0;
      element.style.filter = blur > 0 ? `blur(${blur}px) brightness(${1 - blur * 0.05})` : 'none';
      
      // Add active class when card is in view sweet spot
      if (relativeZ > -150 && relativeZ < 300) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
    
    ticking = false;
  };
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update3DShowcase);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  update3DShowcase(); // Initial call
})();
