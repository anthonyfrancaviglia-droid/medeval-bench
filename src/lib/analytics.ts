import {
  dimensionDetails,
  errorTaxonomy,
  overallVerdicts,
  subjectAreas,
} from "./benchmark";
import type {
  BenchmarkSubjectArea,
  ErrorTaxonomy,
  EvaluationDimension,
  OverallVerdict,
  SavedEvaluation,
} from "./types";

export interface DimensionAverage {
  dimension: EvaluationDimension;
  average: number;
}

export interface VerdictSummary {
  verdict: OverallVerdict;
  count: number;
  percentage: number;
}

export interface ErrorFrequency {
  error: ErrorTaxonomy;
  count: number;
}

export interface SubjectSummary {
  subject: BenchmarkSubjectArea;
  count: number;
}

export interface RecentEvaluation {
  id: string;
  caseId: string;
  caseTitle: string;
  subjectArea: BenchmarkSubjectArea;
  verdict: OverallVerdict;
  createdAt: string;
  meanScore: number;
}

export interface EvaluationAnalytics {
  totalEvaluations: number;
  overallMeanScore: number;
  dimensionAverages: DimensionAverage[];
  verdicts: VerdictSummary[];
  errorFrequencies: ErrorFrequency[];
  subjects: SubjectSummary[];
  recentEvaluations: RecentEvaluation[];
}

const dimensionNames = dimensionDetails.map(({ name }) => name);

function arithmeticMean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function getEvaluationMean(evaluation: SavedEvaluation): number {
  return arithmeticMean(dimensionNames.map((dimension) => evaluation.scores[dimension]));
}

export function calculateAnalytics(evaluations: readonly SavedEvaluation[]): EvaluationAnalytics {
  const totalEvaluations = evaluations.length;
  const allScores = evaluations.flatMap((evaluation) =>
    dimensionNames.map((dimension) => evaluation.scores[dimension]),
  );

  const dimensionAverages = dimensionNames.map((dimension) => ({
    dimension,
    average: arithmeticMean(evaluations.map((evaluation) => evaluation.scores[dimension])),
  }));

  const verdicts = overallVerdicts.map((verdict) => {
    const count = evaluations.filter((evaluation) => evaluation.verdict === verdict).length;
    return {
      verdict,
      count,
      percentage: totalEvaluations === 0 ? 0 : (count / totalEvaluations) * 100,
    };
  });

  const errorFrequencies = errorTaxonomy
    .map((error) => ({
      error,
      count: evaluations.filter((evaluation) => new Set(evaluation.errors).has(error)).length,
    }))
    .sort((left, right) => right.count - left.count || errorTaxonomy.indexOf(left.error) - errorTaxonomy.indexOf(right.error));

  const subjects = subjectAreas.map((subject) => ({
    subject,
    count: evaluations.filter((evaluation) => evaluation.case.subjectArea === subject).length,
  }));

  const recentEvaluations = [...evaluations]
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, 5)
    .map((evaluation) => ({
      id: evaluation.id,
      caseId: evaluation.case.id,
      caseTitle: evaluation.case.title,
      subjectArea: evaluation.case.subjectArea,
      verdict: evaluation.verdict,
      createdAt: evaluation.createdAt,
      meanScore: getEvaluationMean(evaluation),
    }));

  return {
    totalEvaluations,
    overallMeanScore: arithmeticMean(allScores),
    dimensionAverages,
    verdicts,
    errorFrequencies,
    subjects,
    recentEvaluations,
  };
}
