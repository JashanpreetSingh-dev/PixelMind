import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/app" />
    </main>
  );
}
