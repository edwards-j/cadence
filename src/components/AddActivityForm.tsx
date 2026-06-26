"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/activity-types";
import { useRouter } from "next/navigation";

export function AddActivityForm({ dayId }: { dayId: string }) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState<ActivityType>("sightseeing");
  const [durationHours, setDurationHours] = useState("");
  const [location, setLocation] = useState("");

  const createActivity = trpc.activity.create.useMutation({
    onSuccess: async () => {
      await utils.trip.getCurrent.invalidate();
      router.refresh();
      setName("");
      setDurationHours("");
      setLocation("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createActivity.mutate({
          dayId,
          name,
          type,
          durationHours: Number(durationHours),
          location: location || undefined,
        });
      }}
    >
      <input
        type="text"
        placeholder="Activity name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value as ActivityType)}
      >
        {ACTIVITY_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.25"
        min="0"
        placeholder="Duration (hours)"
        value={durationHours}
        onChange={(e) => setDurationHours(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button type="submit" disabled={createActivity.isPending}>
        {createActivity.isPending ? "Saving..." : "Add activity"}
      </button>
    </form>
  );
}
