import type { Metadata } from "next";
import { CaseEvaluator } from "@/components/evaluator/case-evaluator";
import { getBenchmarkCaseById } from "@/lib/benchmark-cases";

export const metadata: Metadata = {
  title: "Case Evaluator",
  description: "Manually score and save model response evaluations with the MedEval Bench rubric.",
};

export default async function EvaluatePage({ searchParams }: PageProps<"/evaluate">) {
  const requestedCaseIdValue = (await searchParams).caseId;
  const requestedCaseId = Array.isArray(requestedCaseIdValue)
    ? requestedCaseIdValue[0]
    : requestedCaseIdValue;
  const benchmarkCase = requestedCaseId
    ? getBenchmarkCaseById(requestedCaseId)
    : undefined;

  return (
    <CaseEvaluator
      key={benchmarkCase?.id ?? requestedCaseId ?? "manual"}
      benchmarkCase={benchmarkCase}
      requestedCaseId={requestedCaseId}
    />
  );
}
