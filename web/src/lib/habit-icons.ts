export type IconCategory = {
  category: string;
  icons: string[];
};

export const HABIT_ICONS: IconCategory[] = [
  {
    category: "Physical",
    icons: ["🏃", "🚶", "💪", "🧘", "🚴", "🤸", "🌊", "⚽"],
  },
  {
    category: "Wellness",
    icons: ["💧", "🌙", "😴", "💊", "🥗", "🍎", "🛁", "🍵"],
  },
  {
    category: "Mind / Work",
    icons: ["🎯", "🧠", "✍️", "📚", "🎨", "🎵", "🌱", "🙏"],
  },
  {
    category: "Habits",
    icons: ["☀️", "📱", "🧹", "💰", "🌿", "⭐", "🔥", "📖"],
  },
];

export const ICON_SUGGESTIONS: Record<string, string> = {
  run: "🏃",
  jog: "🏃",
  walk: "🚶",
  exercise: "💪",
  workout: "💪",
  gym: "💪",
  meditat: "🧘",
  yoga: "🧘",
  bike: "🚴",
  cycl: "🚴",
  stretch: "🤸",
  swim: "🌊",
  sport: "⚽",
  water: "💧",
  drink: "💧",
  sleep: "🌙",
  bed: "🌙",
  nap: "😴",
  rest: "😴",
  vitamin: "💊",
  medicine: "💊",
  diet: "🥗",
  eat: "🍎",
  food: "🍎",
  skin: "🛁",
  bath: "🛁",
  tea: "🍵",
  coffee: "🍵",
  focus: "🎯",
  deep: "🎯",
  learn: "🧠",
  study: "🧠",
  journal: "✍️",
  writ: "✍️",
  read: "📚",
  book: "📚",
  art: "🎨",
  draw: "🎨",
  music: "🎵",
  pract: "🎵",
  plant: "🌱",
  garden: "🌱",
  gratitude: "🙏",
  pray: "🙏",
  morning: "☀️",
  wake: "☀️",
  phone: "📱",
  screen: "📱",
  clean: "🧹",
  chore: "🧹",
  saving: "💰",
  financ: "💰",
  nature: "🌿",
  outside: "🌿",
};

export function suggestIcon(name: string): string {
  const lower = name.trim().toLowerCase();
  if (!lower) return "⭐";
  for (const [keyword, icon] of Object.entries(ICON_SUGGESTIONS)) {
    if (lower.includes(keyword)) return icon;
  }
  return "⭐";
}
