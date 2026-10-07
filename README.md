# Roomies

A friendly, offline-first cleaning rota for our home. Open it, see your area and deadline, tick your checklist. Everyone sees who's done.

Currently **local only**, with our real names, areas and draft checklists.

## Run it

```bash
yarn install
yarn demo      # optional: fill in demo progress for this week and last week
yarn dev       # http://localhost:5173
```

PINs (change them in `config.json`): Noeleen `1111`, Nerijus `2222`, Agnese `3333`, Stefano `4444`.

**Try it on your phone:** `yarn dev` prints a *Network* address (like `http://192.168.1.20:5173`). Open it on a phone on the same wifi. Ticks sync between phones through your Mac.

**Test offline + install:** offline caching only runs in a production build:

```bash
yarn build && yarn preview   # http://localhost:4173 + Network address
```

Note: "Add to Home Screen" with full offline support needs HTTPS, so on a real phone this fully works after deploying (Vercel). On the Mac, `localhost` counts as secure, so you can test offline there (DevTools → Network → Offline).

**Shareable demo:** `yarn build:demo` makes one self-contained file, `dist-demo/index.html`, with a fake in-browser API (no server, data stays in that browser).

Other commands: `yarn test` (rotation, sync and API tests), `yarn typecheck`.

## Edit the house

| What | Where |
|---|---|
| People, PINs, area order, start week, deadline | `config.json` |
| Swaps / someone away | `overrides` in `config.json` (`"swap": ["stefano", "agnese"]` or `"assign": { "stefano": null }`) |
| Areas: name, colour, doodle, checklist, tips | `content/areas/*.md` |
| House guide pages | `content/info/*.md` |
| Colours, radius, font | `src/styles/theme.css` |

Area colours: `butter`, `lavender`, `peach`, `mint`, `cream`, `sky`. Doodles: `sofa`, `pot`, `bath`, `door`, `broom`, `sparkle` (in `src/components/Doodle.tsx`). Add `"avatar": "anything"` to a person in `config.json` to get a different face.

**Rotation:** in `startWeek` everyone gets the area at their position in `areas`. Each week everyone moves one area forward. Changing an item's text in a checklist resets that one tick.

## How it works

- **App:** Vite + React + TypeScript, `wouter` hash routes, Tailwind v4 with shadcn-style tokens, Motion, canvas-confetti, Phosphor icons.
- **Content:** markdown in `/content` and avatars are turned into a JS module at build time (`plugins/content.ts`), so they work offline.
- **Ticks:** saved on the phone first (IndexedDB), queued in an outbox, sent to `POST /api/tick` when online. `GET /api/week?w=2026-W41` returns everyone's ticks. Newest timestamp wins per item, and each person only writes their own ticks.
- **Local API:** `plugins/local-api.ts` serves `/api/*` from `vite dev` / `vite preview` and stores ticks in `data/ticks.json` (git-ignored).
- **Vercel API (ready, not deployed):** `api/week.ts` + `api/tick.ts` use the same logic (`server/logic.ts`) with Upstash Redis (`server/redis-store.ts`).
- **PWA:** `vite-plugin-pwa` precaches the app, fonts and content.

The PIN only stops accidental ticks for someone else. It is not real security; keep the repo private.

## Deploy later (Vercel)

1. Push to a private GitHub repo and import it in Vercel (framework: Vite).
2. In Vercel → Storage, add **Upstash Redis** to the project (sets `KV_REST_API_URL` / `KV_REST_API_TOKEN`).
3. Deploy, open the URL on each phone, add to home screen.

## Credits

- Avatars: [Open Peeps](https://www.openpeeps.com/) by Pablo Stanley (CC0), rendered with [DiceBear](https://www.dicebear.com/).
- Area doodles: drawn for this project in the Open Doodles style.
- Icons: [Phosphor](https://phosphoricons.com/) (MIT). Font: DM Sans (OFL).
