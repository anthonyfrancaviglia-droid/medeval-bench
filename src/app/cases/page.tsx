import type { Metadata } from "next";
import { SectionIcon, SectionPlaceholder } from "@/components/section-placeholder";

export const metadata: Metadata = { title: "Benchmark Cases", description: "Browse the verified synthetic cases in MedEval Bench." };

export default function CasesPage() {
  return <SectionPlaceholder eyebrow="Case library" title="A benchmark built on verified cases." description="This library will organize synthetic educational cases by subject area and make their review status and evaluation criteria easy to inspect." icon={<SectionIcon path="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5Z" />} steps={["Filter by benchmark subject", "Inspect case scope and version", "Open a case in the evaluator"]} note="Scientific content will appear only after personal verification by the project owner." />;
}
