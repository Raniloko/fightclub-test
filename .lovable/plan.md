
## Plan: FIGHT CLUB Berlin Website

Build a single-page editorial black & white martial arts site following the provided spec exactly.

### Setup
- Load **Barlow Condensed (800)** + **Inter (400/600)** via `<link>` tags in `src/routes/__root.tsx` head.
- Extend `src/styles.css` with semantic tokens (white bg, #F5F5F5 alt, #0A0A0A fg, #555 muted, #E0E0E0 border), font tokens, and `border-radius: 0` everywhere. No colors beyond black/white/grey.
- Update root meta title/description to "FIGHT CLUB Berlin — Muay Thai · MMA · Boxen · Kickboxen · BJJ".

### Components (under `src/components/site/`)
- `Logo.tsx` — inline SVG: three nested right-pointing triangles
- `TriangleBg.tsx` — large decorative outline triangle SVG
- `Nav.tsx` — sticky, transparent→white on scroll, mobile full-screen overlay
- `Hero.tsx` — 60/40 split, massive headline with underlined "LEBENSSTIL", fighter image right with mask fade, triangle bg
- `Stats.tsx` — black bar: 300+ / 8 / 40+
- `Disciplines.tsx` — 2-col grid, 5 cards (Muay Thai, MMA, Boxen, Kickboxen, BJJ) with hover zoom
- `About.tsx` — split image/text on grey
- `Trainers.tsx` — 3 cards with grayscale portraits + italic quotes
- `Schedule.tsx` — day tabs (Mo–So) with class list; mobile stacked cards
- `CtaProbetraining.tsx` — black section, large headline, white button
- `Contact.tsx` — info column + form (Name, Email, Telefon, Disziplin select, Nachricht); form is presentational (no backend)
- `Footer.tsx` — 3 columns + legal bar
- `Reveal.tsx` — small IntersectionObserver wrapper for fade+slide-up

### Route
- Replace placeholder in `src/routes/index.tsx` with composed sections; set per-page meta.

### Styling rules
- All Pexels images: `filter: grayscale(100%)`, lazy loaded, `?auto=compress&cs=tinysrgb&w=1200`.
- Hero image also `contrast(110%)` + CSS mask fade.
- Buttons: solid black / outline black, uppercase, letter-spacing 0.1em, no radius.
- Section padding: `py-20 md:py-20` (80px) / `py-12` mobile (48px).
- Hero stagger via CSS animation-delay on each line.
- All transitions 0.25s ease. CSS-only animations, no motion libraries.

### Out of scope
- No backend / Lovable Cloud — contact form is client-only with a success toast via existing `sonner`.
- No additional routes; single landing page as specified.
