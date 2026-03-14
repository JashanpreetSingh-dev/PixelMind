"use client";

import { getPromptById } from "@/lib/journal-prompts";
import type { JournalEntry } from "@/lib/api-client";

const MOOD_LABELS: Record<string, { emoji: string; label: string }> = {
  calm: { emoji: "😌", label: "calm" },
  good: { emoji: "😊", label: "good" },
  energized: { emoji: "🤩", label: "energized" },
  anxious: { emoji: "😰", label: "anxious" },
  frustrated: { emoji: "😤", label: "frustrated" },
  tired: { emoji: "🥱", label: "tired" },
};

type Props = {
  entry: JournalEntry;
};

export function SealedJournalView({ entry }: Props) {
  const moodInfo = entry.mood ? MOOD_LABELS[entry.mood] : null;
  const promptText =
    entry.prompt_id != null ? getPromptById(entry.prompt_id) : null;

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="space-y-0.5">
        <p className="text-lg font-semibold text-text-primary">Day sealed ✦</p>
        <p className="text-xs text-text-faint">{entry.date}</p>
      </div>

      {/* Mood */}
      {moodInfo && (
        <div className="flex items-center gap-2 rounded-xl border border-today-card-border bg-today-card-bg px-4 py-3">
          <span className="text-2xl leading-none">{moodInfo.emoji}</span>
          <span className="text-sm font-medium capitalize text-text-primary">
            {moodInfo.label}
          </span>
        </div>
      )}

      {/* Prompt + response */}
      {promptText && entry.prompt_response && (
        <div className="space-y-1.5 rounded-xl border border-today-card-border bg-today-card-bg px-4 py-3">
          <p className="text-xs text-text-faint">{promptText}</p>
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {entry.prompt_response}
          </p>
        </div>
      )}

      {/* Free text */}
      {entry.free_text && (
        <div className="rounded-xl border border-today-card-border bg-today-card-bg px-4 py-3">
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {entry.free_text}
          </p>
        </div>
      )}
    </div>
  );
}
