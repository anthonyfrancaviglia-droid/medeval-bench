import type { Metadata } from "next";
import { SectionIcon, SectionPlaceholder } from "@/components/section-placeholder";

export const metadata: Metadata = { title: "Methodology", description: "Understand the MedEval Bench evaluation methodology and scoring rubric." };

export default function MethodologyPage() {
  return <SectionPlaceholder eyebrow="Transparent process" title="Make every score explainable." description="The methodology section will document case creation, scientific verification, the five-dimension scoring rubric, error taxonomy, and verdict criteria." icon={<SectionIcon path="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Zm0 0v18M4.5 7 12 11l7.5-4" />} steps={["Document case creation and review", "Define dimension scoring anchors", "Explain errors and verdict thresholds"]} note="Methodology language will be finalized alongside verified benchmark materials." />;
}
