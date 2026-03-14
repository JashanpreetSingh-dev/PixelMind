"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useRef } from "react";
import { HABIT_PALETTE } from "@/lib/theme";

type Habit = { _id: string; name: string; color?: string; icon?: string };

type HabitCardProps = {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggleComplete: (habitId: string) => void;
  onSkip: (habitId: string) => void;
  onOpenActions: (habit: Habit) => void;
};

const LONG_PRESS_MS = 500;
const MIN_TOUCH_TARGET_PX = 44;

export function HabitCard({
  habit,
  completed,
  streak,
  onToggleComplete,
  onSkip,
  onOpenActions,
}: HabitCardProps) {
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
        onOpenActions(habit);
      }, LONG_PRESS_MS);
    },
    [clearLongPress, habit, onOpenActions]
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
      e.preventDefault();
      onToggleComplete(habit._id);
    },
    [habit._id, onToggleComplete]
  );

  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onOpenActions(habit);
    },
    [habit, onOpenActions]
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
          <button
            type="button"
            className="flex shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-white/30"
            style={{ minWidth: MIN_TOUCH_TARGET_PX, minHeight: MIN_TOUCH_TARGET_PX }}
            onClick={handleMenuClick}
            aria-label="Habit options"
          >
            <span className="text-lg leading-none" aria-hidden>⋮</span>
          </button>
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
      </div>
    </motion.div>
  );
}
