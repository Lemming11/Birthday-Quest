# Copilot-Richtlinien für Birthday-Quest

## Projektüberblick
Birthday-Quest ist eine webbasierte, interaktive Geburtstags-Schnitzeljagd (mehrere Stationen), erstellt mit reinem HTML, CSS und JavaScript (ohne Frameworks). Stationen werden nacheinander basierend auf Zeit/Fortschritt freigeschaltet. Deutschsprachige Inhalte, dunkles magisches Design.

**Tech-Stack**
- HTML5, CSS3, JavaScript (ES6+)
- Rein clientseitig (kein Backend)
- Fortschritt via `sessionStorage`
- Deutsch als Primärsprache

## Struktur & Namensgebung
- Jede Station ist eine eigene HTML-Datei im Ordner `stations/`.
- `station0.html`: Start/Countdown (unnummeriert, Einleitung).
- `station1.html`, `station2.html`, …: nummerierte, klar betitelte Aufgaben.
- Jede Seite nutzt eine `.card`-Containerstruktur mit Überschrift, Inhalt, Navigation.
- Buttons: „Zurück" links, „Weiter" rechts.

## HTML-Konventionen
- Semantische HTML5-Elemente verwenden.
- Für dynamische Rückmeldungen `role="status"` und `aria-live="polite"`.
- Formulare mit `autocomplete="off"`; Felder klar beschriften (Labels).

## JavaScript-Konventionen
- Kein Framework, nur Vanilla JS (ES6+).
- Zentrale Quest-Logik in `js/quest.js`.
- Pro Station eine `initStation{N}()`-Funktion zum Setzen von Event-Listenern.
- Fortschritt in `sessionStorage` (Schlüssel: `currentStation`, `station{N}Completed`).
- Asynchronität mit `async/await` (falls Stationen dynamisch geladen werden).
- Ereignisse ausschließlich via `addEventListener` (keine Inline-Handler).
- Eingaben vor Prüfung normalisieren: `.toLowerCase()`, `.trim()`, `.normalize("NFD")`.

## Navigation & Fluss
- „Weiter"-Buttons sind initial deaktiviert; Aktivierung erst nach erfolgreichem Abschluss.
- „Zurück"-Buttons führen zur vorherigen Station.
- Stationen werden nur nach Validierung freigegeben; Manipulation des Fortschritts vermeiden.

## Formulare & Feedback
- Formulare ordentlich kapseln und `e.preventDefault()` nutzen.
- Klare, freundliche deutsche Rückmeldungen:
  - Erfolg: `.success` mit Grün (`#9cffb0`).
  - Fehler: `.error` mit Rot (`#ff7a7a`).
- Fehlertexte sind konkret (was fehlt/was ist falsch, wie korrigieren).

## Styling & Theme
- Eingebettetes CSS in `index.html`, stationenspezifische Inline-Styles erlaubt.
- Dunkles Theme mit CSS-Variablen in `:root` (Beispiel-Farben):
  - Hintergrund: `#0d0d0d`
  - Text: `#e6e6e6`
  - Kartenhintergrund: `#151522`
  - Rahmen: `#2b2b3d`
- Buttons `.btn`:
  - Primär: `#4b0082`
  - Hover: `#6a0dad`
  - Disabled: Hintergrund `#2b2b3d`, Text `#666`, `opacity: 0.5`, `cursor: not-allowed`.

## Inhalte & Sprache
- Deutsch als Standard, kurze Sätze, positive Tonalität.
- Einheitliche Begriffe: „Station", „Aufgabe", „Weiter", „Zurück", „Hinweis".
- Konsistente Überschriften (H1 für Seitentitel, H2/H3 für Abschnitte).
- Narrativ: Kurze Einleitung je Station (Story/Setting), dann klare Aufgabe, danach Feedback/Weiter.

## Qualitätssicherung (Empfohlen)
- Testfälle pro Station: gültige/ungültige Eingaben.
- Zugänglichkeit prüfen (ARIA, Fokus, Tastaturbedienung).
- Performance: Vermeide unnötige DOM-Updates, kompaktes CSS.
- Sicherheit: Eingaben immer validieren/säubern; keine sensiblen Daten speichern.

## Verzeichnisvorschlag
```
.
├─ index.html              # Einstieg, Theme, globale Styles
├─ js/
│  └─ quest.js             # Fortschritt, Navigation, Validierung
├─ stations/
│  ├─ station0.html        # Start/Countdown
│  ├─ station1.html        # Aufgabe 1
│  └─ station2.html        # Aufgabe 2 (usw.)
└─ docs/                   # Redaktionelle Hilfen (optional)
   ├─ content-guide.md
   └─ station-checklist.md
```

## Redaktions-Checkliste (Kurz)
- Ziel der Station in 1–2 Sätzen.
- Eindeutige Eingabeaufforderung + Beispiel.
- Erfolgstext motivierend; Fehlertext hilfreich.
- Button-Logik geprüft (Weiter erst nach Erfolg).
- Einheiten/Schreibweisen konsistent (z. B. Datum, Groß-/Kleinschreibung).
