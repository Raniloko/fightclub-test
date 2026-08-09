# Intro: Flackern beheben + Feuer-Animation um das Logo

## 1. Flacker-Bug beheben

Aktuell wird vor dem Laden ein grauer Platzhalter-Vorhang (zwei Hälften, #2e2e2e / #3d3d3d) über die Seite gelegt. Sobald React startet, wird dieser Platzhalter entfernt und stattdessen der echte schwarze Vorhang gezeigt. Weil beide unterschiedlich aussehen und nicht im selben Moment umgeschaltet werden, blitzt kurz etwas auf und eine Bildschirmhälfte verschwindet für einen Sekundenbruchteil.

Fix:
- Platzhalter und echter Vorhang bekommen exakt dasselbe Aussehen (eine durchgehende schwarze Fläche statt zwei grauer Hälften).
- Der Platzhalter wird erst entfernt, wenn der echte Vorhang wirklich gezeichnet ist (Umschalten nach zwei Render-Frames statt sofort).
- Der Vorhang-Inhalt (Slogan) startet ohne Einblend-Sprung, damit beim Umschalten nichts sichtbar "neu anfängt".

Ergebnis: nahtloser Start, kein Aufblitzen, keine halb verschwindende Fläche.

## 2. Feuer-Animation um das Logo

Die vorhandene Canvas-Feueraura (`FireAura`) wird so erweitert, dass sie auch in der zweiten Intro-Stufe hinter dem Logo läuft:

- Neue Variante "orbit": Flammen und Funken laufen ringförmig um das Logo herum (kein Balken, kein Streifen), mit leichter Rotation der Emissionspunkte.
- Funken werden vom Ring nach außen/oben weggeschleudert und verglühen.
- Farben wie bisher: tiefes Orange, Goldgelb, Glutrot, weicher Außenschein.
- Das Logo liegt darüber und bleibt vollständig scharf und lesbar.
- Max. 100 Partikel, `prefers-reduced-motion` schaltet die Animation ab.

## Technische Umsetzung

- `src/styles.css`: `html.fc-intro-pending`-Pseudoelemente auf eine einzige, mit `.fc-shutter` identische Fläche vereinheitlichen; neue Klasse `.fc-fire-canvas--orbit` für die Positionierung um das Logo (`.fc-intro-logo-center` wird `position: relative`-Container mit z-Index-Stapel).
- `src/components/site/FireAura.tsx`: optionales Prop `mode: "banner" | "orbit"`; im Orbit-Modus werden Partikel entlang einer Ellipse um die Mitte emittiert statt an den Kanten.
- `src/components/site/IntroSequence.tsx`: `FireAura mode="orbit"` in `.fc-intro-logo-center` hinter Logo und Text rendern; `fc-intro-pending` erst nach `requestAnimationFrame`-Doppelframe entfernen.
