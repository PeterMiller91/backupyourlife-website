// ==================== Quiz State ====================
const state = {
    current: 0,
    answers: {},
    name: '',
    email: '',
};

// ==================== Quiz Steps ====================
const steps = [
    {
        id: 'alter',
        meta: 'Schritt 1 von 8',
        title: 'Wir starten mit dir.',
        subtitle: 'Wie alt bist du?',
        type: 'choice',
        options: [
            { value: 'u35',  label: 'Unter 35',   sub: 'Jetzt die günstigsten Konditionen' },
            { value: '35-44', label: '35 – 44',    sub: 'Beste Zeit für solide Absicherung' },
            { value: '45-54', label: '45 – 54',    sub: 'Absicherungslücken oft unterschätzt' },
            { value: 'ue55',  label: '55 oder älter', sub: 'Handlungsbedarf prüfen' },
        ],
    },
    {
        id: 'kinder',
        meta: 'Schritt 2 von 8',
        title: 'Für wen machst du das eigentlich?',
        subtitle: 'Wie viele Kinder hast du?',
        type: 'choice',
        options: [
            { value: '1',   label: '1 Kind' },
            { value: '2',   label: '2 Kinder' },
            { value: '3p',  label: '3 oder mehr' },
        ],
        cols: 1,
    },
    {
        id: 'einkommen',
        meta: 'Schritt 3 von 8',
        title: 'Lass uns deine Lücke berechnen.',
        subtitle: 'Was verdienst du netto im Monat?',
        type: 'choice',
        options: [
            { value: 'u3k',    label: 'bis 3.000 €',     sub: 'Staat zahlt ~930 €/Monat bei BU' },
            { value: '3-5k',   label: '3.000 – 5.000 €', sub: 'Staat zahlt ~1.240 €/Monat bei BU' },
            { value: '5-8k',   label: '5.000 – 8.000 €', sub: 'Staat zahlt ~1.860 €/Monat bei BU' },
            { value: 'ue8k',   label: 'über 8.000 €',    sub: 'Staat zahlt ~2.170 €/Monat bei BU' },
        ],
        insight: {
            always: true,
            type: 'warning',
            getText: (val) => {
                const map = {
                    u3k:  { net: 2500,  staat: 775 },
                    '3-5k': { net: 4000, staat: 1240 },
                    '5-8k': { net: 6500, staat: 2015 },
                    ue8k:  { net: 9000, staat: 2790 },
                };
                const d = map[val];
                const luecke = d.net - d.staat;
                return `<strong>Das bedeutet:</strong> Wirst du berufsunfähig, zahlt dir der Staat nur ca. <strong>${d.staat.toLocaleString('de-DE')} €/Monat</strong>. Deine Lücke wäre dann <strong>−${luecke.toLocaleString('de-DE')} €/Monat</strong>.`;
            },
        },
    },
    {
        id: 'kredit',
        meta: 'Schritt 4 von 8',
        title: 'Was ist auf dem Spiel?',
        subtitle: 'Habt ihr einen laufenden Immobilienkredit?',
        type: 'choice',
        options: [
            { value: 'nein',    label: 'Nein' },
            { value: 'u200',    label: 'Ja, bis 200.000 €' },
            { value: '200-400', label: 'Ja, 200 – 400.000 €' },
            { value: 'ue400',   label: 'Ja, über 400.000 €' },
        ],
        insight: {
            condition: (val) => val !== 'nein',
            type: 'warning',
            getText: (val) => {
                const map = {
                    u200:    '200.000 €',
                    '200-400': 'bis zu 400.000 €',
                    ue400:   'über 400.000 €',
                };
                return `<strong>Wichtig:</strong> Ein Kredit von ${map[val]} gehört bei deinem Tod oder bei Berufsunfähigkeit zu den größten Risiken für deine Familie. Ohne Absicherung bleibt er vollständig übrig.`;
            },
        },
    },
    {
        id: 'bu',
        meta: 'Schritt 5 von 8',
        title: 'Backup 1: Dein Einkommen.',
        subtitle: 'Hast du eine eigene Berufsunfähigkeitsversicherung?',
        type: 'choice',
        cols: 1,
        options: [
            { value: 'eigene',  label: 'Ja – eigene BU-Versicherung',           sub: 'Nicht über den Arbeitgeber' },
            { value: 'ag',      label: 'Nur über den Arbeitgeber',               sub: 'Deckt oft nur 30 % des Bedarfs' },
            { value: 'nein',    label: 'Nein, keine BU-Versicherung' },
            { value: 'weiss',   label: 'Weiß ich nicht' },
        ],
        insight: {
            condition: (val) => val !== 'eigene',
            type: 'warning',
            getText: (val) => {
                if (val === 'ag') return '<strong>Achtung:</strong> BU-Schutz über den Arbeitgeber endet mit dem Job – und leistet oft nur bei <em>vollständiger</em> Erwerbsunfähigkeit. Die Lücke ist fast immer größer als erwartet.';
                if (val === 'nein') return '<strong>Kritische Lücke:</strong> Ohne BU-Schutz trägst du das größte Risiko ungesichert. 1 von 4 Vätern kann das nicht ignorieren.';
                return '<strong>Das solltest du klären:</strong> Viele Menschen glauben, abgesichert zu sein – und sind es nicht. In 20 Minuten wissen wir es genau.';
            },
        },
    },
    {
        id: 'rl',
        meta: 'Schritt 6 von 8',
        title: 'Backup 2: Deine Familie.',
        subtitle: 'Bist du für den Fall deines Todes abgesichert? (Risikoleben)',
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
                if (val === 'nein') return '<strong>Dein Kredit bleibt.</strong> Stirbst du ohne Risikolebensversicherung, erbt deine Familie nicht nur das Haus – sondern auch die volle Restschuld.';
                return '<strong>Das solltest du prüfen:</strong> Risikoleben ist die günstigste Absicherung im Portfolio – aber nur, wenn sie auch wirklich vorhanden ist.';
            },
        },
    },
    {
        id: 'sk',
        meta: 'Schritt 7 von 8',
        title: 'Backup 3: Deine Gesundheit.',
        subtitle: 'Bist du gegen schwere Krankheiten abgesichert? (Herzinfarkt, Krebs, Schlaganfall)',
        type: 'choice',
        cols: 1,
        options: [
            { value: 'ja',    label: 'Ja – ich habe eine Schwere-Krankheiten-Versicherung' },
            { value: 'nein',  label: 'Nein' },
            { value: 'weiss', label: 'Was ist das genau?' },
        ],
        insight: {
            condition: (val) => val !== 'ja',
            type: 'warning',
            getText: () => '<strong>Oft die unsichtbare Lücke:</strong> Du kannst noch arbeiten – aber bist krank und brauchst Geld für Behandlung, Pflege oder Auszeit. BU zahlt dann nicht. Eine Dread-Disease-Versicherung zahlt sofort einen Einmalbetrag bei Diagnose.',
        },
    },
    {
        id: 'kontakt',
        meta: 'Schritt 8 von 8 – Fast fertig!',
        title: 'Wohin schicke ich dein Ergebnis?',
        subtitle: 'Du bekommst eine Zusammenfassung deiner Lücken und konkrete nächste Schritte.',
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
const overlay    = document.getElementById('quiz-overlay');
const body       = document.getElementById('quiz-body');
const progressBar = document.getElementById('quiz-progress-bar');
const closeBtn   = document.getElementById('quiz-close');

// ==================== Open / Close ====================
function openQuiz() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    state.current = 0;
    state.answers = {};
    state.name = '';
    state.email = '';
    renderStep();
}

