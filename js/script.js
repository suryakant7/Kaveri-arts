/**
 * ==========================================
 * KAVERI-ARTS - INTERACTIVE EXPERIENCES
 * Smooth animations, scroll effects, and interactions
 * ==========================================
 */

// ==========================================
// NAVIGATION BAR BEHAVIOR
// ==========================================

/**
 * Navbar scroll effect - adds class when scrolled
 */
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add 'scrolled' class when not at top
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
});

/**
 * Mobile navigation toggle
 */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translateY(8px)' 
        : 'none';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translateY(-8px)' 
        : 'none';
});

/**
 * Close mobile menu when clicking on nav links
 */
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        
        // Reset hamburger icon
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// BACK TO TOP BUTTON
// ==========================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// INTERSECTION OBSERVER - SCROLL ANIMATIONS
// ==========================================

/**
 * Animate elements when they enter viewport
 */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
const animatedElements = document.querySelectorAll(`
    .about-content,
    .philosophy-card,
    .life-text,
    .timeline-item,
    .vision-card,
    .contact-item,
    .contact-form-container
`);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeInObserver.observe(el);
});

// ==========================================
// GALLERY INTERACTIONS
// ==========================================

/**
 * Add staggered animation to gallery items
 */
const galleryItems = document.querySelectorAll('.gallery-item');

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }, index * 100); // Stagger the animations
            
            galleryObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

galleryItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px) scale(0.95)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    galleryObserver.observe(item);
});

/**
 * Gallery item click - future enhancement for lightbox
 */
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        // Placeholder for future lightbox functionality
        console.log('Gallery item clicked - lightbox feature can be added here');
    });
});

// ==========================================
// PARALLAX EFFECT FOR HERO MANDALA
// ==========================================

const mandalaPattern = document.querySelector('.mandala-pattern');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    
    if (mandalaPattern) {
        mandalaPattern.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg) scale(${1 + scrolled * 0.0005})`;
    }
});

// ==========================================
// CONTACT FORM HANDLING
// ==========================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission (replace with actual backend call)
    console.log('Form submitted:', formData);
    
    // Show success message
    showFormMessage('Thank you! Your message has been received. I will get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
});

/**
 * Display form submission message
 */
function showFormMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1.5rem 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ff6b35, #f7931e)' : '#c1272d'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 8px 30px rgba(255, 107, 53, 0.4);
        z-index: 10000;
        font-family: 'Raleway', sans-serif;
        font-weight: 500;
        animation: slideInDown 0.5s ease, slideOutUp 0.5s ease 3s;
    `;
    
    document.body.appendChild(messageElement);
    
    // Remove message after 3.5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 3500);
}

// Add CSS animations for form messages
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-100px);
        }
    }
`;
document.head.appendChild(styleSheet);

// ==========================================
// CURSOR TRAIL EFFECT (ARTISTIC ENHANCEMENT)
// ==========================================

/**
 * Create a subtle cursor trail with mandala-inspired dots
 * Only on desktop devices
 */
if (window.innerWidth > 768) {
    const cursorTrail = [];
    const maxTrailLength = 15;
    
    document.addEventListener('mousemove', (e) => {
        // Create trail dot
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle, rgba(255, 107, 53, 0.6), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translate(-50%, -50%);
            animation: fadeOut 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(dot);
        cursorTrail.push(dot);
        
        // Remove old dots
        if (cursorTrail.length > maxTrailLength) {
            const oldDot = cursorTrail.shift();
            if (oldDot && oldDot.parentNode) {
                oldDot.remove();
            }
        }
        
        // Auto-remove after animation
        setTimeout(() => {
            if (dot.parentNode) {
                dot.remove();
            }
        }, 800);
    });
    
    // Add fadeOut animation
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }
    `;
    document.head.appendChild(cursorStyle);
}

// ==========================================
// ACTIVE SECTION HIGHLIGHTING IN NAV
// ==========================================

/**
 * Highlight current section in navigation
 */
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);

// Add active link styling
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-link.active-link {
        color: var(--color-light-text);
    }
    
    .nav-link.active-link::after {
        width: 100%;
    }
`;
document.head.appendChild(navLinkStyle);

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================

/**
 * Add a subtle scroll progress bar at the top
 */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--color-deep-orange), var(--color-golden-yellow), var(--color-crimson-red));
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ==========================================
// LAZY LOADING FOR FUTURE IMAGES
// ==========================================

/**
 * Lazy load images when they enter viewport
 * (Useful when real artwork images are added)
 */
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

/**
 * Debounce function for scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Additional optimized scroll handlers can be added here
}, 10));

// ==========================================
// EASTER EGG - MANDALA CREATOR
// ==========================================

/**
 * Hidden feature: Press 'M' key 3 times to reveal a mini mandala creator
 */
let mKeyPressCount = 0;
let mKeyTimer;

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm') {
        mKeyPressCount++;
        
        clearTimeout(mKeyTimer);
        mKeyTimer = setTimeout(() => {
            mKeyPressCount = 0;
        }, 1000);
        
        if (mKeyPressCount === 3) {
            console.log('🎨 Secret Mandala Creator activated! (Feature coming soon)');
            showFormMessage('✨ Secret discovered! Mandala creator mode unlocked.', 'success');
            mKeyPressCount = 0;
        }
    }
});

// ==========================================
// INITIALIZATION
// ==========================================

/**
 * Initialize all interactive features when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎨 Kaveri-arts Portfolio Loaded', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
    console.log('%cMandala Art • Creativity • Culture', 'color: #fdc500; font-size: 14px; font-style: italic;');
    
    // Add initial animation class to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('loaded');
    }
    
    // Initialize any additional features here
    highlightNav(); // Set initial active nav link
});

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

/**
 * Keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Navigate to sections with number keys
    const keyMap = {
        '1': '#home',
        '2': '#about',
        '3': '#gallery',
        '4': '#philosophy',
        '5': '#life',
        '6': '#vision',
        '7': '#contact'
    };
    
    if (e.altKey && keyMap[e.key]) {
        e.preventDefault();
        const target = document.querySelector(keyMap[e.key]);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

/**
 * Focus management for modal/overlay (future enhancement)
 */
const focusTrap = {
    elements: [],
    firstElement: null,
    lastElement: null,
    
    activate(container) {
        this.elements = container.querySelectorAll('a, button, input, textarea, select');
        this.firstElement = this.elements[0];
        this.lastElement = this.elements[this.elements.length - 1];
        
        container.addEventListener('keydown', this.handleTab.bind(this));
    },
    
    handleTab(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === this.firstElement) {
                e.preventDefault();
                this.lastElement.focus();
            }
        } else {
            if (document.activeElement === this.lastElement) {
                e.preventDefault();
                this.firstElement.focus();
            }
        }
    }
};

// ==========================================
// CONSOLE ART (FOR DEVELOPERS)
// ==========================================

console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║         KAVERI-ARTS PORTFOLIO         ║
    ║       Mandala Art Gallery 2024        ║
    ║                                       ║
    ║   Built with ❤️ and precision         ║
    ║   HTML • CSS • Vanilla JavaScript     ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    
    🎨 Features:
    • Dark art gallery theme
    • Smooth scroll animations
    • Responsive design
    • Accessibility optimized
    • Performance enhanced
    
    💡 Tips:
    • Use Alt + Number keys to navigate sections
    • Press 'M' 3 times for a secret surprise
    
    🌐 Status: All systems operational
`);
