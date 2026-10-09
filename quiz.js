// ==================== Quiz State ====================
const state = {
    current: 0,
    answers: {},
    name: '',
    email: '',
    phone: '',
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
            { value: 'u3k',   label: 'bis 3.000 €',     sub: 'Staat zahlt ~775 €/Monat bei BU' },
            { value: '3-5k',  label: '3.000 – 5.000 €', sub: 'Staat zahlt ~1.240 €/Monat bei BU' },
            { value: '5-8k',  label: '5.000 – 8.000 €', sub: 'Staat zahlt ~2.015 €/Monat bei BU' },
            { value: 'ue8k',  label: 'über 8.000 €',    sub: 'Staat zahlt ~2.790 €/Monat bei BU' },
        ],
        insight: {
            always: true,
            type: 'warning',
            getText: (val) => {
                const map = {
                    u3k:    { net: 2500,  staat: 775 },
                    '3-5k': { net: 4000,  staat: 1240 },
                    '5-8k': { net: 6500,  staat: 2015 },
                    ue8k:   { net: 9000,  staat: 2790 },
                };
                const d = map[val];
                const luecke = d.net - d.staat;
                return `<strong>Das bedeutet:</strong> Wirst du berufsunfähig, zahlt der Staat nur ca. <strong>${d.staat.toLocaleString('de-DE')} €/Monat</strong>. Deine Lücke: <strong>−${luecke.toLocaleString('de-DE')} €/Monat</strong>.`;
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
            { value: 'ag',     label: 'Nur über den Arbeitgeber',      sub: 'Deckt oft nur 30 % des Bedarfs' },
            { value: 'nein',   label: 'Nein, keine BU-Versicherung' },
            { value: 'weiss',  label: 'Weiß ich nicht' },
        ],
        insight: {
            condition: (val) => val !== 'eigene',
            type: 'warning',
            getText: (val) => {
                if (val === 'ag')    return '<strong>Achtung:</strong> BU über den Arbeitgeber endet mit dem Job – und zahlt oft nur bei <em>vollständiger</em> Erwerbsunfähigkeit.';
                if (val === 'nein')  return '<strong>Kritische Lücke:</strong> 1 von 4 Vätern wird berufsunfähig. Ohne Schutz trägst du dieses Risiko komplett alleine.';
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
                if (val === 'nein') return '<strong>Deine Familie trägt das Risiko alleine.</strong> Risikoleben ist die günstigste Absicherung – oft unter 20 € im Monat.';
                return '<strong>Kurz prüfen lohnt sich:</strong> Eine Risikolebensversicherung kostet weniger als du denkst – aber nur wenn sie wirklich vorhanden ist.';
            },
        },
    },
    {
        id: 'kontakt',
        meta: 'Schritt 5 von 5 – Fast fertig!',
        title: 'Wohin schicke ich dein Ergebnis?',
        subtitle: 'Deine persönliche Lückenanalyse – in 20 Minuten am Telefon erklärt.',
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
const body        = document.getElementById('quiz-body');
const progressBar = document.getElementById('quiz-progress-bar');
const closeBtn    = document.getElementById('quiz-close');

// ==================== Open / Close ====================
function openQuiz() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    state.current = 0;
    state.answers = {};
    state.name    = '';
    state.email   = '';
    state.phone   = '';
    renderStep();
}

function closeQuiz() {
    overlay.hidden = true;
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeQuiz);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeQuiz(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuiz(); });

// ==================== Progress ====================
function updateProgress() {
    progressBar.style.width = (state.current / steps.length * 100) + '%';
}

// ==================== Render ====================
function renderStep() {
    updateProgress();
    if (state.current >= steps.length) { renderResult(); return; }
    const step = steps[state.current];
    step.type === 'contact' ? renderContact(step) : renderChoice(step);
}

