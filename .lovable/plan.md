# Neues Hero-Bild für die Desktop-Version

## Ziel
Auf dem Desktop soll der Hero-Bereich vollflächig gefüllt sein — ohne unscharfen Ersatz-Hintergrund an den Seiten und ohne dass Köpfe oder Beine abgeschnitten werden. Die abgebildeten Kämpfer und Kinder bleiben exakt so, wie sie jetzt sind.

## Vorgehen
1. Das aktuelle Hero-Bild (Hochformat, 1027×1531) wird per Bild-Erweiterung („Outpainting") auf ein Querformat von 1920×1080 gebracht.
   - Die bestehenden Personen werden nicht neu generiert, sondern unverändert übernommen.
   - Nur links und rechts wird die Halle/der Hintergrund im gleichen Look (Licht, Farbstimmung, Körnung) fortgeführt.
2. Das Ergebnis wird als neues Asset im Projekt abgelegt (`hero-desktop-wide`).
3. Der Hero verwendet dieses Bild ausschließlich ab Desktop-Breite; die mobile Version bleibt unverändert beim bisherigen Hochformat-Bild.
4. Der bisher nötige unscharfe Hintergrund-Layer auf dem Desktop entfällt, da das Bild die Fläche nun selbst füllt.
5. Filter und Overlay (Grauton, Kontrast, dunkler Verlauf für die Textlesbarkeit) bleiben wie bisher.

## Kontrolle
Screenshot-Prüfung bei 1440px und 1920px Breite: Bild randlos, Personen komplett sichtbar, Headline gut lesbar.

## Technische Details
- Bild-Erweiterung über das Bild-Edit-Tool auf Basis von `src/assets/hero-main-v2.png`, Ausgabe 1920×1080.
- Neues Pointer-File `src/assets/hero-desktop-wide.jpg.asset.json`, eingebunden in `src/components/site/Hero.tsx`.
- Desktop-`<img>`: `object-cover object-center`, Parallax-Verhalten unverändert.
- Falls die Erweiterung die Personen sichtbar verfälscht, wird stattdessen ein zweiter Versuch mit engerem Prompt gemacht — im Zweifel bleibt das bisherige Bild bestehen.
