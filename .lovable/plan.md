# Probetraining-Seite: Wow-Redesign

Die Seite bekommt eine eigene, kinoreife Inszenierung im Stil der Startseite (Schwarz, Cyan, Gold) – das MATOOL-Formular bleibt technisch exakt wie es ist, wird aber wie ein Premium-Anmeldeschalter präsentiert.

## Was der Besucher sehen wird

1. **Dunkler Kino-Header**
   - Vollflächiger schwarzer Hintergrund mit Kampfsport-Bild, weichem Verlauf und leichtem Rauschen.
   - Große Headline "DEIN ERSTES TRAINING GEHT AUFS HAUS" mit Cyan-Unterstreichung, darunter ein kurzer Satz.
   - Kleines pulsierendes Cyan-Label "Kostenlos · Unverbindlich · Für Groß und Klein".

2. **Vertrauens-Leiste**
   - Drei bis vier kompakte Punkte mit Icons: kostenlos, alle Level, Kinder ab 5 Jahren, moderne Halle in Hanau.

3. **Der Anmelde-Schalter (Formular)**
   - Das Formular sitzt in einer hellen Karte, die auf dem dunklen Hintergrund "schwebt": abgerundete Ecken, Gold-Cyan-Rahmenlicht, dezenter Schatten.
   - Darüber eine Kopfzeile mit Schritt-Anzeige: 1. Standort · 2. Sportart · 3. Termin · 4. Reservieren – damit klar ist, wie die Reservierung funktioniert.
   - Formular selbst unverändert (gleiche Einbettung, gleiche automatische Höhe), nur der Rahmen drumherum ist neu.
   - Sanfte Einblend-Animation beim Scrollen.

4. **Darunter**
   - Kurzer Block "Was dich im Probetraining erwartet" (3 Schritte: ankommen, mitmachen, quatschen).
   - Kontakt-Fallback: Anrufen / WhatsApp / Adresse, falls jemand lieber persönlich bucht.
   - Datenschutz-Hinweis zu MATOOL bleibt erhalten, nur ruhiger gestaltet.

5. **Mobil**
   - Alles einspaltig, große Tippflächen, Formularkarte randlos bis fast an den Bildschirmrand, damit maximal Platz bleibt.

## Technische Hinweise

- Neu gestaltet wird `src/routes/probetraining.tsx`; `MaToolForm.tsx` bleibt in Logik und Einbettung unverändert (nur optionaler Wrapper-Klassenname).
- Farben ausschließlich über bestehende Design-Tokens/Klassen des Projekts (kein neues Farbschema).
- Animationen per CSS (Fade/Slide beim Sichtbarwerden), keine neue Bibliothek.
- Hintergrundbild: vorhandenes Asset wiederverwenden, sonst ein passendes neues Bild erzeugen.
- SEO-Metadaten der Route bleiben bestehen, Beschreibung wird leicht geschärft.