function renderChoice(step) {
    const cls      = step.cols === 1 ? 'quiz-options quiz-options--single' : 'quiz-options';
    const selected = state.answers[step.id] || null;

    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle">${step.subtitle}</p>
            <div class="${cls}" id="quiz-options-container">
                ${step.options.map(opt => `
                    <button class="quiz-option${selected === opt.value ? ' selected' : ''}" data-value="${opt.value}" type="button">
                        <span class="quiz-option-label">${opt.label}</span>
                        ${opt.sub ? `<span class="quiz-option-sub">${opt.sub}</span>` : ''}
                    </button>
                `).join('')}
            </div>
            ${step.insight ? `<div class="quiz-insight" id="quiz-insight"></div>` : ''}
            <div class="quiz-nav">
                <button class="quiz-btn-back" id="quiz-back" ${state.current === 0 ? 'disabled' : ''}>← Zurück</button>
                <button class="quiz-btn-next" id="quiz-next" ${selected ? '' : 'disabled'}>Weiter →</button>
            </div>
        </div>`;

    if (selected && step.insight) showInsight(step, selected);

    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            state.answers[step.id] = val;
            document.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('quiz-next').disabled = false;
            if (step.insight) showInsight(step, val);
        });
    });

    document.getElementById('quiz-next').addEventListener('click', () => {
        if (state.answers[step.id]) { state.current++; renderStep(); }
    });
    document.getElementById('quiz-back').addEventListener('click', () => {
        state.current--; renderStep();
    });
}

function showInsight(step, val) {
    const el = document.getElementById('quiz-insight');
    if (!el) return;
    const show = step.insight.always || (step.insight.condition && step.insight.condition(val));
    el.className = show ? `quiz-insight visible quiz-insight--${step.insight.type}` : 'quiz-insight';
    if (show) el.innerHTML = step.insight.getText(val);
}

// ==================== Contact Form ====================
function renderContact(step) {
    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle">${step.subtitle}</p>

            <div class="quiz-field">
                <label for="quiz-name">Dein Vorname *</label>
                <input class="quiz-input" id="quiz-name" type="text" placeholder="Max" autocomplete="given-name" value="${state.name}">
                <span class="quiz-field-error" id="err-name"></span>
            </div>
            <div class="quiz-field">
                <label for="quiz-email">E-Mail-Adresse *</label>
                <input class="quiz-input" id="quiz-email" type="email" placeholder="max@beispiel.de" autocomplete="email" value="${state.email}">
                <span class="quiz-field-error" id="err-email"></span>
            </div>
            <div class="quiz-field">
                <label for="quiz-phone">Handynummer *</label>
                <div class="quiz-phone-wrap">
                    <span class="quiz-phone-prefix">+49</span>
                    <input class="quiz-input quiz-input-phone" id="quiz-phone" type="tel" placeholder="151 23456789" autocomplete="tel" value="${state.phone}">
                </div>
                <span class="quiz-field-error" id="err-phone"></span>
            </div>
            <label class="quiz-optin">
                <input type="checkbox" id="quiz-optin" ${state.optin ? 'checked' : ''}>
                <span>Ich bin einverstanden, dass backupyourlife mich per E-Mail und Telefon kontaktiert. Keine Weitergabe an Dritte. Widerruf jederzeit möglich.</span>
            </label>
            <span class="quiz-field-error" id="err-optin"></span>
            <p class="quiz-privacy">Kein Spam. Nur dein Ergebnis. Datenschutz gemäß DSGVO.</p>

            <div class="quiz-nav">
                <button class="quiz-btn-back" id="quiz-back">← Zurück</button>
                <button class="quiz-btn-next" id="quiz-next">Ergebnis anzeigen →</button>
            </div>
        </div>`;

    const nameInput  = document.getElementById('quiz-name');
    const emailInput = document.getElementById('quiz-email');
    const phoneInput = document.getElementById('quiz-phone');
    const optinInput = document.getElementById('quiz-optin');
    const nextBtn    = document.getElementById('quiz-next');

    nextBtn.addEventListener('click', () => {
        if (!validateContact(nameInput, emailInput, phoneInput, optinInput)) return;
        state.name  = nameInput.value.trim();
        state.email = emailInput.value.trim();
        state.phone = '+49 ' + phoneInput.value.trim();
        state.optin = optinInput.checked;
        state.current++;
        renderStep();
    });

    document.getElementById('quiz-back').addEventListener('click', () => {
        state.current--; renderStep();
    });
}

