"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { PREDEFINED_HABITS, type PredefinedHabit } from "@/lib/predefined-habits";
import { HabitCreationSheet } from "@/app/app/HabitCreationSheet";
import { cn } from "@/lib/utils";

const FEELINGS = ["Calm", "Energized", "Proud", "Grounded", "Clear-headed"];

type CustomHabit = { id: string; name: string; color: string; icon?: string; rhythm?: Record<string, unknown> };

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function OnboardingContent() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [selectedPredefined, setSelectedPredefined] = useState<Set<string>>(new Set());
  const [customHabits, setCustomHabits] = useState<CustomHabit[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [primaryFeeling, setPrimaryFeeling] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSelected = selectedPredefined.size + customHabits.length;

  const togglePredefined = (habit: PredefinedHabit) => {
    setSelectedPredefined((prev) => {
      const next = new Set(prev);
      if (next.has(habit.id)) next.delete(habit.id);
      else next.add(habit.id);
      return next;
    });
  };

  const handleCollect = useCallback((habit: { name: string; color: string; icon?: string; rhythm?: Record<string, unknown> }) => {
    const id = `custom-${Date.now()}`;
    setCustomHabits((prev) => [...prev, { id, ...habit }]);
  }, []);

  const removeCustomHabit = (id: string) => {
    setCustomHabits((prev) => prev.filter((h) => h.id !== id));
  };

  async function handleSubmit() {
    if (totalSelected === 0) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const token = await getToken();
      if (!token) {
        setError("You need to be signed in to continue.");
        setIsSubmitting(false);
        return;
      }

      // Build structured habits array from selected predefined + custom
      const predefinedSelected = PREDEFINED_HABITS
        .filter((h) => selectedPredefined.has(h.id))
        .map(({ name, color, icon }) => ({ name, color, icon }));

      const customSelected = customHabits.map(({ name, color, icon }) => ({ name, color, icon }));

      const habits = [...predefinedSelected, ...customSelected];

      const res = await fetch(`${apiBase}/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ habits, primary_feeling: primaryFeeling }),
      });

      if (!res.ok) {
        setError("Something went wrong saving your setup. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push("/app");
    } catch {
      setError("Unable to reach the server. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">
          Welcome to PixelMind
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Pick habits to track
        </h1>
        <p className="text-sm text-text-muted">
          Each habit gets its own color in your pixel mosaic. Select at least one to get started.
        </p>
      </header>

      {/* Predefined habit grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {PREDEFINED_HABITS.map((habit) => {
            const isSelected = selectedPredefined.has(habit.id);
            return (
              <button
                key={habit.id}
                type="button"
                onClick={() => togglePredefined(habit)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  isSelected
                    ? "border-transparent bg-accent/15 ring-2 ring-accent"
                    : "border-border-default bg-bg-surface hover:border-border-default/80"
                )}
                style={isSelected ? ({ "--tw-ring-color": habit.color } as React.CSSProperties) : undefined}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base"
                  style={{ backgroundColor: habit.color + "33" }}
                >
                  {habit.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{habit.name}</p>
                  <span
                    className="mt-0.5 inline-block h-1.5 w-6 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                </div>
                {isSelected && (
                  <span className="ml-auto shrink-0 text-xs text-text-muted">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom habits */}
        {customHabits.length > 0 && (
          <div className="space-y-2">
            {customHabits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center gap-3 rounded-xl border border-border-default bg-bg-surface p-3"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="flex-1 text-sm text-text-primary">{habit.name}</span>
                <button
                  type="button"
                  onClick={() => removeCustomHabit(habit.id)}
                  className="text-text-muted hover:text-text-primary transition"
                  aria-label={`Remove ${habit.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add your own */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="w-full rounded-xl border border-dashed border-border-default py-3 text-sm text-text-muted hover:border-border-default/80 hover:text-text-primary transition"
        >
          + Add your own habit
        </button>
      </div>

      {/* Primary feeling */}
      <div className="space-y-4 rounded-xl border border-border-default bg-bg-surface p-4">
        <h2 className="text-sm font-medium text-text-primary">
          How do you want to feel more often?
        </h2>
        <p className="text-xs text-text-muted">Choose one that feels most important right now.</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {FEELINGS.map((label) => {
            const isActive = primaryFeeling === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setPrimaryFeeling(label)}
                className={cn(
                  "rounded-full border px-3 py-1 transition",
                  isActive
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-border-default bg-bg-app text-text-primary hover:border-border-default/80"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive" role="status">
          {error}
        </p>
      )}

      <footer className="flex items-center justify-between pt-2 text-xs text-text-muted">
        <span>
          {totalSelected === 0
            ? "Select at least 1 habit to continue"
            : `${totalSelected} habit${totalSelected !== 1 ? "s" : ""} selected`}
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || totalSelected === 0}
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {isSubmitting ? "Saving..." : "Continue to home"}
        </button>
      </footer>

      <HabitCreationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        habitCount={totalSelected}
        existingNames={[
          ...PREDEFINED_HABITS.filter((h) => selectedPredefined.has(h.id)).map((h) => h.name),
          ...customHabits.map((h) => h.name),
        ]}
        onCollect={handleCollect}
      />
    </section>
  );
}
