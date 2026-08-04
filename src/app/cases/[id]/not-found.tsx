import Link from "next/link";

export default function CaseNotFound() {
  return (
    <section className="placeholder-grid flex flex-1">
      <div className="page-shell flex min-h-[32rem] flex-col items-center justify-center py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white font-mono text-lg font-semibold text-slate-400 shadow-sm">404</span>
        <p className="section-label mt-7">Case unavailable</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">Benchmark case not found.</h1>
        <p className="mt-4 max-w-lg leading-7 text-slate-600">This case ID is not present in the verified benchmark collection. It may not have been added or may no longer be available.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/cases" className="button-primary">Browse verified cases</Link>
          <Link href="/evaluate" className="button-secondary">Open manual evaluator</Link>
        </div>
      </div>
    </section>
  );
}
