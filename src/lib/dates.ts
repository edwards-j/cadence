type TripForDates = { startDate: Date };
type DayForDates = { dayNumber: number };

export function getDayDate(trip: TripForDates, day: DayForDates): Date {
  const d = new Date(trip.startDate);
  d.setDate(d.getDate() + (day.dayNumber - 1));
  return d;
}

export function getTripEndDate(
  trip: TripForDates & { days: DayForDates[] },
): Date {
  if (trip.days.length === 0) return new Date(trip.startDate);
  const maxDayNumber = Math.max(...trip.days.map((d) => d.dayNumber));
  return getDayDate(trip, { dayNumber: maxDayNumber });
}
