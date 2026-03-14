import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { HabitFAB } from "@/components/HabitFAB";
import { InstallBanner } from "@/components/InstallBanner";
import { ThemeSync } from "./ThemeSync";
import { fetchMe } from "@/lib/api";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let theme: string | null = null;
  try {
    const me = await fetchMe();
    theme = (me.preferences as { theme?: string } | undefined)?.theme ?? null;
  } catch {
    // use default
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-app text-text-primary">
      <ThemeSync theme={theme} />
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="hidden w-56 flex-col border-r border-border-default bg-bg-surface px-4 py-6 md:flex">
          <div className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-text-faint">
            PixelMind
          </div>
          <nav aria-label="Main navigation" className="flex flex-1 flex-col gap-2 text-sm">
            <Link
              href="/app"
              className="rounded-md px-2 py-1.5 text-text-primary hover:bg-border-default"
            >
              Home
            </Link>
            <Link
              href="/app/journal"
              className="rounded-md px-2 py-1.5 text-text-primary hover:bg-border-default"
            >
              Journal
            </Link>
            <Link
              href="/app/insights"
              className="rounded-md px-2 py-1.5 text-text-primary hover:bg-border-default"
            >
              Insights
            </Link>
            <Link
              href="/app/settings"
              className="rounded-md px-2 py-1.5 text-text-primary hover:bg-border-default"
            >
              Settings
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-6 md:pb-6">
          {children}
        </main>
      </div>
      <InstallBanner />
      <BottomNav />
      <HabitFAB />
    </div>
  );
}

