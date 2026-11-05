// ==================== Einstellungen ====================
// Link zu deinem Terminkalender (z. B. Calendly oder Cal.com).
// Ist er gesetzt, zeigt das Ergebnis einen "Termin wählen"-Button,
// Name und E-Mail werden vorausgefüllt.
// Bleibt er leer, bestätigt das Ergebnis, dass du dich telefonisch meldest.
const BOOKING_URL = '';

// Eingebaute Terminwahl (wird genutzt, solange BOOKING_URL leer ist).
// Der gewählte Termin kommt per Telegram bei dir an.
const TERMIN_TAGE   = 6;                                   // wie viele Werktage zur Auswahl stehen
const TERMIN_ZEITEN = ['09:00', '12:30', '17:00', '18:30', '19:30'];
const TERMIN_WOCHENTAGE = [1, 2, 3, 4, 5];                 // 1 = Montag … 6 = Samstag, 0 = Sonntag
const TERMIN_VORLAUF_STUNDEN = 3;                          // frühester Termin ab jetzt

// ==================== Icons (SVG statt Emoji) ====================
const ICON = {
    check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x:     '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    arrow: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    calendar: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 10h17M8 3v4M16 3v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    phone: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5h2.6l1.5 4.2-2 1.3a12 12 0 006.3 6.3l1.3-2 4.2 1.5v2.6a2 2 0 01-2.1 2A16.5 16.5 0 014.6 5.6a2 2 0 012-2.1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
};

// Nutzereingaben nie ungeprüft als HTML ausgeben
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ==================== Quiz State ====================
const state = {
    current: 0,
    answers: {},
    name: '',
    email: '',
    phone: '',
    optin: false,
    leadStatus: 'idle', // idle | sending | ok | error
    choice: '',         // '' | termin | anruf
    slotDay: '',
    slotTime: '',
    booked: false,
};

// ==================== Quiz Steps (5) ====================
const steps = [
    {
        id: 'kinder',
        meta: 'Schritt 1 von 5',
        title: 'Für wen machst du das?',
        subtitle: 'Wie viele Kinder hast du?',
        type: 'choice',
        cols: 1,
        options: [
            { value: '1',  label: '1 Kind' },
            { value: '2',  label: '2 Kinder' },
            { value: '3p', label: '3 oder mehr' },
        ],
    },
    {
        id: 'einkommen',
        meta: 'Schritt 2 von 5',
        title: 'Was steht auf dem Spiel?',
        subtitle: 'Was verdienst du netto im Monat?',
        type: 'choice',
        options: [
            { value: 'u3k',   label: 'bis 3.000 €',     sub: 'Grobe Schätzung: Staat zahlt ~775 €/Monat bei voller EM' },
            { value: '3-5k',  label: '3.000 – 5.000 €', sub: 'Grobe Schätzung: Staat zahlt ~1.240 €/Monat bei voller EM' },
            { value: '5-8k',  label: '5.000 – 8.000 €', sub: 'Grobe Schätzung: Staat zahlt ~2.015 €/Monat bei voller EM' },
            { value: 'ue8k',  label: 'über 8.000 €',    sub: 'Grobe Schätzung: Staat zahlt ~2.790 €/Monat bei voller EM' },
        ],
        insight: {
            always: true,
            type: 'warning',
            getText: (val) => {
                const d = incomeMap[val];
                const luecke = d.net - d.staat;
                return `<strong>Das bedeutet:</strong> Wirst du berufsunfähig, zahlt der Staat grob geschätzt nur ca. <strong>${d.staat.toLocaleString('de-DE')} €/Monat</strong>. Deine Lücke: <strong>−${luecke.toLocaleString('de-DE')} €/Monat</strong>.`;
            },
        },
    },
    {
        id: 'bu',
        meta: 'Schritt 3 von 5',
        title: 'Backup 1: Dein Einkommen.',
        subtitle: 'Hast du eine eigene Berufsunfähigkeitsversicherung?',
        type: 'choice',
        cols: 1,
        options: [
            { value: 'eigene', label: 'Ja – eigene BU-Versicherung',  sub: 'Nicht über den Arbeitgeber' },
            { value: 'ag',     label: 'Nur über den Arbeitgeber',      sub: 'Oft gedeckelt und an den Job gebunden' },
            { value: 'nein',   label: 'Nein, keine BU-Versicherung' },
            { value: 'weiss',  label: 'Weiß ich nicht' },
        ],
        insight: {
            condition: (val) => val !== 'eigene',
            type: 'warning',
            getText: (val) => {
                if (val === 'ag')   return '<strong>Gut zu prüfen:</strong> Eine BU über den Arbeitgeber ist oft gedeckelt. Bei einem Jobwechsel kann der Schutz enden oder nur zu anderen Bedingungen weiterlaufen.';
                if (val === 'nein') return '<strong>Offene Lücke:</strong> Ohne eigene BU bleibt dir nur die gesetzliche Erwerbsminderungsrente – und die gibt es voll erst, wenn du weniger als 3 Stunden täglich irgendeinen Job machen kannst. Je jünger und gesünder du bist, desto besser die Bedingungen.';
                return '<strong>Das solltest du klären:</strong> Viele glauben abgesichert zu sein – und sind es nicht. In 20 Minuten wissen wir es genau.';
            },
        },
    },
    {
        id: 'rl',
        meta: 'Schritt 4 von 5',
        title: 'Backup 2: Deine Familie.',
        subtitle: 'Bist du für den Fall deines Todes abgesichert?',
        type: 'choice',
        cols: 1,
        options: [
            { value: 'ja',    label: 'Ja – ich habe eine Risikolebensversicherung' },
            { value: 'nein',  label: 'Nein' },
            { value: 'weiss', label: 'Weiß ich nicht' },
        ],
        insight: {
            condition: (val) => val !== 'ja',
            type: 'warning',
            getText: (val) => {
                if (val === 'nein') return '<strong>Deine Familie trägt das Risiko alleine.</strong> Eine Risikolebensversicherung gehört meist zu den günstigeren Absicherungen – was sie dich kostet, klären wir im Vergleich.';
                return '<strong>Kurz prüfen lohnt sich:</strong> Ob eine Risikoleben da ist und ob die Summe noch zu Kredit und Kindern passt, sehen wir gemeinsam.';
            },
        },
    },
    {
        id: 'kontakt',
        meta: 'Schritt 5 von 5 – gleich siehst du dein Ergebnis',
        title: 'Für wen ist dein Ergebnis?',
        subtitle: 'Danach siehst du sofort deine Lücke und bekommst den Notfallordner für deine Familie.',
        type: 'contact',
    },
];

