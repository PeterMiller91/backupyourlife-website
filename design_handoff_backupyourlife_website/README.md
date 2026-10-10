# Handoff: backupyourlife.de – Startseite

## Überblick
Die Startseite von backupyourlife.de soll Anfragen für ein 20-minütiges Erstgespräch erzeugen. Verkauft werden drei Produkte: Berufsunfähigkeitsversicherung (BU), Schwere-Krankheiten-Versicherung (Dread Disease) und Risikolebensversicherung.

- **Zielgruppe:** Mütter und Väter mittleren Alters, leitend angestellt, Einkommen über 50.000 € im Jahr.
- **Hebel:** die eigene Geschichte des Gründers. Er war selbst nicht richtig abgesichert und hat das zu spät gemerkt.

## Was in diesem Paket steckt
- Die Dateien sind **Design-Referenzen in HTML**, kein Produktionscode.
- Aufgabe: die Seite mit einem geeigneten Stack neu bauen. Empfehlung: Next.js oder Astro, Tailwind, statisches Hosting.
- Die Optik kommt aus `DESIGN.md`. Diese Datei ist verbindlich für Farben, Schrift, Komponenten und Tonalität.

## Detailgrad
- **Wireframes = Low-Fidelity.** Sie legen nur die Struktur, die Reihenfolge der Sektionen und die Funktionen fest.
- **`DESIGN.md` = High-Fidelity.** Exakte Farben, Schriften, Abstände und Komponenten-Stile stehen dort.
- Die Handschrift-Schrift (Kalam) in den Wireframes ist nur Skizzen-Stil. Nicht übernehmen.

## Variante wählen
`wireframes.dc.html` enthält 4 Strukturen, nebeneinander als 1a–1d. **Gebaut wird eine davon.** Steht keine andere Vorgabe fest, gilt 1a. Elemente aus anderen Varianten dürfen als Unterseiten oder Module übernommen werden:
- Lückenrechner aus 1b
- Quiz aus 1d

Öffnen: `wireframes.dc.html` direkt im Browser, `support.js` muss im selben Ordner liegen.

---

## Sektionen je Variante

Für alle Varianten gelten diese gemeinsamen Elemente.

**Header**
- Höhe 72 px, weiß, 1 px `#E6E3DC` unten
- Links das Logo (siehe DESIGN.md §4)
- Rechts maximal 1 Navigationspunkt und ein Primär-Button (Pill, `#2B59C3`)
- Sticky beim Scrollen

**Footer**
- `#1A1A1A`, weißer Text
- Impressum, Datenschutz, Erstinformation nach §15 VersVermV
- Status §34d GewO und Registernummer
- Diese Pflichtangaben für Versicherungsvermittler sind gesetzlich vorgeschrieben.

**Abschluss-CTA**
- Letzte Sektion vor dem Footer, volle Breite, Hintergrund `#FFC531`

### 1a – Geschichte zuerst (Longform)
1. **Hero**
   - Großes Foto des Gründers mit Familie, Alltag, kein Studio
   - H1-Zitat: „Ich dachte, ich wär abgesichert. Ich war es nicht.“
   - Unterzeile: Name, Kinder, Beruf
   - CTAs: „Meine Geschichte lesen ↓“ (scrollt zu Kapitel 1) und „20 Min. Gespräch“ (scrollt zum Kalender)
2. **Geschichte in 4 Kapiteln**
   - Nummern in Caveat Brush, `#E8412C`
   - Optional eine Scroll-Timeline links, die aktiv wird
   - Kapitel 1: Alles lief.
   - Kapitel 2: Der Tag, an dem [Ereignis].
   - Kapitel 3: Was die Versicherung (nicht) zahlte. Enthält eine Tabelle mit „Gehalt vorher“, „Leistung danach“ und „Lücke / Monat“. Lücke in Rot.
   - Kapitel 4: Warum ich das jetzt mache.
3. **Die 3 Backups**
   - 3 Karten im Raster, oben ein 6 px hoher Farbstreifen
   - Einkommen/BU: `#2B59C3`
   - Gesundheit/Schwere Krankheit: `#FFC531`
   - Familie/Risikoleben: `#E8412C`
4. **Typische Lücken bei Führungskräften:** 3 Punkte mit ✕
5. **Abschluss-CTA:** „20 Minuten. Ich schau mir deine Absicherung an.“ Darunter ein eingebettetes Kalender-Widget (Calendly oder Cal.com).

### 1b – Lückenrechner zuerst
1. **Hero = Rechner**
   - H1: „Wie viel fehlt deiner Familie, wenn du ausfällst?“
   - Eingaben: Bruttoeinkommen/Jahr (Zahl), Anzahl Kinder (Pills 1/2/3+), offener Kredit (Zahl)
   - Ausgabe live:
     - BU-Lücke pro Monat, groß in Rot
     - Balken mit dem Anteil der gesetzlichen Erwerbsminderungsrente
   - CTA: „Ergebnis mit mir besprechen →“
