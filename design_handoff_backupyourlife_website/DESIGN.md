# backupyourlife – Website Design System
Richtung: **2d Kinderstimme**. Die Kinder sprechen, die Väter hören zu.

---

## 1. Konzept

- Die Seite wird aus Sicht des Kindes erzählt. Das Kind sagt in Handschrift, was der Vater ihm bedeutet. Die Fakten zur Absicherung stehen in einer kräftigen Grotesk.
- Es gibt immer zwei Stimmen, und sie werden nie vermischt:
  - **Kinderstimme:** emotional, handgeschrieben, leicht schief gesetzt
  - **Faktenstimme:** sachlich, gerade, schwer gesetzt
- Die Farben sind Wachsmalfarben auf weißem Papier. Es gibt keine Corporate-Palette und keine Verläufe.
- Kernsatz: **„Mein Papa hat ein Backup.“**
- Leitsatz: „Papa kann alles reparieren. Außer sich selbst.“

---

## 2. Farben

| Token | Hex | Rolle |
|---|---|---|
| `--paper` | `#FFFFFF` | Hintergrund, immer |
| `--pencil` | `#1A1A1A` | Text, Linien, dunkle Flächen |
| `--crayon-red` | `#E8412C` | Logo-Strich, Markierungen, Lücken/Warnung |
| `--crayon-sun` | `#FFC531` | Highlighter hinter Wörtern, Badges |
| `--crayon-sky` | `#2B59C3` | Kinderstimme (Handschrift), Links, Primär-CTA |
| `--line` | `#E6E3DC` | Trennlinien, Card-Rahmen |
| `--line-dashed` | `#BDB9AF` | Rahmen um Kinderzeichnungen |
| `--muted` | `#6B6862` | Labels, Metadaten |
| `--body` | `#3A3835` | Fließtext |

```css
:root{
  --paper:#FFFFFF; --pencil:#1A1A1A;
  --crayon-red:#E8412C; --crayon-sun:#FFC531; --crayon-sky:#2B59C3;
  --line:#E6E3DC; --line-dashed:#BDB9AF; --muted:#6B6862; --body:#3A3835;
}
```

**Verteilung:** 75 % Weiß, 15 % Bleistift, 10 % Wachsfarben. Pro Viewport sind höchstens zwei Wachsfarben sichtbar.

**Kontrast (Pflicht):**
- `--crayon-sky` auf Weiß: ca. 6,1:1. Erlaubt für jede Textgröße.
- `--crayon-red` auf Weiß: ca. 3,9:1. Nur für Headlines ab 24 px, Striche und Flächen. Nie für Fließtext.
- `--crayon-sun` auf Weiß ist als Text verboten. Gelb nur als Fläche, darauf liegt immer `--pencil`.
- Weißer Text nur auf `--pencil`, `--crayon-sky` oder `--crayon-red`.

---

## 3. Typografie

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,800&family=Caveat+Brush&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Rolle | Font | Gewicht | Größe Desktop / Mobil | Zeilenhöhe | Extras |
|---|---|---|---|---|---|
| Kinderstimme Hero | Caveat Brush | 400 | 88 / 52 px | 0.95 | `color: var(--crayon-sky)`, `rotate(-2deg)` |
| Kinderstimme Zitat | Caveat Brush | 400 | 44 / 32 px | 1.05 | `rotate(-1deg)` |
| Fakten H1 | Bricolage Grotesque | 800 | 56 / 36 px | 1.02 | `letter-spacing: -.02em` |
| Fakten H2 | Bricolage Grotesque | 800 | 32 / 26 px | 1.08 | `letter-spacing: -.02em`, `text-wrap: balance` |
| H3 / Card-Titel | Bricolage Grotesque | 800 | 22 / 20 px | 1.15 | |
| Fließtext | Bricolage Grotesque | 400 | 17 / 16 px | 1.55 | `color: var(--body)`, max. 64 Zeichen pro Zeile |
| Labels, Beträge, Meta | IBM Plex Mono | 400–500 | 13 / 12 px | 1.4 | `color: var(--muted)` |

**Regeln**
- Caveat Brush nur für Sätze, die ein Kind sagen würde. Nie für Preise, Bedingungen, Buttons oder Navigation.
- Pro Section gibt es höchstens einen Handschrift-Satz.
- Handschrift ist immer leicht gedreht (−1° bis −3°). Grotesk ist immer gerade.
- Zahlen und Beträge (2.000 €, 100.000 €) in IBM Plex Mono oder Bricolage 800. Nie in Handschrift.

