import type { SavedEvaluation } from "./types";

export const EVALUATIONS_STORAGE_KEY = "medeval-bench:evaluations:v1";

function readSavedEvaluations(): SavedEvaluation[] {
  const storedValue = window.localStorage.getItem(EVALUATIONS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? (parsed as SavedEvaluation[]) : [];
  } catch {
    return [];
  }
}

export function createEvaluationId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `evaluation-${globalThis.crypto.randomUUID()}`;
  }

  return `evaluation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveEvaluation(evaluation: SavedEvaluation): void {
  const evaluations = readSavedEvaluations();
  window.localStorage.setItem(
    EVALUATIONS_STORAGE_KEY,
    JSON.stringify([...evaluations, evaluation]),
  );
}
