import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif">Sign up</h1>
        <p className="text-sm text-muted">Start planning your trips.</p>
      </div>
      <SignUpForm />
    </main>
  );
}
