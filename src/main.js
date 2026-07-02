import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu on click
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active navigation link on scroll and Progress Bar
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  const progressBar = document.getElementById('scroll-bar');

  window.addEventListener('scroll', () => {
    // Progress Bar Logic
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }

    // Active Nav Link Logic
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // Intersection Observer for scroll animations
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });

  // Contact Form Submission (Mock)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.textContent = 'Casting Owl Mail...';
      btn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        btn.textContent = 'Owl Dispatched! ✉️';
        btn.style.background = 'var(--accent-primary)';
        btn.style.color = 'var(--bg-primary)';
        contactForm.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ========================================================
     HARRY POTTER WAND CURSOR & PARTICLE SYSTEM
     ======================================================== */
  const canvas = document.getElementById('wand-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Mouse tracking
    let mouse = { x: undefined, y: undefined, prevX: undefined, prevY: undefined };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Calculate speed
      let speed = 0;
      if (mouse.prevX !== undefined) {
        let dx = mouse.x - mouse.prevX;
        let dy = mouse.y - mouse.prevY;
        speed = Math.sqrt(dx * dx + dy * dy);
      }

      // Spawn particles on mouse move, proportional to speed
      const numParticles = Math.min(Math.floor(speed / 2) + 1, 5);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        particles.push(new Particle(mouse.x, mouse.y));
      }
    });

    // Get current theme/house color for particles
    function getParticleColor() {
      const house = document.documentElement.getAttribute('data-house') || 'hogwarts';
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';

      // Colors matching the design variables
      if (house === 'gryffindor') return theme === 'dark' ? '#ffc500' : '#ae0001';
      if (house === 'slytherin') return '#2ebd6b';
      if (house === 'ravenclaw') return theme === 'dark' ? '#00a2ff' : '#0e1a40';
      if (house === 'hufflepuff') return theme === 'dark' ? '#e0b034' : '#856108';
      
      return '#d4af37'; // Default Hogwarts Gold
    }

    // Particle class
    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        // Random velocities or inherit if provided
        this.vx = vx !== undefined ? vx : (Math.random() - 0.5) * 2;
        this.vy = vy !== undefined ? vy : (Math.random() - 0.5) * 2 - 0.5; // slight upward drift
        this.size = Math.random() * 3 + 1.5;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = getParticleColor();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.size > 0.1) this.size -= 0.02;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Glowing radial gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.3, this.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Explode helper for sorting hat ceremony and easter eggs
    window.castSpellExplosion = function(x, y, count = 40) {
      for (let i = 0; i < count; i++) {
        // Random angle and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, vx, vy));
      }
    };

    // Render loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove dead particles
        if (particles[i].alpha <= 0 || particles[i].size <= 0.1) {
          particles.splice(i, 1);
          i--;
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ========================================================
     LUMOS / NOX SWITCH LOGIC
     ======================================================== */
  const lumosToggle = document.getElementById('lumos-toggle');
  
  // Set initial theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateLumosToggleUI(savedTheme);

  if (lumosToggle) {
    lumosToggle.addEventListener('click', (e) => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateLumosToggleUI(newTheme);

      // Trigger magic flash at button or cursor
      if (window.castSpellExplosion) {
        window.castSpellExplosion(e.clientX, e.clientY, 25);
      }
    });
  }

  function updateLumosToggleUI(theme) {
    if (!lumosToggle) return;
    const textEl = lumosToggle.querySelector('.spell-text');
    const tipEl = lumosToggle.querySelector('.wand-tip');
    
    if (theme === 'light') {
      if (textEl) textEl.textContent = 'Lumos';
      if (tipEl) tipEl.innerHTML = '🪄✨';
      lumosToggle.title = "Cast Nox (Dark Theme)";
    } else {
      if (textEl) textEl.textContent = 'Nox';
      if (tipEl) tipEl.innerHTML = '🪄';
      lumosToggle.title = "Cast Lumos (Light Theme)";
    }
  }

  /* ========================================================
     SORTING CEREMONY MODAL LOGIC
     ======================================================== */
  const sortingHatBtn = document.getElementById('sorting-hat-btn');
  const sortingModal = document.getElementById('sorting-modal');
  const closeSortingBtn = document.getElementById('close-sorting');
  const houseButtons = document.querySelectorAll('.house-btn');
  const sortingResult = document.querySelector('.sorting-result');
  const sortedHouseName = document.getElementById('sorted-house-name');
  const houseDesc = document.getElementById('house-desc');

  // Load saved house
  const savedHouse = localStorage.getItem('house') || 'hogwarts';
  document.documentElement.setAttribute('data-house', savedHouse);
  updateSortingBtnUI(savedHouse);

  // House descriptions
  const houseTexts = {
    gryffindor: "You belong in Gryffindor, where dwell the brave at heart! Their daring, nerve, and chivalry set Gryffindors apart.",
    slytherin: "Or perhaps in Slytherin, you'll make your real friends. Those cunning folk use any means to achieve their ends.",
    ravenclaw: "Or yet in wise old Ravenclaw, if you've a ready mind. Where those of wit and learning, will always find their kind.",
    hufflepuff: "Where they are just and loyal, those patient Hufflepuffs are true, and unafraid of toil."
  };

  if (sortingHatBtn && sortingModal) {
    // Open modal
    sortingHatBtn.addEventListener('click', () => {
      sortingModal.classList.remove('hidden');
      sortingResult.classList.add('hidden'); // Reset result view
    });

    // Close modal
    closeSortingBtn.addEventListener('click', () => {
      sortingModal.classList.add('hidden');
    });

    // Close on clicking overlay
    sortingModal.addEventListener('click', (e) => {
      if (e.target === sortingModal) {
        sortingModal.classList.add('hidden');
      }
    });

    // House selection
    houseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const house = btn.getAttribute('data-house');
        
        // Update document
        document.documentElement.setAttribute('data-house', house);
        localStorage.setItem('house', house);
        
        // Show result inside modal
        sortedHouseName.textContent = house.charAt(0).toUpperCase() + house.slice(1);
        sortedHouseName.style.color = `var(--accent-primary)`;
        houseDesc.textContent = houseTexts[house];
        
        sortingResult.classList.remove('hidden');
        updateSortingBtnUI(house);

        // Explode house particles from the center of screen
        if (window.castSpellExplosion) {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          window.castSpellExplosion(centerX, centerY, 60);
        }

        // Keep modal open briefly to let user read, then close it
        setTimeout(() => {
          sortingModal.classList.add('hidden');
        }, 3000);
      });
    });
  }

  function updateSortingBtnUI(house) {
    if (!sortingHatBtn) return;
    const hatText = sortingHatBtn.querySelector('.hat-text');
    
    if (house === 'hogwarts') {
      if (hatText) hatText.textContent = 'Sort';
    } else {
      if (hatText) hatText.textContent = house.charAt(0).toUpperCase() + house.slice(1);
    }
  }

  /* ========================================================
     EASTER EGGS (KEYWORD TYPING)
     ======================================================== */
  let inputBuffer = '';
  const expectedCodes = {
    'alohomora': () => {
      // Trigger a massive golden explosion and unlock a message
      if (window.castSpellExplosion) {
        for (let j = 0; j < 5; j++) {
          setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            window.castSpellExplosion(x, y, 30);
          }, j * 200);
        }
      }
      
      // Temporary floating ancient scroll with secret greeting
      const secretCard = document.createElement('div');
      secretCard.style.position = 'fixed';
      secretCard.style.top = '50%';
      secretCard.style.left = '50%';
      secretCard.style.transform = 'translate(-50%, -50%)';
      secretCard.style.zIndex = '3000';
      secretCard.className = 'glass-card scroll-style';
      secretCard.style.padding = '3rem';
      secretCard.style.textAlign = 'center';
      secretCard.style.maxWidth = '500px';
      secretCard.style.border = '3px double var(--accent-primary)';
      secretCard.innerHTML = `
        <h2 style="color: var(--accent-primary); margin-bottom: 1.5rem; font-family: var(--font-heading)">Chamber Unlocked!</h2>
        <p style="color: var(--text-primary); font-size: 1.25rem; font-style: italic; margin-bottom: 1.5rem">
          "The stories we love best do live in us forever. So whether you come back by page or by the big screen, Hogwarts will always be there to welcome you home."
        </p>
        <div style="font-size: 2rem; margin-bottom: 1.5rem">⚡🕯️🦉</div>
        <button id="close-secret" class="btn btn-primary btn-small">Mischief Managed</button>
      `;
      document.body.appendChild(secretCard);

      document.getElementById('close-secret').addEventListener('click', () => {
        secretCard.style.transition = 'opacity 0.4s';
        secretCard.style.opacity = '0';
        setTimeout(() => secretCard.remove(), 400);
      });
    },
    'lumos': () => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateLumosToggleUI('light');
    },
    'nox': () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateLumosToggleUI('dark');
    }
  };

  window.addEventListener('keydown', (e) => {
    // Only capture letters
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      inputBuffer += e.key.toLowerCase();
      // Keep buffer length to maximum keyword length (10 characters)
      if (inputBuffer.length > 12) {
        inputBuffer = inputBuffer.slice(-12);
      }

      // Check if buffer contains any keyword
      for (const key in expectedCodes) {
        if (inputBuffer.endsWith(key)) {
          expectedCodes[key]();
          inputBuffer = ''; // Clear buffer after trigger
          break;
        }
      }
    }
  });
});
