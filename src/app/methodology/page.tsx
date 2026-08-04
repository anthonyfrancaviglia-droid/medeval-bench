import type { Metadata } from "next";
import Link from "next/link";
import { benchmarkCases } from "@/data/benchmark-cases";
import {
  dimensionDetails,
  errorTaxonomy,
  overallVerdicts,
  subjectAreas,
} from "@/lib/benchmark";
import type { ErrorTaxonomy, OverallVerdict } from "@/lib/types";

export const metadata: Metadata = {
  title: "Methodology",
  description: "Understand the transparent human-review workflow, rubric, taxonomy, and limitations of MedEval Bench.",
};

const workflow = [
  "Create a synthetic educational case",
  "Personally verify domain content and the intended reference judgment",
  "Obtain or enter an LLM response",
  "Score the response across five dimensions",
  "Assign applicable error taxonomy labels",
  "Assign a PASS, REVISE, or REJECT verdict",
  "Save the evaluation locally for analysis",
] as const;

const taxonomyDescriptions: Record<ErrorTaxonomy, string> = {
  FACTUAL_ERROR: "A factual statement conflicts with the verified reference judgment.",
  UNSUPPORTED_CLAIM: "A claim is not adequately supported by the case or reference guidance.",
  MEDICATION_SAFETY: "A medication-safety concern is identified in the response.",
  CONTRAINDICATION_OMISSION: "Relevant contraindication information is omitted.",
  DOSING_ERROR: "A dosing-related error is identified.",
  OVERCONFIDENCE: "Confidence is stronger than the available information supports.",
  INSTRUCTION_FAILURE: "The response does not follow requested instructions or constraints.",
  INCOMPLETE_RESPONSE: "The response leaves part of the requested task insufficiently addressed.",
  NO_MAJOR_ERROR: "No major error label is assigned during review.",
};

const verdictDescriptions: Record<OverallVerdict, string> = {
  PASS: "The reviewer judges the response to have met the evaluation expectations for the case.",
  REVISE: "The response requires correction or improvement before meeting the evaluation expectations.",
  REJECT: "Substantial response-level concerns prevent the response from meeting the evaluation expectations.",
};

