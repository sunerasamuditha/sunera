/* ========================================
   AI/ML PORTFOLIO V3 - JAVASCRIPT
   Neural Interface & 3D Visualizations
   ======================================== */

// ===========================================
// GLOBAL VARIABLES & INITIALIZATION
// ===========================================

let scene, camera, renderer, particles, neuralNet;
let mouseX = 0, mouseY = 0;
let scrollProgress = 0;
let isLoading = true;
let charts = {};

// ===========================================
// LOADING SCREEN
// ===========================================

window.addEventListener('load', () => {
    simulateLoading();
});

function simulateLoading() {
    let progress = 0;
    const loadingScreen = document.getElementById('loading-screen');
    const loadProgress = document.getElementById('load-progress');
    const loadPercent = document.getElementById('load-percent');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadProgress.style.width = progress + '%';
        loadPercent.textContent = Math.floor(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('loaded');
                isLoading = false;
                initEverything();
            }, 500);
        }
    }, 150);
}

// ===========================================
// MAIN INITIALIZATION
// ===========================================

function initEverything() {
    // Disabled Three.js for performance - too heavy for browsers
    // initThreeJS();
    initCustomCursor();
    initSmoothScroll();
    initNavigationEffects();
    initAnimationObservers();
    initHeroStats();
    initNeuralVisualizations();
    initCharts();
    initLiveMetrics();
    initContactForm();
    // Disabled 3D project visuals for performance
    // init3DProjectVisuals();
    
    // Start animation loop only if Three.js is enabled
    // animate();
}

// ===========================================
// THREE.JS - 3D PARTICLE SYSTEM
// ===========================================

function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Create particle system
    createParticleField();
    
    // Create neural network connections
    createNeuralNetwork();
    
    camera.position.z = 5;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function createParticleField() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Reduced from 3000 for better performance
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 20;
        
        // Color (accent cyan)
        colorArray[i] = 0.39;     // R
        colorArray[i + 1] = 1.0;  // G
        colorArray[i + 2] = 0.85; // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createNeuralNetwork() {
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    
    const points = [];
    const nodeCount = 25; // Reduced from 50 for better performance
    
    for (let i = 0; i < nodeCount; i++) {
        const x = (Math.random() - 0.5) * 15;
        const y = (Math.random() - 0.5) * 15;
        const z = (Math.random() - 0.5) * 15;
        points.push(new THREE.Vector3(x, y, z));
    }
    
    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            if (points[i].distanceTo(points[j]) < 3) {
                const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[j]]);
                const line = new THREE.Line(geometry, linesMaterial);
                scene.add(line);
            }
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Throttle rendering to 30fps for better performance
let lastRenderTime = 0;
const renderInterval = 1000 / 30; // 30 FPS

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    if (!isLoading && currentTime - lastRenderTime > renderInterval) {
        lastRenderTime = currentTime;
        
        // Rotate particles
        if (particles) {
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0003;
        }
        
        // Mouse interaction (simplified)
        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
}

// ===========================================
// CUSTOM CURSOR
// ===========================================

function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        dotX = e.clientX;
        dotY = e.clientY;
    });
    
    // Direct cursor update without animation frame
    setInterval(() => {
        ringX += (dotX - ringX) * 0.2;
        ringY += (dotY - ringY) * 0.2;
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
    }, 16); // ~60fps
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .capability-card, .project-card, .nav-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

// ===========================================
// SMOOTH SCROLL & GSAP ANIMATIONS
// ===========================================

function initSmoothScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Removed parallax effect to prevent vertical stretching
    
    // Simple fade in sections (no scrub to prevent stretching)
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true // Only animate once to improve performance
            }
        });
    });
    
    // Capability cards stagger (simplified)
    gsap.from('.capability-card', {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.capabilities-grid',
            start: 'top 75%',
            once: true
        }
    });
    
    // Project timeline animation (simplified)
    gsap.from('.project-item', {
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 0.6,
        scrollTrigger: {
            trigger: '.projects-timeline',
            start: 'top 75%',
            once: true
        }
    });
}

// ===========================================
// NAVIGATION EFFECTS
// ===========================================

function initNavigationEffects() {
    const nav = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Hide/show nav on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        
        // Update active section
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const id = section.getAttribute('id');
            
            if (rect.top <= 100 && rect.bottom >= 100) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===========================================
// INTERSECTION OBSERVER ANIMATIONS
// ===========================================

function initAnimationObservers() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Disconnect after animating to prevent memory leak
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.stat-card, .info-card, .metric-gauge');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.4s ease';
        observer.observe(el);
    });
}

