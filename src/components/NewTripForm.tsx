"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export function NewTripForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dayCount, setDayCount] = useState("");

  const createTrip = trpc.trip.create.useMutation();

  const isSubmitting = isPending || createTrip.isPending;

  const handleSubmit = () => {
    const parsedDays = parseInt(dayCount, 10);
    if (!name.trim() || !startDate || isNaN(parsedDays) || parsedDays < 1) {
      return;
    }

    createTrip.mutate(
      {
        name: name.trim(),
        startDate: new Date(startDate),
        dayCount: parsedDays,
      },
      {
        onSuccess: ({ id }) => {
          startTransition(() => {
            router.push(`/trips/${id}`);
          });
        },
      },
    );
  };

  return (
    <details
      className="px-3 mt-7"
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
        borderBottom: "1px solid var(--color-border-subtle)",
      }}
    >
      <summary
        className="px-5 py-4 text-[13px] cursor-pointer list-none"
        style={{ color: "var(--color-text-muted)" }}
      >
        + New trip
      </summary>

      <div className="px-5 pb-5 pt-1 flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span
            className="text-[11px] tracking-[0.16em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Name
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Japan 2026"
            className="bg-transparent border-b py-1 text-[15px] outline-none"
            style={{
              borderColor: "var(--color-border-soft)",
              color: "var(--color-text-strong)",
            }}
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span
            className="text-[11px] tracking-[0.16em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Start date
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-b py-1 text-[15px] outline-none"
            style={{
              borderColor: "var(--color-border-soft)",
              color: "var(--color-text-strong)",
              colorScheme: "dark",
            }}
            disabled={isSubmitting}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span
            className="text-[11px] tracking-[0.16em] uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            Days
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={60}
            value={dayCount}
            onChange={(e) => setDayCount(e.target.value)}
            placeholder="14"
            className="bg-transparent border-b py-1 text-[15px] outline-none w-20"
            style={{
              borderColor: "var(--color-border-soft)",
              color: "var(--color-text-strong)",
            }}
            disabled={isSubmitting}
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !name.trim() || !startDate || !dayCount}
          className="self-start text-[13px] px-4 py-2 rounded-full"
          style={{
            border: "1px solid var(--color-border-soft)",
            color: "var(--color-text-strong)",
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          {isSubmitting ? "Creating…" : "Create trip"}
        </button>

        {createTrip.error && (
          <div
            className="text-[12px]"
            style={{ color: "var(--color-cadence-brutal)" }}
          >
            {createTrip.error.message}
          </div>
        )}
      </div>
    </details>
  );
}
