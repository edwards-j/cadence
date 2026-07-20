"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message ?? "Sign in failed");
        return;
      }

      router.push("/");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="rounded border border-subtle bg-transparent px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-muted">Password</span>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          className="rounded border border-subtle bg-transparent px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-brutal">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded border border-subtle px-4 py-2 disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-sm text-faint">
        Need an account?{" "}
        <a href="/sign-up" className="underline">
          Sign up
        </a>
      </p>
    </form>
  );
}
