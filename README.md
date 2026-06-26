# Cadence

A trip intensity planner. Add activities to days, watch an honest pacing curve emerge. Built to answer the question: *am I doing too much?*

## What it does

Each activity gets a **Cadence Score** — weighted hours mapped to a 0–10 intensity scale. Transit and hiking cost more than lunch. Scores roll up into a per-day bar and a trip-level pacing curve so you can see at a glance where your trip is going to hurt.

| Score | Label |
|-------|-------|
| 0–3 | Chill |
| 3–5 | Light |
| 5–7 | Balanced |
| 7–8.5 | Heavy |
| 8.5+ | Brutal |

Activity type weights (tunable in [src/lib/cadence.ts](src/lib/cadence.ts)):

| Type | Multiplier |
|------|-----------|
| Rest | 0.2× |
| Food / Leisure | 0.5× |
| Sightseeing | 1.0× |
| Nightlife | 1.3× |
| Transit | 1.5× |
| Hike / Physical | 2.0× |

## Roadmap

### MVP — "The Honest Mirror"
Trip container, day-by-day activity log, per-day intensity bars, trip-level pacing curve. No maps, no APIs, no suggestions. Just honest accounting.

### V2 — "The Aware Planner"
Geographic clustering warnings, rolling fatigue debt across days, realistic transit cost injection, and a flag system that surfaces problems like back-to-back transit days or nightlife before an early flight.

### V3 — "The Collaborator"
Suggest-a-fix button to rebalance brutal days, wishlist-to-schedule seeding by geographic area, AI-powered itinerary review from a free-text trip style note, reusable pacing templates from past trips, and collaborative planning that surfaces preference conflicts between travel partners.

## Stack

- **Next.js 16** — app framework
- **tRPC 11** — end-to-end type-safe API
- **Drizzle ORM** + **libSQL** — SQLite-backed persistence
- **TanStack Query** — server state
- **Tailwind CSS v4** — styling

## Getting started

```bash
yarn install
yarn db:migrate
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database scripts

```bash
yarn db:generate   # generate migrations from schema changes
yarn db:migrate    # apply migrations
yarn db:studio     # open Drizzle Studio
```
