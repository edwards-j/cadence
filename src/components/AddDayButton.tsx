"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export function AddDayButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const createDay = trpc.trip.createDay.useMutation();
  const utils = trpc.useUtils();

  const isSubmitting = isPending || createDay.isPending;

  const handleClick = () => {
    createDay.mutate(
      { tripId },
      {
        onSuccess: () => {
          startTransition(async () => {
            await utils.trip.invalidate();
            router.refresh();
          });
        },
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className="w-full text-[13px] py-4 rounded-2xl"
      style={{
        border: "1px dashed var(--color-border-soft)",
        color: "var(--color-text-muted)",
        opacity: isSubmitting ? 0.5 : 1,
      }}
    >
      {isSubmitting ? "Adding…" : "+ Add day"}
    </button>
  );
}
