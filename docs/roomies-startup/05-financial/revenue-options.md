# Revenue Options

Phase: 7, Financial (revenue model only)
Project: roomies-startup
Date: 2026-10-10
Confidence: Low

Financial Model Stage: A, Assumption-Based. All numbers are hypotheses to test, not forecasts. No one outside the founder's home uses Roomies yet.

---

## Short answer

Yes, but only one route can earn a meaningful amount: selling to organizations that run many rooms, such as coliving operators, student housing companies and kollegium administrations. All routes that charge households or individual users earn pocket money. That money covers running costs, but not much more.

## Base for the math

[Assumption] Level 3 from `../02-strategy/hobby-direction.md`: 500 active homes of 4 people, so 2,000 people.

## The options

| Route | How it works | Year income at 500 homes [Estimate] | Effect on growth | Effort |
|---|---|---|---|---|
| Donations | MobilePay box or "buy us a coffee". 0.5 to 1% of people give about 30 DKK. | 300 to 600 DKK | None | Very low |
| Supporter plan | Optional 10 DKK per month for extras such as themes or history. 1 to 2% of homes. | 600 to 1,200 DKK | None | Low |
| Household premium | 20 DKK per month for reminders, editor and kitchen mode. 2 to 5% of homes pay. | 2,400 to 6,000 DKK | Negative. A paywall slows word of mouth. | Medium |
| Shopping list links | "Running low" items link to an online grocery shop through an affiliate program. | A few hundred DKK [Assumption] | None | Medium |
| Sponsor | A cleaning brand or a housing organization pays for a logo or a template pack. | 0 to 20,000 DKK, one-off [Opinion] | Some trust risk | High, sales |
| Operators (B2B) | An operator pays 10 to 20 DKK per room per month for a dashboard of all its houses. Residents stay free. | 36,000 to 72,000 DKK for one operator with 300 rooms | Positive. Each operator brings many homes. | High: level 4, admin, invoices, sales |

## Recommendation [Opinion]

1. Keep Roomies free for households forever. Free use is how it spreads from one flat to the next.
2. Add a donation link at level 3. It covers the domain and Redis. It also shows whether people care.
3. Test the operator route before you build for it. Send a one-page pitch to 3 to 5 operators or kollegium administrations. One operator that says "send us an invoice" is the signal. Polite interest is not.
4. Build the operator dashboard only after that signal and after a kitchen used Roomies for a semester.

## What changes when money comes in

- Vercel Hobby does not allow commercial use [Data, Vercel docs]. Move to Vercel Pro ($20 per month) or to another host, for example Cloudflare, before the first payment.
- Payments need a provider, for example Stripe or MobilePay Subscriptions, and terms of service.
- In Denmark, hobby income is taxed as personal income. A business with a turnover above 50,000 DKK in 12 months must register for VAT (moms) [Assumption, make sure that this is right with Skattestyrelsen].
- The B2B route turns a hobby into a small business with customers, support and invoices. Before you start it, decide whether you want that.

---

## Flags

Red Flags:
- None identified

Yellow Flags:
- All income routes except B2B stay below about 6,000 DKK per year at 500 homes [Estimate].
- B2B demand is untested. No operator was asked.
- A household paywall can stop the spread that every other route depends on.

## Sources
- [`../02-strategy/hobby-direction.md`](../02-strategy/hobby-direction.md), [`../00-intake/brainstorm.md`](../00-intake/brainstorm.md)
- [Vercel limits](https://vercel.com/docs/limits) (Tier 1, vendor)
- Conversion and donation rates are general assumptions, not sourced data.
