import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about MedEval Bench, its authorship, architecture, current status, and educational scope.",
};

const ownerContributions = [
  "Benchmark design and methodology",
  "Scientific and healthcare/STEM case content",
  "Evaluation rubric and error taxonomy",
  "Reference judgments",
  "Verification of domain content",
  "Interpretation of benchmark results",
  "Overall project direction",
] as const;

const architecture = [
  "Next.js App Router",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Recharts",
  "localStorage",
  "Static case data",
] as const;

const demonstrations = [
  { title: "Evaluation design", description: "A consistent five-dimension rubric, explicit error taxonomy, and response-level verdict workflow." },
  { title: "Typed data modeling", description: "Shared TypeScript contracts connect cases, saved evaluations, persistence, and analytics." },
  { title: "Interactive workflows", description: "Accessible forms, validation, verified-case handoff, and deliberate save and reset states." },
  { title: "Local persistence", description: "Versioned browser storage keeps evaluation records available without backend infrastructure." },
  { title: "Deterministic analytics", description: "Auditable arithmetic summaries and visualizations derived only from saved evaluations." },
  { title: "Responsive interface", description: "A research-dashboard visual system designed across desktop, tablet, and mobile layouts." },
  { title: "Transparent boundaries", description: "Educational scope, current limitations, data handling, and project status remain visible." },
  { title: "Human oversight", description: "AI-assisted implementation remains separate from human-owned methodology and scientific review." },
] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none"><path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="section-label">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex-1 border-b border-slate-200 bg-slate-50">
      <section className="hero-grid border-b border-slate-200">
        <div className="page-shell grid min-w-0 gap-8 py-14 sm:py-18 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:py-20">
          <div className="min-w-0">
            <div className="eyebrow"><span className="status-dot" /> Project context</div>
            <h1 className="mt-6 max-w-4xl break-words text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-6xl">Evaluation infrastructure with human-owned methodology.</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">MedEval Bench is an interactive healthcare/STEM LLM evaluation benchmark and portfolio project. It makes structured review criteria, human judgments, and analytical summaries visible in one local-first application.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/methodology" className="button-primary">Read the methodology <ArrowIcon /></Link>
              <a href="https://github.com/anthonyfrancaviglia-droid/medeval-bench" target="_blank" rel="noreferrer" className="button-secondary">View on GitHub <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <aside className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] sm:p-7" aria-labelledby="purpose-heading">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Purpose and boundaries</p>
            <h2 id="purpose-heading" className="mt-3 text-xl font-semibold text-slate-950">Educational evaluation software</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Structured evaluation helps keep review criteria explicit across factual quality, safety, instruction adherence, completeness, and uncertainty.</p>
            <ul className="mt-6 grid gap-2 border-t border-slate-100 pt-5 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {["Not a medical device", "Not clinical decision support", "Not a diagnostic system", "Not evidence of clinical safety"].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5"><span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-slate-400" /><span className="min-w-0">{item}</span></li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <SectionHeading eyebrow="Authorship" title="Clear responsibility for content and code." description="MedEval Bench distinguishes ownership of the benchmark’s scientific work from the tools used to implement its application." />
        <div className="mt-8 grid min-w-0 items-stretch gap-6 lg:grid-cols-2">
          <article className="min-w-0 rounded-2xl border border-teal-200 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-mono text-xs font-semibold text-teal-700">01</span>
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">Human responsibility</p><h3 className="mt-1 font-semibold text-slate-950">Project owner contribution</h3></div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">The project owner is responsible for the benchmark’s methodology, domain material, review judgments, and interpretation.</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {ownerContributions.map((item) => <li key={item} className="flex min-w-0 items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-5 text-slate-700"><svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-teal-700" fill="none"><path d="m5 10 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="break-words">{item}</span></li>)}
            </ul>
            <p className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-sm leading-6 text-teal-950">Domain content is personally reviewed before it enters the verified benchmark case library.</p>
          </article>

          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 font-mono text-xs font-semibold text-slate-700">02</span>
              <div><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Implementation support</p><h3 className="mt-1 font-semibold text-slate-950">AI-assisted coding</h3></div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">AI-assisted coding with Codex was used to accelerate application implementation. Architecture and generated code were reviewed iteratively as the application developed.</p>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-slate-50 px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Assisted</p><p className="mt-2 text-sm leading-6 text-slate-700">Software structure, components, styling, interaction logic, and technical documentation.</p></div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">Not delegated</p><p className="mt-2 text-sm leading-6 text-amber-950">Scientific benchmark content, reference judgments, domain verification, and interpretation of results.</p></div>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="page-shell py-12 sm:py-16">
          <SectionHeading eyebrow="Technical architecture" title="A deliberate local-first foundation." description="The current architecture keeps infrastructure complexity low while making saved evaluations and their deterministic summaries inspectable within the browser." />
          <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
              <h3 className="font-semibold text-slate-950">Application stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {architecture.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">{item}</span>)}
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">Source code is version-controlled with Git and hosted on GitHub.</p>
            </div>
            <div className="grid min-w-0 gap-4 sm:grid-cols-3">
              {[{ title: "No backend", description: "The application does not currently operate a server-side data layer." }, { title: "Browser-local data", description: "Saved evaluations remain in localStorage unless browser storage is cleared." }, { title: "Deterministic analysis", description: "Analytics apply fixed arithmetic calculations to saved evaluation records." }].map((item) => (
                <article key={item.title} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold text-slate-950">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p></article>
              ))}
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">The application currently uses no authentication and no external AI API. This architecture is presented as a portfolio benchmark foundation, not as a clinical or production healthcare deployment model.</p>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <SectionHeading eyebrow="Portfolio focus" title="What the application demonstrates." description="The project connects evaluation methodology to a usable, typed, and transparent software workflow." />
        <div className="mt-8 grid min-w-0 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {demonstrations.map((item, index) => (
            <article key={item.title} className="min-w-0 bg-white p-5 sm:p-6"><span className="font-mono text-xs font-semibold text-teal-700">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 font-semibold text-slate-950">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 text-white">
        <div className="page-shell grid min-w-0 gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_0.72fr] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <p className="section-label text-teal-300">Current status</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Infrastructure implemented; benchmark content controlled separately.</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">The core application infrastructure is implemented. Personally verified cases are being added separately, the library remains intentionally content-controlled, and methodology and scoring guidance may continue to be refined.</p>
          </div>
          <div className="min-w-0 rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Explore the project</p>
            <nav aria-label="About page project links" className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/methodology" className="button-primary col-span-2">Methodology</Link>
              <Link href="/cases" className="button-secondary">Cases</Link>
              <Link href="/evaluate" className="button-secondary">Evaluator</Link>
              <Link href="/analytics" className="button-secondary col-span-2">Analytics</Link>
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
