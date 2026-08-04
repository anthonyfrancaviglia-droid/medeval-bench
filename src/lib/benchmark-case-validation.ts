import { subjectAreas } from "./benchmark";
import type { BenchmarkCase, BenchmarkSubjectArea } from "./types";

const evaluationOnlyFields = [
  "modelResponse",
  "response",
  "scores",
  "errorLabels",
  "errors",
  "verdict",
  "reviewerNotes",
  "evaluationTimestamp",
  "createdAt",
  "updatedAt",
  "analytics",
  "savedEvaluationId",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertNonEmptyString(
  value: unknown,
  field: string,
  location: string,
): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`[benchmark-cases] ${location}.${field} must be a non-empty string.`);
  }
}

function isSupportedSubjectArea(value: string): value is BenchmarkSubjectArea {
  return (subjectAreas as readonly string[]).includes(value);
}

/**
 * Fails fast when the static verified-case collection is malformed.
 * The assertion returns the original collection unchanged.
 */
export function assertValidBenchmarkCases(
  cases: readonly unknown[],
): asserts cases is readonly BenchmarkCase[] {
  const caseIds = new Set<string>();

  cases.forEach((candidate, index) => {
    const location = `benchmarkCases[${index}]`;

    if (!isRecord(candidate)) {
      throw new Error(`[benchmark-cases] ${location} must be an object.`);
    }

    assertNonEmptyString(candidate.id, "id", location);
    assertNonEmptyString(candidate.title, "title", location);
    assertNonEmptyString(candidate.subjectArea, "subjectArea", location);
    assertNonEmptyString(candidate.prompt, "prompt", location);
    assertNonEmptyString(candidate.referenceNotes, "referenceNotes", location);

    if (candidate.id !== candidate.id.trim()) {
      throw new Error(`[benchmark-cases] ${location}.id must not contain surrounding whitespace.`);
    }

    if (caseIds.has(candidate.id)) {
      throw new Error(`[benchmark-cases] Duplicate case ID "${candidate.id}".`);
    }
    caseIds.add(candidate.id);

    if (!isSupportedSubjectArea(candidate.subjectArea)) {
      throw new Error(
        `[benchmark-cases] ${location}.subjectArea "${candidate.subjectArea}" is not supported.`,
      );
    }

    if (candidate.verificationStatus !== "VERIFIED") {
      throw new Error(
        `[benchmark-cases] ${location}.verificationStatus must be "VERIFIED".`,
      );
    }

    if (!Number.isInteger(candidate.version) || Number(candidate.version) <= 0) {
      throw new Error(`[benchmark-cases] ${location}.version must be a positive integer.`);
    }

    if (
      !Array.isArray(candidate.evaluationCriteria) ||
      !candidate.evaluationCriteria.every((criterion) => typeof criterion === "string")
    ) {
      throw new Error(`[benchmark-cases] ${location}.evaluationCriteria must be a string array.`);
    }

    if (
      candidate.tags !== undefined &&
      (!Array.isArray(candidate.tags) ||
        !candidate.tags.every(
          (tag) => typeof tag === "string" && tag.trim().length > 0,
        ))
    ) {
      throw new Error(
        `[benchmark-cases] ${location}.tags must contain only non-empty strings when provided.`,
      );
    }

    for (const field of evaluationOnlyFields) {
      if (Object.hasOwn(candidate, field)) {
        throw new Error(
          `[benchmark-cases] ${location} contains evaluation-only field "${field}".`,
        );
      }
    }
  });
}
