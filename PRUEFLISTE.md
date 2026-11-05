# Prüfliste vor dem Bewerben der Seite

Stand: 5. November 2026 · gehört zum CRO-Review der Startseite.
Alles hier muss **von dir** (fachlich) bzw. **von einer rechtlichen Stelle** geprüft oder mit echten Daten befüllt werden. Im Code sind die Stellen zusätzlich mit `TODO`-Kommentaren markiert.

---

## 1. Platzhalter und Pflichtseiten

Erledigt (eingetragen am 5. November 2026): Name (Daniel Schultes), Alter bei Diagnose (33), Jahreszahlen (2022/2024/2025/2026), IHK für München und Oberbayern, 150 Versicherer, Beispiel-Versicherer (Continentale, Allianz, Dialog, Hannoversche), Qualifikation (Geprüfter Versicherungsfachmann IHK), Löschung „umgehend“, E-Mail mail@backupyourlife.de. § 34f wurde von der Website entfernt (keine Anlageberatung). Neue Seiten: `impressum.html`, `erstinformation.html`.

Noch offen:

| Was | Datei · Stelle | Was gebraucht wird |
|---|---|---|
| **Datenschutzerklärung** | Footer aller Seiten, FAQ „Was passiert mit meinen Daten?“ (Link führt noch auf `#`) | **Gesetzlich Pflicht.** Text erstellen (z. B. Generator/Anwalt) – muss netcup (Hosting), Telegram, monday.com, Google Fonts und „Löschung umgehend, wenn keine Beratung zustande kommt“ enthalten |
| Berufshaftpflicht: Anschrift des Versicherers und räumlicher Geltungsbereich | `impressum.html` | Laut Versicherungsschein der Vermögensschadenhaftpflicht (Allianz) |
| Erstinformations-PDF | dein eigenes PDF | Enthält noch die alte Anschrift (Vohenstrauß), info@daniel-schultes.de und die Honorar-Option. Die Website-Version nutzt Pullenreuth, mail@backupyourlife.de und „ausschließlich Provision“ – PDF bitte angleichen. Anschrift im Vermittlerregister prüfen. |
| Beteiligungen über 10 % | `erstinformation.html` | Dein PDF enthält dazu keine Angabe. Prüfen, ob für dich eine Angabe nötig ist. |

## 2. Fachliche Aussagen, die du prüfen solltest

| Aussage | Wo | Warum prüfen |
|---|---|---|
| „0 € zahlt der Staat, wenn du nur deinen Beruf nicht mehr ausüben kannst – für alle ab 2.1.1961 Geborenen“ | Startseite · „Was der Staat zahlt“ | Stützt sich auf § 240 SGB VI. Formulierung „0 €“ ist zugespitzt: es gibt dann ggf. Erwerbsminderungsrente, aber keinen Berufsschutz. |
| „< 3 Std. pro Tag … erst dann volle Erwerbsminderungsrente“ und „3 von 5 Jahren mit Pflichtbeiträgen“ | Startseite · „Was der Staat zahlt“, FAQ | § 43 SGB VI, „in der Regel“ – es gibt Ausnahmen (z. B. vorzeitige Wartezeiterfüllung). |
| Fristen für Erhöhung **ohne neue Gesundheitsfragen** („oft 6 Monate“) nach Geburt, Immobilienkauf, Gehaltssprung | Startseite · Tabs „Besonders wichtig, wenn du gerade …“; FAQ Immobilie | Nachversicherungsgarantien sind vertragsabhängig (Anlässe, Fristen, Höchstgrenzen). |
| Beispielwerte: 1.550 € EM-Rente bei 5.000 € netto; Familie M. (EM-Rente 1.300 €, AG-BU 500 €) | Startseite · Problem, Muster-Lückenplan | Als Beispielwerte gekennzeichnet; trotzdem auf Plausibilität prüfen. |
| Quiz-Schätzungen der staatlichen Leistung (775 € / 1.240 € / 2.015 € / 2.790 €) | `quiz.js` · Einkommensfrage | Grobe Faustwerte, als „grobe Schätzung“ gekennzeichnet – Herleitung dokumentieren. |
| BU = Monatsrente bei dauerhafter Berufsunfähigkeit; SK = Einmalzahlung bei versicherter Diagnose (z. B. Krebs, Herzinfarkt, Schlaganfall) | Karten, FAQ | Allgemein korrekt, Diagnosen-Liste hängt vom Tarif ab. |
| „Firmen-BU oft gedeckelt, kann bei Jobwechsel enden“ | Mythen-Tabelle, Quiz | Je nach Durchführungsweg der bAV unterschiedlich. |
| Anonyme Risikovoranfrage bei mehreren Versicherern | Ergebnis-Abschnitt, FAQ | Nur so stehen lassen, wenn du das immer so machst. |
| „Keine Gesundheitsfragen im Check und im Erstgespräch“ | Ablauf, FAQ, Datenschutz | Muss deinem tatsächlichen Ablauf entsprechen. |
| „Ich hatte selbst Krebs.“ / „Mit 33 bekam ich die Diagnose Krebs.“ | Hero (ganz oben), Über mich | Persönliche Aussage – nur veröffentlichen, wenn du das so zeigen willst. |

## 3. Versprechen und Leistungen (rechtlich prüfen lassen)

