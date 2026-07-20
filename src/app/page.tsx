import Link from "next/link";
import { getAllTrips } from "@/db/queries";
import { cadenceBucket } from "@/lib/cadence";
import { NewTripForm } from "@/components/NewTripForm";
import { formatDateRange } from "@/lib/format";

export const dynamic = "force-dynamic";

function TripCardRow({
  trip,
}: {
  trip: {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    dayCount: number;
    averageCadence: number;
    isEmpty: boolean;
  };
}) {
  const b = cadenceBucket(trip.averageCadence);

  return (
    <li>
      <Link
        href={`/trips/${trip.id}`}
        className="flex items-center gap-4 px-5 py-4"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="font-serif truncate"
            style={{ fontSize: 22, color: "var(--color-text-strong)" }}
          >
            {trip.name}
          </div>
          <div
            className="text-[12px] mt-[3px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            {formatDateRange(trip.startDate, trip.endDate)} · {trip.dayCount}{" "}
            days
          </div>
        </div>
        {!trip.isEmpty && (
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
        )}
        <span
          className="font-serif text-right"
          style={{
            fontSize: 24,
            color: trip.isEmpty
              ? "var(--color-text-faint)"
              : "var(--color-text-strong)",
            width: 40,
          }}
        >
          {trip.isEmpty ? "—" : trip.averageCadence.toFixed(1)}
        </span>
      </Link>
    </li>
  );
}

export default async function Home() {
  const { upcoming, past } = await getAllTrips();

  return (
    <main
      className="mx-auto"
      style={{
        maxWidth: 480,
        background: "var(--color-surface)",
        minHeight: "100dvh",
      }}
    >
      <section className="px-6 pt-10 pb-2">
        <div
          className="text-[11px] tracking-[0.2em] uppercase"
          style={{ color: "var(--color-text-muted)" }}
        >
          Trips · {upcoming.length + past.length}
        </div>
        <div className="flex">
          <img src="/assets/cadence-mark-paper.svg" alt="" width="34" />
          <h1
            className="font-serif leading-[0.9] mt-2 "
            style={{
              fontSize: 56,
              color: "var(--color-text-strong)",
            }}
          >
            Cadence
          </h1>
        </div>
      </section>

      <NewTripForm />

      {upcoming.length > 0 && (
        <section className="px-3 mt-7">
          <div
            className="px-5 pb-2 text-[11px] tracking-[0.16em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Upcoming
          </div>
          <ul>
            {upcoming.map((trip) => (
              <TripCardRow key={trip.id} trip={trip} />
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section className="px-3 mt-7">
          <details>
            <summary
              className="px-5 pb-2 text-[11px] tracking-[0.16em] uppercase cursor-pointer list-none"
              style={{ color: "var(--color-text-muted)" }}
            >
              Past · {past.length}
            </summary>
            <ul>
              {past.map((trip) => (
                <TripCardRow key={trip.id} trip={trip} />
              ))}
            </ul>
          </details>
        </section>
      )}

      <div style={{ height: 48 }} />
    </main>
  );
}
