import type { AnalysisEntry } from "./analysis-types";

const STORAGE_KEY = "placement-analysis-history";

export function getHistory(): AnalysisEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse analysis history", e);
    return [];
  }
}

export function saveEntry(entry: AnalysisEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getEntryById(id: string): AnalysisEntry | undefined {
  return getHistory().find(e => e.id === id);
}

export function deleteEntry(id: string): void {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateEntry(updatedEntry: AnalysisEntry): void {
  const history = getHistory();
  const index = history.findIndex(e => e.id === updatedEntry.id);
  if (index !== -1) {
    history[index] = updatedEntry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}
