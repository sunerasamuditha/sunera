// --- PARTICLE CANVAS ANIMATION ---

const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
    
        const cols = Math.floor(width / 40);
        const rows = Math.floor(height / 40);
        
        for(let i = 0; i < cols; i++) {
            for(let j = 0; j < rows; j++) {
                const cx = width / 2;
                const cy = height / 2;
                const dx = (i * 40) - cx;
                const dy = (j * 40) - cy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < Math.min(width, height) * 0.4 || Math.random() > 0.8) {
                    particles.push({
                        x: i * 40,
                        y: j * 40,
                        baseX: i * 40,
                        baseY: j * 40,
                        size: Math.random() * 2 + 1,
                        color: Math.random() > 0.5 ? '#667eea' : '#764ba2',
                        offset: Math.random() * 100
                    });
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const time = Date.now() * 0.0025;

        particles.forEach(p => {
            const waveX = Math.sin(time + p.y * 0.01) * 10;
            const waveY = Math.cos(time + p.x * 0.01) * 10;
            
            let finalX = p.baseX + waveX;
            let finalY = p.baseY + waveY;

            if (mouse.x != null) {
                const dx = mouse.x - finalX;
                const dy = mouse.y - finalY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 200;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const repulsion = force * 40;
                    finalX -= (dx / distance) * repulsion;
                    finalY -= (dy / distance) * repulsion;
                }
            }

            p.x = finalX;
            p.y = finalY;
            
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// --- STICKY SCROLL OBSERVER ---

const stickySection = document.querySelector('.sticky-section');
if (stickySection) {
    const featureVisuals = {
        'feat-1': `<div class="code-display">
            <div class="code-header">
                <span class="dot" style="background:#ff5f56"></span>
                <span class="dot" style="background:#ffbd2e"></span>
                <span class="dot" style="background:#27c93f"></span>
            </div>
            <pre class="code-content"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d_model, nhead):
        super().__init__()
        self.attn = nn.MultiheadAttention(
            d_model, nhead
        )
        self.norm = nn.LayerNorm(d_model)
    
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        attn_out, _ = self.attn(x, x, x)
        <span class="kw">return</span> self.norm(x + attn_out)</code></pre>
        </div>`,
        'feat-2': `<div class="code-display">
            <div class="code-header">
                <span class="dot" style="background:#ff5f56"></span>
                <span class="dot" style="background:#ffbd2e"></span>
                <span class="dot" style="background:#27c93f"></span>
            </div>
            <pre class="code-content"><code><span class="kw">from</span> langchain <span class="kw">import</span> LLMChain
<span class="kw">from</span> langchain.vectorstores <span class="kw">import</span> Pinecone

<span class="kw">class</span> <span class="fn">RAGPipeline</span>:
    <span class="kw">def</span> <span class="fn">__init__</span>(self, llm, vectorstore):
        self.retriever = vectorstore.as_retriever()
        self.chain = LLMChain(llm=llm)
    
    <span class="kw">def</span> <span class="fn">query</span>(self, question):
        docs = self.retriever.get_relevant_docs(
            question, k=5
        )
        context = <span class="str">"\\n"</span>.join(docs)
        <span class="kw">return</span> self.chain.run(context, question)</code></pre>
        </div>`,
        'feat-3': `<div class="code-display">
            <div class="code-header">
                <span class="dot" style="background:#ff5f56"></span>
                <span class="dot" style="background:#ffbd2e"></span>
                <span class="dot" style="background:#27c93f"></span>
            </div>
            <pre class="code-content"><code><span class="kw">apiVersion:</span> apps/v1
<span class="kw">kind:</span> Deployment
<span class="kw">metadata:</span>
  <span class="fn">name:</span> ml-inference-service
<span class="kw">spec:</span>
  <span class="fn">replicas:</span> <span class="str">3</span>
  <span class="kw">template:</span>
    <span class="kw">spec:</span>
      <span class="fn">containers:</span>
      - <span class="fn">name:</span> model-server
        <span class="fn">image:</span> <span class="str">ml-model:v1.0</span>
        <span class="fn">resources:</span>
          <span class="fn">limits:</span>
            <span class="fn">nvidia.com/gpu:</span> <span class="str">1</span></code></pre>
        </div>`
    };

    const stickyVisual = document.querySelector('.sticky-visual');
    const featureBlocks = document.querySelectorAll('.feature-block');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                featureBlocks.forEach(b => b.classList.remove('active'));
                entry.target.classList.add('active');

                const featureId = entry.target.getAttribute('data-feature');
                if (featureVisuals[featureId] && stickyVisual) {
                    stickyVisual.innerHTML = featureVisuals[featureId];
                }
            }
        });
    }, observerOptions);

    featureBlocks.forEach(block => observer.observe(block));
}

