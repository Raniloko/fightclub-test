# Admin-Bereich für Stundenplan-Verwaltung

## Ziel
Geschützter Admin-Bereich, in dem Chef und Mitarbeiter den Stundenplan live anpassen können (Entfall, Verschiebung, neue Klasse). Die Änderungen erscheinen sofort auf der öffentlichen Seite unter „Stundenplan".

## Was neu entsteht
- **Login-Seite** `/admin/login` mit Fight Club Branding (dunkles Theme, Cyan-Akzent, `fc-headline-underline`), „Angemeldet bleiben"-Checkbox.
- **Passwort-Setup-Seite** `/admin/passwort-festlegen` – Ziel des Einladungs-/Reset-Links aus der Mail.
- **Admin-Dashboard** `/admin` (geschützt): Wochentag wählen, Klassen bearbeiten/löschen/hinzufügen, Notiz „Heute entfällt" pro Klasse.
- **Öffentliche `Schedule.tsx`** liest ab jetzt aus der Datenbank statt aus einem statischen Objekt und zeigt Entfall-Hinweise.

## Sicherheit (deine Priorität)
- **Lovable Cloud Auth** (verschlüsselte Sessions, HTTPS erzwingt die Plattform automatisch, Passwörter als bcrypt-Hash).
- **Row-Level Security** auf allen Tabellen; Schreibrechte nur mit Rolle `admin`.
- **Rollen in separater `user_roles`-Tabelle** (kein Feld im Profil) – schützt vor Privilege Escalation.
- **Brute-Force-Schutz**: Server-seitiges Rate-Limit (5 Fehlversuche / 15 Min. pro E-Mail + IP) via eigener Tabelle `auth_attempts` und Server Function; danach 15 Min. Sperre.
- **SQL-Injection**: Alle DB-Zugriffe laufen über den Supabase-Client mit parametrisierten Queries – keine String-Konkatenation.
- **HIBP-Passwort-Check** aktivieren (blockiert geleakte Passwörter).
- **Zod-Validierung** für alle Eingaben (Client + Server).

## Einladung per Mail
- Erste Einladung an **info@fightclub-hanau.de** wird per Migration + Auth-Admin-API angelegt; Supabase versendet automatisch die Mail „Passwort festlegen" mit Link auf `/admin/passwort-festlegen`.
- Fight Club Team ist Default – es gibt nur ein Team/Studio, jede Person mit Rolle `admin` oder `staff` sieht denselben Stundenplan.
- Rollenwahl `admin` / `staff` im Dashboard verfügbar (nur `admin` darf Rollen vergeben).

## Datenbank (technisch)
```text
app_role enum: 'admin' | 'staff'
user_roles(user_id, role)                — RLS, has_role()-Funktion
schedule_classes(id, day, start, end,
                 discipline, age, note,
                 cancelled_today boolean,
                 updated_at, updated_by) — public SELECT, admin/staff WRITE
auth_attempts(email, ip, attempted_at)   — Rate-Limit-Speicher
```
Migration seedet die aktuellen Klassen aus `Schedule.tsx`, damit nichts verloren geht.

## Ablauf für dich
1. Ich baue alles, aktiviere Lovable Cloud und HIBP.
2. Du bekommst eine Mail an info@fightclub-hanau.de → Passwort festlegen.
3. Login unter `/admin` → Stundenplan pflegen, weitere Mitarbeiter einladen.

Soll ich so umsetzen?