import Link from "next/link";
import { dimensionDetails, subjectAreas } from "@/lib/benchmark";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DimensionGlyph({ index }: { index: number }) {
  const patterns = [
    "M5 15V9m5 6V5m5 10v-3",
    "m4.5 10 3.2 3.2 7.8-7.8",
    "M5 6.5h10M5 10h7M5 13.5h9",
    "M6 5h8v10H6zM8.5 8h3M8.5 11h3",
    "M10 4v3m0 6v3M5.8 5.8l2.1 2.1m4.2 4.2 2.1 2.1M4 10h3m6 0h3m-10.2 4.2 2.1-2.1m4.2-4.2 2.1-2.1",
  ];

  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
      <path d={patterns[index]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="hero-grid overflow-x-clip border-b border-slate-200/80">
        <div className="page-shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-28">
          <div>
            <div className="eyebrow mb-6">
              <span className="status-dot" />
              Educational benchmark
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Evaluate with rigor.
              <span className="block text-teal-700">Learn with clarity.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              MedEval Bench is a transparent workspace for evaluating how large language models respond to educational healthcare and STEM benchmark cases.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/evaluate" className="button-primary">
                Evaluate cases <ArrowIcon />
              </Link>
              <Link href="/cases" className="button-secondary">
                Browse benchmark
              </Link>
            </div>
            <div className="mt-9 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-6 text-amber-950">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-amber-700" fill="none">
                <path d="M10 3.5 17 16H3l7-12.5ZM10 8v3.5m0 2.2v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p><strong>Educational use only.</strong> MedEval Bench is not a medical device and does not provide clinical decision support or medical advice.</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-8 -z-10 rounded-full bg-teal-200/30 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Evaluation framework</p>
                  <p className="mt-1 font-semibold text-slate-900">Five-dimension review</p>
                </div>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">1–5 scale</span>
              </div>
              <div className="space-y-5 p-6">
                {dimensionDetails.map((dimension, index) => (
                  <div key={dimension.name} className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-slate-700">{dimension.name}</span>
                        <span className="font-mono text-xs text-slate-500">01–05</span>
                      </div>
                      <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((score) => <span key={score} className="h-1.5 rounded-full bg-teal-500/70" />)}
                      </div>
                    </div>
                    <div className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-teal-700">
                      <DimensionGlyph index={index} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 text-center">
                <div><p className="font-mono text-lg font-semibold text-slate-900">05</p><p className="text-[11px] uppercase tracking-wider text-slate-500">Dimensions</p></div>
                <div className="border-x border-slate-200"><p className="font-mono text-lg font-semibold text-slate-900">09</p><p className="text-[11px] uppercase tracking-wider text-slate-500">Error labels</p></div>
                <div><p className="font-mono text-lg font-semibold text-slate-900">03</p><p className="text-[11px] uppercase tracking-wider text-slate-500">Verdicts</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="section-label">Evaluation lens</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">A consistent rubric for careful review.</h2>
            <p className="mt-5 leading-7 text-slate-600">Each response is examined through five distinct dimensions, keeping nuanced strengths and risks visible.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {dimensionDetails.map((dimension, index) => (
              <article key={dimension.name} className={`bg-white p-6 sm:p-7 ${index === 4 ? "sm:col-span-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-semibold text-teal-700">0{index + 1}</span>
                  <h3 className="font-semibold text-slate-900">{dimension.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{dimension.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="page-shell grid gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="section-label text-teal-300">Curated by a human</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Synthetic cases, personally verified.</h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-300">Benchmark content is authored and personally reviewed by the project owner before entering the verified library. The current collection contains two Medication Safety cases; the labels shown here are planned coverage areas.</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {subjectAreas.map((subject) => <span key={subject} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">{subject}</span>)}
          </div>
        </div>
      </section>
    </>
  );
}
