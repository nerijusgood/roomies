# Architecture

## Stack

- **App:** Vite + React 19 + TypeScript. Routes with `wouter` (hash URLs).
- **Style:** Tailwind v4 with shadcn-style tokens in `src/styles/theme.css`. DM Sans font, self-hosted.
- **Art:** Open Peeps avatars (DiceBear, made at build time), own doodles, Phosphor icons.
- **Motion:** `motion` + `canvas-confetti`.
- **Offline:** `vite-plugin-pwa` (Workbox) + IndexedDB (`idb-keyval`).
- **Backend:** local Vite middleware now; Vercel functions + Upstash Redis later.
- **Package manager:** yarn only.

## Folder map

```
config.json        people, PINs, area order, start week, deadline, overrides
content/areas/*.md one file per area: name, colour, doodle, checklist, tips
content/info/*.md  house guide pages
plugins/content.ts turns content + avatars into a JS module at build time
plugins/local-api.ts serves /api/* from vite dev/preview (data/ticks.json)
server/logic.ts    shared API logic (used by local, Vercel and demo)
server/*-store.ts  where ticks are saved: JSON file or Redis
api/*.ts           Vercel functions (ready, not deployed)
src/shared/        pure logic: weeks, rotation, tick merging (+ tests)
src/lib/           app state: user, sync, data, demo API
src/screens/       one file per screen
```

## How the rota works

- `startWeek` is week 0. Each person has a `startArea`.
- Every week, everyone moves one area forward in the `areas` list. It wraps around.
- `overrides` can swap two people for one week, or set someone as away (`null`).
- If there are more people than areas, someone gets a free week.
- All of this is pure code in `src/shared/rotation.ts`, so every phone works it out by itself. No server needed for the schedule.

## How ticks sync

```
tap item
  → save on phone (IndexedDB)
  → add to outbox
  → POST /api/tick  { person, pin, changes[] }   (when online)
  → server merges: newest timestamp wins per item

every 30 s / on focus / on back online
  → GET /api/week?w=2026-W41  → merge into local state
```

- Each person only writes **their own** ticks. So two people never fight over the same item.
- "Untick" is saved as `done: false` with a time, not deleted. This makes offline edits safe.
- Item ids come from the item text (slug). If you change the text, that tick resets.

## Three ways to run

| Mode | Command | Storage |
|---|---|---|
| Local dev | `yarn dev` | `data/ticks.json` on the Mac |
| Demo file | `yarn build:demo` | One HTML file, fake API in the browser |
| Production | Vercel deploy | Upstash Redis, keys `roomies:week:<id>`, kept ~400 days |

## Tests

`src/shared/rotation.test.ts` covers ISO weeks, rotation, overrides, deadline, status, tick merging and the API logic. Run `yarn test`.
