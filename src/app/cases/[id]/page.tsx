import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBenchmarkCaseById,
  getBenchmarkCases,
} from "@/lib/benchmark-cases";

export function generateStaticParams() {
  return getBenchmarkCases().map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[id]">): Promise<Metadata> {
  const { id } = await params;
  const benchmarkCase = getBenchmarkCaseById(id);

  return benchmarkCase
    ? {
        title: benchmarkCase.title,
        description: `Inspect verified benchmark case ${benchmarkCase.id}.`,
      }
    : { title: "Case Not Found" };
}

export default async function BenchmarkCasePage({ params }: PageProps<"/cases/[id]">) {
  const { id } = await params;
  const benchmarkCase = getBenchmarkCaseById(id);

  if (!benchmarkCase) notFound();

  return (
    <div className="placeholder-grid flex-1 border-b border-slate-200">
      <article className="page-shell py-10 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/cases" className="rounded text-teal-700 hover:text-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Benchmark Cases</Link></li>
            <li aria-hidden="true">/</li>
            <li className="break-all font-mono text-xs text-slate-600" aria-current="page">{benchmarkCase.id}</li>
          </ol>
        </nav>

        <header className="mt-7 grid min-w-0 gap-7 border-b border-slate-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="break-all font-mono text-xs font-semibold text-teal-700">{benchmarkCase.id}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">{benchmarkCase.verificationStatus}</span>
            </div>
            <h1 className="mt-4 max-w-4xl break-words text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">{benchmarkCase.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">{benchmarkCase.subjectArea}</span>
              <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">Version {benchmarkCase.version}</span>
              {(benchmarkCase.tags ?? []).map((tag) => <span key={tag} className="max-w-full break-words rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">{tag}</span>)}
            </div>
          </div>
          <Link href={`/evaluate?caseId=${encodeURIComponent(benchmarkCase.id)}`} className="button-primary shrink-0">Evaluate this case <span aria-hidden="true">→</span></Link>
        </header>

        <div className="mt-7 min-w-0 space-y-7">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)]" aria-labelledby="case-prompt-heading">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Benchmark material</p>
              <h2 id="case-prompt-heading" className="mt-2 text-xl font-semibold text-slate-950">Prompt / case text</h2>
            </div>
            <div className="p-5 sm:p-7">
              <p className="max-w-4xl whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{benchmarkCase.prompt}</p>
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)]" aria-labelledby="reference-heading">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Reviewer-oriented</p>
              <h2 id="reference-heading" className="mt-2 text-lg font-semibold text-slate-950">Reference judgment and guidance</h2>
            </div>
            <div className="p-5 sm:p-7">
              <p className="max-w-4xl whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{benchmarkCase.referenceNotes}</p>
            </div>
          </section>

          <div className="flex justify-start sm:justify-end">
            <Link href={`/evaluate?caseId=${encodeURIComponent(benchmarkCase.id)}`} className="button-primary w-full sm:w-auto">Evaluate this case <span aria-hidden="true">→</span></Link>
          </div>

          {benchmarkCase.evaluationCriteria.length > 0 && (
            <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)]" aria-labelledby="criteria-heading">
              <h2 id="criteria-heading" className="font-semibold text-slate-950">Evaluation criteria</h2>
              <ul className="mt-4 space-y-3">
                {benchmarkCase.evaluationCriteria.map((criterion) => <li key={criterion} className="flex min-w-0 gap-3 text-sm leading-6 text-slate-700"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-teal-600" /><span className="break-words">{criterion}</span></li>)}
              </ul>
            </section>
          )}
        </div>

        <aside className="mt-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-amber-700" fill="none"><path d="M10 3.5 17 16H3l7-12.5ZM10 8v3.5m0 2.2v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <p><strong>Educational use only.</strong> MedEval Bench is not a medical device and does not provide clinical decision support or medical advice.</p>
        </aside>
      </article>
    </div>
  );
}