// ==================== Income Map ====================
const incomeMap = {
    u3k:    { net: 2500,  staat: 775 },
    '3-5k': { net: 4000,  staat: 1240 },
    '5-8k': { net: 6500,  staat: 2015 },
    ue8k:   { net: 9000,  staat: 2790 },
};

// ==================== DOM Refs ====================
const overlay     = document.getElementById('quiz-overlay');
const modal       = overlay.querySelector('.quiz-modal');
const body        = document.getElementById('quiz-body');
const progressBar = document.getElementById('quiz-progress-bar');
const closeBtn    = document.getElementById('quiz-close');
let lastTrigger   = null;
let advanceTimer  = null;

// ==================== Open / Close ====================
function openQuiz(trigger) {
    lastTrigger = trigger || document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    Object.assign(state, { current: 0, answers: {}, name: '', email: '', phone: '', optin: false, leadStatus: 'idle', choice: '', slotDay: '', slotTime: '', booked: false, phoneDraft: '' });
    renderStep();
}

function closeQuiz() {
    clearTimeout(advanceTimer);
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
}

// Nicht versehentlich schließen, wenn schon Kontaktdaten eingegeben wurden
function requestClose() {
    const onContact = steps[state.current] && steps[state.current].type === 'contact';
    const typed = onContact && ['quiz-name', 'quiz-email', 'quiz-phone'].some(id => {
        const el = document.getElementById(id);
        return el && el.value.trim();
    });
    if (typed && !window.confirm('Backup-Check wirklich abbrechen? Deine Eingaben gehen verloren.')) return;
    closeQuiz();
}

closeBtn.addEventListener('click', closeQuiz);
overlay.addEventListener('click', (e) => { if (e.target === overlay) requestClose(); });

document.addEventListener('keydown', (e) => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); requestClose(); return; }
    // Fokus im Dialog halten
    if (e.key === 'Tab') {
        const focusables = [...modal.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])')]
            .filter(el => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
            e.preventDefault(); first.focus();
        }
    }
});

// ==================== Progress ====================
// Startet sichtbar bei ~17 %, damit der erste Schritt schon nach Fortschritt aussieht
function updateProgress() {
    const pct = state.current >= steps.length ? 100 : (state.current + 1) / (steps.length + 1) * 100;
    progressBar.style.width = pct + '%';
}

// ==================== Render ====================
function renderStep() {
    clearTimeout(advanceTimer);
    updateProgress();
    if (state.current >= steps.length) {
        renderResult();
    } else {
        const step = steps[state.current];
        step.type === 'contact' ? renderContact(step) : renderChoice(step);
    }
    focusTitle();
}

