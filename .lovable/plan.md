# Probetraining auf eigene Seite auslagern

## Ziel
Das Probetraining-Formular bekommt eine eigene Seite unter `/probetraining`. Alle internen Verlinkungen zeigen dorthin. Das eingebettete MATOOL-Iframe behält seine automatische Höhenanpassung bei, damit beim Ausfüllen nichts abgeschnitten wird.

## Was wir bauen

### 1. Neue Route `/probetraining`
- Datei: `src/routes/probetraining.tsx`
- Seite mit eigenem `head()` für SEO (Titel, Beschreibung, OG-Tags, canonical).
- Inhalt:
  - `Nav` + `Footer` wie auf anderen Unterseiten.
  - Kurze Einleitung: „Jetzt kostenlos Probetraining sichern“.
  - `MaToolForm` (MATOOL-Iframe) zentriert in einem schmalen, hellen Container.
- Kein `IntroSequence` auf dieser Seite, damit der Fokus sofort beim Formular liegt.

### 2. Kontakt-Bereich anpassen
- Datei: `src/components/site/Contact.tsx`
- Entfernt das eingebettete `MaToolForm`.
- Fügt stattdessen einen deutlichen Link/Button hinzu, der auf `/probetraining` verweist (z. B. „Jetzt Probetermin anfragen →").
- Kontaktinformationen (Adresse, Telefon, Karte, Öffnungszeiten, Socials) bleiben erhalten.

### 3. Navigation aktualisieren
- Datei: `src/components/site/Nav.tsx`
- Desktop-Nav: „Probetraining"-Link zeigt auf `/probetraining` statt `#kontakt`.
- Mobiles Menü: Gleiche Anpassung für den CTA-Button „Probetraining anfragen".

### 4. CTA-Sektion aktualisieren
- Datei: `src/components/site/CtaProbetraining.tsx`
- Button „Probetraining anfragen" verlinkt auf `/probetraining` statt `#kontakt`.

### 5. Iframe-Höhenanpassung beibehalten
- Datei: `src/components/site/MaToolForm.tsx`
- Der vom Nutzer zuletzt bestätigte MATOOL-Embed-Code (inklusive originalem Höhen-/Scroll-Script) bleibt unverändert.
- Sicherstellen, dass das Script nach dem Routing zu `/probetraining` korrekt neu initialisiert wird (React-Key auf dem Script-Element oder Komponenten-Key beim Routenwechsel, falls nötig).

## Technische Details
- TanStack Router generiert die Route automatisch aus `src/routes/probetraining.tsx`.
- Verwendung von `<Link to="/probetraining">` in Nav, CTA und Kontakt.
- Keine Backend-Änderungen nötig.

## Abnahmekriterien
- `/probetraining` ist erreichbar und zeigt das Formular.
- Navigations- und CTA-Links landen auf `/probetraining`.
- Kontaktsektion zeigt kein Formular mehr, sondern verlinkt zur neuen Seite.
- Build läuft fehlerfrei.
