# backupyourlife – Website

Eine moderne Website für Versicherungsberatung mit Fokus auf die Perspektive der Kinder.

## Design-Philosophie

- **Zwei Stimmen:** Kinderstimme (emotional, Caveat Brush) und Faktenstimme (sachlich, Bricolage Grotesque)
- **Wachsmalfarben-Palette:** Rot, Gelb, Blau auf weißem Papier
- **Authentische Bilder:** Echte Kinderzeichnungen und Alltagsfotos statt Stockbilder
- **Klare CTA:** Fokus auf Gespräche buchen und Backup-Checks

## Struktur

```
.
├── index.html        # Hauptseite
├── styles.css        # Design System & Styling
├── script.js         # Interaktionen & Animationen
├── README.md         # Diese Datei
└── vercel.json       # Vercel Konfiguration
```

## Lokal entwickeln

1. Dateien in einen Ordner kopieren
2. Mit `python -m http.server 8000` starten (oder einen anderen lokalen Server)
3. http://localhost:8000 öffnen

## Auf Vercel deployen

### Option 1: Mit Vercel CLI (empfohlen)

```bash
# Vercel CLI installieren (falls noch nicht geschehen)
npm install -g vercel

# In den Projektordner wechseln
cd "path/to/Backupyourlife Website"

# Deployen
vercel
```

### Option 2: Mit GitHub + Vercel Web Dashboard

1. **GitHub Repository erstellen:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/backupyourlife-website.git
   git branch -M main
   git push -u origin main
   ```

2. **Auf Vercel deployen:**
   - Vercel.com öffnen
   - "New Project" klicken
   - GitHub Repository auswählen
   - Deployen (keine weitere Konfiguration nötig)

## Design System

Alle Farben und Schriften sind in `styles.css` als CSS-Variablen definiert:

- `--paper`: #FFFFFF (Hintergrund)
- `--pencil`: #1A1A1A (Text, Linien)
- `--crayon-red`: #E8412C (Logo-Strich, Markierungen)
- `--crayon-sun`: #FFC531 (Highlighter, Badges)
- `--crayon-sky`: #2B59C3 (Kinderstimme, Links, Primary CTA)

Schriften:
- **Caveat Brush:** Kinderstimme (emotional, handgeschrieben)
- **Bricolage Grotesque:** Fakten, Headlines (sachlich, kräftig)
- **IBM Plex Mono:** Zahlen, Labels, Metadaten

## Responsive Design

Die Website ist mobil-optimiert mit:
- Responsive Typografie (clamp-Funktion)
- 12-Spalten-Grid auf Desktop, einspaltig auf Mobile
- Flexible Abstände und Padding

## Browser-Unterstützung

- Chrome/Edge (neueste Versionen)
- Firefox (neueste Versionen)
- Safari (neueste Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Accessibility

- Semantisches HTML
- Farbkontraste gemäß WCAG AA
- `prefers-reduced-motion` Unterstützung
- Keyboard Navigation

## Lizenz

Private Nutzung. Alle Design-Assets und Kinderzeichnungen mit Genehmigung der Eltern.
