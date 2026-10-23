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

// ==================== Sprungmenü: aktives Kapitel + Fortschritt ====================
const jumpNav = document.querySelector('.jump-nav');

if (jumpNav) {
    const headerWrap = document.querySelector('.header-wrapper');
    const tabs = [...jumpNav.querySelectorAll('.jump-tab')];
    const chapters = [...document.querySelectorAll('[data-chapter]')];
    const progress = jumpNav.querySelector('.jump-progress');
    const tabRow = jumpNav.querySelector('.jump-nav-inner');
    let current = null;

    // Sprungziele landen exakt unter dem klebenden Header + Tabs
    const setOffset = () => {
        document.documentElement.style.setProperty('--jump-offset', headerWrap.offsetHeight + 8 + 'px');
    };

    const setActive = (name) => {
        if (name === current) return;
        current = name;
        tabs.forEach(tab => {
            const on = tab.dataset.chapterLink === name;
            tab.setAttribute('aria-current', on ? 'true' : 'false');
            // Aktiven Tab auf schmalen Screens ins Bild schieben
            if (on && tabRow.scrollWidth > tabRow.clientWidth) {
                tabRow.scrollTo({ left: tab.offsetLeft - 16 });
            }
        });
    };

    let ticking = false;
    const update = () => {
        ticking = false;
        const line = headerWrap.offsetHeight + window.innerHeight * 0.25;
        let active = null;
        chapters.forEach(ch => {
            if (ch.getBoundingClientRect().top <= line) active = ch.dataset.chapter;
        });
        setActive(active);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', () => { setOffset(); update(); });
    setOffset();
    update();
}

// ==================== Mobile: Backup-Check-Leiste unten ====================
const stickyCta = document.getElementById('sticky-cta');

if (stickyCta) {
    const hero = document.querySelector('.hero');
    const stickyBtn = stickyCta.querySelector('button');
    const endZones = [...document.querySelectorAll('.cta-section, .footer')];
    const cookieBanner = document.getElementById('cookie-banner');
    const menu = document.getElementById('mobile-menu');
    let endVisible = false;

    // Leiste ausblenden, sobald der große CTA oder der Footer sichtbar ist
    const endObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { e.target.dataset.inView = e.isIntersecting ? '1' : ''; });
        endVisible = endZones.some(z => z.dataset.inView === '1');
        refresh();
    });
    endZones.forEach(z => endObserver.observe(z));

    function refresh() {
        const pastHero = hero.getBoundingClientRect().bottom < 0;
        const blocked = endVisible || (cookieBanner && !cookieBanner.hidden) || (menu && !menu.hidden);
        const show = pastHero && !blocked;
        stickyCta.classList.toggle('is-visible', show);
        stickyCta.setAttribute('aria-hidden', show ? 'false' : 'true');
        stickyBtn.tabIndex = show ? 0 : -1;
    }

    window.addEventListener('scroll', refresh, { passive: true });
    document.addEventListener('click', () => setTimeout(refresh, 0));
    refresh();
}