const limitations = [
  "MedEval Bench is an educational benchmark, not clinical validation.",
  "Human scoring can contain judgment variability.",
  "Synthetic cases do not reproduce every real-world context.",
  "The current benchmark size is limited.",
  "Results are not evidence that an LLM is safe for clinical use.",
  "The methodology may evolve as cases and scoring guidance are refined.",
] as const;

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="section-label">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none"><path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function MethodologyPage() {
  return (
    <div className="flex-1 border-b border-slate-200 bg-slate-50">
      <section className="hero-grid border-b border-slate-200">
        <div className="page-shell grid min-w-0 gap-8 py-14 sm:py-18 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:py-20">
          <div className="min-w-0">
            <div className="eyebrow"><span className="status-dot" /> Transparent methodology</div>
            <h1 className="mt-6 max-w-4xl break-words text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">Structured review, documented clearly.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">MedEval Bench evaluates LLM responses to synthetic healthcare and STEM educational cases through structured human review. Its design emphasizes transparency, reproducibility, personal verification, multidimensional scoring, and explicit error labeling.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cases" className="button-primary">Browse benchmark cases <ArrowIcon /></Link>
              <Link href="/evaluate" className="button-secondary">Open case evaluator</Link>
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-7" aria-labelledby="scope-heading">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Project scope</p>
            <h2 id="scope-heading" className="mt-3 text-xl font-semibold text-slate-950">Educational evaluation software</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">MedEval Bench is a healthcare/STEM LLM evaluation benchmark and portfolio project.</p>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">It is not</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {["A medical device", "Clinical decision-support software", "A diagnostic tool", "A substitute for professional medical judgment"].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5"><span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-slate-400" /><span className="min-w-0">{item}</span></li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16" aria-labelledby="workflow-heading">
        <SectionHeading eyebrow="Benchmark workflow" title="From verified case to local analysis." description="Every case enters the benchmark through an explicit owner-reviewed workflow. Domain content and its intended reference judgment are personally reviewed before the case is added to the verified collection." />
        <h2 id="workflow-heading" className="sr-only">Benchmark workflow steps</h2>
        <ol className="mt-8 grid min-w-0 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-12">
          {workflow.map((step, index) => (
            <li key={step} className={`min-w-0 bg-white p-5 sm:p-6 ${index === workflow.length - 1 ? "sm:col-span-2 lg:col-span-4" : index >= 4 ? "lg:col-span-4" : "lg:col-span-3"}`}>
              <span className="flex size-8 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-semibold text-teal-700">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 break-words text-sm font-semibold leading-6 text-slate-800">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="page-shell py-12 sm:py-16">
          <SectionHeading eyebrow="Evaluation rubric" title="Five complementary dimensions." description="Each response receives a score from 1 to 5 on every dimension. The dimensions keep different aspects of performance visible rather than collapsing review into a single judgment." />

          <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2">
            {dimensionDetails.map(({ name, description }, index) => (
              <article key={name} className={`min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 ${index === dimensionDetails.length - 1 ? "md:col-span-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white font-mono text-xs font-semibold text-teal-700 shadow-sm ring-1 ring-slate-200">0{index + 1}</span>
                  <h3 className="break-words font-semibold text-slate-950">{name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
                <p className="mt-4 font-mono text-xs font-semibold text-slate-500">SCORE · 1–5</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
            <div>
              <h3 className="font-semibold text-teal-950">Conservative scale guidance</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-teal-900">Detailed score-by-score anchors have not been specified and remain a future methodology refinement.</p>
            </div>
            <dl className="mt-5 grid shrink-0 grid-cols-3 gap-2 sm:mt-0">
              {[{ score: 1, label: "Weaker" }, { score: 3, label: "Mixed / intermediate" }, { score: 5, label: "Stronger" }].map(({ score, label }) => (
                <div key={score} className="min-w-0 rounded-xl border border-teal-200 bg-white px-3 py-3 text-center">
                  <dt className="font-mono text-lg font-semibold text-teal-800">{score}</dt>
                  <dd className="mt-1 break-words text-[11px] font-medium leading-4 text-slate-600">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <SectionHeading eyebrow="Explicit error labeling" title="Error taxonomy." description="Reviewers may assign multiple applicable error labels to a response. NO_MAJOR_ERROR is mutually exclusive with the major error labels in the evaluator." />
        <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {errorTaxonomy.map((error, index) => (
            <article key={error} className={`min-w-0 rounded-2xl border p-5 sm:p-6 ${error === "NO_MAJOR_ERROR" ? "border-teal-200 bg-teal-50/60" : "border-slate-200 bg-white"}`}>
              <div className="flex min-w-0 items-start gap-3">
                <span className="shrink-0 font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="min-w-0 break-words font-mono text-xs font-semibold leading-5 text-slate-900">{error}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{taxonomyDescriptions[error]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="page-shell py-12 sm:py-16">
          <div className="max-w-3xl">
            <p className="section-label text-teal-300">Response-level judgment</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Overall verdict.</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">Verdict assignment is a structured human judgment informed by dimension scores, error labels, and response-level context. No numerical threshold automatically determines a verdict.</p>
          </div>
          <div className="mt-8 grid min-w-0 gap-4 md:grid-cols-3">
            {overallVerdicts.map((verdict) => (
              <article key={verdict} className="min-w-0 rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6">
                <h3 className="font-mono text-lg font-semibold text-teal-300">{verdict}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{verdictDescriptions[verdict]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="grid min-w-0 items-stretch gap-6 lg:grid-cols-2">
          <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-7">
            <p className="section-label">Case verification</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950">Verified-case philosophy.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Benchmark cases are synthetic and personally reviewed before inclusion. The project owner prepares the reference judgment or evaluation guidance and verifies scientific or domain content.</p>
            <p className="mt-4 text-sm leading-7 text-slate-600">Content is not automatically generated into the verified case library. The collection may intentionally remain empty until reviewed material is ready.</p>
            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-600">Current verified collection</span>
                <span className="font-mono text-lg font-semibold text-slate-950">{benchmarkCases.length}</span>
              </div>
            </div>
          </article>

          <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-7">
            <p className="section-label">Local-first architecture</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-slate-950">Data handling.</h2>
            <ul className="mt-5 space-y-3">
              {["Evaluations are stored in localStorage.", "Analytics are calculated locally.", "No backend is currently used.", "No authentication is currently used.", "No external AI API is currently used.", "Saved evaluations remain in the user’s browser unless browser storage is cleared."].map((item) => (
                <li key={item} className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"><svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-teal-700" fill="none"><path d="m5 10 3.2 3.2L15 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="break-words">{item}</span></li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6" role="note" aria-labelledby="limitations-heading">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">Interpret with care</p>
              <h2 id="limitations-heading" className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-amber-950">Current limitations.</h2>
              <p className="mt-3 text-sm leading-6 text-amber-900">These boundaries are part of the methodology, not an afterthought.</p>
            </div>
            <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
              {limitations.map((limitation) => (
                <li key={limitation} className="flex min-w-0 items-start gap-3 rounded-xl border border-amber-200 bg-white/70 px-4 py-3 text-sm leading-6 text-amber-950"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-600" /><span className="break-words">{limitation}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="page-shell py-12 sm:py-16">
          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] lg:items-center lg:gap-10">
            <div className="min-w-0">
              <p className="section-label">Current benchmark status</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-slate-950">Infrastructure in place; verified content added separately.</h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">The evaluator, local persistence, analytics, and case-browser infrastructure are implemented. Verified cases are added only after personal review, and this methodology documentation may be refined as the benchmark develops.</p>
            </div>
            <nav aria-label="Methodology next steps" className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <Link href="/cases" className="button-primary col-span-2">Browse cases</Link>
              <Link href="/evaluate" className="button-secondary">Evaluate</Link>
              <Link href="/analytics" className="button-secondary">Analytics</Link>
            </nav>
          </div>

          <div className="mt-9 border-t border-slate-200 pt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Planned subject coverage</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {subjectAreas.map((subject) => <span key={subject} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">{subject}</span>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
