import Link from "next/link";
import type { ReactNode } from "react";

interface SectionPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  steps: readonly string[];
  note: string;
  action?: { label: string; href: string };
}

export function SectionPlaceholder({ eyebrow, title, description, icon, steps, note, action }: SectionPlaceholderProps) {
  return (
    <section className="placeholder-grid flex flex-1">
      <div className="page-shell grid min-w-0 gap-12 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
        <div className="min-w-0">
          <p className="section-label">{eyebrow}</p>
          <h1 className="mt-5 max-w-2xl break-words text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">{title}</h1>
          <p className="mt-6 max-w-xl break-words text-lg leading-8 text-slate-600">{description}</p>
          {action && <Link href={action.href} className="button-primary mt-8">{action.label}<span aria-hidden="true">→</span></Link>}
        </div>
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)] sm:p-7">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <span className="flex size-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Foundation status</p>
              <p className="mt-1 font-semibold text-slate-900">Structure ready for verified content</p>
            </div>
          </div>
          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white font-mono text-xs font-semibold text-teal-700 shadow-sm ring-1 ring-slate-200">{index + 1}</span>
                <span className="text-sm font-medium text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-lg bg-slate-950 px-4 py-3 text-xs leading-5 text-slate-300"><span className="font-semibold text-teal-300">Planned:</span> {note}</p>
        </div>
      </div>
    </section>
  );
}

export function SectionIcon({ path }: { path: string }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none"><path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
