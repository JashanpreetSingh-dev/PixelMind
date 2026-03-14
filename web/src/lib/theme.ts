/**
 * Midnight Mosaic habit palette (design.md).
 * Use for pixel grid and any habit color picker.
 * Index 1–8; habit.color from API may be one of these hex values.
 */
export const HABIT_PALETTE = [
  { index: 1, name: "Sage", hex: "#86efac" },
  { index: 2, name: "Sky", hex: "#7dd3fc" },
  { index: 3, name: "Lavender", hex: "#c4b5fd" },
  { index: 4, name: "Peach", hex: "#fdba74" },
  { index: 5, name: "Rose", hex: "#f9a8d4" },
  { index: 6, name: "Mint", hex: "#99f6e4" },
  { index: 7, name: "Amber", hex: "#fcd34d" },
  { index: 8, name: "Slate", hex: "#cbd5e1" },
  { index: 9, name: "Coral", hex: "#fb7185" },
  { index: 10, name: "Violet", hex: "#a78bfa" },
  { index: 11, name: "Teal", hex: "#2dd4bf" },
  { index: 12, name: "Gold", hex: "#f59e0b" },
  { index: 13, name: "Lilac", hex: "#e879f9" },
  { index: 14, name: "Ocean", hex: "#38bdf8" },
  { index: 15, name: "Crimson", hex: "#f43f5e" },
  { index: 16, name: "Forest", hex: "#4ade80" },
] as const;

export const HABIT_COLORS = HABIT_PALETTE.map((p) => p.hex);