function validateContact(nameEl, emailEl, phoneEl, optinEl) {
    let valid = true;

    // Name
    if (nameEl.value.trim().length < 2) {
        showFieldError('err-name', 'Bitte gib deinen Vornamen ein.');
        nameEl.classList.add('invalid');
        valid = false;
    } else {
        clearFieldError('err-name'); nameEl.classList.remove('invalid');
    }

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        showFieldError('err-email', 'Bitte gib eine gültige E-Mail-Adresse ein.');
        emailEl.classList.add('invalid');
        valid = false;
    } else {
        clearFieldError('err-email'); emailEl.classList.remove('invalid');
    }

    // Phone – German mobile: 15x, 16x, 17x or landline, min 10 digits
    const rawPhone = phoneEl.value.trim().replace(/[\s\-\/]/g, '');
    if (!/^(0|\+49|0049)?[1-9][0-9]{8,12}$/.test(rawPhone)) {
        showFieldError('err-phone', 'Bitte gib eine gültige Telefonnummer ein (z.B. 151 23456789).');
        phoneEl.classList.add('invalid');
        valid = false;
    } else {
        clearFieldError('err-phone'); phoneEl.classList.remove('invalid');
    }

    // Opt-in
    if (!optinEl.checked) {
        showFieldError('err-optin', 'Bitte stimme der Kontaktaufnahme zu.');
        valid = false;
    } else {
        clearFieldError('err-optin');
    }

    return valid;
}

function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
}

// ==================== Lead Notification ====================
async function sendLead(payload) {
    try {
        await fetch('/api/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (_) { /* silent */ }
}

// ==================== Result Screen ====================
function renderResult() {
    progressBar.style.width = '100%';

    const inc    = incomeMap[state.answers.einkommen] || { net: 4000, staat: 1240 };
    const luecke = inc.net - inc.staat;
    const buOk   = state.answers.bu === 'eigene';
    const rlOk   = state.answers.rl === 'ja';
    const gaps   = [!buOk, !rlOk].filter(Boolean).length;

    sendLead({
        name: state.name, email: state.email, phone: state.phone,
        answers: state.answers, luecke, gaps,
    });

    const firstName = state.name || 'du';

    const summaryText = (() => {
        if (gaps === 0) return `Gut aufgestellt, ${firstName}! Lass uns in 20 Minuten prüfen, ob die Beträge wirklich ausreichen – und ob sich die Prämien noch optimieren lassen.`;
        if (!buOk && !rlOk) return `Fällt dein Einkommen weg, trägt deine Familie alles alleine. Kein Schutz im Leben, kein Schutz für danach. In einem 20-Minuten-Gespräch zeige ich dir, was genau fehlt – und was es kostet.`;
        if (!buOk) return `Du bist für den Todesfall abgesichert – aber ${inc.net.toLocaleString('de-DE')} € Netto fallen einfach weg, wenn du berufsunfähig wirst. Das ist das wahrscheinlichere Risiko.`;
        return `Dein Einkommen ist geschützt – aber deine Familie hat keinen Schutz, falls dir etwas passiert. Das lässt sich schnell und günstig ändern.`;
    })();

    const kinderLabel = { '1': '1 Kind', '2': '2 Kinder', '3p': '3+ Kinder' }[state.answers.kinder] || '';

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
                <p class="quiz-result-gap-compare">Staat zahlt ${inc.staat.toLocaleString('de-DE')} € · dein Netto: ${inc.net.toLocaleString('de-DE')} €</p>
            </div>

            <div class="quiz-result-status">
                <p class="quiz-result-status-title">Dein Backup-Check ${kinderLabel ? `(für ${kinderLabel})` : ''}</p>
                <div class="quiz-status-row">
                    <span class="quiz-status-name">Einkommen absichern (BU)</span>
                    <span class="quiz-status-pill ${buOk ? 'ok' : 'gap'}">${buOk ? '✓ gesichert' : '✕ Lücke'}</span>
                </div>
                <div class="quiz-status-row">
                    <span class="quiz-status-name">Familie absichern (Risikoleben)</span>
                    <span class="quiz-status-pill ${rlOk ? 'ok' : 'gap'}">${rlOk ? '✓ gesichert' : '✕ Lücke'}</span>
                </div>
            </div>

            <p class="quiz-result-summary">${summaryText}</p>

            <div class="quiz-result-cta">
                <a href="#" class="btn btn-primary btn-large" onclick="closeQuiz()">
                    Kostenloses Gespräch buchen →
                </a>
                <p class="quiz-result-cta-sub">20 Minuten · kostenlos · unverbindlich · nur ${Math.max(1, 8 - new Date().getDay())} Plätze diese Woche</p>
            </div>
        </div>`;
}

// ==================== Init ====================
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quiz-open]');
    if (trigger) { e.preventDefault(); openQuiz(); }
});
