const $card = document.querySelector(".card");
const cardUpdate = (e) => {
  const position = pointerPositionRelativeToElement( $card, e );
  const [px,py] = position.pixels;
  const [perx, pery] = position.percent;
  const [dx,dy] = distanceFromCenter( $card, px, py );
  const edge = closenessToEdge( $card, px, py );
  const angle = angleFromPointerEvent( $card, dx, dy );
  $card.style.setProperty('--pointer-x', `${round(perx)}%`);
  $card.style.setProperty('--pointer-y', `${round(pery)}%`);
  $card.style.setProperty('--pointer-°', `${round(angle)}deg`);
  $card.style.setProperty('--pointer-d', `${round(edge * 100)}`);
  $card.classList.remove('animating');
};
$card.addEventListener("pointermove", cardUpdate);

const centerOfElement = ($el) => {
  const { left, top, width, height } = $el.getBoundingClientRect();
  return [ width/2, height/2 ];
}

const pointerPositionRelativeToElement = ($el, e) => {
  const pos = [e.clientX, e.clientY];
  const { left, top, width, height } = $el.getBoundingClientRect();
  const x = pos[0] - left;
  const y = pos[1] - top;
  const px = clamp((100 / width) * x);
  const py = clamp((100 / height) * y);
  return { pixels: [x,y], percent: [px,py] }
}

const angleFromPointerEvent = ($el, dx, dy ) => {
  // in degrees
  let angleRadians = 0;
  let angleDegrees = 0;
  if ( dx !== 0 || dy !== 0 ) {
    angleRadians = Math.atan2(dy, dx);
    angleDegrees = angleRadians * (180 / Math.PI) + 90;
    if (angleDegrees < 0) {
      angleDegrees += 360;
    }
  }
  return angleDegrees;
}

const distanceFromCenter = ( $card, x, y ) => {
  // in pixels
  const [cx,cy] = centerOfElement( $card );
  return [ x - cx, y - cy ];
}

const closenessToEdge = ( $card, x, y ) => {
  // in fraction (0,1)
  const [cx,cy] = centerOfElement( $card );
  const [dx,dy] = distanceFromCenter( $card, x, y );
  let k_x = Infinity;
  let k_y = Infinity;
  if (dx !== 0) {
    k_x = cx / Math.abs(dx);
  }
  if (dy !== 0) {
    k_y = cy / Math.abs(dy);
  }
  return clamp((1 / Math.min(k_x, k_y)), 0, 1);
}

const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);

/** code for the intro animation, not related to teh interaction */
const playAnimation = () => {
  const angleStart = 110;
  const angleEnd = 465;
  $card.style.setProperty('--pointer-°', `${angleStart}deg`);
  $card.classList.add('animating');
  animateNumber({
    ease: easeOutCubic,
    duration: 500,
    onUpdate: (v) => {
      $card.style.setProperty('--pointer-d', v);
    }
  });
  animateNumber({
    ease: easeInCubic,
    delay: 0,
    duration: 1500,
    endValue: 50,
    onUpdate: (v) => {
      const d = (angleEnd - angleStart) * (v / 100) + angleStart;
      $card.style.setProperty('--pointer-°', `${d}deg`);
    }
  });
  animateNumber({
    ease: easeOutCubic,
    delay: 1500,
    duration: 2250,
    startValue: 50,
    endValue: 100,
    onUpdate: (v) => {
      const d = (angleEnd - angleStart) * (v / 100) + angleStart;
      $card.style.setProperty('--pointer-°', `${d}deg`);
    }
  });
  animateNumber({
    ease: easeInCubic,
    duration: 1500,
    delay: 2500,
    startValue: 100,
    endValue: 0,
    onUpdate: (v) => {
      $card.style.setProperty('--pointer-d', v);
    },
    onEnd: () => {
      $card.classList.remove('animating');
    }
  });
}
setTimeout(() => {
  playAnimation();
}, 500);

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x) {
  return x * x * x;
}

function animateNumber(options) {
  const {
    startValue = 0,
    endValue = 100,
    duration = 1000,
    delay = 0,
    onUpdate = () => {},
    ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    onStart = () => {},
    onEnd = () => {},
  } = options;

  const startTime = performance.now() + delay;

  function update() {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const t = Math.min(elapsed / duration, 1); // Normalize to [0, 1]
    const easedValue = startValue + (endValue - startValue) * ease(t);
    // Apply easing
    onUpdate(easedValue);

    if (t < 1) {
      requestAnimationFrame(update); // Continue the animation
    } else if (t >= 1) {
      onEnd();
    }
  }

  setTimeout(() => {
    onStart();
    requestAnimationFrame(update); // Start the animation after the delay
  }, delay);
}

