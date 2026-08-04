import type { Metadata } from "next";
import { SectionIcon, SectionPlaceholder } from "@/components/section-placeholder";

export const metadata: Metadata = { title: "About", description: "Learn about the purpose and boundaries of MedEval Bench." };

export default function AboutPage() {
  return <SectionPlaceholder eyebrow="Project context" title="A portfolio project for careful evaluation." description="MedEval Bench explores transparent, human-reviewed LLM evaluation in educational healthcare and STEM contexts. It is not a medical device or clinical decision-support system." icon={<SectionIcon path="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-11v6m0-9v.1" />} steps={["Clarify the project’s educational purpose", "Share design and architecture decisions", "State limitations and non-clinical boundaries"]} note="Project notes and authorship details will be added as the benchmark develops." action={{ label: "Read the methodology", href: "/methodology" }} />;
}
