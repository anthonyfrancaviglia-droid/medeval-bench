import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Explore locally calculated MedEval Bench evaluation patterns and results.",
};

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
