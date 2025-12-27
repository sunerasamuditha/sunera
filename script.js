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

// Parallax background motion
const parallaxLayers = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  parallaxLayers.forEach((layer, idx) => {
    const depth = (idx + 1) * 10;
    layer.style.transform = `translate3d(0, ${scrollY / depth}px, 0)`;
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
  ...document.querySelectorAll('.exp-detail')
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
