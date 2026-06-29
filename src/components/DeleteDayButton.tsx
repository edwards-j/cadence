"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { trpc } from "../trpc/client";

export function DeleteDayButton({
  dayId,
  tripId,
}: {
  dayId: string;
  tripId: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deleteDay = trpc.trip.deleteDay.useMutation({
    onSuccess: () => {
      startTransition(() => {
        router.push(`/trips/${tripId}`);
      });
    },
  });

  const busy = deleteDay.isPending || isPending;

  if (!confirming) {
    return (
      <button
        type="button"
        role="menuitem"
        onClick={() => setConfirming(true)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 13,
          color: "var(--color-cadence-brutal)",
          background: "transparent",
          border: 0,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(251,91,91,0.08)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        Delete day
      </button>
    );
  }

  return (
    <div style={{ padding: 4, display: "flex", flexDirection: "column", gap: 6 }}>
      <p
        style={{
          margin: 0,
          padding: "4px 8px",
          fontSize: 12,
          color: "var(--color-text-muted)",
        }}
      >
        Delete this day?
      </p>
      <div style={{ display: "flex", gap: 4 }}>
        <button
          type="button"
          onClick={() => deleteDay.mutate({ id: dayId })}
          disabled={busy}
          style={{
            flex: 1,
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--color-cadence-brutal)",
            background: "rgba(251,91,91,0.12)",
            border: 0,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.5 : 1,
            transition: "background 0.15s ease, opacity 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!busy) e.currentTarget.style.background = "rgba(251,91,91,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(251,91,91,0.12)";
          }}
        >
          {busy ? "Deleting…" : "Confirm"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={busy}
          style={{
            flex: 1,
            padding: "6px 12px",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--color-text-muted)",
            background: "transparent",
            border: 0,
            cursor: busy ? "default" : "pointer",
            opacity: busy ? 0.5 : 1,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!busy) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