// Enhanced Diwali Website Features

// Theme switching
const $app = document.querySelector('#app');
const $moon = document.querySelector(".moon");
const $sun = document.querySelector(".sun");
if ($moon && $sun) {
  $moon.addEventListener('click', () => {
    document.body.classList.remove('light');
    $app.classList.remove('light');
  });
  $sun.addEventListener('click', () => {
    document.body.classList.add('light');
    $app.classList.add('light');
  });
}

// Fireworks System
class FireworksSystem {
  constructor() {
    this.canvas = document.getElementById('fireworksCanvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.fireworks = [];
    this.particles = [];
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Start animation loop
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createFirework(x, y) {
    const colors = ['#ff1744', '#ff5722', '#ff9800', '#ffc107', '#4caf50', '#2196f3', '#9c27b0', '#e91e63'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    this.fireworks.push({
      x,
      y,
      targetY: y,
      speed: 2,
      color,
      exploded: false
    });
  }

  explode(x, y, color) {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x,
        y,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.5) * 8,
        life: 1,
        decay: 0.015,
        color
      });
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update fireworks
    this.fireworks = this.fireworks.filter(firework => {
      if (!firework.exploded) {
        firework.y -= firework.speed;
        if (firework.y <= firework.targetY) {
          firework.exploded = true;
          this.explode(firework.x, firework.y, firework.color);
        }
        return true;
      }
      return false;
    });

    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= particle.decay;
      
      if (particle.life > 0) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.life;
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        return true;
      }
      return false;
    });

    requestAnimationFrame(() => this.animate());
  }

  launchFirework() {
    const x = Math.random() * this.canvas.width;
    const y = this.canvas.height;
    this.createFirework(x, y);
  }

  launchAllFireworks() {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        this.launchFirework();
      }, i * 200);
    }
  }
}

// Initialize fireworks system
const fireworksSystem = new FireworksSystem();

// Button event listeners
const fireBtn = document.getElementById('fireBtn');
const allBoom = document.getElementById('allBoom');

if (fireBtn) {
  fireBtn.addEventListener('click', () => {
    fireworksSystem.launchFirework();
    showToast('🎆 Fireworks launched!', 'success');
  });
}

if (allBoom) {
  allBoom.addEventListener('click', () => {
    fireworksSystem.launchAllFireworks();
    showToast('✨ Boom! Diwali celebration!', 'success');
  });
}

// Event wish buttons
const eventBtns = document.querySelectorAll('.eventBtn');
eventBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const eventName = e.target.dataset.name;
    const wishes = {
      'Dhanteras': '🙏 May prosperity come your way on Dhanteras!',
      'Naraka Chaturdashi': '🕉️ Wishing you a blessed Naraka Chaturdashi!',
      'Lakshmi Puja': '💰 May Goddess Lakshmi bless you with wealth and prosperity!',
      'Govardhan Puja': '🏔️ Happy Govardhan Puja! May your life be filled with strength!',
      'Bhai Dooj': '👫 Happy Bhai Dooj! The bond of siblings is precious!'
    };
    showToast(wishes[eventName] || '🙏 Happy Diwali!', 'blessing');
  });
});

// Records functionality
const saveRecord = document.getElementById('saveRecord');
const clearRecords = document.getElementById('clearRecords');
const recordEvent = document.getElementById('recordEvent');
const recordText = document.getElementById('recordText');
const notesList = document.getElementById('notesList');

if (saveRecord) {
  saveRecord.addEventListener('click', () => {
    const event = recordEvent.value.trim();
    const text = recordText.value.trim();
    
    if (event && text) {
      const record = {
        event,
        text,
        date: new Date().toLocaleDateString()
      };
      
      let records = JSON.parse(localStorage.getItem('diwaliRecords') || '[]');
      records.push(record);
      localStorage.setItem('diwaliRecords', JSON.stringify(records));
      
      recordEvent.value = '';
      recordText.value = '';
      displayRecords();
      showToast('💾 Record saved successfully!', 'success');
    } else {
      showToast('❌ Please fill in both fields!', 'error');
    }
  });
}

if (clearRecords) {
  clearRecords.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all records?')) {
      localStorage.removeItem('diwaliRecords');
      displayRecords();
      showToast('🗑️ All records cleared!', 'success');
    }
  });
}

function displayRecords() {
  if (!notesList) return;
  
  const records = JSON.parse(localStorage.getItem('diwaliRecords') || '[]');
  notesList.innerHTML = records.map(record => `
    <div class="record-item">
      <h5>${record.event} - ${record.date}</h5>
      <p>${record.text}</p>
    </div>
  `).join('');
}

// Toast notification system
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Initialize records display
displayRecords();