import { db } from "@/db";
import { calculateCadenceScore, cadenceLabel } from "@/lib/cadence";

export default async function Home() {
  const trip = await db.query.trips.findFirst({
    with: {
      days: {
        with: { activities: true },
        orderBy: (days, { asc }) => [asc(days.dayNumber)],
      },
    },
  });

  if (!trip) {
    return (
      <main className="max-w-2xl mx-auto p-8">
        <p>
          No trips yet. Run <code>yarn tsx src/db/seed.ts</code> to seed the
          database.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-medium">{trip.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {trip.startDate.toLocaleDateString()} →{" "}
          {trip.endDate.toLocaleDateString()}
        </p>
      </header>

      <div className="space-y-4">
        {trip.days.map((day) => {
          const score = calculateCadenceScore(day.activities);
          return (
            <div key={day.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">Day {day.dayNumber}</div>
                  <div className="text-sm text-gray-500">
                    {day.date.toLocaleDateString()}
                  </div>
                  {day.notes && (
                    <div className="text-xs text-gray-400 mt-1 italic">
                      {day.notes}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-medium">{score}</div>
                  <div className="text-xs text-gray-500">
                    {cadenceLabel(score)}
                  </div>
                </div>
              </div>
              <ul className="text-sm space-y-1">
                {day.activities.map((a) => (
                  <li key={a.id} className="flex justify-between text-gray-700">
                    <span>{a.name}</span>
                    <span className="text-gray-500">
                      {a.durationHours}h · {a.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}
