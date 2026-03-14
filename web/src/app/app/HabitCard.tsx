"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { HABIT_PALETTE } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Habit = { _id: string; name: string; color?: string; icon?: string };

type HabitCardProps = {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggleComplete: (habitId: string) => void;
  onSkip: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

const LONG_PRESS_MS = 500;

export function HabitCard({
  habit,
  completed,
  streak,
  onToggleComplete,
  onSkip,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const touchStartX = useRef(0);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      clearLongPress();
      didLongPress.current = false;
      longPressTimer.current = setTimeout(() => {
        longPressTimer.current = null;
        didLongPress.current = true;
        setMenuOpen(true);
      }, LONG_PRESS_MS);
    },
    [clearLongPress]
  );

  const handlePointerUp = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const handlePointerLeave = useCallback(() => {
    clearLongPress();
  }, [clearLongPress]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (didLongPress.current) {
        didLongPress.current = false;
        return;
      }
      if (menuOpen) return;
      e.preventDefault();
      onToggleComplete(habit._id);
    },
    [habit._id, menuOpen, onToggleComplete]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? 0;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0]?.clientX ?? 0;
      const delta = touchStartX.current - endX;
      if (delta > 60) {
        onSkip(habit._id);
      } else if (delta < -60 && !completed) {
        onToggleComplete(habit._id);
      }
    },
    [habit._id, completed, onSkip, onToggleComplete]
  );

  const habitColor = habit.color ?? HABIT_PALETTE[0].hex;
  const icon = habit.icon ?? "⭐";

  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        default: { duration: 0.1 },
      }}
    >
      <div
        className="cursor-pointer touch-manipulation rounded-[14px] border min-h-[44px] transition-colors"
        style={{
          backgroundColor: completed ? `${habitColor}24` : `${habitColor}14`,
          borderColor: completed ? `${habitColor}66` : `${habitColor}4D`,
          borderWidth: 1,
        }}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative flex min-h-[44px] items-center gap-3 px-3 py-3">
          <span className="text-xl leading-none shrink-0">{icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-white">{habit.name}</p>
            <p className="text-xs text-text-muted">
              {streak > 0 ? `Day ${streak} streak` : "Start your streak"}
            </p>
          </div>
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
            style={{
              borderColor: completed ? habitColor : `${habitColor}4D`,
              backgroundColor: completed ? habitColor : "transparent",
            }}
            aria-hidden
          >
            <AnimatePresence>
              {completed && (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-sm leading-none"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="absolute right-2 top-12 z-50 min-w-[140px] rounded-lg border border-today-card-border bg-today-card-bg py-1 shadow-lg"
              role="menu"
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-border-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(habit);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-border-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onSkip(habit._id);
                }}
              >
                Skip today
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-border-default"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(habit);
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
