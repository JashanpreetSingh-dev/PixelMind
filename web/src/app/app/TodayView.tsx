"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  fetchDaysClient,
  fetchHabitsClient,
  fetchJournalTodayClient,
  updateHabitClient,
  upsertDayClient,
} from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { creationSheetOpenAtom } from "@/lib/atoms";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HabitCard } from "./HabitCard";
import { HabitCreationSheet } from "./HabitCreationSheet";
import { HabitEditSheet } from "./HabitEditSheet";
import { MosaicTab } from "./MosaicTab";
import { UndoToast } from "@/components/UndoToast";
import { TonightTab } from "./TonightTab";
import { getTodayIso as getTodayIsoLib, localDateToIso } from "@/lib/date";
import { cn } from "@/lib/utils";

const MAX_HABITS = 10;
type ActiveTab = "today" | "mosaic" | "tonight";

/** Last 30 days in the browser's local timezone (calendar dates). */
function getLast30DaysRange(): { start: string; end: string; dates: string[] } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const end = new Date(y, m, d);
  const start = new Date(y, m, d - 29);
  const dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const day = new Date(y, m, d - 29 + i);
    dates.push(localDateToIso(day));
  }
  return {
    start: localDateToIso(start),
    end: localDateToIso(end),
    dates,
  };
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function computeStreak(
  habitId: string,
  todayIso: string,
  daysByDate: Record<string, { completed_habit_ids?: string[] }>
): number {
  let count = 0;
  const [y, m, day] = todayIso.split("-").map(Number);
  let cur = new Date(y, m - 1, day);
  for (let i = 0; i < 365; i++) {
    const iso = localDateToIso(cur);
    const dayDoc = daysByDate[iso];
    if (dayDoc?.completed_habit_ids?.includes(habitId)) {
      count++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

type Habit = { _id: string; name: string; color?: string; icon?: string; rhythm?: unknown }; // icon flows to HabitCard and MosaicTab
type DayDoc = { date: string; completed_habit_ids?: string[] };

type TodayViewProps = {
  initialHabits: Habit[];
  initialDays: DayDoc[];
  todayIso: string;
  userName?: string | null;
};

function getTodayIso(): string {
  return getTodayIsoLib();
}

/** Format YYYY-MM-DD as a readable date in the browser's locale. */
function formatLocalDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function TodayView({
  initialHabits,
  initialDays,
  todayIso: initialTodayIso,
  userName,
}: TodayViewProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useAtom(creationSheetOpenAtom);
  const [showCelebration, setShowCelebration] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("today");

  // Use browser's local "today" so date/time work correctly for the user's timezone
  const [todayIso, setTodayIso] = useState(initialTodayIso);
  useLayoutEffect(() => {
    setTodayIso(getTodayIso());
  }, []);

  const { start, end, dates } = useMemo(() => getLast30DaysRange(), []);

  // When the calendar date changes (e.g. after midnight or next day), refresh so the list shows the new day
  const initialTodayRef = useRef(todayIso);
  useEffect(() => {
    const checkNewDay = () => {
      const currentToday = getTodayIso();
      if (currentToday !== initialTodayRef.current) {
        initialTodayRef.current = currentToday;
        router.refresh();
      }
    };
    checkNewDay();
    const interval = setInterval(checkNewDay, 60_000);
    const onFocus = () => checkNewDay();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  const habitsQuery = useQuery({
    queryKey: ["habits"],
    queryFn: () => fetchHabitsClient(getToken),
    initialData: initialHabits,
  });

  const daysQuery = useQuery({
    queryKey: ["days", start, end],
    queryFn: () => fetchDaysClient(getToken, start, end),
    // When server sends no days (initialDays=[]), don't seed cache so the query stays loading
    // and we show shimmer until client fetch completes — avoids showing list with cleared completion.
    initialData: initialDays.length > 0 ? initialDays : undefined,
  });

  // Keep cache in sync when server sends new data (e.g. after router.refresh() or navigation)
  useEffect(() => {
    queryClient.setQueryData(["habits"], initialHabits);
    if (initialDays.length > 0) {
      queryClient.setQueryData(["days", start, end], initialDays);
    }
  }, [initialHabits, initialDays, queryClient, start, end]);

  const isRefetching = habitsQuery.isRefetching || daysQuery.isRefetching;
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["days-mosaic"] });
    router.refresh();
  }, [queryClient, router]);

  const [pendingUndo, setPendingUndo] = useState<{ habitId: string; previousIds: string[] } | null>(null);

  const journalTodayQuery = useQuery({
    queryKey: ["journal-today", todayIso],
    queryFn: () => fetchJournalTodayClient(getToken, todayIso),
    staleTime: 60_000,
  });
  const isTodaySealed = journalTodayQuery.data !== null && journalTodayQuery.data !== undefined;

  const habits: Habit[] = habitsQuery.data ?? [];
  const days: DayDoc[] = daysQuery.data ?? [];
  const daysByDate = useMemo(() => {
    const m: Record<string, DayDoc> = {};
    for (const d of days) m[d.date] = d;
    return m;
  }, [days]);

  const todayDoc = daysByDate[todayIso];
  const completedToday = useMemo(
    () => new Set(todayDoc?.completed_habit_ids ?? []),
    [todayDoc]
  );

  // Sorted: incomplete first, completed at bottom
  const sortedHabits = useMemo(() => {
    const incomplete = habits.filter((h) => !completedToday.has(h._id));
    const complete = habits.filter((h) => completedToday.has(h._id));
    return [...incomplete, ...complete];
  }, [habits, completedToday]);

  // Progress counts
  const totalCount = habits.length;
  const completedCount = completedToday.size;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const patchDaysCache = useCallback(
    (newIds: string[]) => {
      queryClient.setQueryData<DayDoc[]>(["days", start, end], (old = []) => {
        const without = old.filter((d) => d.date !== todayIso);
        return [...without, { date: todayIso, completed_habit_ids: newIds }];
      });
    },
    [queryClient, start, end, todayIso]
  );

  const toggleMutation = useMutation({
    mutationFn: (newIds: string[]) => upsertDayClient(getToken, todayIso, newIds),
    onMutate: async (newIds: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["days", start, end] });
      const snapshot = queryClient.getQueryData<DayDoc[]>(["days", start, end]);
      patchDaysCache(newIds);
      return { snapshot };
    },
    onSuccess: (serverDay: DayDoc) => {
      // Replace optimistic patch with the server-confirmed document — no refetch needed
      queryClient.setQueryData<DayDoc[]>(["days", start, end], (old = []) => {
        const without = old.filter((d) => d.date !== todayIso);
        return [...without, serverDay];
      });
      queryClient.invalidateQueries({ queryKey: ["days-mosaic"] });
    },
    onError: (_err, _newIds, ctx) => {
      if (ctx?.snapshot) {
        queryClient.setQueryData(["days", start, end], ctx.snapshot);
      }
    },
  });

  const handleToggleComplete = useCallback(
    (habitId: string) => {
      const next = new Set(completedToday);
      const wasComplete = next.has(habitId);
      if (wasComplete) {
        next.delete(habitId);
        setPendingUndo(null);
      } else {
        next.add(habitId);
        const previousIds = Array.from(completedToday);
        setPendingUndo({ habitId, previousIds });
      }
      toggleMutation.mutate(Array.from(next));
    },
    [completedToday, toggleMutation]
  );

  const handleUndo = useCallback(
    (previousIds: string[]) => {
      setPendingUndo(null);
      patchDaysCache(previousIds);
      toggleMutation.mutate(previousIds);
    },
    [patchDaysCache, toggleMutation]
  );

  const handleSkip = useCallback(
    (habitId: string) => {
      const next = new Set(completedToday);
      next.delete(habitId);
      toggleMutation.mutate(Array.from(next));
    },
    [completedToday, toggleMutation]
  );

  const handleDelete = useCallback(
    async (habit: Habit) => {
      await updateHabitClient(getToken, habit._id, { archived: true });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["days", start, end] });
      queryClient.invalidateQueries({ queryKey: ["days-mosaic"] });
    },
    [getToken, queryClient, start, end]
  );

  const handleEdit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
  }, []);

  const handleEditSaved = useCallback(() => {
    setEditingHabit(null);
    queryClient.invalidateQueries({ queryKey: ["habits"] });
  }, [queryClient]);

  const handleEditDeleted = useCallback(() => {
    setEditingHabit(null);
    queryClient.invalidateQueries({ queryKey: ["habits"] });
    queryClient.invalidateQueries({ queryKey: ["days", start, end] });
    queryClient.invalidateQueries({ queryKey: ["days-mosaic"] });
  }, [queryClient, start, end]);

  const greeting = getGreeting();
  const isReflectionUnlocked = new Date().getHours() >= 20;
  const atCapacity = habits.length >= MAX_HABITS;
  const existingNames = useMemo(() => habits.map((h) => h.name), [habits]);

  // Fire celebration only when allDone transitions from false → true (not on tab switch / remount)
  const prevAllDone = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevAllDone.current === null) {
      prevAllDone.current = allDone;
      return;
    }
    if (allDone && !prevAllDone.current) {
      setShowCelebration(true);
    }
    prevAllDone.current = allDone;
  }, [allDone]);

  useEffect(() => {
    if (!showCelebration) return;
    const t = setTimeout(() => setShowCelebration(false), 2500);
    return () => clearTimeout(t);
  }, [showCelebration]);

  const handleTabClick = (tab: ActiveTab) => {
    if (tab === "tonight" && !isReflectionUnlocked) return; // locked no-op
    setActiveTab(tab);
  };

  return (
    <section className="min-h-full space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-xs text-text-faint" suppressHydrationWarning>
            {formatLocalDate(todayIso)}
          </p>
          <h1 className="text-2xl font-medium tracking-tight text-text-primary" suppressHydrationWarning>
            {userName ? `${greeting}, ${userName}` : greeting}
          </h1>
          {/* Progress counter */}
          {totalCount > 0 && (
            <p className={cn("text-xs", allDone ? "text-today-accent font-medium" : "text-text-muted")}>
              {allDone ? "All done ✓" : `${completedCount} / ${totalCount} done`}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          className="shrink-0 min-h-[44px] min-w-[44px] text-text-muted"
          onClick={handleRefresh}
          disabled={isRefetching}
          aria-label="Refresh"
        >
          {isRefetching ? "…" : "↻"}
        </Button>
      </header>

      {/* Tab controls */}
      <div className="flex gap-1 rounded-xl border border-today-card-border bg-today-card-bg p-1">
        {(["today", "mosaic", "tonight"] as ActiveTab[]).map((tab) => {
          const isLocked = tab === "tonight" && !isReflectionUnlocked;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              disabled={isLocked}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition",
                isActive
                  ? "bg-today-accent/20 text-today-accent"
                  : isLocked
                  ? "cursor-not-allowed text-text-faint opacity-40"
                  : "text-text-muted hover:text-text-primary"
              )}
              aria-label={isLocked ? "Tonight's reflection unlocks at 8pm" : undefined}
            >
              {tab === "tonight" && isLocked && (
                <span className="text-xs" aria-hidden>🔒</span>
              )}
              {tab === "tonight" && !isLocked && isTodaySealed && (
                <span className="text-xs leading-none text-today-accent" aria-hidden>✦</span>
              )}
              {tab === "tonight" && !isLocked && !isTodaySealed && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-today-accent animate-pulse"
                  aria-hidden
                />
              )}
              <span className="capitalize">{tab === "tonight" ? "Tonight" : tab === "mosaic" ? "Mosaic" : "Today"}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "today" && (
        <>
          {/* daysQuery.dataUpdatedAt === 0 means no successful server fetch yet (initialData=[] always).
              Show shimmer until we have real data — covers the gap while Clerk initializes and retries. */}
          {habits.length === 0 || daysQuery.dataUpdatedAt === 0 ? (
            <div className="space-y-2">
              {(habits.length > 0 ? habits : [1, 2, 3]).map((h) => (
                <div
                  key={typeof h === "number" ? h : h._id}
                  className="rounded-[14px] border border-today-card-border bg-today-card-bg min-h-[52px] overflow-hidden relative"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%]"
                    style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          ) : (
            <LayoutGroup>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {sortedHabits.map((habit) => (
                    <HabitCard
                      key={habit._id}
                      habit={habit}
                      completed={completedToday.has(habit._id)}
                      streak={computeStreak(habit._id, todayIso, daysByDate)}
                      onToggleComplete={handleToggleComplete}
                      onSkip={handleSkip}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          )}
        </>
      )}

      {activeTab === "mosaic" && (
        <MosaicTab
          habits={habits}
          todayIso={todayIso}
          isTodaySealed={isTodaySealed}
        />
      )}

      {activeTab === "tonight" && (
        <TonightTab
          isUnlocked={isReflectionUnlocked}
          todayIso={todayIso}
          onSealComplete={() => {
            queryClient.invalidateQueries({ queryKey: ["journal-today", todayIso] });
            setActiveTab("today");
          }}
        />
      )}

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="rounded-2xl bg-bg-surface px-8 py-6 text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xl font-semibold text-text-primary">All done for today!</p>
              <p className="mt-1 text-sm text-text-muted">Great job completing your habits.</p>
              <Button className="mt-4" onClick={() => setShowCelebration(false)}>
                Dismiss
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UndoToast
        habitName={pendingUndo ? (habits.find((h) => h._id === pendingUndo.habitId)?.name ?? null) : null}
        onUndo={() => pendingUndo && handleUndo(pendingUndo.previousIds)}
        onDismiss={() => setPendingUndo(null)}
      />

      <HabitCreationSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        habitCount={habits.length}
        existingNames={existingNames}
      />

      <HabitEditSheet
        habit={editingHabit}
        open={editingHabit !== null}
        onOpenChange={(open) => { if (!open) setEditingHabit(null); }}
        existingNames={existingNames}
        onSaved={handleEditSaved}
        onDeleted={handleEditDeleted}
      />
    </section>
  );
}
