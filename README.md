# MedEval Bench

MedEval Bench is an interactive healthcare/STEM LLM evaluation benchmark and portfolio project. It provides a structured workflow for entering personally verified synthetic cases, evaluating model responses, saving results locally, and reviewing deterministic analytics.

Repository: [github.com/anthonyfrancaviglia-droid/medeval-bench](https://github.com/anthonyfrancaviglia-droid/medeval-bench)

Production: [medeval-bench.vercel.app](https://medeval-bench.vercel.app)

## Overview

The application supports transparent human review of LLM responses across educational healthcare and STEM subject areas. Reviewers score each response across five dimensions, assign explicit error labels, choose an overall verdict, and record concise rationale.

MedEval Bench is educational software and a portfolio project. It is not a medical device, clinical decision-support software, a diagnostic system, or evidence that any model is safe for clinical use.

## Current Features

- **Home** — project overview, educational disclaimer, and evaluation-framework summary.
- **Case Evaluator** — manual case entry, model-response review, five-dimension scoring, error labeling, verdict assignment, validation, and local saving.
- **Benchmark Case Browser** — search and subject filtering over a static, personally verified case collection, with individual case routes and evaluator handoff.
- **Analytics Dashboard** — local summaries of dimension score distributions, verdict distribution, error frequency, subject coverage, and recent evaluations.
- **Methodology** — documented workflow, rubric, taxonomy, verdict framing, verification philosophy, data handling, and limitations.
- **About** — project purpose, authorship, architecture, AI-assisted implementation, and current status.

## Evaluation Framework

Each response receives one score from 1–5 for each exact dimension:

1. Factual Accuracy
2. Safety
3. Instruction Following
4. Completeness
5. Uncertainty Calibration

Scoring Methodology v1 treats these as ordinal ratings: 1 = Critical deficiency, 2 = Major deficiency, 3 = Mixed / adequate, 4 = Strong, and 5 = Fully satisfies the dimension. They are not percentages, probabilities, continuous measurements, or scientifically validated interval measurements. Detailed dimension-specific anchors and boundary guidance are documented in the in-app `/methodology` route.

The exact error taxonomy is:

- `FACTUAL_ERROR`
- `UNSUPPORTED_CLAIM`
- `MEDICATION_SAFETY`
- `CONTRAINDICATION_OMISSION`
- `DOSING_ERROR`
- `OVERCONFIDENCE`
- `INSTRUCTION_FAILURE`
- `INCOMPLETE_RESPONSE`
- `NO_MAJOR_ERROR`

Multiple error labels may apply. `NO_MAJOR_ERROR` is mutually exclusive with the other labels in the evaluator.

The exact overall verdicts are:

- `PASS`
- `REVISE`
- `REJECT`

Verdicts are structured human judgments informed by dimension scores, error labels, and response-level context. No automatic numerical threshold determines a verdict.

## Benchmark Content

The current verified library contains two synthetic Medication Safety cases. Planned subject coverage also includes Pharmacology, Biology, Chemistry, Epidemiology, and Statistics.

Only content personally verified by the project owner belongs in the static verified-case collection. Reference judgments and evaluation guidance are prepared separately from the application infrastructure. The collection remains intentionally limited while additional cases are prepared and reviewed.

No scientific benchmark case content is generated automatically into the verified library.

### Adding a personally verified case

The project owner supplies and verifies every case before it is inserted into `src/data/benchmark-cases.ts`. Keep the collection in that single file while it remains small, and use this placeholder-only authoring checklist:

```text
Case ID: <unique owner-supplied case ID>
Title: <owner-supplied title>
Subject: <one approved subject area>
Version: <positive integer>
Verification status: VERIFIED
Evaluation criteria: <owner-supplied string list, or an empty list when unused>
Benchmark prompt: <owner-supplied verified prompt>
Verified reference notes / evaluation guidance: <owner-supplied verified guidance>
Optional tags: <owner-supplied string list, or omit>
```

Benchmark scientific/domain content must be supplied and personally verified by the project owner. Coding assistance must not generate or substantively rewrite verified benchmark content.

Each case ID must be unique. The subject must be one of Pharmacology, Medication Safety, Biology, Chemistry, Epidemiology, or Statistics; the verification status must be `VERIFIED`; and the version must be a positive integer. Static case data must not contain a model response, dimension scores, error labels, a verdict, reviewer notes, evaluation timestamps, analytics, or saved evaluation IDs. After inserting an owner-supplied case, run `npm run lint` and `npm run build`; the benchmark integrity assertion will fail clearly for malformed records or duplicate IDs.

## Tech Stack

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/)
- TypeScript
- Tailwind CSS
- [Recharts](https://recharts.org/)
- Browser `localStorage`
- Static TypeScript benchmark data
- Git and GitHub

The current application has no backend, authentication, or external AI API integration.

## Local-First Data Model

Completed evaluations are appended to the versioned browser-storage key:

```text
medeval-bench:evaluations:v1
```

Each saved record includes a case snapshot, model response, five dimension scores, selected error labels, overall verdict, reviewer notes, a unique evaluation ID, and timestamps.

Analytics are calculated locally from valid saved records using deterministic arithmetic. Data is not sent to a backend. Clearing browser storage removes saved evaluations.

## Project Structure

```text
src/
├── app/                    # App Router pages and dynamic case route
├── components/             # Shared shell and feature UI
├── data/                   # Static verified benchmark collection
└── lib/                    # Types, constants, storage, filtering, and analytics
public/                     # Static public assets
```

Key modules include:

- `src/lib/types.ts` — shared benchmark and evaluation contracts.
- `src/data/benchmark-cases.ts` — intentionally controlled raw verified-case collection.
- `src/lib/benchmark-cases.ts` — validated benchmark access boundary for application consumers.
- `src/lib/benchmark-case-validation.ts` — collection integrity validation.
- `src/lib/evaluation-storage.ts` — versioned localStorage persistence and validation.
- `src/lib/analytics.ts` — deterministic analytics aggregation.

## Running Locally

Requirements: a current Node.js installation and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run repository checks with:

```bash
npm run lint
npm run build
```

The production server can be started after a successful build:

```bash
npm run start
```

## Methodology

The human-review workflow is:

1. Create a synthetic educational case.
2. Personally verify domain content and the intended reference judgment.
3. Obtain or enter an LLM response.
4. Score the response across five dimensions.
5. Assign applicable error taxonomy labels.
6. Assign a `PASS`, `REVISE`, or `REJECT` verdict.
7. Save the evaluation locally for analysis.

The in-app `/methodology` route documents the workflow, rubric, taxonomy, verification approach, data handling, and current limitations in more detail.

## Limitations

- MedEval Bench is an educational benchmark, not clinical validation.
- Synthetic cases do not reproduce every real-world scenario.
- Human review can contain judgment variability.
- The current benchmark size is limited.
- Results are not evidence that an LLM is safe for clinical use.
- Methodology and scoring guidance may evolve as the benchmark develops.

## Authorship and AI Assistance

### Project owner

The project owner is responsible for:

- Benchmark methodology and overall direction
- Scientific and healthcare/STEM case content
- Evaluation rubric and error taxonomy
- Reference judgments
- Verification of domain content
- Interpretation of benchmark results

Domain content is personally reviewed before entering the verified benchmark library.

### AI-assisted coding

AI-assisted coding with Codex was used to support application implementation, including software structure, components, styling, interaction logic, and technical documentation. Architecture and generated code were reviewed iteratively.

Scientific benchmark content, reference judgments, domain verification, and interpretation of benchmark results are not delegated to the coding agent.

## Status

MedEval Bench is operational and deployed as a portfolio-ready v1 application. Scoring Methodology v1 and ordinal-aligned Analytics are implemented. The verified library currently contains two personally reviewed Medication Safety cases. Additional cases may be added after review, but further expansion is not required for v1 completeness.
