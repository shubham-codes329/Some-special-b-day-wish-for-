/**
 * DELICATE — Main Interactive Script
 * Handles state, section navigation, interactive elements, particles, and audio.
 */

/* ==========================================
   1. CONFIGURATION SYSTEM
   ========================================== */
const CONFIG = {
    recipientName: "Delicate",
    birthdayMessage: "Wishing you boundless happiness, serene peace, and unwavering confidence as you step into this new chapter. May all your quietest dreams find their path to reality, and may every day remind you of how extraordinary you truly are.",
    memories: [
        { label: "A little moment ✨", image: "assets/images/photo1.jpg" },
        { label: "A random memory 🌸", image: "assets/images/photo2.jpg" },
        { label: "Something worth remembering 💫", image: "assets/images/photo3.jpg" },
        { label: "One of those days 🤍", image: "assets/images/photo4.jpg" }
    ]
};

/* ==========================================
   2. STATE MANAGEMENT & DOM ELEMENTS
   ========================================== */
let currentStep = 1;
const totalSteps = 10;

const DOM = {
    screens: document.querySelectorAll('.screen'),
    btnPrev: document.getElementById('btn-prev'),
    progressBar: document.getElementById('progress-bar'),
    audioToggle: document.getElementById('audio-toggle'),
    audioIcon: document.getElementById('audio-icon'),
    volumeSlider: document.getElementById('volume-slider'),
    bgMusic: document.getElementById('bg-music'),
    cakeInteractive: document.getElementById('cake-interactive'),
    flame: document.getElementById('flame'),
    wishOutcome: document.getElementById('wish-outcome'),
    cakeInstruction: document.getElementById('cake-instruction'),
    memoryGrid: document.getElementById('memory-grid'),
    btnRevealLove: document.getElementById('btn-reveal-love'),
    loveLines: document.getElementById('love-lines'),
    lovePrompt: document.getElementById('love-prompt'),
    loveReassurance: document.getElementById('love-reassurance')
};

/* ==========================================
   3. INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initParticles();
    renderMemories();
    setupEventListeners();
});

function initApp() {
    updateNavigationState();
}

/* ==========================================
   4. NAVIGATION CONTROLLER
   ========================================== */
function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > totalSteps) return;

    const currentScreen = document.querySelector(`.screen[data-step="${currentStep}"]`);
    const nextScreen = document.querySelector(`.screen[data-step="${stepNumber}"]`);

    if (currentScreen) currentScreen.classList.remove('active');

    setTimeout(() => {
        if (currentScreen) currentScreen.classList.add('hidden');
        if (nextScreen) {
            nextScreen.classList.remove('hidden');
            // Slight delay to trigger fade/scale CSS animation smoothly
            setTimeout(() => nextScreen.classList.add('active'), 50);
        }
        currentStep = stepNumber;
        updateNavigationState();
    }, 400);
}

function updateNavigationState() {
    // Progress Bar Calculation
    const progressPercent = (currentStep / totalSteps) * 100;
    DOM.progressBar.style.width = `${progressPercent}%`;

    // Navigation Controls Visibility
    if (currentStep === 1 || currentStep === totalSteps) {
        DOM.btnPrev.classList.add('hidden');
    } else {
        DOM.btnPrev.classList.remove('hidden');
    }
}

/* ==========================================
   5. MEMORY SYSTEM (DYNAMIC GENERATION)
   ========================================== */
function renderMemories() {
    if (!DOM.memoryGrid) return;
    DOM.memoryGrid.innerHTML = '';

    CONFIG.memories.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.setAttribute('tabindex', '0');

        const label = document.createElement('span');
        label.className = 'memory-card-label';
        label.textContent = item.label;

        const img = document.createElement('img');
        img.className = 'memory-card-img';
        img.alt = item.label;
        img.src = item.image;

        // Fallback for missing photos
        img.onerror = () => {
            img.style.display = 'none';
            label.style.opacity = '1';
            label.textContent += " (Image Unavailable)";
        };

        card.appendChild(label);
        card.appendChild(img);

        card.addEventListener('click', () => {
            card.classList.toggle('revealed');
        });

        DOM.memoryGrid.appendChild(card);
    });
}

/* ==========================================
   6. INTERACTIVE CAKE & CANDLE
   ========================================== */
let wishMade = false;

function blowOutCandle() {
    if (wishMade) return;
    wishMade = true;

    DOM.flame.classList.add('extinguished');
    DOM.cakeInstruction.textContent = "Your wish has been made ✨";
    
    // Trigger celebration particles
    createConfettiBurst();

    setTimeout(() => {
        DOM.wishOutcome.classList.remove('hidden');
    }, 800);
}

/* ==========================================
   7. LOVE CONFESSION REVEAL
   ========================================== */
function revealLoveStory() {
    DOM.btnRevealLove.classList.add('hidden');
    DOM.lovePrompt.classList.add('hidden');
    DOM.loveLines.classList.remove('hidden');

    const lines = DOM.loveLines.querySelectorAll('.line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 1200); // Gradual line-by-line reveal
    });

    const totalDuration = lines.length * 1200 + 500;
    setTimeout(() => {
        DOM.loveReassurance.classList.remove('hidden');
    }, totalDuration);
}

/* ==========================================
   8. AUDIO SYSTEM
   ========================================== */
let isPlaying = false;

function toggleAudio() {
    if (isPlaying) {
        DOM.bgMusic.pause();
        DOM.audioIcon.textContent = '🎵';
        isPlaying = false;
    } else {
        DOM.bgMusic.play().then(() => {
            DOM.audioIcon.textContent = '⏸';
            isPlaying = true;
        }).catch(err => console.log("Audio playback blocked or unavailable:", err));
    }
}

/* ==========================================
   9. EVENT LISTENERS SETUP
   ========================================== */
function setupEventListeners() {
    // Start Button
    document.getElementById('btn-start').addEventListener('click', () => goToStep(2));

    // Next Step Buttons
    document.querySelectorAll('.next-step-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(e.currentTarget.getAttribute('data-next'), 10);
            goToStep(nextStep);
        });
    });

    // Previous Button
    DOM.btnPrev.addEventListener('click', () => {
        if (currentStep > 1) goToStep(currentStep - 1);
    });

    // Interactive Candle Events
    DOM.cakeInteractive.addEventListener('click', blowOutCandle);
    DOM.cakeInteractive.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') blowOutCandle();
    });

    // Feelings Question Choices
    document.querySelectorAll('.btn-choice').forEach(btn => {
        btn.addEventListener('click', () => goToStep(9));
    });

    // Reveal Love Story
    DOM.btnRevealLove.addEventListener('click', revealLoveStory);

    // Audio Controls
    DOM.audioToggle.addEventListener('click', toggleAudio);
    DOM.volumeSlider.addEventListener('input', (e) => {
        DOM.bgMusic.volume = e.target.value;
    });
}

/* ==========================================
   10. PARTICLE ENGINE (CANVAS)
   ========================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.2
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < 0) p.y = height;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 179, 193, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 179, 193, 0.5)';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function createConfettiBurst() {
    // Simple non-intrusive glow effect boost on wish completion
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            ctx.fillStyle = `rgba(247, 202, 208, 0.8)`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 4, 4);
        }, i * 20);
    }
}
