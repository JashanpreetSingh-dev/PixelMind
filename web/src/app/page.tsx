import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/app");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-app px-6 text-text-primary">
      <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          PixelMind
        </h1>
        <p className="text-balance text-lg leading-relaxed text-text-muted">
          A home screen app that turns your habits, nightly reflections, and
          patterns into a living mosaic of your life.
        </p>
        <div className="mt-2 grid w-full gap-3 sm:grid-cols-2">
          <a
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg-app transition hover:bg-accent-hover"
          >
            Get started
          </a>
          <a
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-full border border-border-default px-5 py-3 text-sm font-medium text-text-primary transition hover:bg-bg-surface hover:border-text-faint"
          >
            I already have an account
          </a>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.2em] text-text-faint">
          PWA · Habits · Journal · AI Memory
        </p>
      </section>
    </main>
  );
}
