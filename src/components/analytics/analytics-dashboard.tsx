"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateAnalytics } from "@/lib/analytics";
import {
  getEvaluationsStorageSnapshot,
  parseSavedEvaluations,
  subscribeToEvaluations,
} from "@/lib/evaluation-storage";
import type { OverallVerdict } from "@/lib/types";

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

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function subscribeToHydration(): () => void {
  return () => undefined;
}

function formatScore(score: number): string {
  return score.toFixed(2);
}

function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <DashboardCard label="Saved evaluations" value={analytics.totalEvaluations} detail="Local evaluation records" />
                <DashboardCard label="Descriptive rating mean" value={formatScore(analytics.overallMeanScore)} detail="Arithmetic summary of all ordinal ratings—not a quality score" accent="text-teal-700" />
                {analytics.verdicts.map(({ verdict, count }) => <DashboardCard key={verdict} label={verdict} value={count} detail={`Evaluations marked ${verdict}`} accent={verdict === "PASS" ? "text-teal-700" : verdict === "REVISE" ? "text-amber-700" : "text-rose-700"} />)}
              </div>
              <aside className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950" role="note">
                <strong>Ordinal-score note.</strong> Arithmetic means shown here are pre-existing descriptive summaries of ordinal ratings. They are not validated interval measurements, a composite quality score, or verdict thresholds; interpret each dimension individually and in context.
              </aside>
            </section>

            <div className="grid min-w-0 gap-7 xl:grid-cols-[1.3fr_0.7fr]">
              <Panel eyebrow="Five-dimension rubric" title="Dimension performance" description="Descriptive arithmetic mean for each ordinal dimension across all saved evaluations.">
                <div role="img" aria-label="Horizontal bar chart of average scores for the five evaluation dimensions on a 1 to 5 scale" className="h-[340px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.dimensionAverages} layout="vertical" margin={{ top: 4, right: 24, bottom: 8, left: 8 }}>
                      <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
                      <YAxis type="category" dataKey="dimension" width={164} tick={{ fill: "#334155", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} / 5`, "Average"]} cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: 10, borderColor: "#cbd5e1", boxShadow: "0 10px 30px -18px rgba(15,23,42,.4)" }} />
                      <Bar dataKey="average" fill="#0f766e" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <dl className="mt-5 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
                  {analytics.dimensionAverages.map(({ dimension, average }) => (
                    <div key={dimension} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
                      <dt className="text-slate-600">{dimension}</dt>
                      <dd className="shrink-0 font-mono font-semibold text-slate-950">{formatScore(average)}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>

              <Panel eyebrow="Outcomes" title="Verdict distribution" description="Counts and share of all locally saved evaluations.">
                <div role="img" aria-label="Donut chart showing PASS, REVISE, and REJECT verdict distribution" className="mx-auto h-[230px] max-w-sm">
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
              </Panel>
            </div>

            <div className="grid min-w-0 gap-7 xl:grid-cols-2">
              <Panel eyebrow="Review signals" title="Error taxonomy frequency" description="Number of evaluations containing each label; each label counts at most once per evaluation.">
                <ol className="space-y-3">
                  {analytics.errorFrequencies.map(({ error, count }, index) => (
                    <li key={error} className="grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-3">
                      <span className="font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>
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

            <Panel eyebrow="Latest activity" title="Recent evaluations" description="The five most recently saved records, without prompt or response text.">
              <div className="space-y-3 md:hidden">
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
                      <div><dt className="text-slate-400">Subject</dt><dd className="mt-1 font-medium text-slate-700">{evaluation.subjectArea}</dd></div>
                      <div><dt className="text-slate-400">Descriptive mean</dt><dd className="mt-1 font-mono font-semibold text-slate-950">{formatScore(evaluation.meanScore)} / 5</dd></div>
                      <div className="col-span-2"><dt className="text-slate-400">Saved</dt><dd className="mt-1 text-slate-700">{dateFormatter.format(new Date(evaluation.createdAt))}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr><th className="w-[34%] px-4 py-3 font-semibold">Case</th><th className="w-[20%] px-4 py-3 font-semibold">Subject</th><th className="w-[13%] px-4 py-3 font-semibold">Verdict</th><th className="w-[13%] px-4 py-3 text-right font-semibold">Descriptive mean</th><th className="w-[20%] px-4 py-3 font-semibold">Saved</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analytics.recentEvaluations.map((evaluation) => (
                      <tr key={evaluation.id} className="align-top">
                        <td className="min-w-0 px-4 py-3.5"><p className="break-words font-medium text-slate-900">{evaluation.caseTitle}</p><p className="mt-1 break-all font-mono text-xs text-slate-400">{evaluation.caseId}</p></td>
                        <td className="break-words px-4 py-3.5 text-slate-600">{evaluation.subjectArea}</td>
                        <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${verdictStyles[evaluation.verdict]}`}>{evaluation.verdict}</span></td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-900">{formatScore(evaluation.meanScore)}</td>
                        <td className="px-4 py-3.5 text-xs leading-5 text-slate-600">{dateFormatter.format(new Date(evaluation.createdAt))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <aside className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-sm leading-6 text-teal-950">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-teal-700" fill="none"><path d="M10 2.8 16 5v4.6c0 3.7-2.5 6.2-6 7.6-3.5-1.4-6-3.9-6-7.6V5l6-2.2Zm-2.5 7.1 1.6 1.6 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <p><strong>Private by design.</strong> Analytics are calculated locally from saved evaluations in this browser. Evaluation data remains on this device and no backend is used.</p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
