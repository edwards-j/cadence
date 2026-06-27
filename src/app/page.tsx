import { getCurrentTrip } from "@/db/queries";
import { calculateCadenceScore, cadenceBucket } from "@/lib/cadence";
import { AddActivityForm } from "@/components/AddActivityForm";
import { ActivityRow } from "@/components/ActivityRow";
import { CadenceCurve } from "@/components/CadenceCurve";

export const dynamic = "force-dynamic";

export default async function Home() {
  const trip = await getCurrentTrip();

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
  const cadenceByDayId = new Map(
    trip.days.map((day) => {
      const score = calculateCadenceScore(day.activities);
      return [day.id, cadenceBucket(score)] as const;
    }),
  );

  const curveData = trip.days.map((day) => {
    const cadence = cadenceByDayId.get(day.id)!;
    return {
      dayId: day.id,
      dayNumber: day.dayNumber,
      ...cadence,
    };
  });

  return (
    <main className="max-w-2xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-medium">{trip.name}</h1>
        <p className="text-sm text-muted mt-1">
          {trip.startDate.toLocaleDateString()} →{" "}
          {trip.endDate.toLocaleDateString()}
        </p>
      </header>

      <div className="mb-8">
        <CadenceCurve data={curveData} />
      </div>

      <div className="space-y-4">
        {trip.days.map((day) => {
          const cadence = cadenceByDayId.get(day.id)!;
          return (
            <div key={day.id} className="border border-subtle rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-medium">Day {day.dayNumber}</div>
                  <div className="text-sm text-muted">
                    {day.date.toLocaleDateString()}
                  </div>
                  {day.notes && (
                    <div className="text-xs text-faint mt-1 italic">
                      {day.notes}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-medium">{cadence.score}</div>
                  <div className="text-xs text-muted">{cadence.label}</div>
                </div>
              </div>
              <ul className="text-sm space-y-1">
                {day.activities.map((a) => (
                  <ActivityRow key={a.id} activity={a} />
                ))}
                <AddActivityForm dayId={day.id} />
              </ul>
            </div>
          );
        })}
      </div>
    </main>
  );
}
