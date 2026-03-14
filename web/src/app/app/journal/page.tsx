import { fetchJournal } from "@/lib/api";
import { getPromptById } from "@/lib/journal-prompts";

const MOOD_LABELS: Record<string, { emoji: string; label: string }> = {
  calm: { emoji: "😌", label: "calm" },
  good: { emoji: "😊", label: "good" },
  energized: { emoji: "🤩", label: "energized" },
  anxious: { emoji: "😰", label: "anxious" },
  frustrated: { emoji: "😤", label: "frustrated" },
  tired: { emoji: "🥱", label: "tired" },
};

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

const DAYS_BACK = 365;

function getStartDateIso() {
  const d = new Date();
  d.setDate(d.getDate() - DAYS_BACK);
  return d.toISOString().slice(0, 10);
}

export default async function JournalPage() {
  const endDate = getTodayIso();
  const startDate = getStartDateIso();
  const allEntries = await fetchJournal(startDate, endDate);

  // Only show sealed entries, newest first
  const entries = (allEntries as any[])
    .filter((e) => e.sealed)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
        <p className="text-sm text-slate-400">Your sealed days.</p>
      </header>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center">
            <p className="text-sm text-slate-400">
              No entries yet — seal your first day tonight.
            </p>
          </div>
        ) : (
          entries.map((entry: any) => {
            const moodInfo = entry.mood ? MOOD_LABELS[entry.mood] : null;
            const promptText =
              entry.prompt_id != null ? getPromptById(entry.prompt_id) : null;

            return (
              <div
                key={entry._id}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3"
              >
                {/* Date + mood */}
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {entry.date}
                  </p>
                  {moodInfo && (
                    <span className="text-sm">
                      {moodInfo.emoji}{" "}
                      <span className="text-slate-400 capitalize">{moodInfo.label}</span>
                    </span>
                  )}
                </div>

                {/* Prompt + response */}
                {promptText && entry.prompt_response && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">{promptText}</p>
                    <p className="text-sm text-slate-100 whitespace-pre-wrap">
                      {entry.prompt_response}
                    </p>
                  </div>
                )}

                {/* Free text */}
                {entry.free_text && (
                  <p className="text-sm text-slate-200 whitespace-pre-wrap border-t border-slate-800 pt-2">
                    {entry.free_text}
                  </p>
                )}

                {/* Mood-only entry */}
                {!entry.prompt_response && !entry.free_text && moodInfo && (
                  <p className="text-xs text-slate-500 italic">Mood only entry</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
