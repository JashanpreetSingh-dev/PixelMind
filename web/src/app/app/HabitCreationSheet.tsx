"use client";

import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HABIT_PALETTE } from "@/lib/theme";
import { HABIT_ICONS, suggestIcon } from "@/lib/habit-icons";
import { createHabitClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const MAX_HABITS = 20;
const STEP_NAMES = ["Name it", "Appearance", "Rhythm"] as const;
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

// Static suggestions: prefix -> options
const SUGGESTIONS: Record<string, string[]> = {
  read: ["Read 20 pages", "Read before bed", "Read 30 min"],
  walk: ["Evening walk", "Morning walk", "Walk 10 min"],
  sleep: ["Sleep by 10pm", "No phone in bed", "8 hours sleep"],
  exercise: ["Exercise 30 min", "Morning workout", "Stretch"],
  water: ["Drink 8 glasses", "Drink water first thing"],
  meditate: ["Meditate 10 min", "Morning meditation"],
};

function getSuggestions(prefix: string): string[] {
  const key = prefix.trim().toLowerCase().slice(0, 4);
  for (const [k, v] of Object.entries(SUGGESTIONS)) {
    if (key.startsWith(k) || k.startsWith(key)) return v;
  }
  return [];
}

type CollectedHabit = { name: string; color: string; icon?: string; rhythm?: Record<string, unknown> };

type HabitCreationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitCount: number;
  existingNames: string[];
  /** When provided, the sheet collects habit data and calls this instead of posting to the API. */
  onCollect?: (habit: CollectedHabit) => void;
};

export function HabitCreationSheet({
  open,
  onOpenChange,
  habitCount,
  existingNames,
  onCollect,
}: HabitCreationSheetProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>("⭐");
  const [color, setColor] = useState<string>(HABIT_PALETTE[0].hex);
  const [rhythm, setRhythm] = useState<"daily" | "week" | "days">("daily");
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set(DAYS));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const atCapacity = habitCount >= MAX_HABITS;
  const duplicateWarning = useMemo(() => {
    const n = name.trim().toLowerCase();
    if (!n) return false;
    return existingNames.some((e) => e.trim().toLowerCase() === n);
  }, [name, existingNames]);

  const suggestions = useMemo(() => getSuggestions(name), [name]);
  const canProceedStep1 = name.trim().length > 0;

  const reset = useCallback(() => {
    setStep(0);
    setName("");
    setIcon("⭐");
    setColor(HABIT_PALETTE[0].hex);
    setRhythm("daily");
    setTimesPerWeek(3);
    setSelectedDays(new Set(DAYS));
    setError(null);
  }, []);

  const handleClose = useCallback(
    (open: boolean) => {
      if (!open) reset();
      onOpenChange(open);
    },
    [onOpenChange, reset]
  );

  const handleNext = useCallback(() => {
    if (step === 0) {
      // Auto-suggest icon when moving to Appearance step
      setIcon(suggestIcon(name));
    }
    setStep(step + 1);
  }, [step, name]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setSubmitting(true);
    const rhythmValue = rhythm === "daily" ? { type: "daily" } : rhythm === "week" ? { times_per_week: timesPerWeek } : { days: Array.from(selectedDays) };
    try {
      if (onCollect) {
        onCollect({ name: name.trim(), color, icon, rhythm: rhythmValue });
        handleClose(false);
        return;
      }
      await createHabitClient(getToken, {
        name: name.trim(),
        color,
        icon,
        rhythm: rhythmValue,
      });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["days"] });
      handleClose(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  }, [name, color, icon, rhythm, timesPerWeek, selectedDays, onCollect, getToken, queryClient, handleClose]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>New habit — {STEP_NAMES[step]}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
          {step === 0 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Habit name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Read 20 pages"
                  className="text-base"
                  autoFocus
                  autoComplete="off"
                />
                {duplicateWarning && (
                  <p className="mt-1 text-xs text-amber-500">
                    You already have a habit with this name
                  </p>
                )}
                {suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestions.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="rounded-full border border-border-default bg-bg-app px-3 py-1 text-xs text-text-primary hover:border-accent/50"
                        onClick={() => setName(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              {/* Icon picker */}
              <div>
                <label className="mb-3 block text-sm font-medium text-text-primary">
                  Icon
                </label>
                <div className="space-y-3">
                  {HABIT_ICONS.map(({ category, icons }) => (
                    <div key={category}>
                      <p className="mb-1.5 text-[10px] font-medium uppercase tracking-widest text-text-faint">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {icons.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition",
                              icon === emoji
                                ? "border-accent bg-accent/20"
                                : "border-border-default hover:border-text-faint"
                            )}
                            onClick={() => setIcon(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-default" />

              {/* Color picker */}
              <div>
                <label className="mb-3 block text-sm font-medium text-text-primary">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-1.5">
                  {HABIT_PALETTE.map(({ hex, name: colorName }) => (
                    <button
                      key={hex}
                      type="button"
                      className={cn(
                        "h-8 w-full rounded-lg border-2 transition",
                        color === hex
                          ? "border-accent ring-2 ring-accent/30"
                          : "border-border-default hover:border-text-faint"
                      )}
                      style={{ backgroundColor: hex }}
                      title={colorName}
                      onClick={() => setColor(hex)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  How often?
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      rhythm === "daily"
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default text-text-primary hover:border-text-faint"
                    )}
                    onClick={() => setRhythm("daily")}
                  >
                    Daily
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      rhythm === "week"
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default text-text-primary hover:border-text-faint"
                    )}
                    onClick={() => setRhythm("week")}
                  >
                    {timesPerWeek}x per week
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      rhythm === "days"
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border-default text-text-primary hover:border-text-faint"
                    )}
                    onClick={() => setRhythm("days")}
                  >
                    Specific days
                  </button>
                </div>
              </div>
              {rhythm === "week" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-muted">Times per week</span>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={timesPerWeek}
                    onChange={(e) => setTimesPerWeek(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">{timesPerWeek}</span>
                </div>
              )}
              {rhythm === "days" && (
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs capitalize",
                        selectedDays.has(d)
                          ? "border-accent bg-accent/20 text-accent"
                          : "border-border-default text-text-muted hover:border-text-faint"
                      )}
                      onClick={() => toggleDay(d)}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2 border-t border-border-default p-4">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => handleClose(false)}>
              Cancel
            </Button>
          )}
          <div className="flex-1" />
          {step < 2 ? (
            <Button
              onClick={handleNext}
              disabled={step === 0 && !canProceedStep1}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !name.trim()}
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
