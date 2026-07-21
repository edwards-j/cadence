"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.push("/sign-in");
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-[11px] tracking-[0.16em] uppercase"
      style={{ color: "var(--color-text-muted)" }}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
