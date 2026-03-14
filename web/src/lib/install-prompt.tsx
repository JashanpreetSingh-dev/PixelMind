"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallPromptContextValue = {
  canInstall: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<void>;
};

const InstallPromptContext = createContext<InstallPromptContextValue>({
  canInstall: false,
  isIOS: false,
  promptInstall: async () => {},
});

function getIsIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(getIsIOS());
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const value: InstallPromptContextValue = {
    canInstall: !!deferredPrompt,
    isIOS,
    promptInstall,
  };

  return (
    <InstallPromptContext.Provider value={value}>
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  return useContext(InstallPromptContext);
}
