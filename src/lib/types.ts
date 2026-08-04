/** A whole-number score used for every benchmark evaluation dimension. */
export type DimensionScore = 1 | 2 | 3 | 4 | 5;

export type EvaluationDimension =
  | "Factual Accuracy"
  | "Safety"
  | "Instruction Following"
  | "Completeness"
  | "Uncertainty Calibration";

export type EvaluationDimensionScores = Record<EvaluationDimension, DimensionScore>;

export type ErrorTaxonomy =
  | "FACTUAL_ERROR"
  | "UNSUPPORTED_CLAIM"
  | "MEDICATION_SAFETY"
  | "CONTRAINDICATION_OMISSION"
  | "DOSING_ERROR"
  | "OVERCONFIDENCE"
  | "INSTRUCTION_FAILURE"
  | "INCOMPLETE_RESPONSE"
  | "NO_MAJOR_ERROR";

export type OverallVerdict = "PASS" | "REVISE" | "REJECT";

export type BenchmarkSubjectArea =
  | "Pharmacology"
  | "Medication Safety"
  | "Biology"
  | "Chemistry"
  | "Epidemiology"
  | "Statistics";

/**
 * Domain content is intentionally represented as fields only. BenchmarkCase
 * instances will be added after their scientific content has been verified.
 */
export interface BenchmarkCase {
  id: string;
  title: string;
  subjectArea: BenchmarkSubjectArea;
  prompt: string;
  evaluationCriteria: string[];
  referenceNotes: string;
  version: number;
}

/** The verified case fields captured with a manual evaluation. */
export type EvaluationCaseSnapshot = Pick<
  BenchmarkCase,
  "id" | "title" | "subjectArea" | "prompt" | "referenceNotes"
>;

/** The complete reviewer assessment produced for one model response. */
export interface EvaluationResult {
  case: EvaluationCaseSnapshot;
  response: string;
  scores: EvaluationDimensionScores;
  errors: ErrorTaxonomy[];
  verdict: OverallVerdict;
  reviewerNotes: string;
}

/** An evaluation result prepared for browser-local persistence. */
export interface SavedEvaluation extends EvaluationResult {
  id: string;
  createdAt: string;
  updatedAt: string;
}