---

## 4. Logo

- Wortmarke `backupyourlife` in Caveat Brush, alles klein geschrieben.
- Darunter liegt ein roter Wachsmalstrich:
  - Höhe 10 px (skaliert mit, ca. 18 % der Schriftgröße)
  - `background: var(--crayon-red)`
  - `transform: skewX(-20deg) rotate(-1.5deg)`
  - `border-radius: 4px`
  - so breit wie die Wortmarke
- Header: 28–32 px. Footer: 40 px. Hero (falls freigestellt): 56 px.
- Schutzraum: Höhe des „b“ rundum.
- Favicon: ein handgeschriebenes „b“ mit rotem Strich auf Weiß.

---

## 5. Abstände und Raster

- **Spacing-Skala (px):** 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 96 · 128
- **Container:** `max-width: 1200px`, Seitenrand `clamp(20px, 5vw, 40px)`
- **Section-Abstand:** `clamp(64px, 10vw, 128px)` vertikal
- **Raster:** 12 Spalten, Gap 24 px. Mobil einspaltig.
- **Radius:**
  - 6 px für Zeichnungsrahmen und Cards
  - 4 px für den Logo-Strich
  - 999 px für Pills
  - Sonst eckig
- Keine Schatten. Tiefe entsteht durch Rahmen und Farbflächen.

---

## 6. Komponenten

### Header
- Weiß, 1 px `--line` unten, Höhe 72 px
- Logo links. Rechts: Navigation in Bricolage 500, 15 px, `--pencil`, dazu der Primär-Button.
- Navigationspunkte: *Wie es funktioniert · Die drei Backups · Über uns · Backup-Check*

### Buttons
| Typ | Stil |
|---|---|
| Primär | `background: var(--crayon-sky)`, weißer Text, Bricolage 800 16 px, Padding 16×28, Radius 999 px. Hover: `--pencil`. |
| Sekundär | Transparent, `2px solid var(--pencil)`, Text `--pencil`. Hover: `background: var(--crayon-sun)`. |
| Text-Link | `--crayon-sky`, Unterstreichung 2 px, `text-underline-offset: 4px`. Hover: `--pencil`. |

- Primärer CTA-Text: **„Backup-Check starten“**
- Sekundärer CTA-Text: **„Erst mal verstehen“**

### Highlighter
Einzelne Wörter in Fakten-Headlines bekommen einen gelben Marker:
```css
background: linear-gradient(transparent 55%, var(--crayon-sun) 55%, var(--crayon-sun) 92%, transparent 92%);
```
Höchstens ein Wort pro Headline.

### Kinderzeichnungs-Rahmen
- `border: 2px dashed var(--line-dashed)`, `border-radius: 6px`, Padding 24 px
- Darin liegt immer eine echte Zeichnung eines Kunden-Kindes, eine pro Motiv.
- Bildunterschrift in IBM Plex Mono 12 px: `Mira, 6 · „Mein Papa und ich“`

### Produkt-Card („Die drei Backups“)
- Weiß, `1px solid var(--line)`, Radius 6 px, Padding 32 px
- Aufbau von oben nach unten:
  1. Kinderzitat (Caveat Brush 32 px, `--crayon-sky`)
  2. Produktname (Bricolage 800, 22 px)
  3. Fakt mit Betrag (Plex Mono)
  4. 2–3 Sätze Fließtext
  5. Text-Link
- Oben sitzt ein 6 px hoher Wachsstreifen. Jedes Produkt hat seine eigene Farbe:

| Produkt | Streifenfarbe | Kinderzitat | Fakt |
|---|---|---|---|
| Berufsunfähigkeit | `--crayon-sky` | „Papa geht arbeiten, damit wir ein Haus haben.“ | bis zu 2.000 € / Monat bis 67 |
| Schwere Krankheiten | `--crayon-sun` | „Wenn Papa krank ist, bleibt er bei mir.“ | 100.000 € einmalig bei Diagnose |
| Risikoleben | `--crayon-red` | „Unser Haus bleibt unser Haus.“ | 350.000 €, Laufzeit wie der Kredit |

### Backup-Status (Check-Ergebnis)
- Liste mit drei Zeilen in Plex Mono 15 px: `Einkommen`, `Gesundheit`, `Familie`
- Status rechts:
  - Gesichert: ✓ in `--pencil` auf gelbem Pill
  - Lücke: ✕ in Weiß auf rotem Pill