function closeQuiz() {
    overlay.hidden = true;
    document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeQuiz);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeQuiz(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuiz(); });

// Wire all CTA buttons
document.querySelectorAll('a[href="#backup-check"], .btn[href="#"], .mobile-nav-cta').forEach(btn => {
    if (btn.getAttribute('href') === '#backup-check' || btn.classList.contains('mobile-nav-cta') || btn.textContent.trim().startsWith('Backup-Check')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openQuiz();
        });
    }
});

// ==================== Progress ====================
function updateProgress() {
    const total = steps.length;
    const pct = ((state.current) / total) * 100;
    progressBar.style.width = pct + '%';
}

// ==================== Render ====================
function renderStep() {
    updateProgress();

    if (state.current >= steps.length) {
        renderResult();
        return;
    }

    const step = steps[state.current];

    if (step.type === 'contact') {
        renderContact(step);
    } else {
        renderChoice(step);
    }
}

function renderChoice(step) {
    const cols = step.cols === 1 ? 'quiz-options quiz-options--single' : 'quiz-options';
    const selected = state.answers[step.id] || null;

    const insightHtml = step.insight ? `<div class="quiz-insight" id="quiz-insight"></div>` : '';

    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle">${step.subtitle}</p>
            <div class="${cols}" id="quiz-options-container">
                ${step.options.map(opt => `
                    <button
                        class="quiz-option${selected === opt.value ? ' selected' : ''}"
                        data-value="${opt.value}"
                        type="button"
                    >
                        <span class="quiz-option-label">${opt.label}</span>
                        ${opt.sub ? `<span class="quiz-option-sub">${opt.sub}</span>` : ''}
                    </button>
                `).join('')}
            </div>
            ${insightHtml}
            <div class="quiz-nav">
                <button class="quiz-btn-back" id="quiz-back" ${state.current === 0 ? 'disabled' : ''}>← Zurück</button>
                <button class="quiz-btn-next" id="quiz-next" ${selected ? '' : 'disabled'}>Weiter →</button>
            </div>
        </div>
    `;

    // Restore insight if answer already set
    if (selected && step.insight) showInsight(step, selected);

    // Option clicks
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
    if (show) {
        el.className = `quiz-insight visible quiz-insight--${step.insight.type}`;
        el.innerHTML = step.insight.getText(val);
    } else {
        el.className = 'quiz-insight';
    }
}

function renderContact(step) {
    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-step-meta">${step.meta}</p>
            <h2 class="quiz-step-title">${step.title}</h2>
            <p class="quiz-step-subtitle">${step.subtitle}</p>

            <div class="quiz-field">
                <label for="quiz-name">Dein Vorname</label>
                <input class="quiz-input" id="quiz-name" type="text" placeholder="Max" autocomplete="given-name" value="${state.name}">
            </div>
            <div class="quiz-field">
                <label for="quiz-email">Deine E-Mail-Adresse</label>
                <input class="quiz-input" id="quiz-email" type="email" placeholder="max@beispiel.de" autocomplete="email" value="${state.email}">
            </div>
            <p class="quiz-privacy">Kein Spam. Nur dein Ergebnis. Du kannst dich jederzeit abmelden.</p>

            <div class="quiz-nav">
                <button class="quiz-btn-back" id="quiz-back">← Zurück</button>
                <button class="quiz-btn-next" id="quiz-next" disabled>Ergebnis anzeigen →</button>
            </div>
        </div>
    `;

    const nameInput  = document.getElementById('quiz-name');
    const emailInput = document.getElementById('quiz-email');
    const nextBtn    = document.getElementById('quiz-next');

    function validate() {
        const ok = nameInput.value.trim().length > 1 && /\S+@\S+\.\S+/.test(emailInput.value.trim());
        nextBtn.disabled = !ok;
    }

    nameInput.addEventListener('input', validate);
    emailInput.addEventListener('input', validate);
    validate();

    nextBtn.addEventListener('click', () => {
        state.name  = nameInput.value.trim();
        state.email = emailInput.value.trim();
        state.current++;
        renderStep();
    });

    document.getElementById('quiz-back').addEventListener('click', () => {
        state.current--; renderStep();
    });
}

