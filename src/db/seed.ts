import { db } from "./index";
import { trips, days, activities } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(activities);
  await db.delete(days);
  await db.delete(trips);

  // Insert a trip
  const [trip] = await db
    .insert(trips)
    .values({
      name: "Japan 2026",
      startDate: new Date("2026-10-15"),
      endDate: new Date("2026-10-28"),
    })
    .returning();

  console.log(`✓ Created trip: ${trip.name} (${trip.id})`);

  // Insert day 1
  const [day1] = await db
    .insert(days)
    .values({
      tripId: trip.id,
      date: new Date("2026-10-15"),
      dayNumber: 1,
      notes: "Arrival day - jet lag expected",
    })
    .returning();

  // Insert day 1 activites
  await db.insert(activities).values([
    {
      dayId: day1.id,
      name: "Flight SFO → HND",
      type: "transit",
      durationHours: 13,
      orderIndex: 0,
    },
    {
      dayId: day1.id,
      name: "Train to hotel",
      type: "transit",
      durationHours: 1.5,
      orderIndex: 1,
    },
    {
      dayId: day1.id,
      name: "Dinner near Shinjuku",
      type: "food",
      durationHours: 1.5,
      orderIndex: 2,
    },
  ]);

  // Insert Day 2 — a more balanced day for visual contrast
  const [day2] = await db
    .insert(days)
    .values({
      tripId: trip.id,
      date: new Date("2026-10-16"),
      dayNumber: 2,
    })
    .returning();

  // Insert day 2 activites
  await db.insert(activities).values([
    {
      dayId: day2.id,
      name: "Breakfast at hotel",
      type: "food",
      durationHours: 1,
      orderIndex: 0,
    },
    {
      dayId: day2.id,
      name: "Meiji Shrine",
      type: "sightseeing",
      durationHours: 2,
      orderIndex: 1,
    },
    {
      dayId: day2.id,
      name: "Lunch in Harajuku",
      type: "food",
      durationHours: 1.5,
      orderIndex: 2,
    },
    {
      dayId: day2.id,
      name: "Shibuya walking tour",
      type: "sightseeing",
      durationHours: 3,
      orderIndex: 3,
    },
    {
      dayId: day2.id,
      name: "Dinner + izakaya crawl",
      type: "nightlife",
      durationHours: 4,
      orderIndex: 4,
    },
  ]);

  // Insert Day 3 — a rest day for visual contrast
  const [day3] = await db
    .insert(days)
    .values({
      tripId: trip.id,
      date: new Date("2026-10-17"),
      dayNumber: 3,
      notes: "Recovery from jet lag",
    })
    .returning();

  await db.insert(activities).values([
    {
      dayId: day3.id,
      name: "Slow morning in hotel",
      type: "rest",
      durationHours: 3,
      orderIndex: 0,
    },
    {
      dayId: day3.id,
      name: "Lunch nearby",
      type: "food",
      durationHours: 1.5,
      orderIndex: 1,
    },
    {
      dayId: day3.id,
      name: "Onsen visit",
      type: "rest",
      durationHours: 2,
      orderIndex: 2,
    },
  ]);

  console.log(`✓ Created 3 days with activities`);
  console.log("✅ Seed complete");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