- Darunter steht ein Satz in Handschrift, passend zum Ergebnis, z. B. *„Fast fertig, Papa!“*

### Formulare (Backup-Check)
- Inputs: Höhe 56 px, `2px solid var(--pencil)`, Radius 6 px, Bricolage 17 px
- Fokus: `outline: 3px solid var(--crayon-sun)`, Offset 2 px
- Labels in Plex Mono 13 px über dem Feld
- Ein Schritt pro Screen
- Fortschritt als roter Wachsstrich, der wächst (gleicher Stil wie der Logo-Strich)

### Footer
- `background: var(--pencil)`, weißer Text
- Logo mit rotem Strich
- Impressum, Datenschutz und Erstinformation (§ 15 VersVermV) in Plex Mono 12 px

---

## 7. Seitenaufbau Startseite

1. **Hero**
   - „Mein Papa hat ein Backup.“ (Handschrift, blau)
   - H1: „Papa kann alles reparieren. Außer sich selbst.“
   - Primär- und Sekundär-CTA
   - Rechts eine große Kinderzeichnung
2. **Das Problem in einem Fakt**
   - Eine Zahl groß in Bricolage 800, z. B. „Jeder 4. wird vor der Rente berufsunfähig.“ (Quelle angeben)
   - Ein Handschrift-Satz darunter
3. **Die drei Backups:** drei Produkt-Cards
4. **So läuft’s:** 3 Schritte, nummeriert in Caveat Brush (`1`, `2`, `3`, rot), Text in Grotesk
5. **Väter erzählen:** Zitat des Vaters in Grotesk, daneben die Zeichnung seines Kindes
6. **Backup-Check CTA**
   - Volle Breite, `background: var(--crayon-sun)`
   - H2 in `--pencil`
   - Button primär
7. **Footer**

---

## 8. Bildsprache

- **Ja:**
  - echte Kinderzeichnungen (eingescannt, Papierstruktur sichtbar)
  - Alltagsfotos von Vätern mit Kindern: Tageslicht, unaufgeräumt, kein Studio
- **Nein:**
  - Stockfotos
  - Krankenhaus, Rollstuhl, Friedhof, weinende Menschen
  - Schirme, Schilde, Bausteine, Hände, die etwas halten
- Fotos werden nie farbig überlagert. Wachsmal-Elemente (Strich, Kreis, Pfeil) dürfen von Hand über Fotos gezeichnet sein, aber nur eines pro Bild.
- Für Kinderzeichnungen braucht es die Einwilligung der Eltern. Vornamen und Alter nur mit Freigabe.

---

## 9. Bewegung

- Logo-Strich und Highlighter „malen“ sich beim ersten Erscheinen ein:
  - `clip-path` von links nach rechts, 500 ms, `cubic-bezier(.6,0,.2,1)`
- Handschrift-Sätze blenden ein (300 ms) und drehen sich dabei von 0° auf ihren Endwinkel.
- Keine Parallax-Effekte und keine Scroll-Hijacks.
- `prefers-reduced-motion` schaltet alles ab.

---

## 10. Sprache

- Du-Form. Der Vater wird angesprochen, das Kind spricht.
- Kinderstimme:
  - kurze Hauptsätze
  - Wortschatz eines 5- bis 8-jährigen Kindes
  - keine Fachbegriffe
- Faktenstimme:
  - klar und konkret, mit Zahlen
  - ein Gedanke pro Satz
  - Fachbegriffe beim ersten Auftreten erklären
- **Nie:**
  - Angstmache („Was, wenn morgen …“)
  - Versicherungsdeutsch („Leistungsfall“, „Hinterbliebene“)
  - Superlative ohne Beleg

---

## 11. Do / Don’t

| Do | Don’t |
|---|---|
| Ein Handschrift-Satz pro Section | Handschrift für Preise, Buttons, Navigation |
| Weiß als dominante Fläche | Farbige Hintergründe außer der gelben CTA-Section und dem Footer |
| Echte Zeichnungen von Kunden-Kindern | Gezeichnete Illustrationen von Agenturen, die kindlich wirken sollen |
| Gelb nur als Fläche | Gelber Text |
| Rot für Logo-Strich und Lücken | Rot als Button-Farbe |
| Beträge in Plex Mono | Beträge ohne Bedingungen |
