# Hobby Direction: Potential, Positioning, Features, Costs

Phase: 4, Strategy (light, after the hobby pivot)
Project: roomies-startup
Date: 2026-10-10
Confidence: Medium for costs, Low for reach. No user outside the founder's home tested it yet.

---

## What changed

Roomies is a hobby. Money and the founder's time do not count. Success is now measured in homes that use Roomies every week, not in revenue. See Pivot notes in `../00-intake/brief.md`.

## What is possible

Each level needs the level before it.

| Level | What it looks like | Realistic reach | What unlocks it |
|---|---|---|---|
| 1. Your home | The four of you use it every week | 1 home | Deploy, reminders, final checklists |
| 2. Friends' homes | You make a home for friends by hand | 5 to 20 homes [Estimate] | Multi-home data model, setup by you |
| 3. Free hosted service | Anyone makes a home in 2 minutes and shares a link | 100 to 1,000 homes in Copenhagen in 1 to 2 years [Opinion] | Self-serve setup, Danish text, templates |
| 4. Kollegium kitchens | A kitchen rep sets up the weekly kitchen duty for 10 to 16 rooms | Many kitchens per building, spread by the kitchen meeting [Opinion] | Kitchen mode: more people than areas, pairs, quick move-in and move-out |
| 5. Scandinavia | Same app in Swedish and Norwegian | Unknown | Translations, no other change |

The big step is from level 2 to level 3. Up to level 2, the app stays as it is today. Level 3 needs a setup flow and an in-app editor, so a non-developer can run a home.

Level 4 has the best fit [Opinion]. Kollegium kitchens already run a weekly rotation, people move every semester, and nobody wants to make an account for a kitchen plan [Data, `../../competitors.md`].

## Positioning

Built on April Dunford's five parts.

Competitive alternatives. The paper plan on the fridge, the Messenger group and the kitchen rules PDF. Flatastic comes second [Data, `../../competitors.md`].

Unique attributes.
- No accounts. A link and a 4-digit PIN.
- A fixed rota of areas, with a checklist that says what "done" means in this home.
- Everyone sees who is done, live.
- Works offline. Free, no ads, no data sold.
- Friendly tone. It does not nag or shame.

Value. Nobody argues about whose turn it is or what "clean the kitchen" means. Nobody has to chase anyone.

Target. Shared homes of 3 to 16 equals with a weekly cleaning rotation, where people move in and out often. First Copenhagen flatshares and kollegium kitchens.

Market category. Do not call it a "chore app". Chore apps are for families and tasks. Position Roomies as the fridge cleaning plan, made live.

One-line position, draft:
- English: "Your fridge cleaning plan, on everyone's phone. No sign-up."
- Danish: "Rengøringsplanen fra køleskabet, nu på alles telefon. Uden login."

Proof point to get: one kollegium kitchen that uses it for a full semester.

## Features to focus on

In build order. Each step makes the next level possible.

| # | Feature | Why | Level |
|---|---|---|---|
| 1 | Deploy and reminders (Saturday morning, Sunday afternoon) | When nobody opens a chore app, it dies. Every competitor has reminders. | 1 |
| 2 | Swap and away in the app | Removes the need for a developer each week | 1 |
| 3 | PIN check on the server, one house code per home | Needed before the link is public | 2 |
| 4 | Multi-home data model (`homes/<id>` in Redis) | One deploy for all homes | 2 |
| 5 | Create a home in 2 minutes: names, areas from templates, start week | The key unlock for strangers | 3 |
| 6 | Danish and English | Most homes in the target speak Danish | 3 |
| 7 | Checklist editor and a template library (kitchen, bathroom, kollegium kitchen) | Homes copy their own rules | 3 |
| 8 | Fridge poster with QR code | Meets the real competitor where it hangs. The paper plan becomes the way in. | 3 |
| 9 | Kitchen mode: more people than areas, pairs, move-in and move-out | Fits kollegium kitchens | 4 |
| 10 | Swedish and Norwegian | Same product, new market | 5 |

