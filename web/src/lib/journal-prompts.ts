export const PROMPT_LIST: string[] = [
  "What's one moment from today you want to remember?",
  "What felt hard today — and did you get through it?",
  "How does your body feel right now?",
  "What's one thing you did for yourself today?",
  "What would you tell tomorrow-you?",
  "What surprised you today?",
  "Who made today better, even a little?",
  "What did you let go of today?",
  "What are you looking forward to tomorrow?",
  "What's something you noticed today that you usually rush past?",
  "If today had a title, what would it be?",
  "What did you learn — about anything?",
  "What do you wish had gone differently?",
  "What made you smile today?",
  "How did you show up for yourself today?",
];

/** Returns the prompt for the current calendar day (same for all users on the same date). */
export function getTodayPrompt(): { id: number; text: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const id = dayOfYear % PROMPT_LIST.length;
  return { id, text: PROMPT_LIST[id] };
}

/** Returns the prompt text for a stored prompt_id. */
export function getPromptById(id: number): string {
  return PROMPT_LIST[id % PROMPT_LIST.length] ?? PROMPT_LIST[0];
}
