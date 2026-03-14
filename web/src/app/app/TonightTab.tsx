"use client";

import Link from "next/link";

type TonightTabProps = {
  isUnlocked: boolean;
};

export function TonightTab({ isUnlocked }: TonightTabProps) {
  if (!isUnlocked) {
    // Should not be reachable since the tab is a no-op when locked,
    // but guard here just in case.
    return null;
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl font-medium text-text-primary">How did today go?</h2>
        <p className="text-sm text-text-muted">
          Take a few minutes to reflect on your day — what went well, what was hard, how you felt.
        </p>
      </div>

      <div className="rounded-xl border border-today-card-border bg-today-card-bg p-4 space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-text-faint">
          Tonight&apos;s reflection
        </p>
        <p className="text-sm text-text-muted">
          Write freely or answer a short prompt. Your entries are private and help PixelMind surface patterns over time.
        </p>
        <Link
          href="/app/journal"
          className="inline-flex items-center gap-2 rounded-full bg-today-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Start writing →
        </Link>
      </div>

      <p className="text-xs text-text-faint text-center">
        Full reflection experience lives in the Journal tab
      </p>
    </div>
  );
}
