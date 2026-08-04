import type { Metadata } from "next";
import { CaseBrowser } from "@/components/cases/case-browser";
import { getBenchmarkCases } from "@/lib/benchmark-cases";

export const metadata: Metadata = {
  title: "Benchmark Cases",
  description: "Browse personally verified synthetic cases available in MedEval Bench.",
};

export default function CasesPage() {
  return <CaseBrowser cases={getBenchmarkCases()} />;
}
