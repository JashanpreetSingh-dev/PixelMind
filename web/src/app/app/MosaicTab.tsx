"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import type { CSSProperties } from "react";
import { fetchDaysClient, fetchJournalTodayClient } from "@/lib/api-client";
import { isoToLocalDate, localDateToIso } from "@/lib/date";

type Habit = { _id: string; name: string; color?: string; icon?: string };
type DayDoc = { date: string; completed_habit_ids?: string[] };

type MosaicTabProps = {
  habits: Habit[];
  todayIso: string;
};

const GRID_WEEKS = 26; // show 26 weeks at once (7 rows × 26 columns)

/** Canonical mosaic grid format — aesthetic solid-block style. Use everywhere a habit grid is shown:
 *  - Square cells, no rounding, no grid lines; contiguous blocks of color
 *  - No gap between day rows (Mo, Tu, We…) or week columns
 *  - Day labels (Mo–Su) on the left; month labels along the bottom
 */

// Returns exactly GRID_WEEKS calendar weeks (Mon–Sun) in browser local timezone.
function getCalendarWeeks(todayIso: string, signupIso: string | null): string[][] {
  const today = isoToLocalDate(todayIso);
  const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - dayOfWeek);

  let startMonday: Date;
  if (signupIso) {
    const signup = isoToLocalDate(signupIso);
    const signupMonday = new Date(signup);
    const signupDayOfWeek = (signup.getDay() + 6) % 7;
    signupMonday.setDate(signup.getDate() - signupDayOfWeek);
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks =
      Math.round((currentMonday.getTime() - signupMonday.getTime()) / msPerWeek) + 1;
    if (totalWeeks <= GRID_WEEKS) {
      startMonday = signupMonday;
    } else {
      startMonday = new Date(currentMonday);
      startMonday.setDate(currentMonday.getDate() - (GRID_WEEKS - 1) * 7);
    }
  } else {
    startMonday = new Date(currentMonday);
    startMonday.setDate(currentMonday.getDate() - (GRID_WEEKS - 1) * 7);
  }

  const weeks: string[][] = [];
  for (let w = 0; w < GRID_WEEKS; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + w * 7 + d);
      week.push(localDateToIso(date));
    }
    weeks.push(week);
  }
  return weeks;
}

