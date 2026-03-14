import { HABIT_PALETTE } from "./theme";

export type PredefinedHabit = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

/**
 * Curated starter habits shown during onboarding.
 * Colors are drawn from HABIT_PALETTE so they work with the mosaic and edit sheet.
 */
export const PREDEFINED_HABITS: PredefinedHabit[] = [
  { id: "read",     name: "Read 20 pages",    color: HABIT_PALETTE[1].hex, icon: "📚" },
  { id: "walk",     name: "Evening walk",      color: HABIT_PALETTE[2].hex, icon: "🚶" },
  { id: "sleep",    name: "Sleep by 10pm",     color: HABIT_PALETTE[3].hex, icon: "🌙" },
  { id: "water",    name: "Drink water",       color: HABIT_PALETTE[0].hex, icon: "💧" },
  { id: "meditate", name: "Meditate 10 min",   color: HABIT_PALETTE[4].hex, icon: "🧘" },
  { id: "workout",  name: "Exercise",          color: HABIT_PALETTE[5].hex, icon: "🏃" },
  { id: "journal",  name: "Write in journal",  color: HABIT_PALETTE[6].hex, icon: "✍️" },
  { id: "focus",    name: "Deep work block",   color: HABIT_PALETTE[7].hex, icon: "💻" },
];
