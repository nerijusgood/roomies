# Analysis

A look at the idea and the code as of commit `88b01fc` (7 Oct 2026).

## Summary

Roomies solves a small, real problem well. The scope is tight, the code is clean, and the offline sync is designed with care. The main gaps are **not in the code but around it**: it is not deployed yet, there are no reminders, and changing the rota still needs a developer.

## Strengths

- **Clear, small scope.** One job: who cleans what this week, and is it done. No feature creep.
- **Logic is pure and tested.** Weeks, rotation, overrides, deadlines and tick merging live in `src/shared/` with no UI or network. One test file covers the tricky parts (year change, wrap-around, overrides, old offline ticks).
- **Sync is simple and safe.** Each person only writes their own ticks, and the newest timestamp wins. So there are no real conflicts to solve. Unticks are kept as `done: false`, which makes offline work correct.
- **One API logic, three backends.** `server/logic.ts` runs in local dev, on Vercel and in the demo file. Less code to break.
- **Content is just markdown.** Anyone who can edit a text file can change a checklist or a house guide page.
- **Costs €0** to run on Vercel Hobby + Upstash free tier.
- **Feels nice.** Pastel tiles, doodles, avatars, confetti, kind copy. This matters: people will only use a chore app they like opening.

## Risks and gaps

### 1. PINs are visible in the app code (medium)
`src/lib/data.ts` imports `config.json` into the browser bundle, and the login check runs on the phone. Anyone with the URL can read all PINs in the JS. `GET /api/week` also has no check at all.
This is fine on home wifi. Once it is on a public Vercel URL, anyone who finds it can see names, the house guide and progress.
**Fix ideas:** check the PIN only on the server and leave PINs out of the bundle; add one shared "house code" stored as a Vercel env var; or turn on Vercel's deployment protection.

### 2. PINs are still the defaults (high, easy)
`config.json` still has `1111`, `2222`, `3333`, `4444`. Change them before sharing the link.

### 3. Repo privacy
The README says "keep the repo private", because PINs live in `config.json`. Check that `github.com/nerijusgood/roomies` really is private, or move PINs to an env var.

### 4. No reminders (high impact)
The app only helps if people open it. Right now nothing tells them to. A push on Saturday morning and a nudge on Sunday afternoon would likely matter more than any other feature.
Note: on iPhone, web push only works after the app is added to the home screen.

### 5. Swaps and "away" need a code change
Overrides live in `config.json`, so every swap means editing JSON and redeploying. In practice only Nerijus can do it. An in-app "swap with…" or "I'm away" button would make the app self-running.

### 6. Repeated tasks are a workaround
Items like "Vacuum the front door area (1 of 3)" and "Wipe the countertop (2 of 3)" fake mid-week tasks with numbered copies. It works, but a `repeat: 3` field would be cleaner and easier to edit. It also shows the real pattern: some areas need care during the week, not just at the weekend.

### 7. Editing item text resets ticks (low)
Item ids are made from the text. Fixing a typo mid-week clears that tick for the person who did it. Fine if you only edit checklists between weeks.

### 8. "Missed" is public (design choice)
Everyone sees a red dot when someone misses the deadline. This keeps things fair, but it can feel like blame. Worth talking about with the household. A softer word or colour could help.

### 9. Small things
- Week and deadline use each phone's local time. Fine while everyone is home.
- No limit on wrong PIN tries. Low risk for this use.
- Redis keeps each week for ~400 days, then history is gone.
- `Claude outputs/roomies-screens.png` still shows old demo names (Emma, Lukas, Sofie).
- `PLAN.md` still lists "Real names, PINs, areas and checklists" as open. Names and areas are done; PINs and final checklists are not.

## Potential

### For the house: high
This is where the value is. It removes "whose turn is it?" talk, makes "clean the kitchen" mean the same thing to everyone, and shows effort fairly. It is close to done: deploy + reminders would make it a daily tool.

### As a product: limited, but there are options
The market for chore apps is crowded (for example Flatastic, Tody, Sweepy, OurHome). They have accounts, payments and app-store apps. Roomies is different in a few ways:

- No sign-up at all.
- Works offline.
- Content is plain markdown.
- One home, one simple rota.

These are also the reasons it is hard to turn into a multi-home service. That would need real login, a setup flow and an in-app editor.

**Realistic paths:**
1. **Keep it personal.** Lowest effort, most value.
2. **Open-source template.** "Fork, edit `config.json` and `content/`, deploy to Vercel." A deploy button and a short setup guide. Little extra work, useful to other shared homes.
3. **Portfolio case study.** Shows design system, offline-first PWA and sync design in one small project. A good fit for a personal site write-up.
4. **Multi-home app.** Only worth it if 1–3 show real demand.
