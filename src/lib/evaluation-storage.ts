import type { SavedEvaluation } from "./types";
import {
  dimensionDetails,
  errorTaxonomy,
  overallVerdicts,
  subjectAreas,
} from "./benchmark";

export const EVALUATIONS_STORAGE_KEY = "medeval-bench:evaluations:v1";
const EVALUATIONS_UPDATED_EVENT = "medeval-bench:evaluations-updated";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSavedEvaluation(value: unknown): value is SavedEvaluation {
  if (!isRecord(value) || !isRecord(value.case) || !isRecord(value.scores)) {
    return false;
  }

  const caseValue = value.case;
  const scoreValues = value.scores;
  const validCase =
    typeof caseValue.id === "string" &&
    typeof caseValue.title === "string" &&
    typeof caseValue.prompt === "string" &&
    typeof caseValue.referenceNotes === "string" &&
    subjectAreas.some((subject) => subject === caseValue.subjectArea);
  const validScores = dimensionDetails.every(({ name }) => {
    const score = scoreValues[name];
    return typeof score === "number" && Number.isInteger(score) && score >= 1 && score <= 5;
  });
  const validErrors =
    Array.isArray(value.errors) &&
    value.errors.length > 0 &&
    value.errors.every((error) => errorTaxonomy.some((label) => label === error));

  return Boolean(
    validCase &&
    validScores &&
    validErrors &&
    typeof value.id === "string" &&
    typeof value.response === "string" &&
    typeof value.reviewerNotes === "string" &&
    typeof value.createdAt === "string" &&
    Number.isFinite(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === "string" &&
    overallVerdicts.some((verdict) => verdict === value.verdict)
  );
}

export function getEvaluationsStorageSnapshot(): string | null {
  try {
    return window.localStorage.getItem(EVALUATIONS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function parseSavedEvaluations(storedValue: string | null): SavedEvaluation[] {
  if (!storedValue) return [];

  try {
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter(isSavedEvaluation) : [];
  } catch {
    return [];
  }
}

export function getSavedEvaluations(): SavedEvaluation[] {
  return parseSavedEvaluations(getEvaluationsStorageSnapshot());
}

export function subscribeToEvaluations(onStoreChange: () => void): () => void {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVALUATIONS_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVALUATIONS_UPDATED_EVENT, onStoreChange);
  };
}

export function createEvaluationId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `evaluation-${globalThis.crypto.randomUUID()}`;
  }

  return `evaluation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveEvaluation(evaluation: SavedEvaluation): void {
  const evaluations = getSavedEvaluations();
  window.localStorage.setItem(
    EVALUATIONS_STORAGE_KEY,
    JSON.stringify([...evaluations, evaluation]),
  );
  window.dispatchEvent(new Event(EVALUATIONS_UPDATED_EVENT));
}
