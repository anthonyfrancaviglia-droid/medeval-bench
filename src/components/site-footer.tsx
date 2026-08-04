import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="page-shell flex flex-col gap-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-800">MedEval Bench</p>
          <p className="mt-1">Educational LLM evaluation for healthcare and STEM.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/methodology" className="transition-colors hover:text-teal-700">Methodology</Link>
          <Link href="/about" className="transition-colors hover:text-teal-700">About</Link>
          <span className="text-slate-500">Not for clinical use</span>
        </div>
      </div>
    </footer>
  );
}
