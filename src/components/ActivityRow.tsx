"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { ACTIVITY_TYPES, type ActivityType } from "@/lib/activity-types";

type Activity = {
  id: string;
  name: string;
  type: ActivityType;
  durationHours: number;
  location: string | null;
};

export function ActivityRow({ activity }: { activity: Activity }) {
  const utils = trpc.useUtils();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(activity.name);
  const [type, setType] = useState<ActivityType>(activity.type);
  const [durationHours, setDurationHours] = useState(
    String(activity.durationHours),
  );
  const [location, setLocation] = useState(activity.location ?? "");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateActivity = trpc.activity.update.useMutation({
    onSuccess: async () => {
      await utils.trip.getCurrent.invalidate();
      startTransition(() => {
        router.refresh();
        setIsEditing(false);
      });
    },
  });

  const deleteActivity = trpc.activity.delete.useMutation({
    onSuccess: async () => {
      await utils.trip.getCurrent.invalidate();
      startTransition(() => {
        router.refresh();
      });
    },
  });

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
    };
  }, []);

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      confirmTimerRef.current = setTimeout(() => {
        setConfirmingDelete(false);
        confirmTimerRef.current = null;
      }, 3000);
      return;
    }

    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
    deleteActivity.mutate({ id: activity.id });
  };

  const dataInflight =
    updateActivity.isPending || deleteActivity.isPending || isPending;

  if (isEditing) {
    return (
      <li className="border-t border-subtle pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateActivity.mutate({
              id: activity.id,
              name,
              type,
              durationHours: Number(durationHours),
              location: location || undefined,
            });
          }}
          className="space-y-2"
        >
          <input
            type="text"
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
          <div className="flex gap-2">
            <button type="submit" disabled={dataInflight}>
              {updateActivity.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(activity.name);
                setType(activity.type);
                setDurationHours(String(activity.durationHours));
                setLocation(activity.location ?? "");
              }}
              disabled={dataInflight}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex justify-between items-center">
      <span>{activity.name}</span>
      <div className="flex items-center gap-3">
        <span className="text-muted">
          {activity.durationHours}h · {activity.type}
        </span>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          disabled={dataInflight}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={dataInflight}
        >
          {deleteActivity.isPending
            ? "Deleting..."
            : confirmingDelete
              ? "Click again to confirm"
              : "Delete"}
        </button>
      </div>
    </li>
  );
}
