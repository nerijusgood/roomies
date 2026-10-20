# Competitors in Denmark

A look at the apps and habits that Roomies competes with in Danish shared homes. Research done 10 Oct 2026 with web search. Prices are from app stores and third-party sites. Make sure that you check them again before you quote them in public.

The raw data for each competitor is in [competitors.yaml](competitors.yaml).

## Summary

No Danish app for shared-home chores came up in the research. The international apps (Flatastic, Sweepy, Tody) exist in the Danish App Store, but show few Danish reviews. Flatastic has 12 ratings in the Danish store, for example.

So the real competitor in Denmark is not an app. It is the paper plan on the fridge, the kitchen rules PDF, and the Messenger group.

The best fit for Roomies is the kollegium kitchen. Kollegier already run a weekly cleaning rotation between rooms, and people move in and out every semester. A no-account app with one link and a PIN fits that well. To win there, Roomies needs Danish text, a way to change the people list without code, and reminders.

## The market

There is no official count of Danish flatshares. These numbers give the size of the niches:

| Group | Size | Source |
|---|---|---|
| Youth homes incl. kollegier, all of Denmark | about 66,000 homes (2013) | Socialstyrelsen |
| Student homes in Copenhagen + Frederiksberg | 13,670 + 2,415 (2020) | Ministry answer to Folketinget |
| Copenhagen + Frederiksberg | 1 public youth home per 12 students (2024) | BL UngdomsboligRapporten 2024 |
| Bofællesskaber (co-housing) | about 400 communities, 10,000 homes (2022) | BUILD, Aalborg University |
| Young tenants in Europe who share a home | 48% of 18 to 34 year olds | HousingAnywhere survey |

Students who rent privately pay 42% more per person than students in public youth homes (BL 2024). This pushes students into shared flats and kollegier, and it makes them price-sensitive. A paid app is a hard sell to them.

Each kitchen sets its own rules. The GJK kollegium kitchen rules are an example. The weekly kitchen clean rotates between rooms, and everyone must take part. Each kitchen votes on its own extra rules at a kitchen meeting. This is the same model as the Roomies rota.

## The competitors

There are four groups.

### 1. Habits (the real competitor)

| What | Strength | Weakness |
|---|---|---|
| Paper plan on the fridge or kitchen door | Free, everyone sees it, no install | It does not show which tasks are done. It goes out of date after people move. |
| Kitchen rules PDF from the kollegium | Official, shared by all | Says what to do, not who does it this week |
| Messenger or Facebook group | Everyone already has it | Plans get lost in chat. Reminders turn into nagging. |
| Google Sheets | Free, flexible | Bad on a phone. One person must keep it up to date. |

Roomies must be easier than the fridge plan. If it takes longer to open the app than to look at the fridge, people will stop using it.

### 2. Chore apps for shared homes

| App | From | Price (indicative) | Shared use free? | Danish fit |
|---|---|---|---|---|
| Flatastic | Germany | Free with ads. Household plan about $35/year. | Yes, basic | English and German listed. 12 ratings in the Danish store. |
| Sweepy | Not checked | $3.99/month or $19.99/year | No, sharing needs Premium | English UI. Built for one home, not a rota. |
| Tody | Not checked | $10 to $30/year, sources disagree | No, sync needs Premium | Cleaning-focused, good for one person |
| RoomMate | Italy | Unknown | Unknown | Says it has 10,000 users, mostly in Italy |
| OurHome | Australia | Was free | No longer available | Listed as discontinued |

Flatastic is the closest competitor. It does chores, a shopping list and shared costs in one app, and it charges one price for the whole household. It is independent and does not sell data. Its weak points for Danish users are the language, the need for every person to create an account, and ads in the free version.

Sweepy and Tody are built for one person or a family in one home. They do not have a weekly rotation of areas between people. Both lock sharing behind a subscription.

### 3. Money apps (adjacent)

These do not compete on chores, but they own the "shared home app" slot on many Danish phones.

| App | Notes |
|---|---|
| MobilePay | Everyone in Denmark has it. Can request money and split a bill. Its group app WeShare closed on 1 Feb 2023. |
| Lunar ShareIt | Lunar launched it in 2023 to replace WeShare |
| Tricount (bunq) | Free, no limits, no ads |
| Splitwise | Free plan has a daily limit on new expenses. Pro costs $40/year. |

Roomies does not need to copy these. A link to MobilePay from a future shopping list is enough.

### 4. Family apps (adjacent)

Cozi, Home Routines and Homey (Slovenia, chores and pocket money for kids) show up in Danish "best cleaning app" articles. They are built for parents and children, not for equals who share a home.

## Where Roomies stands

| | Roomies | Flatastic | Sweepy | Fridge plan |
|---|---|---|---|---|
| Sign-up | None, name + PIN | Account per person | Account | None |
| Weekly rotation of areas | Yes, automatic | Yes, chore rotation | No, per task | Yes, by hand |
| Checklist per area | Yes, in markdown | Notes on chores (Premium) | Yes | Sometimes |
| See who is done | Yes, live | Yes | Yes (Premium) | No |
| Works offline | Yes | Partly | Partly | Yes |
| Reminders | No | Yes | Yes | No |
| Danish text | No | Not listed | No | Yes |
| Swap or away without code | No | Yes | Yes | Yes, with a pen |
| Shopping list, costs | No | Yes | No | No |
| Price for the house | €0, self-hosted | Free with ads, or about $35/year | $20/year | €0 |
| Native app in store | No, PWA | Yes | Yes | No |

