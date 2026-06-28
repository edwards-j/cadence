import { eq } from "drizzle-orm";
import { db } from "./index";
import { trips } from "./schema";
import { calculateCadenceScore, averageScore } from "@/lib/cadence";
import { getTripEndDate } from "@/lib/dates";

type TripCard = {
  id: string;
  name: string;
  startDate: Date;
  createdAt: Date;
  endDate: Date;
  dayCount: number;
  averageCadence: number;
  isEmpty: boolean;
};

export async function getAllTrips() {
  const rows = await db.query.trips.findMany({
    orderBy: (trips, { asc }) => [asc(trips.startDate)],
    with: {
      days: {
        orderBy: (days, { asc }) => [asc(days.dayNumber)],
        with: {
          activities: true,
        },
      },
    },
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming: TripCard[] = [];
  const past: TripCard[] = [];

  for (const trip of rows) {
    const dayScores = trip.days.map((d) => calculateCadenceScore(d.activities));

    let activityCount = 0;
    for (const d of trip.days) {
      activityCount += d.activities.length;
    }

    const endDate = getTripEndDate(trip);
    const endDayStart = new Date(endDate);
    endDayStart.setHours(0, 0, 0, 0);

    const card: TripCard = {
      id: trip.id,
      name: trip.name,
      startDate: trip.startDate,
      createdAt: trip.createdAt,
      endDate,
      dayCount: trip.days.length,
      averageCadence: averageScore(dayScores),
      isEmpty: activityCount === 0,
    };

    if (endDayStart < startOfToday) {
      past.push(card);
    } else {
      upcoming.push(card);
    }
  }

  past.reverse();

  return { upcoming, past };
}

export async function getTripById(id: string) {
  return db.query.trips.findFirst({
    where: eq(trips.id, id),
    with: {
      days: {
        orderBy: (days, { asc }) => [asc(days.dayNumber)],
        with: {
          activities: {
            orderBy: (activities, { asc }) => [asc(activities.orderIndex)],
          },
        },
      },
    },
  });
}
