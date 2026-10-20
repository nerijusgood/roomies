# Overview

## The problem

Four people share one home. Each weekend, each person cleans one area. The areas rotate every week.

Today this lives in people's heads and the group chat. So it is easy to forget whose turn it is, what "clean the kitchen" really means, and whether someone already did their part.

## The idea

**Roomies** is a small, friendly web app for our home. Open it and you see:

1. **Your area this week**, and how long until the deadline (Sunday 21:00).
2. **A checklist** for that area. Tick items as you go.
3. **The whole house**: who is done, who has started, who has not.

It works on the phone like an app (add to home screen), and it keeps working offline.

## Who it is for

- The household: Noeleen, Nerijus, Agnese and Stefano.
- No accounts, no emails. You pick your name and type a 4-digit PIN once. The phone remembers you.

## What it does today

| Screen | What you can do |
|---|---|
| Who are you? | Pick your name, enter PIN |
| My week | See your area, progress and countdown; see the other three |
| Checklist | Tick items; confetti when you finish |
| Roomie checklist | See someone else's list and when they ticked each item (view only) |
| Schedule | 2 weeks back and 4 weeks ahead, with status colours |
| House guide | Short pages: supplies, bins, oven, rules, low supplies |
| Settings | Switch user, see sync status |

The four areas: **Floors & Couch**, **Drawers & Fridge**, **Kitchen Surfaces**, **Bathrooms**. Over 4 weeks you do each one once.

## Status

- Built and working **locally** (3 commits). Phones on the same wifi sync through the Mac.
- The rota started in week 41 (5 Oct 2026). Real names and areas are in.
- Not deployed yet. The Vercel + Redis code is written but not switched on.
- Checklists are still drafts.

## Design goals

- **Fast.** Open, see, tick. No more than 2 taps to your checklist.
- **Friendly.** Pastel colours, doodles, avatars, kind wording. It should not feel like a chore app nagging you.
- **Fair and visible.** Everyone sees the same thing. No arguing about whose turn it was.
- **Free to run.** Vercel Hobby + Upstash free tier = €0.
