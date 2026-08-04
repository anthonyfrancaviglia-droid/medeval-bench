import type { Metadata } from "next";
import { CaseEvaluator } from "@/components/evaluator/case-evaluator";

export const metadata: Metadata = {
  title: "Case Evaluator",
  description: "Manually score and save model response evaluations with the MedEval Bench rubric.",
};

export default function EvaluatePage() {
  return <CaseEvaluator />;
}
