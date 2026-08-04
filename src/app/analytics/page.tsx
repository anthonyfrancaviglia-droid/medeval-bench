import type { Metadata } from "next";
import { SectionIcon, SectionPlaceholder } from "@/components/section-placeholder";

export const metadata: Metadata = { title: "Analytics", description: "Explore MedEval Bench evaluation patterns and results." };

export default function AnalyticsPage() {
  return <SectionPlaceholder eyebrow="Results overview" title="Turn evaluations into clear signals." description="Analytics will summarize saved evaluations so patterns across dimensions, error labels, verdicts, and subject areas remain easy to understand." icon={<SectionIcon path="M5 20V10m5 10V4m5 16v-7m5 7V7" />} steps={["Compare dimension score patterns", "Review error taxonomy frequency", "Explore results by subject area"]} note="Visual summaries will use locally saved evaluation data; no backend is required." />;
}
