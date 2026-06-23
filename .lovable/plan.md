## Plan: Premium Fight Club SVG Logo Component

### 1. Create `src/components/site/FightClubLogo.tsx`
Standalone SVG React component per spec:
- Props: `variant: 'full' | 'mark' | 'wordmark'`, `color`, `size`
- viewBox `0 0 400 310` (full), adjusted square viewBox for `mark` variant so it has equal padding on all sides (e.g. `0 0 400 180` cropped to the symbol, rendered as square)
- Symbol: two mirrored angular paths + top connector bar, all in `currentColor`-style fill via the `color` prop
- Wordmark: "FIGHT CLUB" (Barlow Condensed 900, 72px), thin separator line, "MMA AKADEMIE HANAU" (600, 18px, letter-spacing 4)
- Ensure Barlow Condensed is loaded (already used elsewhere in the project — verify in `__root.tsx`; if missing, add the Google Fonts `<link>` there)

### 2. Replace existing logo usages
- `src/components/site/Nav.tsx`: replace current logo with `<FightClubLogo variant="full" color="#0A0A0A" size={140} />` (and the white version where the nav sits over dark)
- Mobile menu: spec confirms logo was removed earlier — leave removed (do NOT re-add) unless you want it back. **Question below.**
- `src/components/site/Footer.tsx`: `<FightClubLogo variant="mark" color="#FFFFFF" size={48} />`
- `src/components/site/IntroSequence.tsx`: swap the triangle mark for `<FightClubLogo variant="mark" ... />` then reveal `variant="full"`

### 3. Favicon
- Write `public/favicon.svg` with the mark-only SVG (static, hand-written to match the component output)
- Update `<link rel="icon">` in `src/routes/__root.tsx` to point to `/favicon.svg`

### 4. Preview route
- Create `src/routes/logo-preview.tsx` showing all 3 variants on dark and light backgrounds, plus size tests at 32/64/120/200px. Not linked in nav.

### 5. Verification
- `bun run build`
- Visual check at `/` and `/logo-preview` via Playwright screenshots (desktop + mobile widths) to confirm centering, separator alignment, and that "MMA AKADEMIE HANAU" visually matches "FIGHT CLUB" width

### Open question
Earlier you asked me to **remove** the logo from the mobile fullscreen menu. The new spec lists a mobile-menu logo usage. Should I re-add the white logo to the mobile menu, or keep it removed?
