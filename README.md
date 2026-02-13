# Birthday-Quest

Birthday-Quest ist eine webbasierte, interaktive Geburtstags-Schnitzeljagd mit aufeinanderfolgenden Stationen (Challenges). Stationen werden in Reihenfolge und basierend auf Fortschritt freigeschaltet. Das Projekt setzt auf ein dunkles, magisches Design und deutschsprachige Inhalte.

## Ziel und Einsatz
- Persönliche Geburtstagsüberraschung mit Rätseln und Aufgaben
- Offline-fähig (lokal im Browser öffnen), keine Server-Komponenten
- Inhalte leicht anpassbar für verschiedene Personen/Alter

## Features
- Mehrere Stationen mit eigenständigen HTML-Seiten (`stations/`)
- Fortschrittstracking über `sessionStorage` (clientseitig)
- Manuelle Navigation mit aktivierbaren „Weiter"-Buttons
- Deutschsprachige Feedback- und Fehlermeldungen
- Dunkles Theme mit konsistenten Styles

## Schnellstart
1. Repository herunterladen oder klonen.
2. `index.html` im Browser öffnen (Doppelklick oder per „Open With…").
3. Den Anweisungen auf dem Startbildschirm folgen.

Hinweis: Moderne Browser empfohlen (Chrome, Firefox, Edge, Safari). Keine Installation erforderlich.

## Ablauf der Quest
- Station 0: Start/Countdown (unnummeriert) – Einstieg und Stimmung.
- Stationen 1..N: Aufgaben, Rätsel, Mini-Challenges.
- Jede Station hat eine Karte (`.card`) mit Überschrift, Inhalt, Navigation.
- „Weiter"-Buttons sind initial deaktiviert und werden erst nach Abschluss aktiviert.
- Fortschritt wird in `sessionStorage` gespeichert (z. B. `currentStation`, `station{N}Completed`).

## Barrierefreiheit & Sprache
- Semantische HTML5-Elemente sowie `role="status"` und `aria-live="polite"` für dynamische Meldungen.
- Freundliche, kurze Hinweistexte in Deutsch.
- Eingaben werden vor der Validierung normalisiert (Kleinschreibung, Trim, Unicode-Normalisierung).

## Technische Architektur
- Tech-Stack: HTML5, CSS3, JavaScript (ES6+), ohne Frameworks.
- Zentrale Logik: `js/quest.js`
- Styles: eingebettet in `index.html` (+ optionale Inline-Styles pro Station).
- Keine Backend- oder Server-Abhängigkeiten.

## Ordnerstruktur
```
.
├─ index.html
├─ js/
│  └─ quest.js
├─ stations/
│  ├─ station0.html
│  ├─ station1.html
│  └─ station2.html
└─ .github/
   └─ copilot-instructions.md
```

## Entwicklungsrichtlinien (Kurzfassung)
- Ereignis-Handling nur via `addEventListener` (keine Inline-Handler).
- Stationen initialisieren über `initStation{N}()`.
- Buttons: Reihenfolge „Zurück" links, „Weiter" rechts. „Weiter" erst nach Erfolg aktiv.
- Konsistentes Theme mit CSS-Variablen in `:root`.

## Personalisierung
- Texte und Rätsel in `stations/` anpassen.
- Farben über CSS-Variablen ändern.
- Bilder und Assets hinzufügen (z. B. `assets/`-Ordner).

## Lizenz
Dieses Projekt ist für private Nutzung gedacht. Füge eine Lizenz hinzu (z. B. MIT), wenn Veröffentlichung/Wiederverwendung gewünscht ist.
