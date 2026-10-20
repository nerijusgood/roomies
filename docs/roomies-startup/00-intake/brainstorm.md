# Brainstorm

Phase: 2, Brainstorm (Fast Track, 3 variations)
Project: roomies-startup
Date: 2026-10-10
Confidence: Low. All numbers are rough estimates to compare the paths, not forecasts.

---

## The ROI question in numbers

The founder asked about ROI against time. This rough math frames every variation below.

Time. The founder spends about 370 hours per year at 8 hours per week [Estimate]. The 8 hours is the middle of the range in `brief.md`.

Consumer price ceiling. Flatastic charges about $35 per household per year [Data, `../../competitors.md`]. That is about 240 DKK. Students in Copenhagen are price-sensitive [Data, BL 2024, in `../../competitors.md`].

Target. A side income of 100,000 DKK per year needs about 420 paying households at 240 DKK [Estimate].

Conversion. Freemium apps usually convert 2% to 5% of active users to paid [Assumption, general industry range, to check in Phase 7]. So 420 paying households need 8,400 to 21,000 active households.

Size check. Copenhagen and Frederiksberg have about 16,000 student homes [Data, 2020, in `../../competitors.md`]. Not all of them are shared, and not all shared homes want an app.

Conclusion [Opinion]: a consumer subscription in Copenhagen alone cannot reach a meaningful income. Either somebody else pays (an operator), or the return is not money.

## Variation A: Free app for private flatshares, paid house plan

Who: groups of 3 to 6 friends or strangers who rent a flat together in Copenhagen.
Model: free for the basic rota. A house plan (for example 20 to 25 DKK per month) adds reminders, Danish and English text, a shopping list and history [Assumption].

Exciting:
- This is the founder's own situation, so the founder knows the problem.
- No sign-up is a real advantage over Flatastic.
- Word of mouth works: one person moves out and brings the app to the next flat.

Risky or hard:
- The ROI math above. It needs a large share of the city.
- App-store search belongs to Flatastic and Sweepy.
- Chore apps lose users after a few weeks [Opinion, see `preflight.md`].

Competitive change: head-on with Flatastic, which is free with ads.

## Variation B: Tool for coliving operators and student housing (B2B)

Who: companies that rent rooms in shared flats or run kollegier and coliving houses in Copenhagen. They already manage cleaning, house rules and move-ins, and cleaning disputes are a support cost for them [Assumption].
Model: the operator pays per room per month, for example 10 to 20 DKK [Assumption]. Residents use it free with no accounts. The operator gets one dashboard for all houses, its own rules and checklists, and move-in and move-out of residents.

ROI check: 1,000 rooms at 10 to 20 DKK per month gives 120,000 to 240,000 DKK per year [Estimate]. That is 2 to 5 customers, not 400 households.

Exciting:
- Fewer, larger customers. The founder can sell in the evenings by email and meetings.
- No-account login is a strong fit, because residents change every few months.
- Markdown content fits operators: they already have rules PDFs.

Risky or hard:
- Needs real multi-home support: setup page, admin dashboard, operator login. This is the "multi-home app" from `analysis.md`, which is the largest build.
- B2B sales take time and the founder works full time.
- Unknown: do operators feel this pain enough to pay? Nobody asked them yet.

Competitive change: Flatastic and Sweepy do not sell to operators [Assumption, check in research]. Property management tools can already include tasks [Unknown].

## Variation C: Open-source template and case study (non-money ROI)

Who: developers and tech-savvy people who share a home, plus the founder's own career.
Model: no revenue. A "Deploy to Vercel" button, a setup guide, a case study on the founder's site and a write-up about the offline sync design.
Effort: about 20 to 40 hours [Estimate].

Exciting:
- Smallest time cost. The return is reputation, portfolio and possible job or client leads for an AI and app engineer.
- It also tests demand for free: If other homes want it, GitHub stars, forks and messages show it.
- It does not block A or B later.

Risky or hard:
- No money.
- Non-technical homes cannot deploy it.

Competitive change: none. It is not in the chore-app market.

## How the three compare

| | A: Flatshare app | B: Operators (B2B) | C: Template + case study |
|---|---|---|---|
| Build time to first test | Medium (reminders, Danish, swap in app) | High (multi-home, admin) | Low |
| Who pays | Households | Operators | Nobody |
| Customers needed for 100k DKK/year | about 420 paying, 8,000+ active | 2 to 5 | Not applicable |
| Fit with evenings and weekends | Medium | Low for sales, high for build | High |
| Main unknown | Do households pay at all? | Do operators feel the pain? | Does anyone care? |

## Converge (to fill in after the founder replies)

Open questions for the founder:
- Which variation feels right? Elements can mix, for example C first as a cheap demand test, then B.
- What is one hour of the founder's evening time worth, in DKK? This sets the ROI bar.
- Does the founder know any coliving or student housing operators in Copenhagen?

---

## Flags

Red Flags:
- Variation A: the consumer math does not reach a meaningful income in Copenhagen at today's market prices [Estimate].

Yellow Flags:
- Variation B depends on a pain that no operator stated yet.
- All variations depend on retention after the first month, which is unknown.

## Sources
- [`brief.md`](brief.md), [`preflight.md`](preflight.md)
- [`../../competitors.md`](../../competitors.md) (Flatastic price, BL 2024, student home counts)
- [`../../analysis.md`](../../analysis.md) (the four paths)
