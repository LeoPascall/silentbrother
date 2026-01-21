// ===== Interactive Canvas Background =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.3 + 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 15;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe section titles
document.querySelectorAll('.section-title').forEach(el => {
    observer.observe(el);
});

// Observe featured project elements
const featuredHeader = document.querySelector('.featured-header');
const featuredContent = document.querySelector('.featured-content');
const featuredText = document.querySelector('.featured-text');
if (featuredHeader) observer.observe(featuredHeader);
if (featuredContent) observer.observe(featuredContent);
if (featuredText) observer.observe(featuredText);

// Observe approach cards
document.querySelectorAll('.approach-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observe past work cards
document.querySelectorAll('.past-work-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(card);
});

// Observe scrim cards
document.querySelectorAll('.scrim-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observe project cards with staggered animation
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observe features
document.querySelectorAll('.feature').forEach((feature, index) => {
    feature.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(feature);
});

// Observe about text
const aboutText = document.querySelector('.about-text');
if (aboutText) {
    observer.observe(aboutText);
}

// Observe contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    observer.observe(contactForm);
}

// ===== Smooth Scroll =====
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

// ===== Optimized Mouse Following Effect =====
let mouseThrottled = false;
let targetMouseX = 0;
let targetMouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (!mouseThrottled) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        mouseThrottled = true;
        setTimeout(() => { mouseThrottled = false; }, 50);
    }
}, { passive: true });

// ===== Form Submission =====
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector('textarea');
        const button = form.querySelector('button');

        // Simple validation
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading state
        const originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;

        try {
            // Use FormSubmit.co API for sending emails (free service)
            const formData = new FormData();
            formData.append('_captcha', 'false');
            formData.append('name', nameInput.value);
            formData.append('email', emailInput.value);
            formData.append('message', messageInput.value);
            formData.append('_subject', `New Message from ${nameInput.value} - Silent Brother Production House`);
            formData.append('_template', 'table');

            const response = await fetch('https://formsubmit.co/dualozonebusiness@gmail.com', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                button.textContent = 'Message Sent! ✓';
                button.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    button.textContent = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 2000);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            button.textContent = 'Error sending message';
            button.style.background = 'linear-gradient(135deg, #ff006e 0%, #ff4d94 100%)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
    });
}

// ===== Lightweight Parallax Scroll Effect =====
let scrollThrottled = false;
window.addEventListener('scroll', () => {
    if (!scrollThrottled) {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        scrollThrottled = true;
        requestAnimationFrame(() => { scrollThrottled = false; });
    }
}, { passive: true });

// ===== Navbar Background on Scroll =====
const navbar = document.querySelector('.navbar');
let navbarScrollThrottled = false;
window.addEventListener('scroll', () => {
    if (!navbarScrollThrottled) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 14, 39, 0.8)';
        }
        navbarScrollThrottled = true;
        setTimeout(() => { navbarScrollThrottled = false; }, 100);
    }
}, { passive: true });

// ===== Active Nav Link =====
const navLinks = document.querySelectorAll('.nav-link');
let navLinkThrottled = false;
window.addEventListener('scroll', () => {
    if (!navLinkThrottled) {
        let currentSection = '';
        const scrollY = window.scrollY;

        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.style.color = 'var(--accent)';
            } else {
                link.style.color = '';
            }
        });
        navLinkThrottled = true;
        setTimeout(() => { navLinkThrottled = false; }, 150);
    }
}, { passive: true });

// ===== Initialize =====
console.log('🎬 Silent Brother Production House - Ready');
