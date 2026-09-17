/**
 * Client-only persistence for the fortune jar (drawn-stick history and the
 * daily-visit streak). Mirrors the rest of the app's no-backend design —
 * everything lives in localStorage and is namespaced per journal id.
 */

export interface FortuneState {
  /** Regular sticks drawn since the jar was last "refilled". */
  drawnIds: string[];
  /** Hidden sticks ever opened — once seen, gone for good. */
  drawnHiddenIds: string[];
  /** Local date (YYYY-MM-DD) of the last time the jar was opened. */
  lastVisitDate: string | null;
  /** Consecutive days the jar has been opened, ending on lastVisitDate. */
  streak: number;
}

function storageKey(journalId: string) {
  return `unfold:fortune:${journalId}`;
}

function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function defaultState(): FortuneState {
  return { drawnIds: [], drawnHiddenIds: [], lastVisitDate: null, streak: 0 };
}

export function loadFortuneState(journalId: string): FortuneState {
  try {
    const raw = localStorage.getItem(storageKey(journalId));
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveFortuneState(journalId: string, state: FortuneState) {
  try {
    localStorage.setItem(storageKey(journalId), JSON.stringify(state));
  } catch {
    // Private browsing / quota exceeded — the jar still works, just without memory.
  }
}

/** Call once per jar opening. Bumps the streak the first time a new day is seen. */
export function registerVisit(journalId: string, now = new Date()): FortuneState {
  const state = loadFortuneState(journalId);
  const today = dateKey(now);
  if (state.lastVisitDate === today) return state;

  const yesterday = dateKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const streak = state.lastVisitDate === yesterday ? state.streak + 1 : 1;
  const next: FortuneState = { ...state, lastVisitDate: today, streak };
  saveFortuneState(journalId, next);
  return next;
}

export function recordDraw(journalId: string, stickId: string, hidden: boolean): FortuneState {
  const state = loadFortuneState(journalId);
  const next: FortuneState = hidden
    ? { ...state, drawnHiddenIds: [...new Set([...state.drawnHiddenIds, stickId])] }
    : { ...state, drawnIds: [...new Set([...state.drawnIds, stickId])] };
  saveFortuneState(journalId, next);
  return next;
}

/** Empties the drawn-regular-stick history so the jar can be refilled. */
export function resetDrawnCycle(journalId: string): FortuneState {
  const state = loadFortuneState(journalId);
  const next: FortuneState = { ...state, drawnIds: [] };
  saveFortuneState(journalId, next);
  return next;
}
