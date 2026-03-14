"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HABIT_PALETTE } from "@/lib/theme";
import { HABIT_ICONS } from "@/lib/habit-icons";
import { updateHabitClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

type Habit = { _id: string; name: string; color?: string; icon?: string; rhythm?: unknown };

type HabitEditSheetProps = {
  habit: Habit | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingNames: string[];
  onSaved: () => void;
  onDeleted: () => void;
};

function parseRhythm(rhythm: unknown): { type: "daily" | "week" | "days"; timesPerWeek: number; selectedDays: Set<string> } {
  const r = rhythm as Record<string, unknown> | undefined;
  if (!r) return { type: "daily", timesPerWeek: 3, selectedDays: new Set(DAYS) };
  if (r.times_per_week) return { type: "week", timesPerWeek: Number(r.times_per_week), selectedDays: new Set(DAYS) };
  if (Array.isArray(r.days)) return { type: "days", timesPerWeek: 3, selectedDays: new Set(r.days as string[]) };
  return { type: "daily", timesPerWeek: 3, selectedDays: new Set(DAYS) };
}

export function HabitEditSheet({
  habit,
  open,
  onOpenChange,
  existingNames,
  onSaved,
  onDeleted,
}: HabitEditSheetProps) {
  const { getToken } = useAuth();

  const initialRhythm = useMemo(() => parseRhythm(habit?.rhythm), [habit]);

  const [name, setName] = useState(habit?.name ?? "");
  const [icon, setIcon] = useState(habit?.icon ?? "⭐");
  const [color, setColor] = useState(habit?.color ?? HABIT_PALETTE[0].hex);
  const [rhythmType, setRhythmType] = useState<"daily" | "week" | "days">(initialRhythm.type);
  const [timesPerWeek, setTimesPerWeek] = useState(initialRhythm.timesPerWeek);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(initialRhythm.selectedDays);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync when habit changes or sheet opens (so form is always filled with current habit)
  const syncToHabit = useCallback(() => {
    if (!habit) return;
    const r = parseRhythm(habit.rhythm);
    setName(habit.name);
    setIcon(habit.icon ?? "⭐");
    setColor(habit.color ?? HABIT_PALETTE[0].hex);
    setRhythmType(r.type);
    setTimesPerWeek(r.timesPerWeek);
    setSelectedDays(r.selectedDays);
    setError(null);
    setConfirmDelete(false);
  }, [habit]);

  useEffect(() => {
    if (open && habit) syncToHabit();
  }, [open, habit, syncToHabit]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) syncToHabit();
      else {
        setConfirmDelete(false);
        setError(null);
      }
      onOpenChange(next);
    },
    [onOpenChange, syncToHabit]
  );

  const duplicateWarning = useMemo(() => {
    if (!habit) return false;
    const n = name.trim().toLowerCase();
    if (!n) return false;
    return existingNames
      .filter((e) => e.toLowerCase() !== habit.name.toLowerCase())
      .some((e) => e.toLowerCase() === n);
  }, [name, existingNames, habit]);

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = useCallback(async () => {
    if (!habit || !canSave) return;
    setError(null);
    setSaving(true);
    try {
      const rhythmValue =
        rhythmType === "daily"
          ? { type: "daily" }
          : rhythmType === "week"
          ? { times_per_week: timesPerWeek }
          : { days: Array.from(selectedDays) };
      await updateHabitClient(getToken, habit._id, {
        name: name.trim(),
        color,
        icon,
        rhythm: rhythmValue,
      });
      onOpenChange(false);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save habit");
    } finally {
      setSaving(false);
    }
  }, [habit, canSave, name, color, icon, rhythmType, timesPerWeek, selectedDays, getToken, onOpenChange, onSaved]);

  const handleDelete = useCallback(async () => {
    if (!habit) return;
    setError(null);
    setSaving(true);
    try {
      await updateHabitClient(getToken, habit._id, { archived: true });
      onOpenChange(false);
      onDeleted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete habit");
    } finally {
      setSaving(false);
    }
  }, [habit, getToken, onOpenChange, onDeleted]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  if (!habit) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit habit</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-auto p-4">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name"
              className="text-base"
              autoComplete="off"
            />
            {duplicateWarning && (
              <p className="mt-1 text-xs text-amber-500">
                You already have a habit with this name
              </p>
            )}
          </div>

          {/* Icon */}
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

          {/* Color */}
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

          {/* Rhythm */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              How often?
            </label>
            <div className="flex flex-wrap gap-2">
              {(["daily", "week", "days"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    rhythmType === r
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border-default text-text-primary hover:border-text-faint"
                  )}
                  onClick={() => setRhythmType(r)}
                >
                  {r === "daily" ? "Daily" : r === "week" ? `${timesPerWeek}× per week` : "Specific days"}
                </button>
              ))}
            </div>
            {rhythmType === "week" && (
              <div className="mt-3 flex items-center gap-2">
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
            {rhythmType === "days" && (
              <div className="mt-3 flex flex-wrap gap-2">
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
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {/* Delete */}
          <div className="mt-auto pt-2">
            {confirmDelete ? (
              <div className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-text-primary">
                  Remove this habit? This will remove it from your tracker.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    {saving ? "Removing…" : "Yes, remove"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-text-faint hover:text-destructive transition"
              >
                Delete habit
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-t border-border-default p-4">
          <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <div className="flex-1" />
          <Button onClick={handleSave} disabled={!canSave}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
