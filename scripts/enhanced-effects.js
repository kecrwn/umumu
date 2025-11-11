// Enhanced Effects - Fireworks, Confetti, and Animations
document.addEventListener('DOMContentLoaded', function() {

    initFireworks();
    initCelebrationButtons();
    initToastNotifications();
    initEnhancedAnimations();
});



// Fireworks System
function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Firework particles
    const particles = [];
    const fireworks = [];
    
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 2;
            this.acceleration = 1.05;
            this.brightness = random(50, 100);
            this.targetRadius = 1;
            this.targetSpeed = 5;
            this.arrived = false;
        }
        
        update() {
            this.targetX += (this.targetX - this.x) * 0.13;
            this.targetY += (this.targetY - this.y) * 0.13;
            
            this.speed *= this.acceleration;
            this.x += (this.targetX - this.x) / this.speed;
            this.y += (this.targetY - this.y) / this.speed;
            
            this.targetRadius += this.targetSpeed;
            
            if (this.targetRadius > 5) {
                this.arrived = true;
                return true;
            }
            return false;
        }
        
        draw() {
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.targetRadius, 0, Math.PI * 2, true);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fill();
        }
    }
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8;
            this.friction = 0.95;
            this.gravity = 0.5;
            this.life = 1;
            this.size = 2;
            this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        }
        
        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.life -= 0.02;
            this.size = Math.max(0, this.life * 3);
        }
        
        draw() {
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            ctx.fill();
        }
    }
    
    function createFirework(x, y, targetX, targetY) {
        const firework = new Firework(x, y, targetX, targetY);
        fireworks.push(firework);
    }
    
    function createParticleExplosion(x, y) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(x, y));
        }
    }
    
    function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        
        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].update()) {
                createParticleExplosion(fireworks[i].x, fireworks[i].y);
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Global function to launch fireworks
    window.launchFireworks = function(count = 5) {
        canvas.classList.add('show');
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = random(0, canvas.width);
                const y = random(canvas.height * 0.3, canvas.height * 0.7);
                const targetX = x + random(-100, 100);
                const targetY = y + random(-200, -100);
                
                createFirework(x, y, targetX, targetY);
            }, i * 200);
        }
        
        // Hide canvas after animation
        setTimeout(() => {
            canvas.classList.remove('show');
        }, 3000);
    };
    
    // Start animation loop
    animate();
}

// Celebration Buttons
function initCelebrationButtons() {
    const fireworksBtn = document.getElementById('fireworksBtn');
    const boomAllBtn = document.getElementById('boomAllBtn');
    const confettiBtn = document.getElementById('confettiBtn');
    
    if (fireworksBtn) {
        fireworksBtn.addEventListener('click', () => {
            showToast('🎆 Fireworks launched! Celebrate our love!', 'success');
            if (window.launchFireworks) {
                window.launchFireworks(3);
            }
            buttonPulse(fireworksBtn);
        });
    }
    
    if (boomAllBtn) {
        boomAllBtn.addEventListener('click', () => {
            showToast('✨ Everything is magical with you!', 'success');
            if (window.launchFireworks) {
                window.launchFireworks(8);
            }
            createConfetti();
            buttonPulse(boomAllBtn);
        });
    }
    
    if (confettiBtn) {
        confettiBtn.addEventListener('click', () => {
            showToast('🎉 Confetti time! You make everything special!', 'success');
            createConfetti();
            buttonPulse(confettiBtn);
        });
    }
}

// Toast Notifications
function initToastNotifications() {
    window.showToast = function(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };
}

// Enhanced Animations
function initEnhancedAnimations() {
    // Add floating class to elements
    const floatingElements = document.querySelectorAll('.floating-elements .floating-star, .floating-elements .floating-heart, .floating-elements .floating-music, .floating-elements .floating-sparkle');
    floatingElements.forEach(el => {
        el.classList.add('floating');
    });
    
    // Add pulse effect to important elements
    const pulseElements = document.querySelectorAll('.duration-card, .disco-square, .charm');
    pulseElements.forEach(el => {
        el.classList.add('pulse');
    });
    
    // Enhanced hover effects
    initEnhancedHoverEffects();
}

// Enhanced Hover Effects
function initEnhancedHoverEffects() {
    // Add sparkle trail effect on hover
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('disco-square') || 
            e.target.classList.contains('duration-card') ||
            e.target.classList.contains('charm')) {
            createSparkleTrail(e.clientX, e.clientY);
        }
    });
}

// Utility Functions
function random(min, max) {
    return Math.random() * (max - min) + min;
}

function buttonPulse(button) {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 0 20px rgba(230, 165, 163, 0.8)';
    
    setTimeout(() => {
        button.style.transform = '';
        button.style.boxShadow = '';
    }, 300);
}



function createSparkleTrail(x, y) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                left: ${x + (Math.random() - 0.5) * 40}px;
                top: ${y + (Math.random() - 0.5) * 40}px;
                font-size: ${Math.random() * 10 + 10}px;
                pointer-events: none;
                z-index: 1000;
                animation: sparkleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }, i * 50);
    }
}