### Where Roomies is better

- No accounts. This matters most in kollegier, where people move in and out each semester.
- A fixed rota with a clear checklist per area. Competitors list chores. Roomies tells you what "clean the kitchen" means in this home.
- Free, no ads, no data sold.
- Content is plain markdown that a kitchen can copy from its own rules PDF.

### Where Roomies is weaker

- No reminders. Every competitor has them. The roadmap already calls this the most important next step.
- No Danish text.
- Changing people or swaps needs a developer.
- Not in the App Store. Many people do not know how to add a web app to the home screen.
- One home per install. A kollegium with ten kitchens needs ten deploys.

## What this means

1. The household use case does not need any of this. Keep building for the four of you first.
2. If you want other homes to use it, aim at kollegium kitchens, not at the global chore-app market. Flatastic and Sweepy own app-store search. Kitchens are reachable by word of mouth and by the kitchen meeting.
3. To make that work, add in this order: reminders, Danish text, edit people and swaps in the app, more people than areas (already supported), then a simple setup page for a new kitchen.
4. Do not compete on money features. MobilePay and Tricount already do this for free.

## Comparison pages (only if you go public)

Comparison pages only make sense after Roomies is an open template or a multi-home app. If you get there, build them in this order:

| Priority | Page | Target search | Why |
|---|---|---|---|
| 1 | /da/rengoeringsplan-kollegie | "rengøringsplan kollegie", "køkkenplan kollegium" | No app ranks for this today. Danish, low competition. |
| 2 | /flatastic-alternative | "Flatastic alternative" | Closest competitor. Angle: no accounts, no ads. |
| 3 | /vs/sweepy | "Sweepy vs", "Sweepy free sharing" | Sweepy locks sharing behind Premium |
| 4 | /alternatives/chore-apps-for-roommates | "best chore app roommates" | High competition, low priority |

Search volumes were not checked. Use a keyword tool before you start, because Danish volumes are small.

## Open questions

- Is the Flatastic UI in Danish? AlternativeTo lists only English and German, but that can be out of date. Install it to make sure.
- How many people share one kollegium kitchen, on average? The answer tells you if Roomies needs pairs instead of "one area each".
- Do Danish kollegier already use a tool that did not show up in search (for example a board app from the administrator)? Ask a few kitchen representatives.

## Sources

- [Flatastic Premium](https://www.flatastic-app.com/en/premium/)
- [Flatastic in the App Store](https://apps.apple.com/app/id840810742)
- [Flatastic ratings in the Danish store (AppFollow)](https://apps.appfollow.io/ios/flatastic-chore-checklist/840810742?country=dk)
- [Flatastic on AlternativeTo](https://alternativeto.net/software/flatastic/about)
- [Flatastic price reports (JustUseApp)](https://justuseapp.com/en/app/840810742/flatastic-the-roommate-app/reviews)
- [Sweepy](https://sweepy.com/), [Sweepy pricing (App Pricing Lab)](https://www.apppricinglab.com/app/apple/1498897320), [Sweepy review (Cubby)](https://www.cubbyathome.com/sweepy-cleaning-app-review-80044734)
- [Tody (WILX, Nov 2025)](https://www.wilx.com/2025/11/11/what-tech-app-day-tody-app/), [Tody pricing (habitbox)](https://habitbox.app/blog/apps-for-moms), [Tody profile (marlvel)](https://marlvel.ai/apps/tody)
- [OurHome on AlternativeTo](https://alternativeto.net/software/ourhome/about/)
- [RoomMate (Unibo startup day)](https://site.unibo.it/startupdayunibo/en/roommate)
- [Homey (CB Insights)](https://www.cbinsights.com/company/homeylabs)
- [Danish cleaning apps article (Handyhand)](https://handyhand.dk/rengoering/app/a)
- [Splitwise free limits (IT Voice)](https://www.itvoice.in/splitwise-has-introduced-restrictions-on-the-number-of-free-expenses-users-can-add), [Tricount press](https://tricount.com/press)
- [MobilePay in the App Store](https://apps.apple.com/app/id624499138), [WeShare closing (Skagen Online)](https://www.skagenonline.dk/faq/er-mobilepay-box-det-samme-som-weshare)
- [GJK kitchen rules](https://gjk.dk/media/qwtncibn/koekkenreglement-2020-danskengelsk.pdf)
- [BL UngdomsboligRapporten 2024](https://bl.dk/media/gs1p3e24/ungdomsboligrapporten-2024.pdf), [Studieboliger i Danmark 2014 (Socialstyrelsen)](https://socialstyrelsen.dk:443/Media/638255278483131581/Studieboliger%20i%20Danmark%20-%20Rammer%20regler%20og%20muligheder%202014.pdf), [Ministry answer on student homes 2020](https://www.ft.dk/samling/20201/almdel/bou/spm/313/svar/1802540/2434136.pdf)
- [Bofællesskaber i Danmark (BUILD, AAU)](https://vbn.aau.dk/ws/portalfiles/portal/490617571/Kortlaegning_og_analyse_af_bofaellesskaber_i_Danmark.pdf)
- [Young Danes living at home (The Local)](https://www.thelocal.dk/20230626/young-danes-choose-to-live-at-home-for-longer), [Young tenants in Europe (HousingAnywhere via Datawrapper)](https://datawrapper.dwcdn.net/40kmO/2/)
