import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-app text-text-primary">
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/app"
        appearance={clerkAppearance}
      />
    </main>
  );
}
