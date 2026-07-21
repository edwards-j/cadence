import Link from "next/link";
import { getTripById } from "@/db/queries";
import {
  averageScore,
  cadenceBucket,
  calculateCadenceScore,
  peakScore,
  totalHours,
} from "@/lib/cadence";
import { CadenceCurve } from "@/components/CadenceCurve";
import { getDayDate, getTripEndDate } from "@/lib/dates";
import { notFound } from "next/navigation";
import { AddDayButton } from "@/components/AddDayButton";
import {
  MONTHS,
  WEEKDAYS,
  formatHours,
  formatDateRange,
  twoDigit,
} from "@/lib/format";
import { KebabMenu } from "@/components/KebabMenu";
import { DeleteTripButton } from "@/components/DeleteTripButton";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { id: userId } = await requireUser();
  const trip = await getTripById({ id, userId });

  if (!trip) notFound();

  // Derive everything for the overview view.
  const dayScores = trip.days.map((d) => ({
    dayId: d.id,
    dayNumber: d.dayNumber,
    score: calculateCadenceScore(d.activities),
  }));

  const scores = dayScores.map((d) => d.score);
  const avg = averageScore(scores);
  const peak = peakScore(scores);
  const avgB = cadenceBucket(avg);

  const curveData = dayScores.map((d) => {
    const b = cadenceBucket(d.score);
    return { ...d, color: b.color };
  });

  return (
    <main
      className="mx-auto"
      style={{
        maxWidth: 480,
        background: "var(--color-surface)",
        minHeight: "100dvh",
      }}
    >
      {/* Header */}
      <section className="px-6 pt-10 pb-2">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[13px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            ‹&nbsp;Trips
          </Link>
          <KebabMenu>
            <DeleteTripButton tripId={trip.id} />
          </KebabMenu>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div>
            <h1
              className="font-serif leading-[0.9]"
              style={{
                fontSize: 56,
                color: "var(--color-text-strong)",
              }}
            >
              {trip.name}
            </h1>
            <div
              className="text-[13px] mt-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              {formatDateRange(trip.startDate, getTripEndDate(trip))} ·{" "}
              {trip.days.length} days
            </div>
          </div>
          <div className="text-right">
            <div
              className="font-serif leading-none"
              style={{ fontSize: 48, color: avgB.color }}
            >
              {avg.toFixed(1)}
            </div>
            <div
              className="text-[10px] tracking-[0.14em] uppercase mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              avg · {avgB.label}
            </div>
          </div>
        </div>
      </section>

      {/* Pacing curve */}
      <section
        className="mx-6 mt-5 p-5 pb-4"
        style={{
          border: "1px solid var(--color-border-soft)",
          borderRadius: 20,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0))",
        }}
      >
        <div className="flex justify-between items-baseline px-1">
          <span
            className="font-serif"
            style={{ fontSize: 20, color: "var(--color-text-strong)" }}
          >
            Pacing curve
          </span>
          <span
            className="text-[11px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            peak {peak.toFixed(1)}
          </span>
        </div>
        <CadenceCurve data={curveData} />
      </section>

      {/* Itinerary */}
      <section className="px-3 mt-7">
        <div
          className="px-5 pb-2 text-[11px] tracking-[0.16em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Itinerary
        </div>

        <ul>
          {trip.days.map((day) => {
            const score = calculateCadenceScore(day.activities);
            const b = cadenceBucket(score);
            const date = getDayDate(trip, day);

            const weekday = WEEKDAYS[date.getDay()];
            const dateLabel = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
            const hours = totalHours(day.activities);

            // Pull the first activity name as a working title for the day
            // so the list reads like the Aperture mock without a title field.
            const headline = day.activities[0]?.name ?? "Open day";

            return (
              <li key={day.id}>
                <Link
                  href={`/trips/${id}/days/${day.id}`}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{
                    borderTop: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div
                    className="font-serif"
                    style={{
                      fontSize: 24,
                      color: "var(--color-text-faint)",
                      width: 28,
                    }}
                  >
                    {twoDigit(day.dayNumber)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[15px] font-medium truncate"
                      style={{ color: "var(--color-text)" }}
                    >
                      {headline}
                    </div>
                    <div
                      className="text-[12px] mt-[3px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {weekday} {dateLabel} · {day.activities.length} stops ·{" "}
                      {formatHours(hours)}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: b.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-serif text-right"
                    style={{
                      fontSize: 24,
                      color: "var(--color-text-strong)",
                      width: 40,
                    }}
                  >
                    {score.toFixed(1)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="px-5 mt-5">
          <AddDayButton tripId={id} />
        </div>
        <div style={{ height: 48 }} />
      </section>
    </main>
  );
}