// ===========================================
// HERO STATISTICS COUNTER
// ===========================================

function initHeroStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current * 10) / 10;
        }, 16);
    };
    
    // Trigger when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statValues.forEach(stat => {
                    const target = parseFloat(stat.getAttribute('data-target'));
                    if (target) {
                        animateValue(stat, 0, target, 2000);
                    }
                });
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// ===========================================
// NEURAL NETWORK VISUALIZATIONS
// ===========================================

function initNeuralVisualizations() {
    // Hero neural network - lazy load
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createHeroNeuralNet();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    
    const heroViz = document.getElementById('hero-neural-net');
    if (heroViz) heroObserver.observe(heroViz);
    
    // Model architecture 3D - lazy load
    const modelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createModelArchitecture();
                modelObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    
    const modelViz = document.getElementById('model-architecture-3d');
    if (modelViz) modelObserver.observe(modelViz);
    
    // Contact 3D visualization - lazy load
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                createContactVisualization();
                contactObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    
    const contactViz = document.getElementById('contact-visualization');
    if (contactViz) contactObserver.observe(contactViz);
}

function createHeroNeuralNet() {
    const container = document.getElementById('hero-neural-net');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Simplified static neural network (no animation to prevent memory leak)
    const nodes = [];
    const layers = [3, 4, 4, 3]; // Reduced nodes
    const layerSpacing = canvas.width / (layers.length + 1);
    
    layers.forEach((nodeCount, layerIndex) => {
        const nodeSpacing = canvas.height / (nodeCount + 1);
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: layerSpacing * (layerIndex + 1),
                y: nodeSpacing * (i + 1),
                layer: layerIndex
            });
        }
    });
    
    // Draw once - no animation
    function drawNeuralNet() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(100, 255, 218, 0.15)';
        ctx.lineWidth = 1;
        
        nodes.forEach(node => {
            const nextLayerNodes = nodes.filter(n => n.layer === node.layer + 1);
            nextLayerNodes.forEach(nextNode => {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(nextNode.x, nextNode.y);
                ctx.stroke();
            });
        });
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.fillStyle = 'rgba(100, 255, 218, 0.8)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.fillStyle = 'rgba(100, 255, 218, 0.2)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawNeuralNet();
    
    // Resize handler
    const resizeHandler = () => {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawNeuralNet();
    };
    window.addEventListener('resize', resizeHandler);
}

function createModelArchitecture() {
    const container = document.getElementById('model-architecture-3d');
    if (!container) return;
    
    // Simplified 2D representation instead of heavy Three.js
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Draw simple layer visualization
    const layers = [
        { width: 150, height: 150, label: 'Input' },
        { width: 120, height: 120, label: 'Conv' },
        { width: 90, height: 90, label: 'Pool' },
        { width: 60, height: 60, label: 'Output' }
    ];
    
    const spacing = canvas.width / (layers.length + 1);
    
    ctx.strokeStyle = 'rgba(100, 255, 218, 0.6)';
    ctx.fillStyle = 'rgba(100, 255, 218, 0.1)';
    ctx.lineWidth = 2;
    
    layers.forEach((layer, index) => {
        const x = spacing * (index + 1);
        const y = canvas.height / 2;
        
        // Draw rectangle
        ctx.strokeRect(
            x - layer.width / 2,
            y - layer.height / 2,
            layer.width,
            layer.height
        );
        ctx.fillRect(
            x - layer.width / 2,
            y - layer.height / 2,
            layer.width,
            layer.height
        );
        
        // Draw connections
        if (index < layers.length - 1) {
            const nextX = spacing * (index + 2);
            ctx.beginPath();
            ctx.moveTo(x + layer.width / 2, y);
            ctx.lineTo(nextX - layers[index + 1].width / 2, y);
            ctx.stroke();
        }
    });
}

function createContactVisualization() {
    const container = document.getElementById('contact-visualization');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Static rings - no animation
    for (let i = 1; i <= 3; i++) {
        const radius = i * 50;
        const opacity = (4 - i) / 4;
        
        ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(200, 200, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
                loadCharts();
                chartsObserver.disconnect();
            }
        });
    }, { threshold: 0.1 });
    
    const modelsSection = document.getElementById('models');
    if (modelsSection) chartsObserver.observe(modelsSection);
}

