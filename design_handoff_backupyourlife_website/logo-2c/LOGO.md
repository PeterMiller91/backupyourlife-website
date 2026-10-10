# Logo 2c – Textmarker + Kinder-Claim

**Idee:** „yourlife" ist gelb markiert, so wie man Wichtiges anstreicht. Darunter steht in Kinderstimme: „… weil wir dich brauchen." Der Satz passt zu Mutter und Vater.

## Dateien
| Datei | Einsatz |
|---|---|
| `logo-light.svg` | Standard mit Claim (Hero, Print, Visitenkarte) |
| `logo-dark.svg` | Auf #1A1A1A, mit Claim (Footer) |
| `logo-light-ohne-claim.svg` / `logo-dark-ohne-claim.svg` | Header, kleine Flächen |
| `logo-mono-black.svg` | Einfarbig für Stempel, Fax |
| `icon-app.svg` | App-Icon, Social-Avatar |
| `favicon.svg` | Favicon |
| `Logo2c.tsx` | React: `<Logo2c variant="light|dark|mono" height={48} claim={false} />` |

## Farben
| | Hell | Dunkel |
|---|---|---|
| Wortmarke | #1A1A1A | #FFFFFF |
| Marker | #FFC531 | #E8412C |
| Claim | #2B59C3 | #FFC531 |

## Regeln
- Claim nur ab 160 px Logobreite. Darunter die Version ohne Claim verwenden.
- Header: ohne Claim, 36 px hoch. Hero und Footer: mit Claim.
- Der Marker liegt immer nur hinter „yourlife", nie hinter „backup".
- Den Claim nicht umformulieren und nicht in Grotesk setzen.
- Schutzraum: Höhe des „b" rundum

## Vor Go-live
Text in Pfade umwandeln (Figma/Illustrator „Outline"), damit das Logo ohne Webfont überall gleich aussieht.