// ==================== Result Screen ====================
function renderResult() {
    progressBar.style.width = '100%';

    const inc     = incomeMap[state.answers.einkommen] || { net: 4000, staat: 1240 };
    const luecke  = inc.net - inc.staat;

    const buOk = state.answers.bu === 'eigene';
    const rlOk = state.answers.rl === 'ja';
    const skOk = state.answers.sk === 'ja';
    const gaps  = [!buOk, !rlOk, !skOk].filter(Boolean).length;

    const firstName = state.name || 'du';

    // Dynamic urgency sentence
    const urgency = gaps === 0
        ? 'Fast alles gesichert, Papa!'
        : gaps === 1
        ? 'Eine Lücke – die können wir schließen.'
        : gaps === 2
        ? 'Zwei Lücken. Lass uns das angehen.'
        : 'Drei Lücken. Jetzt ist der richtige Moment.';

    const statusRows = [
        { name: 'Einkommen (BU)',       ok: buOk },
        { name: 'Familie (Risikoleben)', ok: rlOk },
        { name: 'Gesundheit (Schwere K.)', ok: skOk },
    ];

    body.innerHTML = `
        <div class="quiz-step">
            <p class="quiz-result-title">Dein Ergebnis, ${firstName}.</p>
            <h2 class="quiz-result-headline">
                ${gaps === 0
                    ? 'Du bist gut aufgestellt – lass uns das bestätigen.'
                    : `Du hast ${gaps} offene Lücke${gaps > 1 ? 'n' : ''} in deiner Absicherung.`
                }
            </h2>

            ${gaps > 0 ? `
            <div class="quiz-result-gap">
                <p class="quiz-result-gap-label">Deine monatliche Einkommenslücke bei BU</p>
                <p class="quiz-result-gap-amount">−${luecke.toLocaleString('de-DE')} €</p>
                <p class="quiz-result-gap-sub">Staat zahlt ${inc.staat.toLocaleString('de-DE')} € · du verdienst ${inc.net.toLocaleString('de-DE')} €</p>
            </div>
            ` : ''}

            <div class="quiz-result-status">
                ${statusRows.map(row => `
                    <div class="quiz-status-row">
                        <span class="quiz-status-name">${row.name}</span>
                        <span class="quiz-status-pill ${row.ok ? 'ok' : 'gap'}">
                            ${row.ok ? '✓ gesichert' : '✕ Lücke'}
                        </span>
                    </div>
                `).join('')}
            </div>

            <p class="quiz-result-urgency">${urgency}</p>

            <div class="quiz-result-cta">
                <a href="#" class="btn btn-primary" onclick="closeQuiz()">
                    Jetzt kostenloses Gespräch buchen →
                </a>
                <p class="quiz-result-cta-sub">20 Minuten · kostenlos · unverbindlich · nur ${Math.max(1, 8 - (new Date().getDay()))} Plätze diese Woche</p>
            </div>
        </div>
    `;
}

// ==================== Init ====================
// Wire buttons via data attribute too
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-quiz-open]');
    if (trigger) { e.preventDefault(); openQuiz(); }
});
