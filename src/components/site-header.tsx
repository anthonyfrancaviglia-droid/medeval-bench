import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Case Evaluator", href: "/evaluate" },
  { label: "Benchmark Cases", href: "/cases" },
  { label: "Analytics", href: "/analytics" },
  { label: "Methodology", href: "/methodology" },
  { label: "About", href: "/about" },
] as const;

function Mark() {
  return (
    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-teal-300 shadow-sm">
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-7" fill="none">
        <path d="M6 21.5 11.7 10l4.1 8 4-6.5L26 21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="21.5" r="1.5" fill="currentColor" /><circle cx="11.7" cy="10" r="1.5" fill="currentColor" /><circle cx="15.8" cy="18" r="1.5" fill="currentColor" /><circle cx="19.8" cy="11.5" r="1.5" fill="currentColor" /><circle cx="26" cy="21.5" r="1.5" fill="currentColor" />
      </svg>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600" aria-label="MedEval Bench home">
          <Mark />
          <span className="text-sm font-semibold tracking-[-0.015em] text-slate-950 sm:text-base">MedEval <span className="text-teal-700">Bench</span></span>
        </Link>
        <nav aria-label="Primary navigation" className="min-w-0 overflow-x-auto">
          <ul className="flex w-max items-center gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
