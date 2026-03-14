"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { JournalRitualFlow } from "@/components/JournalRitualFlow";
import { SealedJournalView } from "@/components/SealedJournalView";
import { fetchJournalTodayClient, createJournalClient } from "@/lib/api-client";
import type { JournalEntry } from "@/lib/api-client";
import type { SealEntry } from "@/components/JournalRitualFlow";

type TonightTabProps = {
  isUnlocked: boolean;
  todayIso: string;
  /** Called after seal animation completes — switches to Today tab. */
  onSealComplete: () => void;
};

export function TonightTab({ isUnlocked, todayIso, onSealComplete }: TonightTabProps) {
  const { getToken } = useAuth();
  const [sealedEntry, setSealedEntry] = useState<JournalEntry | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const pendingEntryRef = useRef<JournalEntry | null>(null);

  // Load today's seal status on mount
  useEffect(() => {
    let cancelled = false;
    fetchJournalTodayClient(getToken, todayIso)
      .then((entry) => {
        if (!cancelled) setSealedEntry(entry);
      })
      .catch(() => {
        if (!cancelled) setSealedEntry(null);
      });
    return () => { cancelled = true; };
  }, [getToken, todayIso]);

  if (!isUnlocked) return null;

  // Loading
  if (sealedEntry === undefined) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="h-40 rounded-xl border border-today-card-border bg-today-card-bg animate-pulse" />
      </div>
    );
  }

  // Already sealed
  if (sealedEntry !== null) {
    return <SealedJournalView entry={sealedEntry} />;
  }

  // Fire API call immediately when user taps Seal (concurrent with animation)
  const handleSeal = (entry: SealEntry) => {
    setError(null);
    createJournalClient(getToken, {
      date: todayIso,
      mood: entry.mood,
      prompt_id: entry.promptId,
      prompt_response: entry.promptResponse || undefined,
      free_text: entry.freeText || undefined,
      sealed: true,
    })
      .then((created) => {
        pendingEntryRef.current = created;
      })
      .catch(() => {
        setError("Couldn't save your entry. Please try again.");
      });
  };

  // Called after animation completes (~1.4s after handleSeal)
  const handleAnimationDone = () => {
    if (pendingEntryRef.current) {
      setSealedEntry(pendingEntryRef.current);
    }
    onSealComplete();
  };

  return (
    <>
      <JournalRitualFlow todayIso={todayIso} onSeal={handleSeal} onAnimationDone={handleAnimationDone} />
      {error && (
        <div className="mt-2 rounded-xl border border-red-800/40 bg-red-900/20 px-4 py-3 text-sm text-red-300 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-xs font-semibold underline shrink-0">Dismiss</button>
        </div>
      )}
    </>
  );
}
