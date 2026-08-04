import type { Metadata } from "next";
import { SectionIcon, SectionPlaceholder } from "@/components/section-placeholder";

export const metadata: Metadata = { title: "Case Evaluator", description: "Score and review model responses with the MedEval Bench rubric." };

export default function EvaluatePage() {
  return <SectionPlaceholder eyebrow="Evaluation workspace" title="Review one response at a time." description="A focused workspace will pair each verified case with a model response, five dimension scores, error labels, and an overall verdict." icon={<SectionIcon path="M7 3.5h10M7 20.5h10M8 6.5h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Zm1 4h6m-6 3h6m-6 3h4" />} steps={["Select a verified benchmark case", "Score all five evaluation dimensions", "Assign errors and an overall verdict"]} note="Evaluations will be stored privately in this browser with localStorage." action={{ label: "Browse benchmark cases", href: "/cases" }} />;
}