2. **Geschichte kurz:** Foto, Zitat, Link „Ganze Geschichte lesen →“ zur Unterseite `/meine-geschichte`
3. **So schließen wir die Lücke:** 3 Zeilen mit Farbbalken links
4. **Ablauf:** 3 Schritte (Rechner → 20 Min. Call → Konzept)
5. **Abschluss-CTA:** E-Mail-Feld und Senden. Danach gehen das Ergebnis per Mail und ein Terminlink raus.

### 1c – Brief an meine Kinder
1. **Hero**
   - Satz in Kinderstimme: „Mein Papa hat jetzt ein Backup.“ (Caveat Brush, `#2B59C3`, −2° gedreht)
   - Darunter eine Kinderzeichnung in gestricheltem Rahmen
2. **Brief**
   - Ich-Form, 400–600 Wörter, Hintergrund `#FAF8F3`
   - Ein hervorgehobenes Zitat mit rotem Strich links
   - Unterschrift „Papa“ in Caveat Brush
3. **Was ich geregelt habe:** 3 Zeilen, links das Kinderzitat, rechts das Produkt
4. **Andere Eltern:** Kunden-Referenzen mit Kinderzeichnung (später)
5. **Abschluss-CTA:** „Schreib deinen eigenen Plan B. Ich helf dir.“ mit dem Button „Gespräch buchen“

### 1d – Video und Quiz
1. **Hero**
   - H1: „90 Sekunden, die ich gern früher gehört hätte.“
   - 16:9-Video, Autoplay stumm mit Untertiteln, Play-Button
2. **Backup-Check (Quiz)**
   - 5 Fragen, eine pro Screen
   - Fortschrittsbalken in `#E8412C`
   - Antworten als große Auswahlkarten
   - Beispielfrage: „Hast du eine eigene BU – oder nur über den Arbeitgeber?“
   - Ergebnis nur gegen E-Mail-Adresse
3. **Geschichte in 3 Zahlen:** Monate ausgefallen, Lücke pro Monat (rot), Betrag aus Ersparnissen
4. **FAQ:** Akkordeon
5. **Abschluss-CTA:** Kalender-Widget

---

## Interaktionen und Verhalten
- **Alle CTAs** führen zum Kalender, zum Rechner oder zum Quiz. Es gibt keine sonstigen externen Links.
- **Rechner (1b):**
  - Berechnet live bei jeder Eingabe, ohne Absenden-Button
  - Formel liefert der Auftraggeber
  - Platzhalter für den Prototyp: Lücke = (Brutto × 0,6 / 12) − (Brutto × 0,3 / 12)
  - Eingaben als Tausender formatieren (85.000 €)
- **Quiz (1d):**
  - Weiter beim Klick auf eine Antwort
  - Zurück-Link vorhanden
  - Zustand im `sessionStorage` sichern
  - Ergebnis-Screen: Status pro Backup (gesichert / Lücke), danach E-Mail-Formular
- **Formulare:**
  - E-Mail validieren
  - Pflicht-Checkbox für die Datenschutz-Einwilligung
  - Double-Opt-in, falls Newsletter
  - Erfolgsmeldung inline anzeigen
- **Animationen:** siehe DESIGN.md §9 (Logo-Strich und Highlighter zeichnen sich ein). `prefers-reduced-motion` beachten.
- **Responsive:**
  - Mobile-first, Wireframes sind ca. 440 px breit gezeichnet
  - Ab 1024 px: Hero zweispaltig (Text links, Bild rechts), Produktkarten in 3 Spalten

## State
- `calculator`: `{ income, kids, loan }` → abgeleitet `gapMonthly`
- `quiz`: `{ step, answers[] }` → abgeleitet `result`
- `leadForm`: `{ email, consent, status: idle | sending | success | error }`
- **Lead-Versand:** API-Route oder Formular-Dienst. Ziel: E-Mail an den Betreiber und optional ein CRM.

## Design-Tokens
Vollständig in `DESIGN.md`. Kurzfassung:

| Bereich | Werte |
|---|---|
| Farben | Paper `#FFFFFF` · Pencil `#1A1A1A` · Wachsrot `#E8412C` · Sonne `#FFC531` · Himmel `#2B59C3` · Linie `#E6E3DC` · Gestrichelt `#BDB9AF` · Muted `#6B6862` · Body `#3A3835` |
| Schriften | Caveat Brush (Kinderstimme) · Bricolage Grotesque 400/500/800 (Fakten) · IBM Plex Mono 400/500 (Labels, Beträge) |
| Spacing (px) | 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 96 · 128 |
| Radius | 6 px Cards · 4 px Logo-Strich · 999 px Pills |
| Schatten | keine |

## Assets (vom Auftraggeber zu liefern)
- Fotos des Gründers mit Familie
- Kinderzeichnungen als Scans, mit Einwilligung der Eltern
- Video (nur 1d)
- Text der Geschichte und echte Zahlen: alle Platzhalter in `[eckigen Klammern]`
- Tarifwerte
- Quelle für jede Statistik
- Impressumsdaten und §34d-Registernummer

## Dateien
- `wireframes.dc.html`: die 4 Wireframe-Varianten (Struktur)
- `DESIGN.md`: das verbindliche Designsystem (Optik)
- `support.js`: wird nur zum Öffnen der Wireframe-Datei im Browser benötigt
