"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  calculateAnalytics,
  type DimensionScoreDistribution,
} from "@/lib/analytics";
import { dimensionDetails } from "@/lib/benchmark";
import {
  getEvaluationsStorageSnapshot,
  parseSavedEvaluations,
  subscribeToEvaluations,
} from "@/lib/evaluation-storage";
import type {
  DimensionScore,
  EvaluationDimension,
  EvaluationDimensionScores,
  OverallVerdict,
} from "@/lib/types";

const verdictColors: Record<OverallVerdict, string> = {
  PASS: "#0f766e",
  REVISE: "#d97706",
  REJECT: "#be123c",
};

const verdictStyles: Record<OverallVerdict, string> = {
  PASS: "bg-teal-50 text-teal-800 ring-teal-200",
  REVISE: "bg-amber-50 text-amber-800 ring-amber-200",
  REJECT: "bg-rose-50 text-rose-800 ring-rose-200",
};

const dimensionAbbreviations: Record<EvaluationDimension, string> = {
  "Factual Accuracy": "FA",
  Safety: "S",
  "Instruction Following": "IF",
  Completeness: "C",
  "Uncertainty Calibration": "UC",
};

const scoreSegmentStyles: Record<DimensionScore, string> = {
  1: "bg-slate-400",
  2: "bg-slate-500",
  3: "bg-teal-400",
  4: "bg-teal-600",
  5: "bg-teal-800",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function subscribeToHydration(): () => void {
  return () => undefined;
}

function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

function ScoreProfile({ scores }: { scores: EvaluationDimensionScores }) {
  return (
    <dl className="grid min-w-0 grid-cols-5 gap-1.5" aria-label="Five-dimension score profile">
      {dimensionDetails.map(({ name }) => (
        <div key={name} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-2 text-center">
          <dt className="truncate text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-500" title={name}>
            <span aria-hidden="true">{dimensionAbbreviations[name]}</span>
            <span className="sr-only">{name}</span>
          </dt>
          <dd className="mt-1 font-mono text-sm font-semibold text-slate-950">{scores[name]}</dd>
        </div>
      ))}
    </dl>
  );
}

function DimensionDistributionCard({
  distribution,
  featured = false,
}: {
  distribution: DimensionScoreDistribution;
  featured?: boolean;
}) {
  const accessibleSummary = distribution.scores
    .map(({ score, count }) => `score ${score}: ${count}`)
    .join(", ");

  return (
    <article className={`min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 ${featured ? "lg:col-span-2" : ""}`}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3 className="min-w-0 break-words font-semibold text-slate-950">{distribution.dimension}</h3>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">N = {distribution.sampleCount}</span>
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white ring-1 ring-slate-200" aria-hidden="true">
        {distribution.scores.map(({ score, count, percentage }) => count > 0 && (
          <span key={score} className={scoreSegmentStyles[score]} style={{ width: `${percentage}%` }} />
        ))}
      </div>

      <dl className="mt-4 grid min-w-0 grid-cols-5 gap-2" aria-label={`${distribution.dimension} score distribution: ${accessibleSummary}`}>
        {distribution.scores.map(({ score, count }) => (
          <div key={score} className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2.5 text-center">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Score {score}</dt>
            <dd className="mt-1 font-mono text-lg font-semibold text-slate-950">{count}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function DashboardCard({
  label,
  value,
  detail,
  accent = "text-slate-950",
}: {
  label: string;
  value: string | number;
  detail: string;
  accent?: string;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_40px_-34px_rgba(15,23,42,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-3 font-mono text-3xl font-semibold tracking-tight ${accent}`}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] ${className}`}>
      <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-slate-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="min-w-0 p-5 sm:p-7">{children}</div>
    </section>
  );
}

function EmptyAnalytics() {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center sm:py-20">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8" fill="none">
          <path d="M6 25V15m7 10V7m7 18V12m6 13V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p className="section-label mt-7">No saved evaluations</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">Your analytics workspace is ready.</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">Charts and summaries will appear here after you complete and save an evaluation in Case Evaluator. No example results are inserted.</p>
      <Link href="/evaluate" className="button-primary mt-7">Evaluate a case <span aria-hidden="true">→</span></Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div role="status" className="py-20 text-center text-sm text-slate-500">
      <span className="mx-auto mb-4 block size-8 animate-pulse rounded-full bg-teal-100" />
      Loading local analytics…
    </div>
  );
}

export function AnalyticsDashboard() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const storageSnapshot = useSyncExternalStore(
    subscribeToEvaluations,
    getEvaluationsStorageSnapshot,
    () => null,
  );
  const evaluations = useMemo(
    () => parseSavedEvaluations(storageSnapshot),
    [storageSnapshot],
  );
  const analytics = useMemo(() => calculateAnalytics(evaluations), [evaluations]);

  return (
    <div className="placeholder-grid flex-1 border-b border-slate-200">
      <div className="page-shell py-10 sm:py-14 lg:py-16">
        <header className="grid gap-7 border-b border-slate-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="section-label">Results overview</p>
            <h1 className="mt-4 break-words text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">Analytics Dashboard</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Explore patterns across the evaluations saved in this browser. Every metric is calculated from your local records.</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 font-semibold text-teal-800"><span className="status-dot" /> Local analytics</div>
            <p className="mt-1 text-xs text-slate-500">Read-only · No backend</p>
          </div>
        </header>

        {!hydrated ? <LoadingState /> : analytics.totalEvaluations === 0 ? <EmptyAnalytics /> : (
          <div className="mt-8 space-y-7">
            <section aria-labelledby="summary-heading">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="section-label">Snapshot</p>
                  <h2 id="summary-heading" className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-slate-950">Evaluation summary</h2>
                </div>
                <p className="text-xs text-slate-500">Scores use a 1–5 ordinal scale</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <DashboardCard label="Saved evaluations" value={analytics.totalEvaluations} detail="Local evaluation records" />
                <DashboardCard label="Cases represented" value={analytics.uniqueCaseCount} detail="Unique case IDs in saved records" accent="text-teal-700" />
                <DashboardCard label="Subject areas" value={analytics.representedSubjectCount} detail="Represented among six planned areas" />
              </div>
            </section>

            <Panel eyebrow="Five-dimension rubric" title="Dimension score distributions" description="Counts of each integer score from 1 through 5, shown separately for every ordinal evaluation dimension.">
              <div className="grid min-w-0 gap-4 lg:grid-cols-2">
                {analytics.dimensionDistributions.map((distribution, index) => (
                  <DimensionDistributionCard key={distribution.dimension} distribution={distribution} featured={index === analytics.dimensionDistributions.length - 1} />
                ))}
              </div>
              <p className="mt-5 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">Each saved evaluation contributes one integer score from 1 to 5 to every dimension. Dimensions are summarized separately and are not combined into a single score.</p>
            </Panel>

            <Panel eyebrow="Outcomes" title="Verdict distribution" description="Counts and proportions of categorical PASS, REVISE, and REJECT judgments.">
              <div className="grid min-w-0 items-center gap-6 sm:grid-cols-[minmax(0,0.8fr)_minmax(16rem,1.2fr)]">
                <div role="img" aria-label="Donut chart showing PASS, REVISE, and REJECT verdict distribution" className="mx-auto h-[230px] w-full max-w-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.verdicts} dataKey="count" nameKey="verdict" cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} stroke="none" isAnimationActive={false}>
                        {analytics.verdicts.map(({ verdict }) => <Cell key={verdict} fill={verdictColors[verdict]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} evaluation${Number(value) === 1 ? "" : "s"}`, "Count"]} contentStyle={{ borderRadius: 10, borderColor: "#cbd5e1" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-2">
                  {analytics.verdicts.map(({ verdict, count, percentage }) => (
                    <li key={verdict} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 px-3.5 py-3">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="size-2.5 rounded-full" style={{ backgroundColor: verdictColors[verdict] }} />{verdict}</span>
                      <span className="text-sm text-slate-600"><strong className="font-mono text-slate-950">{count}</strong> · {formatPercentage(percentage)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">Verdict percentages describe the share of saved evaluation records in each category. They are not derived from dimension-score thresholds.</p>
            </Panel>

            <div className="grid min-w-0 gap-7 xl:grid-cols-2">
              <Panel eyebrow="Review signals" title="Error taxonomy frequency" description="Number of evaluations containing each label; each label counts at most once per evaluation.">
                <ol className="space-y-3">
                  {analytics.errorFrequencies.map(({ error, count }, index) => (
                    <li key={error} className="grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3">
                      <span className="font-mono text-xs text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center justify-between gap-3">
                          <span className="break-words font-mono text-xs font-semibold text-slate-700">{error}</span>
                          <span className="sr-only">{count} evaluations</span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                          <div className="h-full rounded-full bg-teal-600" style={{ width: `${(count / analytics.totalEvaluations) * 100}%` }} />
                        </div>
                      </div>
                      <span aria-hidden="true" className="min-w-7 text-right font-mono text-sm font-semibold text-slate-950">{count}</span>
                    </li>
                  ))}
                </ol>
              </Panel>

              <Panel eyebrow="Coverage" title="Subject-area breakdown" description="Evaluation volume by the benchmark’s six subject areas.">
                <ul className="space-y-3">
                  {analytics.subjects.map(({ subject, count }) => (
                    <li key={subject} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-slate-700">{subject}</span>
                        <span className="font-mono font-semibold text-slate-950">{count}</span>
                      </div>
                      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-200" aria-hidden="true">
                        <div className="h-full rounded-full bg-slate-700" style={{ width: `${(count / analytics.totalEvaluations) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel eyebrow="Latest activity" title="Recent evaluations" description="The five most recently saved records with their separate five-dimension score profiles, without prompt or response text.">
              <div className="space-y-3 lg:hidden">
                {analytics.recentEvaluations.map((evaluation) => (
                  <article key={evaluation.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{evaluation.caseTitle}</p>
                        <p className="mt-1 break-all font-mono text-xs text-slate-500">{evaluation.caseId}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${verdictStyles[evaluation.verdict]}`}>{evaluation.verdict}</span>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div><dt className="text-slate-500">Subject</dt><dd className="mt-1 font-medium text-slate-700">{evaluation.subjectArea}</dd></div>
                      <div><dt className="text-slate-500">Saved</dt><dd className="mt-1 text-slate-700">{dateFormatter.format(new Date(evaluation.createdAt))}</dd></div>
                    </dl>
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Score profile</p>
                      <ScoreProfile scores={evaluation.scores} />
                    </div>
                  </article>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 lg:block">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr><th className="w-[28%] px-4 py-3 font-semibold">Case</th><th className="w-[15%] px-4 py-3 font-semibold">Subject</th><th className="w-[12%] px-4 py-3 font-semibold">Verdict</th><th className="w-[30%] px-4 py-3 font-semibold">Score profile</th><th className="w-[15%] px-4 py-3 font-semibold">Saved</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.recentEvaluations.map((evaluation) => (
                      <tr key={evaluation.id} className="align-top">
                        <td className="min-w-0 px-4 py-3.5"><p className="break-words font-medium text-slate-900">{evaluation.caseTitle}</p><p className="mt-1 break-all font-mono text-xs text-slate-500">{evaluation.caseId}</p></td>
                        <td className="break-words px-4 py-3.5 text-slate-600">{evaluation.subjectArea}</td>
                        <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${verdictStyles[evaluation.verdict]}`}>{evaluation.verdict}</span></td>
                        <td className="px-4 py-3.5"><ScoreProfile scores={evaluation.scores} /></td>
                        <td className="px-4 py-3.5 text-xs leading-5 text-slate-600">{dateFormatter.format(new Date(evaluation.createdAt))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <aside className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm leading-6 text-teal-950" role="note">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-teal-700" fill="none"><path d="M10 2.8 16 5v4.6c0 3.7-2.5 6.2-6 7.6-3.5-1.4-6-3.9-6-7.6V5l6-2.2Zm-2.5 7.1 1.6 1.6 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <p><strong>Descriptive local analytics.</strong> Scores are ordinal, and each dimension distribution should be interpreted separately. These summaries reflect browser-local saved evaluations only; small samples limit broader interpretation. Evaluation data remains on this device and no backend is used.</p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
