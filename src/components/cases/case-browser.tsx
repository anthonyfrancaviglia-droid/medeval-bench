"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { subjectAreas } from "@/lib/benchmark";
import {
  filterBenchmarkCases,
  type SubjectFilter,
} from "@/lib/benchmark-cases";
import type { BenchmarkCase } from "@/lib/types";

export function CaseBrowser({ cases }: { cases: readonly BenchmarkCase[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<SubjectFilter>("ALL");
  const filteredCases = useMemo(
    () => filterBenchmarkCases(cases, { query, subject }),
    [cases, query, subject],
  );
  const filtersActive = Boolean(query.trim() || subject !== "ALL");

  function clearFilters() {
    setQuery("");
    setSubject("ALL");
  }

  return (
    <div className="placeholder-grid flex-1 border-b border-slate-200">
      <div className="page-shell py-10 sm:py-14 lg:py-16">
        <header className="grid gap-7 border-b border-slate-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="section-label">Case library</p>
            <h1 className="mt-4 break-words text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">Benchmark Cases</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Browse the personally verified synthetic cases available for structured model-response evaluation.</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur">
            <p className="font-mono text-2xl font-semibold text-slate-950">{cases.length}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Verified {cases.length === 1 ? "case" : "cases"}</p>
          </div>
        </header>

        <section aria-labelledby="case-filters-heading" className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="case-filters-heading" className="font-semibold text-slate-950">Find a verified case</h2>
              <p className="mt-1 text-sm text-slate-500">Search case IDs, titles, and tags, or narrow by subject area.</p>
            </div>
            <p aria-live="polite" className="text-sm font-medium text-slate-600">{filteredCases.length} {filteredCases.length === 1 ? "case" : "cases"} shown</p>
          </div>

          <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.45fr)_auto] md:items-end">
            <label htmlFor="case-search" className="min-w-0 text-sm font-semibold text-slate-700">
              Search cases
              <span className="relative mt-2 block">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" fill="none"><circle cx="8.5" cy="8.5" r="4.8" stroke="currentColor" strokeWidth="1.5" /><path d="m12 12 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                <input id="case-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by ID, title, or tag" className="w-full rounded-xl border border-slate-300 bg-white py-3 pr-3.5 pl-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10" />
              </span>
            </label>
            <label htmlFor="subject-filter" className="min-w-0 text-sm font-semibold text-slate-700">
              Subject area
              <select id="subject-filter" value={subject} onChange={(event) => setSubject(event.target.value as SubjectFilter)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10">
                <option value="ALL">All subject areas</option>
                {subjectAreas.map((subjectArea) => <option key={subjectArea} value={subjectArea}>{subjectArea}</option>)}
              </select>
            </label>
            <button type="button" onClick={clearFilters} disabled={!filtersActive} className="button-secondary disabled:cursor-not-allowed disabled:opacity-50">Clear filters</button>
          </div>
        </section>

        {cases.length === 0 ? (
          <section className="mx-auto max-w-2xl py-14 text-center sm:py-20" aria-labelledby="empty-library-heading">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-700 shadow-sm">
              <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8" fill="none"><path d="M5 8.5A3.5 3.5 0 0 1 8.5 5H15v22H8.5A3.5 3.5 0 0 0 5 30V8.5Zm22 0A3.5 3.5 0 0 0 23.5 5H17v22h6.5A3.5 3.5 0 0 1 27 30V8.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
            </div>
            <p className="section-label mt-7">Library status</p>
            <h2 id="empty-library-heading" className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950">Verified cases have not been added yet.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">Scientific and domain content enters this library only after personal verification by the project owner. The empty collection is intentional and is not an application error.</p>
            <Link href="/evaluate" className="button-secondary mt-7">Open manual evaluator <span aria-hidden="true">→</span></Link>
          </section>
        ) : filteredCases.length === 0 ? (
          <section className="py-16 text-center" aria-labelledby="no-matches-heading">
            <h2 id="no-matches-heading" className="text-2xl font-semibold text-slate-950">No cases match these filters.</h2>
            <p className="mt-3 text-slate-600">Try a different search term or subject area.</p>
            <button type="button" onClick={clearFilters} className="button-secondary mt-6">Clear filters</button>
          </section>
        ) : (
          <section className="mt-7" aria-labelledby="case-results-heading">
            <h2 id="case-results-heading" className="sr-only">Benchmark case results</h2>
            <div className="grid min-w-0 gap-5 lg:grid-cols-2">
              {filteredCases.map((benchmarkCase) => (
                <article key={benchmarkCase.id} className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)] sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="break-all font-mono text-xs font-semibold text-teal-700">{benchmarkCase.id}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 ring-1 ring-emerald-200">Verified</span>
                  </div>
                  <h3 className="mt-4 break-words text-xl font-semibold tracking-[-0.02em] text-slate-950">{benchmarkCase.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">{benchmarkCase.subjectArea}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5">Version {benchmarkCase.version}</span>
                    {(benchmarkCase.tags ?? []).map((tag) => <span key={tag} className="max-w-full break-words rounded-full border border-slate-200 px-3 py-1.5">{tag}</span>)}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                    <Link href={`/cases/${encodeURIComponent(benchmarkCase.id)}`} className="button-secondary">Inspect case</Link>
                    <Link href={`/evaluate?caseId=${encodeURIComponent(benchmarkCase.id)}`} className="button-primary">Evaluate case <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
