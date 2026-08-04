import { benchmarkCases } from "@/data/benchmark-cases";
import type { BenchmarkCase, BenchmarkSubjectArea } from "./types";

export type SubjectFilter = BenchmarkSubjectArea | "ALL";

export interface BenchmarkCaseFilters {
  query: string;
  subject: SubjectFilter;
}

export function getBenchmarkCaseById(id: string): BenchmarkCase | undefined {
  return benchmarkCases.find((benchmarkCase) => benchmarkCase.id === id);
}

export function filterBenchmarkCases(
  cases: readonly BenchmarkCase[],
  filters: BenchmarkCaseFilters,
): BenchmarkCase[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return cases.filter((benchmarkCase) => {
    const matchesSubject =
      filters.subject === "ALL" || benchmarkCase.subjectArea === filters.subject;
    const searchableText = [
      benchmarkCase.id,
      benchmarkCase.title,
      ...(benchmarkCase.tags ?? []),
    ].join(" ").toLowerCase();

    return matchesSubject && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
}
