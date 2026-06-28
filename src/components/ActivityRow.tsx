"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import {
  ACTIVITY_TYPE_META,
  nextActivityType,
  type ActivityType,
} from "@/lib/activity-types";

type Activity = {
  id: string;
  name: string;
  type: ActivityType;
  durationHours: number;
  location: string | null;
};

const fmtH = (h: number) => `${h}h`;
const snap = (h: number) => Math.max(0.5, Math.round(h * 2) / 2);

/**
 * Aperture activity row:
 *
 *   [glyph]  Name                 [-]  2.5h  [+]  ×
 *            Sights · 2.5 load
 *
 * Tapping the glyph cycles type; ± step duration by 0.5h; × deletes.
 * No modal edit form — direct manipulation everything.
 */
export function ActivityRow({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refresh = async () => {
    startTransition(() => router.refresh());
  };

  const updateActivity = trpc.activity.update.useMutation({
    onSuccess: refresh,
  });
  const deleteActivity = trpc.activity.delete.useMutation({
    onSuccess: refresh,
  });

  const meta = ACTIVITY_TYPE_META[activity.type];
  const contrib = (activity.durationHours * meta.weight).toFixed(1);
  const inflight =
    updateActivity.isPending || deleteActivity.isPending || isPending;

  const cycleType = () =>
    updateActivity.mutate({
      id: activity.id,
      type: nextActivityType(activity.type),
    });

  const step = (delta: number) =>
    updateActivity.mutate({
      id: activity.id,
      durationHours: snap(activity.durationHours + delta),
    });

  return (
    <li
      className="flex items-center gap-3 px-3 py-3"
      style={{
        borderTop: "1px solid var(--color-border-subtle)",
        opacity: inflight ? 0.6 : 1,
        transition: "opacity 0.15s ease",
      }}
    >
      <button
        type="button"
        onClick={cycleType}
        disabled={inflight}
        aria-label={`Type: ${meta.label}, tap to change`}
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          color: meta.color,
          background: "rgba(255,255,255,0.05)",
          flexShrink: 0,
          cursor: "pointer",
          border: 0,
        }}
      >
        {meta.glyph}
      </button>
      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] truncate"
          style={{ color: "var(--color-text)" }}
        >
          {activity.name}
        </div>
        <div
          className="text-[11px] mt-[1px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {meta.label} · {contrib} load
        </div>
      </div>
      <Stepper
        onClick={() => step(-0.5)}
        disabled={inflight || activity.durationHours <= 0.5}
        label="−"
      />
      <span
        className="text-[13px] text-center"
        style={{
          color: "var(--color-text)",
          width: 36,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtH(activity.durationHours)}
      </span>
      <Stepper onClick={() => step(0.5)} disabled={inflight} label="+" />
      <button
        type="button"
        onClick={() => deleteActivity.mutate({ id: activity.id })}
        disabled={inflight}
        aria-label="Delete"
        style={{
          width: 22,
          height: 25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-faint)",
          background: "transparent",
          border: 0,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        ×
      </button>
    </li>
  );
}

function Stepper({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 25,
        height: 25,
        borderRadius: 8,
        background: "rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text)",
        cursor: disabled ? "default" : "pointer",
        fontSize: 16,
        border: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  );
}
