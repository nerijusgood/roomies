# Roadmap

Ordered by value for the household. Each step is small.

## Now – before sharing the link

- [ ] Change the four PINs in `config.json`
- [ ] Check the GitHub repo is private
- [ ] Finish the real checklists with the household
- [ ] Deploy to Vercel and add Upstash Redis (see README → Deploy later)
- [ ] Install on each phone (iOS and Android) and test offline tick → sync
- [ ] Share the link in the group chat

## Next – make it run by itself

- [ ] **Reminders.** Web push: Saturday morning "Your area: Bathrooms", Sunday afternoon if not done. Needs a small cron (Vercel Cron) and saved push subscriptions.
- [ ] **Swap / away in the app.** Save overrides in Redis instead of `config.json`, so no redeploy is needed.
- [ ] **Keep PINs off the phone.** Check the PIN on the server only; add a shared house code for reading data.
- [ ] **Repeat items.** `repeat: 3` in the checklist front matter instead of "(1 of 3)" copies.

## Later – nice to have

- [ ] **Shopping list.** Tap "running low" on an item from the house guide; everyone sees the list.
- [ ] **Gentle history.** "4 weeks in a row all done" style wins, not a leaderboard.
- [ ] **Edit content in the app.** Change checklists and guide pages without git.
- [ ] **Stable item ids.** So fixing a typo does not reset a tick.

## Maybe – if other homes want it

- [ ] Open-source template with a "Deploy to Vercel" button and setup guide
- [ ] Case study on the personal site
- [ ] Multi-home version (real login, setup flow) – only with clear demand
