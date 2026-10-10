// ==================== Hamburger Menu ====================
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        mobileMenu.hidden = isOpen;
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.hidden = true;
        }
    });
}

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = href !== '#' && document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== Scroll Animations ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.clipPath = 'inset(0 0% 0 0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.child-voice').forEach(el => {
    if (!el.classList.contains('hero-child-voice')) {
        el.style.clipPath = 'inset(0 100% 0 0)';
        el.style.transition = 'clip-path 0.6s cubic-bezier(.6,0,.2,1)';
        observer.observe(el);
    }
});

// ==================== Reduced Motion ====================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// ==================== Tabs (B-2a-B) ====================
const tabPills = document.querySelectorAll('.tab-pill');
tabPills.forEach(pill => {
    pill.addEventListener('click', () => {
        const targetId = pill.getAttribute('aria-controls');
        tabPills.forEach(p => p.setAttribute('aria-selected', 'false'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.setAttribute('aria-hidden', 'true'));
        pill.setAttribute('aria-selected', 'true');
        document.getElementById(targetId).setAttribute('aria-hidden', 'false');
    });
});

// ==================== Accordion (B-2e) ====================
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        trigger.nextElementSibling.classList.toggle('open', !isOpen);
    });
});
