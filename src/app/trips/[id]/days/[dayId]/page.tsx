import Link from "next/link";
import { notFound } from "next/navigation";
import { getTripById } from "@/db/queries";
import {
  cadenceBucket,
  calculateCadenceScore,
  totalHours,
} from "@/lib/cadence";
import { ActivityRow } from "@/components/ActivityRow";
import { AddActivityForm } from "@/components/AddActivityForm";
import { getDayDate } from "@/lib/dates";
import { MONTHS, WEEKDAYS, formatHours, twoDigit } from "@/lib/format";
import { KebabMenu } from "@/components/KebabMenu";
import { DeleteDayButton } from "@/components/DeleteDayButton";

export const dynamic = "force-dynamic";

export default async function DayPage({
  params,
}: {
  params: Promise<{ id: string; dayId: string }>;
}) {
  const { id, dayId } = await params;

  const trip = await getTripById(id);

  if (!trip) notFound();

  const day = trip.days.find((d) => d.id === dayId);
  if (!day) notFound();

  const date = getDayDate(trip, day);

  const score = calculateCadenceScore(day.activities);
  const b = cadenceBucket(score);
  const weekday = WEEKDAYS[date.getDay()];
  const dateLabel = `${MONTHS[date.getMonth()]} ${date.getDate()}`;

  const hours = totalHours(day.activities);
  const headline = day.activities[0]?.name ?? "Open day";

  return (
    <main
      className="mx-auto"
      style={{
        maxWidth: 480,
        background: "var(--color-surface)",
        minHeight: "100dvh",
      }}
    >
      {/* Header + score */}
      <section className="px-6 pt-8">
        <div className="flex items-center justify-between">
          <Link
            href={`/trips/${id}`}
            className="inline-flex items-center gap-1 text-[13px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            ‹&nbsp;Itinerary
          </Link>
          <KebabMenu>
            <DeleteDayButton dayId={day.id} tripId={trip.id} />
          </KebabMenu>
        </div>
        <div
          className="text-[11px] tracking-[0.16em] uppercase mt-4"
          style={{ color: "var(--color-text-muted)" }}
        >
          Day {twoDigit(day.dayNumber)} · {weekday} {dateLabel}
        </div>
        <h1
          className="font-serif mt-1 leading-none"
          style={{ fontSize: 36, color: "var(--color-text-strong)" }}
        >
          {headline}
        </h1>
        <div className="flex items-end gap-3 mt-5">
          <div
            className="font-serif leading-[0.85]"
            style={{ fontSize: 60, color: b.color }}
          >
            {score.toFixed(1)}
          </div>
          <div className="pb-[7px]">
            <div className="text-[14px]" style={{ color: "var(--color-text)" }}>
              {b.label}
            </div>
            <div
              className="text-[11px] mt-[2px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {day.activities.length} activities · {formatHours(hours)}
            </div>
          </div>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.08)",
            marginTop: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.round((score / 10) * 100)}%`,
              background: b.color,
              borderRadius: 3,
              transition: "width 0.3s ease",
            }}
          />
        </div>
        {day.notes ? (
          <div
            className="text-[12px] italic mt-4"
            style={{ color: "var(--color-text-faint)" }}
          >
            {day.notes}
          </div>
        ) : null}
      </section>

      {/* Activities */}
      <section className="px-3 mt-6">
        <div className="flex justify-between px-3 pb-2 text-[11px] tracking-[0.16em] uppercase">
          <span style={{ color: "var(--color-text-muted)" }}>Activities</span>
          <span
            style={{
              color: "var(--color-text-fainter)",
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            tap ◆ to change type
          </span>
        </div>
        <ul>
          {day.activities.map((a) => (
            <ActivityRow
              key={a.id}
              activity={{
                id: a.id,
                name: a.name,
                type: a.type,
                durationHours: a.durationHours,
                location: a.location,
              }}
            />
          ))}
        </ul>
      </section>

      {/* Add */}
      <section className="px-4 mt-5">
        <AddActivityForm dayId={day.id} />
      </section>
      <div style={{ height: 48 }} />
    </main>
  );
}
