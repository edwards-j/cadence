"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_META,
  type ActivityType,
} from "@/lib/activity-types";

const fmtH = (h: number) => `${h}h`;
const snap = (h: number) => Math.max(0.5, Math.round(h * 2) / 2);

/**
 * Aperture add-activity card: dashed border, name input on a hairline
 * underline, type chips on a row, duration stepper, light "Add" button.
 */
export function AddActivityForm({ dayId }: { dayId: string }) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<ActivityType>("sightseeing");
  const [duration, setDuration] = useState(2);

  const createActivity = trpc.activity.create.useMutation({
    onSuccess: async () => {
      await utils.trip.getCurrent.invalidate();
      router.refresh();
      setName("");
      setDuration(2);
    },
  });

  const canSubmit = name.trim().length > 0 && !createActivity.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        createActivity.mutate({
          dayId,
          name: name.trim(),
          type,
          durationHours: duration,
        });
      }}
      style={{
        padding: 15,
        border: "1px dashed rgba(255,255,255,0.13)",
        borderRadius: 16,
      }}
    >
      <input
        type="text"
        placeholder="Add an activity…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          background: "transparent",
          border: 0,
          outline: "none",
          color: "var(--color-text)",
          fontSize: 15,
          padding: "2px 0 11px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 7,
          marginTop: 13,
        }}
      >
        {ACTIVITY_TYPES.map((t) => {
          const meta = ACTIVITY_TYPE_META[t];
          const active = type === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 11px",
                borderRadius: 9,
                fontSize: 12,
                cursor: "pointer",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active
                  ? "var(--color-text-strong)"
                  : "var(--color-text-muted)",
                border: `1px solid ${
                  active ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)"
                }`,
              }}
            >
              <span style={{ color: meta.color }}>{meta.glyph}</span>
              {meta.label}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <DurStep
            onClick={() => setDuration((d) => snap(d - 0.5))}
            disabled={duration <= 0.5}
            label="−"
          />
          <span
            style={{
              fontSize: 13,
              color: "var(--color-text)",
              width: 42,
              textAlign: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtH(duration)}
          </span>
          <DurStep
            onClick={() => setDuration((d) => snap(Math.min(16, d + 0.5)))}
            label="+"
          />
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          style={{
            padding: "10px 20px",
            borderRadius: 11,
            background: "var(--color-text-strong)",
            color: "var(--color-surface)",
            fontWeight: 600,
            fontSize: 13,
            cursor: canSubmit ? "pointer" : "default",
            border: 0,
            opacity: canSubmit ? 1 : 0.5,
          }}
        >
          {createActivity.isPending ? "Saving…" : "Add"}
        </button>
      </div>
    </form>
  );
}

function DurStep({
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
        width: 28,
        height: 28,
        borderRadius: 9,
        background: "rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text)",
        cursor: disabled ? "default" : "pointer",
        fontSize: 17,
        border: 0,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  );
}