// Neuer Schritt: Fokus auf die Überschrift, damit Screenreader den Schritt vorlesen
function focusTitle() {
    const title = body.querySelector('.quiz-step-title, .quiz-result-headline');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
    body.scrollTop = 0;
    modal.scrollTop = 0;
}

function goNext() { state.current++; renderStep(); }
function goBack() { state.current--; renderStep(); }

function renderChoice(step) {
    const cls      = step.cols === 1 ? 'quiz-options quiz-options--single' : 'quiz-options';
    const selected = state.answers[step.id] || null;

    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle" id="quiz-q">${step.subtitle}</p>
            <div class="${cls}" role="radiogroup" aria-labelledby="quiz-q">
                ${step.options.map(opt => `
                    <button class="quiz-option${selected === opt.value ? ' selected' : ''}" data-value="${opt.value}" type="button" role="radio" aria-checked="${selected === opt.value}">
                        <span class="quiz-option-label">${opt.label}</span>
                        ${opt.sub ? `<span class="quiz-option-sub">${opt.sub}</span>` : ''}
                    </button>
                `).join('')}
            </div>
            ${step.insight ? `<div class="quiz-insight" id="quiz-insight" aria-live="polite"></div>` : ''}
            <div class="quiz-nav">
                <button class="quiz-btn-back" id="quiz-back" type="button" ${state.current === 0 ? 'disabled' : ''}>← Zurück</button>
                <button class="quiz-btn-next" id="quiz-next" type="button" ${selected ? '' : 'disabled'}>Weiter →</button>
            </div>
        </div>`;

    if (selected && step.insight) showInsight(step, selected);

    body.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            state.answers[step.id] = val;
            body.querySelectorAll('.quiz-option').forEach(b => {
                const on = b === btn;
                b.classList.toggle('selected', on);
                b.setAttribute('aria-checked', String(on));
            });
            document.getElementById('quiz-next').disabled = false;
            const insightShown = step.insight ? showInsight(step, val) : false;
            // Ohne Hinweis direkt weiter – mit Hinweis bleibt Zeit zum Lesen
            clearTimeout(advanceTimer);
            if (!insightShown) advanceTimer = setTimeout(goNext, 350);
        });
    });

    document.getElementById('quiz-next').addEventListener('click', () => {
        if (state.answers[step.id]) goNext();
    });
    document.getElementById('quiz-back').addEventListener('click', goBack);
}

function showInsight(step, val) {
    const el = document.getElementById('quiz-insight');
    if (!el) return false;
    const show = !!(step.insight.always || (step.insight.condition && step.insight.condition(val)));
    el.className = show ? `quiz-insight visible quiz-insight--${step.insight.type}` : 'quiz-insight';
    el.innerHTML = show ? step.insight.getText(val) : '';
    return show;
}

// ==================== Contact Form ====================
function renderContact(step) {
    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle">${step.subtitle}</p>

            <form id="quiz-contact" novalidate>
                <p class="quiz-required-note">Pflichtfelder sind mit * markiert.</p>
                <div class="quiz-field">
                    <label for="quiz-name">Dein Vorname *</label>
                    <input class="quiz-input" id="quiz-name" name="name" type="text" placeholder="Max" autocomplete="given-name" required aria-describedby="err-name" value="${esc(state.name)}">
                    <span class="quiz-field-error" id="err-name"></span>
                </div>
                <div class="quiz-field">
                    <label for="quiz-email">E-Mail-Adresse *</label>
                    <input class="quiz-input" id="quiz-email" name="email" type="email" inputmode="email" placeholder="max@beispiel.de" autocomplete="email" required aria-describedby="err-email" value="${esc(state.email)}">
                    <span class="quiz-field-error" id="err-email"></span>
                </div>
                <div class="quiz-field">
                    <label for="quiz-phone">Handynummer <span class="quiz-optional">(optional)</span></label>
                    <div class="quiz-phone-wrap">
                        <span class="quiz-phone-prefix" aria-hidden="true">+49</span>
                        <input class="quiz-input quiz-input-phone" id="quiz-phone" name="phone" type="tel" inputmode="tel" placeholder="151 23456789" autocomplete="tel-national" aria-describedby="hint-phone err-phone" value="${esc(state.phone.replace(/^\+49\s*/, ''))}">
                    </div>
                    <span class="quiz-field-hint" id="hint-phone">Nur, wenn du lieber angerufen werden willst. Keine Werbeanrufe – ein Nein reicht.</span>
                    <span class="quiz-field-error" id="err-phone"></span>
                </div>
                <label class="quiz-optin">
                    <input type="checkbox" id="quiz-optin" aria-describedby="err-optin" ${state.optin ? 'checked' : ''}>
                    <span>Ich bin einverstanden, dass backupyourlife mich per E-Mail und – falls angegeben – per Telefon zu meinem Ergebnis kontaktiert. Keine Weitergabe zu Werbezwecken. Widerruf jederzeit möglich.</span>
                </label>
                <span class="quiz-field-error" id="err-optin"></span>
                <p class="quiz-privacy">Kein Spam. Nur dein Ergebnis. Datenschutz gemäß DSGVO.</p>

                <div class="quiz-nav">
                    <button class="quiz-btn-back" id="quiz-back" type="button">← Zurück</button>
                    <button class="quiz-btn-next" id="quiz-next" type="submit">Ergebnis anzeigen →</button>
                </div>
            </form>
        </div>`;

    const form       = document.getElementById('quiz-contact');
    const nameInput  = document.getElementById('quiz-name');
    const emailInput = document.getElementById('quiz-email');
    const phoneInput = document.getElementById('quiz-phone');
    const optinInput = document.getElementById('quiz-optin');

    // Fehler erst nach Verlassen des Feldes prüfen, nicht bei jedem Tastendruck
    [nameInput, emailInput, phoneInput].forEach(input => {
        input.addEventListener('blur', () => { if (input.value.trim()) validateField(input); });
        input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const invalid = [nameInput, emailInput, phoneInput, optinInput].filter(el => !validateField(el));
        if (invalid.length) { invalid[0].focus(); return; }
        state.name  = nameInput.value.trim();
        state.email = emailInput.value.trim();
        state.phone = normalizePhone(phoneInput.value);
        state.optin = optinInput.checked;
        submitLead();
    });

    document.getElementById('quiz-back').addEventListener('click', () => {
        state.name  = nameInput.value;
        state.email = emailInput.value;
        state.phone = phoneInput.value;
        state.optin = optinInput.checked;
        goBack();
    });
}

