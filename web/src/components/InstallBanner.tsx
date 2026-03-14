"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { useInstallPrompt } from "@/lib/install-prompt";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "pixelmind-install-dismissed";
const AUTO_DISMISS_MS = 8_000; // Hide after 8s if user doesn't interact

/** Detect if running as installed PWA (standalone) */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function InstallBanner() {
  const { canInstall, isIOS, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const wasDismissed = localStorage.getItem(STORAGE_KEY);
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show banner for iOS or when we have the install prompt (Chrome/Android)
    if (isIOS || canInstall) setDismissed(false);
  }, [isIOS, canInstall]);

  useEffect(() => {
    if (dismissed && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  }, [dismissed]);

  // Auto-hide after a short time so it doesn't sit on the page forever
  useEffect(() => {
    if (installed || dismissed) return;
    const t = setTimeout(() => setDismissed(true), AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [installed, dismissed]);

  const handleInstall = async () => {
    await promptInstall();
    setInstalled(true);
    setDismissed(true);
  };

  const handleDismiss = () => setDismissed(true);

  if (installed || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Install PixelMind"
      className={cn(
        "fixed left-4 right-4 z-20 flex items-center gap-3 rounded-xl border border-today-card-border bg-today-card-bg px-4 py-3 shadow-lg",
        "bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-4 md:left-auto md:right-4 md:max-w-sm"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">Install PixelMind</p>
        <p className="text-xs text-text-muted">
          {isIOS
            ? "Tap Share → Add to Home Screen"
            : "Add to your home screen for quick access."}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {!isIOS && canInstall && (
          <button
            type="button"
            onClick={handleInstall}
            className="inline-flex items-center gap-1.5 rounded-lg bg-today-accent px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Download className="h-4 w-4" aria-hidden />
            Install
          </button>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="rounded-lg p-2 text-text-muted transition hover:bg-border-default hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
