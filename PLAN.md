# Roomies — plan

## Stack
- App: Vite + React + TypeScript, wouter (hash routes)
- Style: Tailwind v4 + shadcn-style tokens (src/styles/theme.css), DM Sans (self-hosted)
- Art: Open Peeps avatars via DiceBear (built at build time), own doodles, Phosphor icons
- Motion: motion + canvas-confetti
- Offline: vite-plugin-pwa (Workbox), idb-keyval tick outbox
- Content: Markdown + frontmatter in /content → JS module at build
- Backend: local API in Vite (data/ticks.json) now; Vercel /api + Upstash Redis later
- Hosting: Vercel Hobby, private GitHub repo — €0

## Tasks
### 1. Setup
- [x] Vite + React + TS, Tailwind v4, theme.css
- [x] PWA config: manifest, icons, precache
- [ ] Vercel project + Upstash Redis integration (later)

### 2. Content & logic
- [x] config.json: people, PINs, area order, start week, overrides (swap / assign)
- [x] content/areas/*.md + content/info/*.md (demo content)
- [x] Build step: markdown → content module
- [x] rotation.ts: week → person → area (+ overrides), deadline/countdown

### 3. API & sync
- [x] GET /api/week, POST /api/tick (PIN check) — local + Vercel versions
- [x] sync.ts: local ticks, outbox, flush on open/online/focus, refresh every 30s

### 4. UI components
- [x] Button (pill), IconButton, Tile, Hero, Progress bar + ring, Checkbox row, Status pill, Avatar, PIN input, floating nav

### 5. Screens
- [x] Who are you (name + PIN)
- [x] My week (hero + house tiles)
- [x] Checklist (+ confetti on done)
- [x] Roomie checklist (read-only, timestamps)
- [x] Calendar (weeks × people, status colours)
- [x] House guide + area pages (markdown)
- [x] Settings (switch user, sync status)

### 6. Art & polish
- [x] Doodle per area, avatars, app icon
- [x] Friendly copy, offline states
- [ ] Real names, PINs, areas and checklists

### 7. Ship
- [x] Tested: unit tests, offline reload, offline tick → sync, second device sees it
- [ ] Test install on real iOS and Android (needs HTTPS deploy)
- [ ] Deploy, share link, roomies add to home screen
