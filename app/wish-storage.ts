"use client";

import { useMemo, useSyncExternalStore } from "react";

export const WISH_STORAGE_KEY = "priya-birthday-wishes-v1";
const changedEvent = "priya-wishes-changed";
let memoryFallback: string | undefined;
export type SavedWish = { text: string; slot: number };

function snapshot() {
  if (memoryFallback !== undefined) return memoryFallback;
  try { return localStorage.getItem(WISH_STORAGE_KEY) ?? ""; }
  catch { return ""; }
}
function subscribe(callback: () => void) {
  const otherTab = (event: StorageEvent) => {
    if (event.key === WISH_STORAGE_KEY || event.key === null) { memoryFallback = undefined; callback(); }
  };
  window.addEventListener("storage", otherTab);
  window.addEventListener(changedEvent, callback);
  return () => { window.removeEventListener("storage", otherTab); window.removeEventListener(changedEvent, callback); };
}

export function useSavedWishes() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const wishes = useMemo<SavedWish[]>(() => {
    try {
      const data: unknown = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter((item): item is SavedWish => typeof item?.text === "string" && item.text.trim().length > 0 && item.text.length <= 80 && Number.isInteger(item.slot) && item.slot >= 0 && item.slot < 6)
        .filter((item, i, all) => all.findIndex(other => other.slot === item.slot) === i).slice(0, 6);
    } catch { return []; }
  }, [raw]);

  function save(next: SavedWish[]) {
    const value = JSON.stringify(next);
    let persisted = true;
    try { localStorage.setItem(WISH_STORAGE_KEY, value); memoryFallback = undefined; }
    catch { memoryFallback = value; persisted = false; }
    window.dispatchEvent(new Event(changedEvent));
    return persisted;
  }
  return { wishes, save };
}