function createConfetti() {
    const colors = ['#E6A5A3', '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#FF69B4'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                z-index: 1000;
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }, i * 20);
    }
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotateZ(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Smooth scrolling enhancement
function addSmoothScrolling() {
    const cardsSection = document.querySelector('.photos-section');
    if (cardsSection) {
        const scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.textContent = 'Scroll to explore our memories in 3D! ✨';
        cardsSection.appendChild(scrollHint);
    }
}

addSmoothScrolling();

// Add scroll hint styling
const hintStyle = document.createElement('style');
hintStyle.textContent = `
    .scroll-hint {
        text-align: center;
        margin-top: 24px;
        color: #E6A5A3;
        font-size: 14px;
        font-weight: 500;
        animation: hintPulse 2s ease-in-out infinite;
    }
    
    @keyframes hintPulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(hintStyle);

// 3D Tubes Cursor Effect for Celebration Section
async function initTubesCursor() {
    const canvas = document.getElementById('tubesCursorCanvas');
    if (!canvas) return;
    
    try {
        // Dynamically import the tubes cursor module
        const { default: TubesCursor } = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        
        // Custom colors matching the celebration theme
        const celebrationColors = ["#FFD700", "#FFA500", "#FF69B4", "#87CEEB", "#98FB98"];
        const celebrationLights = ["#FFD700", "#FFA500", "#FF1493", "#00CED1", "#FF6347"];
        
        // Initialize the tubes cursor
        const tubesCursor = TubesCursor(canvas, {
            tubes: {
                colors: celebrationColors,
                lights: {
                    intensity: 150,
                    colors: celebrationLights
                }
            }
        });

        // Add click event to change colors randomly
        canvas.addEventListener('click', () => {
            const randomColors = generateRandomColors(3);
            const randomLights = generateRandomColors(4);
            tubesCursor.tubes.setColors(randomColors);
            tubesCursor.tubes.setLightsColors(randomLights);
        });

        // Enhanced button interaction with tubes cursor
        const celebrationButtons = document.querySelectorAll('.celebration-buttons .btn');
        
        // Track mouse position for button interactions
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Check if mouse is near any celebration button
            celebrationButtons.forEach(button => {
                const rect = button.getBoundingClientRect();
                const buttonCenterX = rect.left + rect.width / 2;
                const buttonCenterY = rect.top + rect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(mouseX - buttonCenterX, 2) + 
                    Math.pow(mouseY - buttonCenterY, 2)
                );
                
                // If mouse is within 100px of button center, add active class
                if (distance < 100) {
                    button.classList.add('tubes-active');
                } else {
                    button.classList.remove('tubes-active');
                }
            });
        });

        // Enhanced button click effects with tubes cursor
        celebrationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create tubes cursor burst effect at click position
                const rect = canvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                
                // Trigger tubes color burst
                const burstColors = ["#FF1493", "#FFD700", "#FF4500", "#00CED1", "#32CD32"];
                const burstLights = ["#FFD700", "#FF69B4", "#FF4500", "#87CEEB", "#98FB98"];
                
                tubesCursor.tubes.setColors(burstColors);
                tubesCursor.tubes.setLightsColors(burstLights);
                
                // Auto revert colors after 2 seconds
                setTimeout(() => {
                    tubesCursor.tubes.setColors(celebrationColors);
                    tubesCursor.tubes.setLightsColors(celebrationLights);
                }, 2000);
            });
        });

        // Initial celebration burst
        setTimeout(() => {
            const burstColors = ["#FF1493", "#FFD700", "#FF4500", "#00CED1", "#32CD32"];
            const burstLights = ["#FFD700", "#FF69B4", "#FF4500", "#87CEEB", "#98FB98"];
            tubesCursor.tubes.setColors(burstColors);
            tubesCursor.tubes.setLightsColors(burstLights);
        }, 1000);
        
        console.log('🎆 3D Tubes Cursor initialized successfully!');
        
    } catch (error) {
        console.warn('Tubes Cursor failed to load:', error);
        // Fallback: hide the canvas if the effect fails to load
        canvas.style.display = 'none';
    }
}

// Helper function to generate random colors
function generateRandomColors(count) {
    const colors = [
        "#FFD700", "#FFA500", "#FF69B4", "#FF1493", "#FF4500",
        "#FF6347", "#FF8C00", "#FF7F50", "#FFB6C1", "#FFC0CB",
        "#87CEEB", "#87CEFA", "#00CED1", "#00BFFF", "#1E90FF",
        "#98FB98", "#90EE90", "#32CD32", "#228B22", "#006400",
        "#DDA0DD", "#D8BFD8", "#E6E6FA", "#F0E68C", "#FFFFE0"
    ];
    return new Array(count)
        .fill(0)
        .map(() => colors[Math.floor(Math.random() * colors.length)]);
}

// Initialize tubes cursor when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTubesCursor);
} else {
    initTubesCursor();
}