function computeStreak(
  habitId: string,
  todayIso: string,
  daysByDate: Record<string, DayDoc>
): number {
  let count = 0;
  let cur = isoToLocalDate(todayIso);
  for (let i = 0; i < 365; i++) {
    const iso = localDateToIso(cur);
    const day = daysByDate[iso];
    if (day?.completed_habit_ids?.includes(habitId)) {
      count++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_ABBREV = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MosaicTab({ habits, todayIso }: MosaicTabProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [isTodaySealed, setIsTodaySealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchJournalTodayClient(getToken, todayIso)
      .then((entry) => { if (!cancelled) setIsTodaySealed(entry !== null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [getToken, todayIso]);

  const signupIso = useMemo(() => {
    if (!user?.createdAt) return null;
    return localDateToIso(new Date(user.createdAt));
  }, [user?.createdAt]);

  const weeks = useMemo(
    () => getCalendarWeeks(todayIso, signupIso),
    [todayIso, signupIso]
  );

  const { start, end } = useMemo(() => {
    if (weeks.length === 0) return { start: todayIso, end: todayIso };
    return {
      start: weeks[0][0],
      end: weeks[weeks.length - 1][6],
    };
  }, [weeks, todayIso]);

  const daysQuery = useQuery({
    queryKey: ["days-mosaic", start, end],
    queryFn: () => fetchDaysClient(getToken, start, end),
  });

  const daysByDate = useMemo(() => {
    const days: DayDoc[] = daysQuery.data ?? [];
    const m: Record<string, DayDoc> = {};
    for (const d of days) m[d.date] = d;
    return m;
  }, [daysQuery.data]);

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-text-muted">Add habits to see your mosaic</p>
        <p className="mt-1 text-xs text-text-faint">Your history will appear here</p>
      </div>
    );
  }

  if (daysQuery.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-today-card-border bg-today-card-bg min-h-[120px] relative overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%]"
              style={{ animation: "shimmer 1.5s ease-in-out infinite" }}
              aria-hidden
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const habitColor = habit.color ?? "#86efac";
        const streak = computeStreak(habit._id, todayIso, daysByDate);

        return (
          <div
            key={habit._id}
            className="rounded-xl border p-3 space-y-3"
            style={{
              backgroundColor: `${habitColor}12`,
              borderColor: `${habitColor}28`,
            }}
          >
            {/* Header — icon + title + streak (same for every habit card) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg leading-none shrink-0">{habit.icon ?? "⭐"}</span>
                <span className="text-sm font-semibold text-white truncate uppercase tracking-wide">
                  {habit.name}
                </span>
              </div>
              {streak > 0 && (
                <span className="text-xs text-text-muted shrink-0 ml-2">🔥 {streak}</span>
              )}
            </div>

            {/* Mosaic grid — solid-block aesthetic: no grid lines, contiguous squares */}
            <div
              className="min-w-0 w-full max-w-full max-w-[22rem] rounded-lg bg-white/[0.04] p-3"
              style={{
                display: "grid",
                gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))`,
                gridTemplateRows: "repeat(7, 1fr) auto",
                gap: 0,
                minHeight: "6.5rem",
              }}
            >
              {DAY_LABELS.map((dayLabel, dayIndex) => (
                <Fragment key={dayLabel}>
                  <span
                    className="flex items-center pr-2 text-[10px] font-medium text-text-muted tabular-nums"
                    style={{ gridRow: dayIndex + 1, gridColumn: 1 }}
                  >
                    {dayLabel}
                  </span>
                  {weeks.map((week, weekIndex) => {
                    const dateIso = week[dayIndex];
                    const isFuture = dateIso > todayIso;
                    const isToday = dateIso === todayIso;
                    const completed =
                      daysByDate[dateIso]?.completed_habit_ids?.includes(habit._id) ?? false;
                    const completedOpacity = 0.5 + (0.5 * (weekIndex + 1)) / weeks.length;
                    const isBeforeSignup = signupIso !== null && dateIso < signupIso;

                    let cellStyle: CSSProperties;
                    if (isBeforeSignup) {
                      cellStyle = { backgroundColor: "rgba(255,255,255,0.02)" };
                    } else if (completed) {
                      cellStyle = {
                        backgroundColor: habitColor,
                        opacity: completedOpacity,
                        ...(isToday && isTodaySealed ? { boxShadow: "0 0 0 2px #5eead4" } : {}),
                      };
                    } else if (isToday) {
                      cellStyle = {
                        backgroundColor: `${habitColor}40`,
                        boxShadow: isTodaySealed
                          ? `inset 0 0 0 1.5px ${habitColor}, 0 0 0 2px #5eead4`
                          : `inset 0 0 0 1.5px ${habitColor}`,
                      };
                    } else if (isFuture) {
                      cellStyle = { backgroundColor: "rgba(255,255,255,0.03)" };
                    } else {
                      cellStyle = { backgroundColor: `${habitColor}15` };
                    }

                    return (
                      <div
                        key={dateIso}
                        className="min-w-0 w-full"
                        style={{
                          gridRow: dayIndex + 1,
                          gridColumn: weekIndex + 2,
                          ...cellStyle,
                          aspectRatio: "1",
                          width: "100%",
                        }}
                        title={`${dateIso}${completed ? " ✓" : ""}`}
                      />
                    );
                  })}
                </Fragment>
              ))}
              {/* Month labels row */}
              <span style={{ gridRow: 8, gridColumn: 1 }} />
              {weeks.map((week, weekIndex) => {
                const monday = isoToLocalDate(week[0]);
                const isFirstWeekOfMonth =
                  weekIndex === 0 || isoToLocalDate(weeks[weekIndex - 1][0]).getMonth() !== monday.getMonth();
                const label = isFirstWeekOfMonth ? MONTH_ABBREV[monday.getMonth()].toUpperCase() : "";
                return (
                  <span
                    key={weekIndex}
                    className="pt-1.5 text-[9px] font-medium uppercase tracking-wider text-text-faint"
                    style={{ gridRow: 8, gridColumn: weekIndex + 2 }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