// Telefonnummer prüfen und einheitlich speichern (+49 …)
const isPhone = (v) => /^(0|\+49|0049)?[1-9][0-9]{8,12}$/.test(String(v).trim().replace(/[\s\-\/()]/g, ''));
const normalizePhone = (v) => {
    const raw = String(v).trim();
    return raw ? '+49 ' + raw.replace(/^(\+49|0049|0)\s*/, '') : '';
};

const validators = {
    'quiz-name':  { err: 'err-name',  msg: 'Bitte gib deinen Vornamen ein (mindestens 2 Zeichen).',
                    ok: el => el.value.trim().length >= 2 },
    'quiz-email': { err: 'err-email', msg: 'Bitte prüfe deine E-Mail-Adresse – sie braucht ein @ und eine Endung wie .de.',
                    ok: el => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) },
    'quiz-phone': { err: 'err-phone', msg: 'Bitte gib deine Nummer ohne +49 ein, z. B. 151 23456789.',
                    ok: el => !el.value.trim() || isPhone(el.value) },
    'quiz-optin': { err: 'err-optin', msg: 'Damit ich dir dein Ergebnis erklären kann, brauche ich dein Einverständnis.',
                    ok: el => el.checked },
};

function validateField(el) {
    const v = validators[el.id];
    const ok = v.ok(el);
    const errEl = document.getElementById(v.err);
    errEl.textContent = ok ? '' : v.msg;
    errEl.style.display = ok ? 'none' : 'block';
    el.classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
}

