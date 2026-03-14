"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTodayPrompt } from "@/lib/journal-prompts";
import { cn } from "@/lib/utils";

const MOODS = [
  { key: "calm", emoji: "😌", label: "calm" },
  { key: "good", emoji: "😊", label: "good" },
  { key: "energized", emoji: "🤩", label: "energized" },
  { key: "anxious", emoji: "😰", label: "anxious" },
  { key: "frustrated", emoji: "😤", label: "frustrated" },
  { key: "tired", emoji: "🥱", label: "tired" },
] as const;

type MoodKey = (typeof MOODS)[number]["key"];

const MOOD_COLORS: Record<MoodKey, string> = {
  calm: "#5eead4",
  good: "#86efac",
  energized: "#fde68a",
  anxious: "#fca5a5",
  frustrated: "#f97316",
  tired: "#94a3b8",
};

export type SealEntry = {
  mood: string;
  promptId: number;
  promptResponse: string;
  freeText: string;
};

type Props = {
  todayIso: string;
  /** Called immediately when user taps "Seal" — fire API call here (concurrent with animation). */
  onSeal: (entry: SealEntry) => void;
  /** Called after the animation completes. Switch tab here. */
  onAnimationDone: () => void;
};

type Phase = "idle" | "sealing";

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function JournalRitualFlow({ todayIso, onSeal, onAnimationDone }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [promptResponse, setPromptResponse] = useState("");
  const [freeText, setFreeText] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const today = getTodayPrompt();

  const canSeal = selectedMood !== null && phase === "idle";
  const moodColor = selectedMood ? MOOD_COLORS[selectedMood] : "#5eead4";
  const moodEmoji = selectedMood ? MOODS.find((m) => m.key === selectedMood)?.emoji : null;

  const handleMoodSelect = (mood: MoodKey) => {
    if (phase !== "idle") return;
    setSelectedMood((prev) => (prev === mood ? null : mood));
  };

  const handleSeal = () => {
    if (!selectedMood || phase !== "idle") return;

    onSeal({
      mood: selectedMood,
      promptId: today.id,
      promptResponse,
      freeText,
    });

    setPhase("sealing");

    // Cinematic moment lasts ~2.4s, then hand off
    setTimeout(onAnimationDone, 2600);
  };

  return (
    <>
      {/* ── Cinematic seal overlay ── */}
      <AnimatePresence>
        {phase === "sealing" && selectedMood && (
          <motion.div
            key="seal-screen"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Top glow line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: moodColor,
                boxShadow: `0 0 24px 6px ${moodColor}80`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            />

            {/* Bottom glow line */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{
                background: moodColor,
                boxShadow: `0 0 24px 6px ${moodColor}80`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
            />

            {/* Radial glow behind the star */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 280,
                height: 280,
                background: `radial-gradient(circle, ${moodColor}22 0%, transparent 70%)`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            />

            {/* Date */}
            <motion.p
              className="text-[11px] tracking-[0.35em] uppercase text-white/30"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              {formatDisplayDate(todayIso)}
            </motion.p>

            {/* ✦ star */}
            <motion.div
              className="mt-5 select-none"
              style={{
                fontSize: 72,
                color: moodColor,
                textShadow: `0 0 32px ${moodColor}, 0 0 80px ${moodColor}60`,
                lineHeight: 1,
              }}
              initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.55,
                duration: 0.55,
                type: "spring",
                damping: 10,
                stiffness: 120,
              }}
            >
              ✦
            </motion.div>

            {/* Mood emoji + label */}
            <motion.div
              className="mt-5 flex items-center gap-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <span className="text-2xl leading-none">{moodEmoji}</span>
              <span
                className="text-sm font-medium capitalize"
                style={{ color: moodColor }}
              >
                {selectedMood}
              </span>
            </motion.div>

            {/* "Day sealed" label */}
            <motion.p
              className="mt-6 text-[10px] tracking-[0.5em] uppercase text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.25, duration: 0.5 }}
            >
              Day sealed
            </motion.p>

            {/* Fade-out veil — appears near the end to smooth the transition */}
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ritual form ── */}
      <div className="relative flex flex-col gap-6 py-4">
        {/* Step 1: Mood selector */}
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-widest text-text-faint">
            How did today feel?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                type="button"
                onClick={() => handleMoodSelect(mood.key)}
                disabled={phase !== "idle"}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border py-3 text-center transition",
                  selectedMood === mood.key
                    ? "border-today-accent bg-today-accent/15 text-today-accent"
                    : "border-today-card-border bg-today-card-bg text-text-muted hover:text-text-primary"
                )}
              >
                <span className="text-xl leading-none">{mood.emoji}</span>
                <span className="text-[11px] font-medium capitalize">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Prompt + optional free write */}
        <AnimatePresence initial={false}>
          {selectedMood && (
            <motion.div
              key="prompt-section"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-text-primary">{today.text}</p>
                <textarea
                  className="w-full rounded-xl border border-today-card-border bg-today-card-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-today-accent resize-none"
                  placeholder="Write your answer…"
                  rows={3}
                  value={promptResponse}
                  onChange={(e) => setPromptResponse(e.target.value)}
                  disabled={phase !== "idle"}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-text-faint">Anything else?</p>
                <textarea
                  className="w-full rounded-xl border border-today-card-border bg-today-card-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:ring-1 focus:ring-today-accent resize-none"
                  placeholder="Optional…"
                  rows={2}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  disabled={phase !== "idle"}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seal button */}
        <AnimatePresence initial={false}>
          {selectedMood && (
            <motion.button
              key="seal-btn"
              type="button"
              onClick={handleSeal}
              disabled={!canSeal}
              className="w-full rounded-full py-3.5 text-sm font-semibold text-black transition disabled:opacity-40"
              style={{ backgroundColor: moodColor }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.97 }}
            >
              ✦ Seal the day
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
