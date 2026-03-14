"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker when running in the browser.
 * Keeps the SW minimal for now; add caching (e.g. Workbox) later for offline.
 */
export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((reg) => {
        if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
      })
      .catch(() => {});
  }, []);
  return null;
}