// ==================== Lead senden ====================
async function sendLead(payload) {
    try {
        const res = await fetch('/api/lead.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) return false;
        const data = await res.json().catch(() => ({}));
        return data.success === true;
    } catch (_) {
        return false;
    }
}

function leadPayload() {
    const inc = incomeMap[state.answers.einkommen] || { net: 4000, staat: 1240 };
    const gaps = [state.answers.bu !== 'eigene', state.answers.rl !== 'ja'].filter(Boolean).length;
    return { name: state.name, email: state.email, phone: state.phone, answers: state.answers, luecke: inc.net - inc.staat, gaps };
}

async function submitLead() {
    const btn = document.getElementById('quiz-next');
    if (btn) {
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.innerHTML = '<span class="quiz-spinner" aria-hidden="true"></span> Wird gesendet …';
    }
    state.leadStatus = 'sending';
    const ok = await sendLead(leadPayload());
    state.leadStatus = ok ? 'ok' : 'error';
    state.current = steps.length;
    renderStep();
}

async function retryLead(btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="quiz-spinner" aria-hidden="true"></span> Wird gesendet …';
    const ok = await sendLead(leadPayload());
    state.leadStatus = ok ? 'ok' : 'error';
    const box = document.getElementById('quiz-next-step');
    if (box) {
        box.outerHTML = nextStepHtml();
        bindNextStep();
        const fresh = document.getElementById('quiz-next-step');
        if (fresh) { fresh.setAttribute('tabindex', '-1'); fresh.focus(); }
    }
}

// ==================== Result Screen ====================
const WOCHENTAG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WOCHENTAG_LANG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const slotDate = (iso, time) => { const d = parseDay(iso); const [h, min] = time.split(':').map(Number); d.setHours(h, min, 0, 0); return d; };
const earliest = () => new Date(Date.now() + TERMIN_VORLAUF_STUNDEN * 3600 * 1000);

function terminTage() {
    const days = [];
    const d = new Date(); d.setHours(0, 0, 0, 0);
    for (let i = 0; days.length < TERMIN_TAGE && i < 30; i++, d.setDate(d.getDate() + 1)) {
        if (!TERMIN_WOCHENTAGE.includes(d.getDay())) continue;
        const iso = isoDay(d);
        if (TERMIN_ZEITEN.some(t => slotDate(iso, t) > earliest())) days.push(iso);
    }
    return days;
}

function slotLabel(iso, time) {
    const d = parseDay(iso);
    return `${WOCHENTAG_LANG[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}. um ${time} Uhr`;
}

function nextStepHtml() {
    const firstName = esc(state.name || '');

    if (state.leadStatus === 'error') {
        return `
            <div class="quiz-next-step quiz-next-step--error" id="quiz-next-step" role="alert">
                <p class="quiz-next-step-title">Deine Angaben sind leider nicht bei mir angekommen.</p>
                <p>Das liegt an der Verbindung, nicht an dir. Versuch es bitte noch einmal.</p>
                <div class="quiz-result-cta">
                    <button class="btn btn-primary btn-large" type="button" id="quiz-retry">Nochmal senden</button>
                </div>
            </div>`;
    }

    // Bestätigung: Termin gebucht
    if (state.choice === 'termin' && state.booked) {
        return `
            <div class="quiz-next-step quiz-next-step--done" id="quiz-next-step">
                <p class="quiz-next-step-title">${ICON.check} Dein Termin steht${firstName ? ', ' + firstName : ''}!</p>
                <p class="quiz-booked-slot">${slotLabel(state.slotDay, state.slotTime)}</p>
                <p>Ich rufe dich zu dieser Zeit unter <strong>${esc(state.phone)}</strong> an. Plane rund 20 Minuten ein – Unterlagen brauchst du keine.</p>
                <div class="quiz-result-cta">
                    <button class="btn btn-booking btn-large" type="button" id="quiz-ics">${ICON.calendar} In meinen Kalender eintragen</button>
                    <button class="quiz-link-btn" type="button" id="quiz-done">Fertig</button>
                </div>
            </div>`;
    }

    // Rückruf gewünscht, aber noch keine Nummer
    if (state.choice === 'anruf-nummer') {
        return `
            <div class="quiz-next-step" id="quiz-next-step">
                <p class="quiz-next-step-title">${ICON.phone} Unter welcher Nummer erreiche ich dich?</p>
                <div class="quiz-field quiz-field--late">
                    <label for="quiz-late-phone">Handynummer *</label>
                    <div class="quiz-phone-wrap">
                        <span class="quiz-phone-prefix" aria-hidden="true">+49</span>
                        <input class="quiz-input quiz-input-phone" id="quiz-late-phone" type="tel" inputmode="tel" placeholder="151 23456789" autocomplete="tel-national" value="${esc(state.phoneDraft || '')}">
                    </div>
                </div>
                <p class="quiz-field-error" id="err-slot" role="alert"></p>
                <div class="quiz-result-cta">
                    <button class="btn btn-primary btn-large" type="button" id="quiz-call-confirm">Rückruf anfordern</button>
                    <button class="quiz-link-btn" type="button" id="quiz-pick">Doch lieber selbst einen Termin wählen</button>
                </div>
            </div>`;
    }

    // Bestätigung: lieber anrufen lassen
    if (state.choice === 'anruf') {
        return `
            <div class="quiz-next-step" id="quiz-next-step">
                <p class="quiz-next-step-title">${ICON.phone} Alles klar${firstName ? ', ' + firstName : ''}</p>
                <p>Ich melde mich persönlich unter <strong>${esc(state.phone)}</strong>, um einen Termin für das 20-Minuten-Gespräch zu vereinbaren.</p>
                <div class="quiz-result-cta">
                    <button class="btn btn-primary btn-large" type="button" id="quiz-done">Alles klar, fertig</button>
                    <button class="quiz-link-btn" type="button" id="quiz-pick">Doch lieber selbst einen Termin wählen</button>
                </div>
            </div>`;
    }

    // Terminwahl offen
    if (state.choice === 'termin') {
        const days = terminTage();
        if (!state.slotDay || !days.includes(state.slotDay)) state.slotDay = days[0] || '';
        const times = state.slotDay ? TERMIN_ZEITEN.filter(t => slotDate(state.slotDay, t) > earliest()) : [];
        if (!times.includes(state.slotTime)) state.slotTime = '';
        return `
            <div class="quiz-next-step quiz-next-step--booking" id="quiz-next-step">
                <p class="quiz-next-step-title">${ICON.calendar} Wann passt es dir?</p>
                <p class="quiz-picker-label" id="pick-day-label">Tag</p>
                <div class="quiz-slots quiz-slots--days" role="radiogroup" aria-labelledby="pick-day-label">
                    ${days.map(iso => {
                        const d = parseDay(iso);
                        const on = iso === state.slotDay;
                        return `<button type="button" class="quiz-slot${on ? ' selected' : ''}" role="radio" aria-checked="${on}" data-day="${iso}" aria-label="${WOCHENTAG_LANG[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.">
                            <span class="quiz-slot-wd">${WOCHENTAG[d.getDay()]}</span><span class="quiz-slot-date">${d.getDate()}.${d.getMonth() + 1}.</span>
                        </button>`;
                    }).join('')}
                </div>
                <p class="quiz-picker-label" id="pick-time-label">Uhrzeit</p>
                <div class="quiz-slots quiz-slots--times" role="radiogroup" aria-labelledby="pick-time-label">
                    ${times.map(t => {
                        const on = t === state.slotTime;
                        return `<button type="button" class="quiz-slot${on ? ' selected' : ''}" role="radio" aria-checked="${on}" data-time="${t}">${t}</button>`;
                    }).join('')}
                </div>
                ${state.phone ? '' : `
                <div class="quiz-field quiz-field--late">
                    <label for="quiz-late-phone">Unter welcher Nummer rufe ich dich an? *</label>
                    <div class="quiz-phone-wrap">
                        <span class="quiz-phone-prefix" aria-hidden="true">+49</span>
                        <input class="quiz-input quiz-input-phone" id="quiz-late-phone" type="tel" inputmode="tel" placeholder="151 23456789" autocomplete="tel-national" value="${esc(state.phoneDraft || '')}">
                    </div>
                </div>`}
                <p class="quiz-field-error" id="err-slot" role="alert"></p>
                <div class="quiz-result-cta">
                    <button class="btn btn-booking btn-large" type="button" id="quiz-book" ${state.slotTime ? '' : 'disabled'}>
                        ${state.slotTime ? `Termin am ${WOCHENTAG[parseDay(state.slotDay).getDay()]} um ${state.slotTime} festmachen` : 'Bitte Uhrzeit wählen'}
                    </button>
                    <button class="quiz-link-btn" type="button" id="quiz-call">Doch lieber anrufen lassen</button>
                </div>
            </div>`;
    }

    // Entweder-oder: zwei Wege, beide führen zum Gespräch
    return `
        <div class="quiz-next-step quiz-next-step--choice" id="quiz-next-step">
            <p class="quiz-received">${ICON.check} Deine Angaben sind angekommen.</p>
            <p class="quiz-next-step-title">Wie ist es dir lieber${firstName ? ', ' + firstName : ''}?</p>
            <div class="quiz-choice">
                ${BOOKING_URL ? (() => {
                    const url = new URL(BOOKING_URL);
                    if (state.name)  url.searchParams.set('name', state.name);
                    if (state.email) url.searchParams.set('email', state.email);
                    return `<a href="${esc(url.toString())}" class="btn btn-booking btn-large quiz-choice-main" target="_blank" rel="noopener">${ICON.calendar} Termin jetzt selbst wählen</a>`;
                })() : `<button class="btn btn-booking btn-large quiz-choice-main" type="button" id="quiz-pick">${ICON.calendar} Termin jetzt selbst wählen</button>`}
                <p class="quiz-choice-hint">Dauert 30 Sekunden · du bestimmst die Uhrzeit</p>
                <p class="quiz-choice-or"><span>oder</span></p>
                <button class="btn btn-secondary btn-large quiz-choice-alt" type="button" id="quiz-call">${ICON.phone} Ruf mich an, wenn es dir passt</button>
            </div>
            <p class="quiz-result-cta-sub">20 Minuten · kostenlos · ein Nein reicht – kein Nachtelefonieren</p>
        </div>`;
}

// Sofort-Gewinn direkt nach dem Ergebnis: Notfallordner
function fastWinHtml() {
    return `
        <a class="quiz-fastwin" href="notfallordner.html" target="_blank" rel="noopener">
            <span class="quiz-fastwin-icon" aria-hidden="true">${ICON.check}</span>
            <span>
                <strong>Sofort für dich: der „Wenn Papa ausfällt“-Notfallordner</strong>
                <span class="quiz-fastwin-sub">Vorlage zum Ausdrucken – damit deine Familie im Ernstfall weiß, was zu tun ist. Öffnet in neuem Tab.</span>
            </span>
        </a>`;
}

function rerenderNextStep(focusSel) {
    const box = document.getElementById('quiz-next-step');
    if (!box) return;
    box.outerHTML = nextStepHtml();
    bindNextStep();
    const target = (focusSel && document.querySelector(focusSel)) || document.getElementById('quiz-next-step');
    if (target) {
        if (target.id === 'quiz-next-step') target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        document.getElementById('quiz-next-step').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

async function sendNote(type) {
    const extra = type === 'termin'
        ? { termin: slotLabel(state.slotDay, state.slotTime), termin_iso: slotDate(state.slotDay, state.slotTime).toISOString() }
        : {};
    return sendLead({ type, name: state.name, email: state.email, phone: state.phone, ...extra });
}

function downloadIcs() {
    const start = slotDate(state.slotDay, state.slotTime);
    const end = new Date(start.getTime() + 20 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//backupyourlife//Backup-Check//DE', 'BEGIN:VEVENT',
        `UID:${Date.now()}@backupyourlife.de`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
        'SUMMARY:Backup-Gespräch mit backupyourlife (20 Min.)',
        `DESCRIPTION:Ich rufe dich unter ${state.phone} an. Kostenlos und unverbindlich.`,
        'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Backup-Gespräch in 15 Minuten', 'END:VALARM',
        'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'backup-gespraech.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function bindNextStep() {
    const on = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', () => fn(el)); };

    // Nachgetragene Telefonnummer übersteht das Neu-Zeichnen der Terminwahl
    const late = document.getElementById('quiz-late-phone');
    if (late) late.addEventListener('input', () => { state.phoneDraft = late.value; });
    const takeLatePhone = () => {
        if (state.phone) return true;
        const el = document.getElementById('quiz-late-phone');
        const err = document.getElementById('err-slot');
        if (!el || !isPhone(el.value)) {
            err.textContent = 'Bitte gib deine Nummer ohne +49 ein, z. B. 151 23456789.';
            err.style.display = 'block';
            if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
            return false;
        }
        state.phone = normalizePhone(el.value);
        return true;
    };

    on('quiz-retry', retryLead);
    on('quiz-done', closeQuiz);
    on('quiz-ics', downloadIcs);
    on('quiz-pick', () => { state.choice = 'termin'; rerenderNextStep('.quiz-slots--times .quiz-slot'); });
    on('quiz-call', async (btn) => {
        if (!state.phone) { state.choice = 'anruf-nummer'; rerenderNextStep('#quiz-late-phone'); return; }
        btn.disabled = true;
        state.choice = 'anruf';
        sendNote('anruf'); // nur Hinweis für dich – der Lead ist schon angekommen
        rerenderNextStep();
    });
    on('quiz-call-confirm', async (btn) => {
        if (!takeLatePhone()) return;
        btn.disabled = true;
        btn.innerHTML = '<span class="quiz-spinner" aria-hidden="true"></span> Wird gesendet …';
        const ok = await sendNote('anruf');
        if (ok) { state.choice = 'anruf'; rerenderNextStep(); return; }
        state.phone = '';
        btn.disabled = false;
        btn.textContent = 'Nochmal versuchen';
        const err = document.getElementById('err-slot');
        err.textContent = 'Das ist leider nicht bei mir angekommen. Bitte versuch es noch einmal.';
        err.style.display = 'block';
    });

    document.querySelectorAll('.quiz-slot[data-day]').forEach(b => b.addEventListener('click', () => {
        state.slotDay = b.dataset.day; state.slotTime = '';
        rerenderNextStep(`.quiz-slot[data-day="${b.dataset.day}"]`);
    }));
    document.querySelectorAll('.quiz-slot[data-time]').forEach(b => b.addEventListener('click', () => {
        state.slotTime = b.dataset.time;
        rerenderNextStep('#quiz-book');
    }));

    on('quiz-book', async (btn) => {
        if (!state.slotTime) return;
        const hadPhone = !!state.phone;
        if (!takeLatePhone()) return;
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.innerHTML = '<span class="quiz-spinner quiz-spinner--dark" aria-hidden="true"></span> Wird gebucht …';
        const ok = await sendNote('termin');
        if (ok) {
            state.booked = true;
            rerenderNextStep('#quiz-ics');
        } else {
            if (!hadPhone) state.phone = '';
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btn.textContent = 'Nochmal versuchen';
            const err = document.getElementById('err-slot');
            err.textContent = 'Der Termin ist leider nicht bei mir angekommen. Bitte versuch es noch einmal.';
            err.style.display = 'block';
        }
    });
}

function renderResult() {
    const inc    = incomeMap[state.answers.einkommen] || { net: 4000, staat: 1240 };
    const luecke = inc.net - inc.staat;
    const buOk   = state.answers.bu === 'eigene';
    const rlOk   = state.answers.rl === 'ja';
    const gaps   = [!buOk, !rlOk].filter(Boolean).length;
    const firstName = esc(state.name || 'du');

    const summaryText = (() => {
        if (gaps === 0) return `Gut aufgestellt, ${firstName}! Lass uns in 20 Minuten prüfen, ob die Beträge wirklich ausreichen.`;
        if (!buOk && !rlOk) return 'Fällt dein Einkommen weg, trägt deine Familie alles alleine. Kein Schutz im Leben, kein Schutz für danach. Im 20-Minuten-Gespräch zeige ich dir, was genau fehlt.';
        if (!buOk) return `Du bist für den Todesfall abgesichert – aber ${inc.net.toLocaleString('de-DE')} € Netto fallen weg, wenn du berufsunfähig wirst. Dieses Risiko wird oft unterschätzt.`;
        return 'Dein Einkommen ist geschützt – aber deine Familie hat keinen Schutz, falls dir etwas passiert. Das schauen wir uns gemeinsam an.';
    })();

    const kinderLabel = { '1': '1 Kind', '2': '2 Kinder', '3p': '3+ Kinder' }[state.answers.kinder] || '';
    const pill = (ok) => ok
        ? `<span class="quiz-status-pill ok">${ICON.check} gesichert</span>`
        : `<span class="quiz-status-pill gap">${ICON.x} Lücke</span>`;

    body.innerHTML = `
        <div class="quiz-step quiz-result-wrap">
            <p class="quiz-result-eyebrow">Dein Ergebnis, ${firstName}.</p>
            <h2 class="quiz-result-headline">
                ${gaps === 0
                    ? 'Du bist gut aufgestellt.'
                    : `Du hast ${gaps === 1 ? 'eine offene Lücke' : 'zwei offene Lücken'} in deiner Absicherung.`}
            </h2>

            <div class="quiz-result-gap-card">
                <p class="quiz-result-gap-label">Monatliche Lücke bei Berufsunfähigkeit</p>
                <p class="quiz-result-gap-amount">−${luecke.toLocaleString('de-DE')} €</p>
                <p class="quiz-result-gap-compare">Grobe Schätzung: Staat zahlt ca. ${inc.staat.toLocaleString('de-DE')} € · dein Netto ca. ${inc.net.toLocaleString('de-DE')} € · deine echten Werte klären wir im Gespräch</p>
            </div>

            <div class="quiz-result-status">
                <p class="quiz-result-status-title">Dein Backup-Check ${kinderLabel ? `(für ${kinderLabel})` : ''}</p>
                <div class="quiz-status-row">
                    <span class="quiz-status-name">Einkommen absichern (BU)</span>
                    ${pill(buOk)}
                </div>
                <div class="quiz-status-row">
                    <span class="quiz-status-name">Familie absichern (Risikoleben)</span>
                    ${pill(rlOk)}
                </div>
                <div class="quiz-status-row">
                    <span class="quiz-status-name">Schwere Krankheiten (SK)</span>
                    <span class="quiz-status-pill neutral">${ICON.arrow} Im Gespräch klären</span>
                </div>
            </div>

            <p class="quiz-result-summary">${summaryText}</p>

            ${nextStepHtml()}

            ${fastWinHtml()}
        </div>`;

    bindNextStep();
}

// ==================== Init ====================
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quiz-open]');
    if (trigger) { e.preventDefault(); openQuiz(trigger); }
});