Diese Punkte sind **Leistungsversprechen**. Bitte mit IHK, Maklerverband oder Anwalt klären:

- **Sondervergütungsverbot (§ 48b VAG):** Lückenplan, Vertrags-Röntgen, Gesundheits-Voranfrage und Notfallordner bekommt jeder – unabhängig von einem Abschluss. Die Begleitung im Leistungsfall ist ausdrücklich nur für Kunden.
- **Wettbewerbsrecht (UWG):** Formulierung der drei Versprechen („Ein Nein reicht“, „Ehrlich, auch wenn ich nichts verdiene“, „Klarheit statt Fachchinesisch“).
- **„Kein Nachtelefonieren, kein Newsletter ohne dein Ja“** – muss technisch und organisatorisch so gelebt werden.
- **Datenschutz:** Die FAQ-Antwort nennt Webserver, Telegram und monday.com. Die Datenschutzerklärung muss diese Dienste, Google Fonts und – falls aktiviert – das Analytics-Tool aufführen. Für Telegram/monday.com sind Auftragsverarbeitungsverträge zu prüfen.

---

## 4. Conversion-Messung aktivieren (optional)

Die Seite enthält bereits eine datensparsame Mess-Schnittstelle (`window.bylTrack` in `script.js`). Sie sendet **nur Ereignisnamen** und den Ort des Buttons – nie Namen, E-Mail, Telefonnummer oder Antworten. Ohne Analytics-Tool passiert nichts.

Gemessen werden:

| Ereignis | Wann |
|---|---|
| Seitenaufruf | automatisch durch das Tool |
| `CTA Klick` (mit `ort`: hero, header, menu, backups, plan, rechner, ablauf, abschluss, sticky, fragen) | Klick auf „Meine Familien-Lücke berechnen“ |
| `Check gestartet` | erste Antwort im Backup-Check |
| `Check abgeschlossen` | Kontakt-Schritt abgeschickt |
| `Ergebnis angezeigt` | Ergebnis-Seite sichtbar |
| `Gespräch gewählt` (`art`: termin, rueckruf, kalender) | Klick auf Termin oder Rückruf |
| `Termin gebucht` / `Rückruf angefordert` | erfolgreich bei dir angekommen |

**Aktivieren mit Plausible (cookielos, EU-Hosting):** Konto anlegen, Domain eintragen und in `index.html`, `fragen.html` und `ueber-uns.html` vor `</head>` einfügen:

```html
<script defer data-domain="backupyourlife.de" src="https://plausible.io/js/script.js"></script>
```

In Plausible die Ereignisse oben als „Goals“ anlegen. Vorher Datenschutzerklärung ergänzen und klären, ob eine Einwilligung nötig ist (bei cookielosen Tools meist nicht – bitte rechtlich bestätigen lassen).

---

## 5. Offene Punkte

- Echte, freigegebene Kundenstimmen fehlen – erst einbauen, wenn vorhanden.
- Terminwahl im Backup-Check prüft keinen echten Kalender (Doppelbuchungen möglich). Lösung: `BOOKING_URL` in `quiz.js` auf Calendly/Cal.com setzen.
- Uhrzeiten und Wochentage der Terminwahl (`TERMIN_ZEITEN`, `TERMIN_WOCHENTAGE` in `quiz.js`) an deine echten Zeiten anpassen.
- Google Fonts werden von Google geladen. Für Datenschutz und Ladezeit wäre Selbst-Hosting der Schriften besser.

---

## 6. Newsletter „Backup-Briefing“ einrichten (Brevo)

Das Formular steht auf `notfallordner.html` und läuft über `api/newsletter.php` mit Double-Opt-in. Bis die folgenden Schritte erledigt sind, zeigt es beim Absenden eine Fehlermeldung.

1. **Liste anlegen:** Brevo → Kontakte → Listen → „BYL Newsletter“. ID notieren.
2. **Absender einrichten:** Brevo → Absender & Domains → mail@backupyourlife.de hinzufügen und bestätigen; Domain backupyourlife.de authentifizieren (DNS-Einträge bei netcup), sonst landen Mails im Spam.
3. **Double-Opt-in-Vorlage:** Vorlage mit Tag „optin“ und dem Bestätigungslink `{{ params.DOIurl }}` im Design von backupyourlife (kann Claude anlegen, sobald der Absender existiert). ID notieren.
4. **API-Schlüssel:** Brevo → SMTP & API → neuen Schlüssel nur für die Website erstellen.
5. **Auf dem Server** in `api/config.php` eintragen: `brevo_api_key`, `brevo_newsletter_list_id`, `brevo_doi_template_id` (Vorlage: `api/config.example.php`).
6. **Datenschutzerklärung** um Brevo (Sendinblue GmbH, Berlin) ergänzen und im Formular verlinken.
7. Einmal mit einer eigenen Adresse testen: Bestätigungs-Mail kommt an → Link → Rückkehr auf den Notfallordner mit „Anmeldung bestätigt“ → Kontakt steht in „BYL Newsletter“.

Hinweis: Das Brevo-Konto „DS Marketing“ enthält auch die Listen anderer Projekte (Morgenlicht, Raus aus dem Gift). Der Website-Schlüssel kann technisch alle Listen ansprechen – daher eigenen Schlüssel verwenden und nur in `config.php` hinterlegen.
