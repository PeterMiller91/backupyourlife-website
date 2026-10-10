# Logo 2e – „Großes b, kleines b mit Marker"

**Idee:** Ein großes b (Elternteil) und ein kleines, angelehntes b (Kind) stehen gemeinsam auf einem Textmarker-Strich. Wir sichern ab, nicht für uns, sondern für unsere Kinder. Lesbar auch als „Plan b".

## Dateien
Alle SVGs sind **in Pfade umgewandelt** (Caveat Brush), 1:1 nach Entwurf 2e. Es wird keine Webfont benötigt.
| Datei | Einsatz |
|---|---|
| `logo-light.svg` | Standard auf Weiß |
| `logo-dark.svg` | Mit #1A1A1A-Hintergrund |
| `logo-dark-transparent.svg` | Dunkle Version ohne Hintergrund (Footer) |
| `logo-mono-black.svg` | Einfarbig |
| `symbol.svg` | Nur Bildzeichen (bb + Marker) |
| `icon-app.svg` / `favicon.svg` | App-Icon / Favicon |
| `Logo.tsx` | `<Logo variant="light|dark|mono|symbol" height={40} />` |

## Aufbau
- Bildzeichen: großes **b** (Caveat Brush, 100 %) + kleines **b** (54 %, um +6° gedreht, überlappt leicht)
- Marker: gerundetes Rechteck hinter der unteren Hälfte beider b, −1° gedreht
- Wortmarke: „backup / yourlife" zweizeilig, Caveat Brush, 40 % der b-Höhe, Grundlinie bündig mit dem Bildzeichen

## Farben
| | Hell | Dunkel |
|---|---|---|
| Großes b | #1A1A1A | #FFFFFF |
| Kleines b | #2B59C3 | #FFC531 |
| Marker | #FFC531 | #E8412C |
| Wortmarke | #1A1A1A | #FFFFFF |

## Regeln
- Schutzraum: Höhe des kleinen b rundum
- Mindesthöhe: 28 px digital / 10 mm Print. Darunter nur das Bildzeichen (`symbolOnly`).
- Header 40 px hoch, Footer 56 px
- Nicht: Farben tauschen, kleines b gerade stellen, Marker weglassen, Schatten oder Verläufe ergänzen

