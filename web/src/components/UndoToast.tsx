"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type UndoToastProps = {
  habitName: string | null;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
};

export function UndoToast({ habitName, onUndo, onDismiss, durationMs = 3000 }: UndoToastProps) {
  useEffect(() => {
    if (!habitName) return;
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [habitName, onDismiss, durationMs]);

  return (
    <AnimatePresence>
      {habitName && (
        <motion.div
          key="undo-toast"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-today-card-border bg-bg-surface px-4 py-3 shadow-lg md:hidden"
          style={{
            bottom: "calc(56px + max(1rem, env(safe-area-inset-bottom)) + 0.5rem)",
          }}
        >
          <span className="text-sm text-text-primary">
            <span className="font-medium">{habitName}</span> completed
          </span>
          <button
            type="button"
            onClick={onUndo}
            className="text-sm font-semibold text-today-accent hover:opacity-80"
          >
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