function loadCharts() {
    // Training metrics chart
    const trainingCtx = document.getElementById('training-chart');
    if (trainingCtx) {
        charts.training = new Chart(trainingCtx, {
            type: 'line',
            data: {
                labels: ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4', 'Epoch 5', 'Epoch 6'],
                datasets: [{
                    label: 'Training Loss',
                    data: [2.4, 1.8, 1.2, 0.8, 0.5, 0.3],
                    borderColor: '#64ffda',
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Validation Loss',
                    data: [2.5, 1.9, 1.4, 1.0, 0.7, 0.5],
                    borderColor: '#4fd1c5',
                    backgroundColor: 'rgba(79, 209, 197, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#8892b0' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    }
                }
            }
        });
    }
    
    // Model comparison chart
    const comparisonCtx = document.getElementById('comparison-chart');
    if (comparisonCtx) {
        charts.comparison = new Chart(comparisonCtx, {
            type: 'bar',
            data: {
                labels: ['ResNet50', 'VGG16', 'MobileNet', 'EfficientNet'],
                datasets: [{
                    label: 'Accuracy (%)',
                    data: [94.2, 91.5, 88.3, 96.1],
                    backgroundColor: 'rgba(100, 255, 218, 0.6)',
                    borderColor: '#64ffda',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#8892b0' }
                    }
                },
                scales: {
                    y: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    }
                }
            }
        });
    }
}

// ===========================================
// LIVE METRICS DASHBOARD
// ===========================================

function initLiveMetrics() {
    createGauges();
    createLiveCharts();
    startMetricsSimulation();
}

function createGauges() {
    const gauges = ['cpu', 'gpu', 'memory', 'requests'];
    
    gauges.forEach(id => {
        const canvas = document.getElementById(`${id}-gauge`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        charts[`${id}Gauge`] = {
            canvas: canvas,
            ctx: ctx,
            value: Math.random() * 100,
            draw: function() {
                const value = this.value;
                const width = canvas.width;
                const height = canvas.height;
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 3;
                
                ctx.clearRect(0, 0, width, height);
                
                // Background arc
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'rgba(136, 146, 176, 0.2)';
                ctx.stroke();
                
                // Value arc
                const endAngle = 0.75 * Math.PI + (value / 100) * 1.5 * Math.PI;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
                ctx.lineWidth = 10;
                ctx.strokeStyle = '#64ffda';
                ctx.stroke();
            }
        };
        
        charts[`${id}Gauge`].draw();
    });
}

function createLiveCharts() {
    // Latency chart
    const latencyCtx = document.getElementById('latency-chart');
    if (latencyCtx) {
        charts.latency = new Chart(latencyCtx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    label: 'Latency',
                    data: Array(20).fill(0).map(() => Math.random() * 20 + 5),
                    borderColor: '#64ffda',
                    backgroundColor: 'rgba(100, 255, 218, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    },
                    x: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Predictions chart
    const predictionsCtx = document.getElementById('predictions-chart');
    if (predictionsCtx) {
        charts.predictions = new Chart(predictionsCtx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    label: 'Predictions',
                    data: Array(20).fill(0).map(() => Math.random() * 1000 + 500),
                    borderColor: '#4fd1c5',
                    backgroundColor: 'rgba(79, 209, 197, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        ticks: { color: '#8892b0' },
                        grid: { color: 'rgba(136, 146, 176, 0.1)' }
                    },
                    x: {
                        display: false
                    }
                }
            }
        });
    }
}

let globalMetricsInterval = null;
let metricsObserver = null;

function startMetricsSimulation() {
    // Only update when metrics section is visible
    metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!globalMetricsInterval) {
                    globalMetricsInterval = setInterval(updateMetrics, 4000); // Further reduced
                }
            } else {
                if (globalMetricsInterval) {
                    clearInterval(globalMetricsInterval);
                    globalMetricsInterval = null;
                }
            }
        });
    });
    
    const metricsSection = document.getElementById('metrics');
    if (metricsSection) metricsObserver.observe(metricsSection);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (globalMetricsInterval) clearInterval(globalMetricsInterval);
    if (metricsObserver) metricsObserver.disconnect();
});