Do not build these [Opinion]:
- Money splitting. MobilePay and Tricount do it free.
- Chat. The group chat exists.
- Leaderboards and points. They turn into blame.
- Native app-store apps. The PWA is enough until real demand shows.
- Personal accounts. They break the main advantage.

## Running costs

Build and design cost nothing, because the founder does both.

Usage per home. The current sync sends one GET every 30 s while the app is open, plus one POST per tick [Data, `../../architecture.md`]. So one home of 4 people uses about 2,000 server calls and 2,000 Redis commands per month [Estimate].

| Item | Free limit | Homes inside the free limit | After the free limit |
|---|---|---|---|
| Vercel Hobby (hosting, functions) | 1,000,000 function calls per month, 2 cron jobs once a day | about 500 homes [Estimate] | Pro, $20 per month |
| Upstash Redis | 500,000 commands per month, 256 MB | about 250 homes [Estimate] | Pay as you go, $0.20 per 100,000 commands. 1,000 homes cost about $4 per month [Estimate]. |
| Web push (reminders) | Free with your own VAPID keys | No limit that matters | Free |
| Domain | Not free | Not applicable | About 100 DKK per year |
| Google Play listing (optional, as a TWA, an Android wrapper around the PWA) | Not free | Not applicable | $25 once |
| Apple App Store (optional) | Not free | Not applicable | $99 per year |

Result [Estimate]: 0 DKK up to about 250 homes, plus a domain. About 30 to 200 DKK per month at 1,000 homes, depending on the plan.

Two rules to know.
- Vercel Hobby does not allow commercial use [Data, Vercel docs]. A free hobby service is fine. If you add ads, donations with perks or a paid plan, move to Pro or to another host.
- Hobby cron jobs run once a day at most, and only within the hour [Data, Vercel docs]. Two daily jobs are enough for a Saturday reminder and a Sunday reminder. Each job checks the day and does nothing on other days.

When usage grows, these changes lower it:
- Poll only while the app is visible, and stop polling after the user finished the checklist.
- Return "no change" from a small version key instead of the full week.
- If you outgrow the free tiers, Cloudflare Workers and KV have a large free tier and allow commercial use [Assumption, check before you move].

## Biggest risks for a hobby service

1. Retention. People stop opening chore apps after a few weeks [Opinion, `../00-intake/preflight.md`]. Reminders and the fridge poster are the answer to test.
2. Setup friction. If making a home takes longer than drawing a table on paper, homes stay on paper.
3. Abuse on a public service. Strangers can create homes with bad content. Keep homes private by link and code, and add a rate limit on home creation.
4. Personal data. Names and tick times are personal data under GDPR. A one-page privacy notice and a "delete this home" button cover it [Opinion].

## Next steps

1. Ship level 1: deploy, change PINs, reminders, swaps in the app.
2. Run it in your own home for 4 weeks. Write down who opens it without a reminder from you.
3. Ask one friend's flatshare and one kollegium kitchen rep to try it. This replaces the customer interviews (Phase 3.7).
4. After 4 weeks, if at least one of them still uses it, build level 3.

---

## Flags

Red Flags:
- None identified

Yellow Flags:
- Retention is unknown, even in the founder's own home.
- Vercel Hobby forbids commercial use. Any future money needs a new host plan.
- Usage numbers are estimates from the code, not measured.

## Sources
- [Upstash Redis pricing](https://upstash.com/pricing/redis) (Tier 1, vendor)
- [Vercel limits](https://vercel.com/docs/limits) (Tier 1, vendor)
- [Vercel cron jobs usage and pricing](https://docs.vercel.com/docs/cron-jobs/usage-and-pricing) (Tier 1, vendor)
- [`../../competitors.md`](../../competitors.md), [`../../architecture.md`](../../architecture.md), [`../../roadmap.md`](../../roadmap.md)
