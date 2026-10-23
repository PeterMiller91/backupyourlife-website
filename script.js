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

// ==================== Tabs (B-2a-B, Rechenbeispiele) ====================
// Jede .tabs-group schaltet nur ihre eigenen Pills und Panels um.
document.querySelectorAll('.tab-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        const group = pill.closest('.tabs-group') || document;
        group.querySelectorAll('.tab-pill').forEach(p => p.setAttribute('aria-selected', 'false'));
        group.querySelectorAll('.tab-panel').forEach(panel => panel.setAttribute('aria-hidden', 'true'));
        pill.setAttribute('aria-selected', 'true');
        document.getElementById(pill.getAttribute('aria-controls')).setAttribute('aria-hidden', 'false');
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

// ==================== Notfallrechner ====================
// Rechnet nur im Browser – es wird nichts gespeichert oder gesendet.
const calcForm = document.getElementById('calc-form');

if (calcForm) {
    const num = id => Math.max(0, parseFloat(document.getElementById(id).value) || 0);
    const euro = n => n.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';
    const amountEl = document.getElementById('calc-amount');
    const totalEl = document.getElementById('calc-total');

    const updateCalc = () => {
        const kosten = num('calc-kosten');
        if (!kosten) {
            amountEl.textContent = '–';
            amountEl.classList.remove('is-gap');
            totalEl.textContent = '';
            return;
        }
        const luecke = Math.max(0, kosten - num('calc-staat') - num('calc-vorhanden'));
        amountEl.textContent = luecke ? '−' + euro(luecke) : '0 €';
        amountEl.classList.toggle('is-gap', luecke > 0);

        const alter = num('calc-alter');
        if (luecke && alter >= 18 && alter < 67) {
            const jahre = 67 - alter;
            totalEl.textContent = `≈ ${euro(luecke * 12 * jahre)} bis 67 (${jahre} Jahre)`;
        } else if (!luecke) {
            totalEl.textContent = 'Nach dieser groben Rechnung ist keine Lücke offen.';
        } else {
            totalEl.textContent = '';
        }
    };

    calcForm.addEventListener('input', updateCalc);
    calcForm.addEventListener('submit', e => e.preventDefault());
}