function updateMetrics() {
    // Update gauges
    ['cpu', 'gpu', 'memory', 'requests'].forEach(id => {
            const gauge = charts[`${id}Gauge`];
            if (gauge) {
                gauge.value += (Math.random() - 0.5) * 10;
                gauge.value = Math.max(0, Math.min(100, gauge.value));
                gauge.draw();
                
                // Update text values
                const valueEl = document.getElementById(`${id}-value`);
                if (valueEl) {
                    if (id === 'memory') {
                        valueEl.textContent = (gauge.value / 20 + 2).toFixed(1) + 'GB';
                    } else if (id === 'requests') {
                        valueEl.textContent = (gauge.value * 20 + 1000).toFixed(0);
                    } else {
                        valueEl.textContent = Math.floor(gauge.value) + '%';
                    }
                }
            }
        });
        
        // Update live charts
        if (charts.latency) {
            const newData = Math.random() * 20 + 5;
            charts.latency.data.datasets[0].data.push(newData);
            charts.latency.data.datasets[0].data.shift();
            charts.latency.update('none');
        }
        
        if (charts.predictions) {
            const newData = Math.random() * 1000 + 500;
            charts.predictions.data.datasets[0].data.push(newData);
            charts.predictions.data.datasets[0].data.shift();
            charts.predictions.update('none');
        }
        
    // Add new log entry
    addSystemLog();
}

function addSystemLog() {
    const logsContainer = document.getElementById('system-logs');
    if (!logsContainer) return;
    
    const logTypes = ['success', 'info', 'warning'];
    const messages = [
        'Model inference completed: batch_32 - 8.2ms',
        'Preprocessing pipeline initialized',
        'GPU memory allocated: 1.4GB',
        'Receiving batch request: 842 images',
        'Cache hit rate: 94.3%',
        'Model loaded: YOLOv8-large',
        'WebSocket connection established'
    ];
    
    const type = logTypes[Math.floor(Math.random() * logTypes.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const time = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-tag">[${type.toUpperCase()}]</span>
        <span class="log-message">${message}</span>
    `;
    
    logsContainer.insertBefore(logEntry, logsContainer.firstChild);
    
    // Keep only last 10 logs
    while (logsContainer.children.length > 10) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

// Log filter functionality
const logFilters = document.querySelectorAll('.log-filter');
logFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        logFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const filterType = filter.getAttribute('data-filter');
        const logs = document.querySelectorAll('.log-entry');
        
        logs.forEach(log => {
            if (filterType === 'all' || log.classList.contains(filterType)) {
                log.style.display = 'flex';
            } else {
                log.style.display = 'none';
            }
        });
    });
});

// ===========================================
// PROJECT 3D VISUALIZATIONS
// ===========================================

function init3DProjectVisuals() {
    // Simplified - use CSS animations instead of canvas for project visuals
    // This significantly reduces canvas overhead
    return;
    
    /* Original canvas implementation disabled for performance
    for (let i = 1; i <= 4; i++) {
        const container = document.getElementById(`proj-viz-${i}`);
        if (!container) continue;
        
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Animated wireframe cube
        let angle = 0;
        function animateProjectViz() {
            ctx.clearRect(0, 0, 120, 120);
            
            ctx.strokeStyle = 'rgba(100, 255, 218, 0.5)';
            ctx.lineWidth = 1;
            
            const size = 30;
            const centerX = 60;
            const centerY = 60;
            
            // Rotating cube wireframe
            angle += 0.02;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            // Draw cube edges
            ctx.beginPath();
            ctx.moveTo(centerX - size * cos, centerY - size * sin);
            ctx.lineTo(centerX + size * cos, centerY - size * sin);
            ctx.lineTo(centerX + size * cos, centerY + size * sin);
            ctx.lineTo(centerX - size * cos, centerY + size * sin);
            ctx.closePath();
            ctx.stroke();
            
            requestAnimationFrame(animateProjectViz);
        }
        
        animateProjectViz();
    }
    */
}

// ===========================================
// CONTACT FORM
// ===========================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate form submission
        const button = form.querySelector('.form-submit');
        const originalText = button.querySelector('.submit-text').textContent;
        
        button.querySelector('.submit-text').textContent = 'TRANSMITTING...';
        button.disabled = true;
        
        setTimeout(() => {
            button.querySelector('.submit-text').textContent = 'MESSAGE SENT!';
            setTimeout(() => {
                button.querySelector('.submit-text').textContent = originalText;
                button.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Throttle function for performance
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Random range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('low-performance');
}

// Cleanup intervals when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (globalMetricsInterval) {
            clearInterval(globalMetricsInterval);
            globalMetricsInterval = null;
        }
    }
});

console.log('%c🚀 AI/ML Portfolio v3.0.8 - Neural Interface Active', 'color: #64ffda; font-size: 16px; font-weight: bold;');
console.log('%cSystem initialized successfully', 'color: #4fd1c5; font-size: 12px;');
