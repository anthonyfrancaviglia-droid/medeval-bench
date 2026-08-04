import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MedEval Bench", template: "%s | MedEval Bench" },
  description: "An educational benchmark for evaluating LLM responses across healthcare and STEM cases.",
  keywords: ["LLM evaluation", "healthcare education", "STEM benchmark", "AI safety"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