// --- MOBILE NAVIGATION ---

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('open');
        });
    });
}

// --- REVIEWS CAROUSEL ---

(function() {
    const track = document.querySelector('.reviews-track');
    if (!track) return;
    
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
        
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    let scrollPos = 0;
    const speed = 0.5;
    let isHovered = false;

    track.addEventListener('mouseenter', () => isHovered = true);
    track.addEventListener('mouseleave', () => isHovered = false);

    function animate() {
        if (!isHovered) {
            scrollPos += speed;
            
            const singleSetWidth = track.scrollWidth / 3;
            
            if (scrollPos >= singleSetWidth) {
                scrollPos = 0;
            }
            
            track.style.transform = `translateX(-${scrollPos}px)`;
        }
        requestAnimationFrame(animate);
    }

    animate();
})();

// --- THEME TOGGLE ---

(function() {
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
})();

// --- 3D PROJECT SHOWCASE SCROLL ---

(function() {
    const showcaseContainer = document.querySelector('.showcase-3d-container');
    const camera = document.querySelector('.showcase-camera');
    const projects3D = document.querySelectorAll('.project-3d');

    if (showcaseContainer && camera && projects3D.length > 0 && window.innerWidth > 1024) {
        let currentZ = 0;
        let targetZ = 0;

        const projectPositions = [
            { z: -400, index: 0 },
            { z: -1200, index: 1 },
            { z: -2000, index: 2 },
            { z: -2800, index: 3 },
            { z: -3600, index: 4 }
        ];

        let activeProjectIndex = -1;

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function updateCamera() {
            currentZ = lerp(currentZ, targetZ, 0.08);
            const z = Math.round(currentZ * 100) / 100;
            camera.style.transform = `translateZ(${-z}px)`;

            // Find closest project
            let closestIndex = -1;
            let closestDist = Infinity;

            projectPositions.forEach((proj, idx) => {
                const dist = Math.abs(currentZ - proj.z);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestIndex = idx;
                }
            });

            // Activate closest project
            if (closestDist < 500 && closestIndex !== activeProjectIndex) {
                activeProjectIndex = closestIndex;
                projects3D.forEach(p => p.classList.remove('active'));
                if (activeProjectIndex >= 0 && projects3D[activeProjectIndex]) {
                    projects3D[activeProjectIndex].classList.add('active');
                }
            } else if (closestDist >= 500 && activeProjectIndex !== -1) {
                projects3D.forEach(p => p.classList.remove('active'));
                activeProjectIndex = -1;
            }

            requestAnimationFrame(updateCamera);
        }

        requestAnimationFrame(updateCamera);

        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 1024) return;

            const rect = showcaseContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            const scrolled = -rect.top;
            const totalScrollable = rect.height - viewportHeight;
            
            let progress = scrolled / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));

            const maxZ = -4000;
            targetZ = progress * maxZ;
        });
    }
})();

// --- SCROLL REVEAL ANIMATIONS ---

(function() {
    const revealSections = document.querySelectorAll('.reveal-section');
    const revealItems = document.querySelectorAll('.reveal-item');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, revealObserverOptions);

    revealSections.forEach(section => revealObserver.observe(section));
    revealItems.forEach(item => revealObserver.observe(item));
})();

// --- 3D CARD TILT EFFECT ---

(function() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();

// --- SCROLL ANIMATIONS ---

(function() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.project-card, .stat-item');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.style.opacity = '1';
            }
        });
    };

    // Set initial styles
    document.querySelectorAll('.project-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.3s ease`;
    });

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
})();

// --- TYPING EFFECT FOR HERO ---

(function() {
    const gradientText = document.querySelector('.gradient-text');
    if (!gradientText) return;

    const words = ['Learn', 'Adapt', 'Evolve', 'Predict', 'Create'];
    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % words.length;
        gradientText.style.opacity = '0';
        
        setTimeout(() => {
            gradientText.textContent = words[currentIndex];
            gradientText.style.opacity = '1';
        }, 300);
    }, 3000);

    gradientText.style.transition = 'opacity 0.3s ease';
})();

// --- PARALLAX EFFECT ON HERO ---

(function() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }
})();

// --- SMOOTH SCROLL FOR NAVIGATION ---

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
