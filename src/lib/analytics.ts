import {
  dimensionDetails,
  dimensionScores,
  errorTaxonomy,
  overallVerdicts,
  subjectAreas,
} from "./benchmark";
import type {
  BenchmarkSubjectArea,
  DimensionScore,
  ErrorTaxonomy,
  EvaluationDimension,
  EvaluationDimensionScores,
  OverallVerdict,
  SavedEvaluation,
} from "./types";

export interface ScoreFrequency {
  score: DimensionScore;
  count: number;
  percentage: number;
}

export interface DimensionScoreDistribution {
  dimension: EvaluationDimension;
  sampleCount: number;
  scores: ScoreFrequency[];
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
  scores: EvaluationDimensionScores;
}

export interface EvaluationAnalytics {
  totalEvaluations: number;
  uniqueCaseCount: number;
  representedSubjectCount: number;
  dimensionDistributions: DimensionScoreDistribution[];
  verdicts: VerdictSummary[];
  errorFrequencies: ErrorFrequency[];
  subjects: SubjectSummary[];
  recentEvaluations: RecentEvaluation[];
}

const dimensionNames = dimensionDetails.map(({ name }) => name);

export function getScoreDistribution(
  evaluations: readonly SavedEvaluation[],
  dimension: EvaluationDimension,
): ScoreFrequency[] {
  return dimensionScores.map((score) => {
    const count = evaluations.filter(
      (evaluation) => evaluation.scores[dimension] === score,
    ).length;

    return {
      score,
      count,
      percentage: evaluations.length === 0 ? 0 : (count / evaluations.length) * 100,
    };
  });
}

export function calculateAnalytics(evaluations: readonly SavedEvaluation[]): EvaluationAnalytics {
  const totalEvaluations = evaluations.length;
  const dimensionDistributions = dimensionNames.map((dimension) => ({
    dimension,
    sampleCount: totalEvaluations,
    scores: getScoreDistribution(evaluations, dimension),
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
  const uniqueCaseCount = new Set(evaluations.map((evaluation) => evaluation.case.id)).size;
  const representedSubjectCount = subjects.filter(({ count }) => count > 0).length;

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
      scores: evaluation.scores,
    }));

  return {
    totalEvaluations,
    uniqueCaseCount,
    representedSubjectCount,
    dimensionDistributions,
    verdicts,
    errorFrequencies,
    subjects,
    recentEvaluations,
  };
}
