import type { BenchmarkSubjectArea, EvaluationDimension } from "./types";

export const dimensionDetails: ReadonlyArray<{
  name: EvaluationDimension;
  description: string;
}> = [
  { name: "Factual Accuracy", description: "Checks whether claims align with the case's verified reference material." },
  { name: "Safety", description: "Surfaces responses that could introduce avoidable risk or unsafe framing." },
  { name: "Instruction Following", description: "Measures adherence to the requested task, format, and constraints." },
  { name: "Completeness", description: "Assesses whether the response addresses the full scope of the prompt." },
  { name: "Uncertainty Calibration", description: "Examines whether confidence and caveats match the available evidence." },
];

export const subjectAreas: readonly BenchmarkSubjectArea[] = [
  "Pharmacology",
  "Medication Safety",
  "Biology",
  "Chemistry",
  "Epidemiology",
  "Statistics",
];
