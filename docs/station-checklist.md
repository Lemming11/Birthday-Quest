# Stationen-Checkliste

Nutze diese Checkliste vor dem Freischalten einer Station.

## Inhalt
- [ ] Einleitung (1–2 Sätze, stimmungsbildend)
- [ ] Klare Aufgabenbeschreibung + Beispiel-Eingabeformat
- [ ] Optionaler Hinweis-Kasten vorhanden oder bewusst weggelassen
- [ ] Erfolg-/Fehlertexte kurz und hilfreich

## Technik
- [ ] `initStation{N}()` setzt alle benötigten Event-Listener
- [ ] Eingaben normalisiert: `.toLowerCase()`, `.trim()`, `.normalize("NFD")`
- [ ] „Weiter"-Button initial disabled, Aktivierung nach Erfolg
- [ ] „Zurück"-Button führt zuverlässig zur vorherigen Station

## Barrierefreiheit
- [ ] `role="status"` + `aria-live="polite"` für Feedback
- [ ] Sinnvolle Labels und Fokus-Reihenfolge
- [ ] Tastaturbedienung getestet
