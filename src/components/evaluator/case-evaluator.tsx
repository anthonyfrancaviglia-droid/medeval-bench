"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  dimensionDetails,
  dimensionScores,
  errorTaxonomy,
  overallVerdicts,
  subjectAreas,
} from "@/lib/benchmark";
import {
  createEvaluationId,
  EVALUATIONS_STORAGE_KEY,
  saveEvaluation,
} from "@/lib/evaluation-storage";
import type {
  BenchmarkSubjectArea,
  BenchmarkCase,
  ErrorTaxonomy,
  EvaluationDimension,
  EvaluationDimensionScores,
  OverallVerdict,
  SavedEvaluation,
} from "@/lib/types";

type ValidationKey =
  | "caseId"
  | "caseTitle"
  | "subjectArea"
  | "prompt"
  | "response"
  | "scores"
  | "errors"
  | "verdict";

type FormErrors = Partial<Record<ValidationKey, string>>;

interface EvaluatorFormState {
  caseId: string;
  caseTitle: string;
  subjectArea: BenchmarkSubjectArea | "";
  prompt: string;
  referenceNotes: string;
  response: string;
  scores: Partial<EvaluationDimensionScores>;
  errors: ErrorTaxonomy[];
  verdict: OverallVerdict | "";
  reviewerNotes: string;
}

const inputClassName = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-500/10";

function createEmptyForm(benchmarkCase?: BenchmarkCase): EvaluatorFormState {
  return {
    caseId: benchmarkCase?.id ?? "",
    caseTitle: benchmarkCase?.title ?? "",
    subjectArea: benchmarkCase?.subjectArea ?? "",
    prompt: benchmarkCase?.prompt ?? "",
    referenceNotes: benchmarkCase?.referenceNotes ?? "",
    response: "",
    scores: {},
    errors: [],
    verdict: "",
    reviewerNotes: "",
  };
}

function hasAllScores(
  scores: Partial<EvaluationDimensionScores>,
): scores is EvaluationDimensionScores {
  return dimensionDetails.every(({ name }) => scores[name] !== undefined);
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)]">
      <div className="flex items-start gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-semibold text-teal-700">{number}</span>
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-950 sm:text-lg">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={id} className="mt-2 text-sm font-medium text-red-700">{message}</p>;
}

function ScoreControl({
  dimension,
  value,
  disabled,
  onChange,
}: {
  dimension: EvaluationDimension;
  value?: number;
  disabled: boolean;
  onChange: (score: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <fieldset disabled={disabled} className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5">
      <legend className="px-1 text-sm font-semibold text-slate-800">{dimension}</legend>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {dimensionScores.map((score) => {
          const selected = value === score;
          return (
            <label key={score} className={`relative flex min-h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 ${selected ? "border-teal-700 bg-teal-700 text-white shadow-sm" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-300 hover:bg-teal-50"} ${disabled ? "cursor-not-allowed opacity-70" : ""}`}>
              <input className="sr-only" type="radio" name={`score-${dimension}`} value={score} checked={selected} required onChange={() => onChange(score)} />
              {score}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CaseEvaluator({
  benchmarkCase,
  requestedCaseId,
}: {
  benchmarkCase?: BenchmarkCase;
  requestedCaseId?: string;
}) {
  const [form, setForm] = useState<EvaluatorFormState>(() => createEmptyForm(benchmarkCase));
  const [errors, setErrors] = useState<FormErrors>({});
  const [savedEvaluation, setSavedEvaluation] = useState<SavedEvaluation | null>(null);
  const [storageError, setStorageError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  const locked = savedEvaluation !== null;
  const caseFieldsLocked = locked || Boolean(benchmarkCase);
  const noMajorErrorSelected = form.errors.includes("NO_MAJOR_ERROR");

  function clearValidationError(key: ValidationKey) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setStorageError("");
  }

  function updateText(
    field: "caseId" | "caseTitle" | "prompt" | "referenceNotes" | "response" | "reviewerNotes",
    value: string,
    validationKey?: ValidationKey,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    if (validationKey) clearValidationError(validationKey);
    setConfirmClear(false);
  }

  function updateScore(dimension: EvaluationDimension, score: 1 | 2 | 3 | 4 | 5) {
    setForm((current) => ({ ...current, scores: { ...current.scores, [dimension]: score } }));
    clearValidationError("scores");
    setConfirmClear(false);
  }

  function toggleError(label: ErrorTaxonomy, checked: boolean) {
    setForm((current) => {
      if (label === "NO_MAJOR_ERROR") {
        return { ...current, errors: checked ? ["NO_MAJOR_ERROR"] : [] };
      }

      const withoutNoMajorError = current.errors.filter((error) => error !== "NO_MAJOR_ERROR");
      return {
        ...current,
        errors: checked
          ? [...withoutNoMajorError, label]
          : withoutNoMajorError.filter((error) => error !== label),
      };
    });
    clearValidationError("errors");
    setConfirmClear(false);
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!form.caseId.trim()) nextErrors.caseId = "Enter a case ID.";
    if (!form.caseTitle.trim()) nextErrors.caseTitle = "Enter a case title.";
    if (!form.subjectArea) nextErrors.subjectArea = "Select a subject area.";
    if (!form.prompt.trim()) nextErrors.prompt = "Enter the benchmark prompt or case text.";
    if (!form.response.trim()) nextErrors.response = "Enter the model response being evaluated.";
    if (!hasAllScores(form.scores)) nextErrors.scores = "Choose a score for all five dimensions.";
    if (form.errors.length === 0) nextErrors.errors = "Select at least one error label.";
    if (!form.verdict) nextErrors.verdict = "Select an overall verdict.";
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStorageError("");

    const firstError = Object.keys(nextErrors)[0] as ValidationKey | undefined;
    if (firstError) {
      window.requestAnimationFrame(() => document.getElementById(`field-${firstError}`)?.focus());
      return;
    }

    if (!form.subjectArea || !form.verdict || !hasAllScores(form.scores) || form.errors.length === 0) {
      return;
    }

    const timestamp = new Date().toISOString();
    const evaluation: SavedEvaluation = {
      id: createEvaluationId(),
      createdAt: timestamp,
      updatedAt: timestamp,
      case: {
        id: form.caseId.trim(),
        title: form.caseTitle.trim(),
        subjectArea: form.subjectArea,
        prompt: form.prompt.trim(),
        referenceNotes: form.referenceNotes.trim(),
      },
      response: form.response.trim(),
      scores: form.scores,
      errors: form.errors,
      verdict: form.verdict,
      reviewerNotes: form.reviewerNotes.trim(),
    };

    try {
      saveEvaluation(evaluation);
      setSavedEvaluation(evaluation);
      setConfirmClear(false);
      window.requestAnimationFrame(() => document.getElementById("save-success")?.focus());
    } catch {
      setStorageError("This evaluation could not be saved in local storage. Check browser storage permissions or available space, then try again.");
    }
  }

  function resetForm() {
    setForm(createEmptyForm(benchmarkCase));
    setErrors({});
    setSavedEvaluation(null);
    setStorageError("");
    setConfirmClear(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hasEnteredData(): boolean {
    const assessmentDataEntered = Boolean(
      form.response || Object.keys(form.scores).length || form.errors.length ||
      form.verdict || form.reviewerNotes
    );

    if (benchmarkCase) return assessmentDataEntered;

    return Boolean(
      form.caseId || form.caseTitle || form.subjectArea || form.prompt ||
      form.referenceNotes || assessmentDataEntered
    );
  }

  function requestClear() {
    if (hasEnteredData()) {
      setConfirmClear(true);
      return;
    }
    resetForm();
  }

  return (
    <div className="placeholder-grid flex-1 border-b border-slate-200">
      <div className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="grid gap-7 border-b border-slate-200 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="section-label">Evaluation workspace</p>
            <h1 className="mt-4 break-words text-4xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-5xl">Case Evaluator</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{benchmarkCase ? "Review a model response against this verified library case and save a structured evaluation to this browser." : "Enter a personally verified case, score a model response, and save a structured evaluation to this browser."}</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 font-semibold text-teal-800"><span className="status-dot" /> Local-only workspace</div>
            <p className="mt-1 text-xs text-slate-500">No data is sent to a backend.</p>
          </div>
        </div>

        <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950">
          <strong>Educational use only.</strong> This evaluator is not a medical device and does not provide clinical decision support or medical advice.
        </div>

        {benchmarkCase && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-950">Verified benchmark case loaded</p>
              <p className="mt-1 text-xs leading-5 text-emerald-800">Case information is locked to preserve the personally verified library record. Evaluation fields remain editable.</p>
            </div>
            <Link href={`/cases/${encodeURIComponent(benchmarkCase.id)}`} className="shrink-0 rounded-lg text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Inspect source case</Link>
          </div>
        )}

        {!benchmarkCase && requestedCaseId && (
          <div role="status" className="mt-5 rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
            No verified library case matched <code className="break-all font-mono text-xs text-slate-900">{requestedCaseId}</code>. Manual entry mode remains available below.
          </div>
        )}

        {savedEvaluation && (
          <div id="save-success" tabIndex={-1} role="status" className="mt-7 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 outline-none focus:ring-2 focus:ring-emerald-600 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white" aria-hidden="true">✓</span>
              <div>
                <p className="font-semibold text-emerald-950">Evaluation saved locally</p>
                <p className="mt-1 text-sm leading-6 text-emerald-800">Saved {new Date(savedEvaluation.createdAt).toLocaleString()}. The completed form remains visible below.</p>
                <p className="mt-1 break-all font-mono text-xs text-emerald-700">{savedEvaluation.id}</p>
              </div>
            </div>
            <button type="button" onClick={resetForm} className="button-primary mt-4 shrink-0 sm:mt-0">Start new evaluation</button>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div role="alert" className="mt-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            <p className="font-semibold">The evaluation is not ready to save.</p>
            <p className="mt-1">Review the highlighted fields and complete each required selection.</p>
          </div>
        )}

        <form noValidate onSubmit={handleSubmit} className="mt-7 space-y-6">
          <FormSection number="01" title="Case information" description={benchmarkCase ? "Loaded from the personally verified benchmark library; these fields are read-only." : "Enter only benchmark material that you have personally verified."}>
            <div className="grid min-w-0 gap-5 sm:grid-cols-2">
              <label className="min-w-0 text-sm font-semibold text-slate-700" htmlFor="field-caseId">
                Case ID <span className="text-red-600" aria-hidden="true">*</span>
                <input id="field-caseId" name="caseId" type="text" value={form.caseId} disabled={caseFieldsLocked} required aria-invalid={Boolean(errors.caseId)} aria-describedby={errors.caseId ? "error-caseId" : undefined} onChange={(event) => updateText("caseId", event.target.value, "caseId")} placeholder="Enter a unique case ID" className={inputClassName} />
                <FieldError id="error-caseId" message={errors.caseId} />
              </label>
              <label className="min-w-0 text-sm font-semibold text-slate-700" htmlFor="field-caseTitle">
                Case title <span className="text-red-600" aria-hidden="true">*</span>
                <input id="field-caseTitle" name="caseTitle" type="text" value={form.caseTitle} disabled={caseFieldsLocked} required aria-invalid={Boolean(errors.caseTitle)} aria-describedby={errors.caseTitle ? "error-caseTitle" : undefined} onChange={(event) => updateText("caseTitle", event.target.value, "caseTitle")} placeholder="Enter a verified case title" className={inputClassName} />
                <FieldError id="error-caseTitle" message={errors.caseTitle} />
              </label>
              <label className="min-w-0 text-sm font-semibold text-slate-700 sm:col-span-2" htmlFor="field-subjectArea">
                Subject area <span className="text-red-600" aria-hidden="true">*</span>
                <select id="field-subjectArea" name="subjectArea" value={form.subjectArea} disabled={caseFieldsLocked} required aria-invalid={Boolean(errors.subjectArea)} aria-describedby={errors.subjectArea ? "error-subjectArea" : undefined} onChange={(event) => { setForm((current) => ({ ...current, subjectArea: event.target.value as BenchmarkSubjectArea | "" })); clearValidationError("subjectArea"); setConfirmClear(false); }} className={inputClassName}>
                  <option value="">Select a subject area</option>
                  {subjectAreas.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                </select>
                <FieldError id="error-subjectArea" message={errors.subjectArea} />
              </label>
              <label className="min-w-0 text-sm font-semibold text-slate-700 sm:col-span-2" htmlFor="field-prompt">
                Benchmark prompt / case text <span className="text-red-600" aria-hidden="true">*</span>
                <textarea id="field-prompt" name="prompt" rows={8} value={form.prompt} disabled={caseFieldsLocked} required aria-invalid={Boolean(errors.prompt)} aria-describedby={errors.prompt ? "error-prompt" : undefined} onChange={(event) => updateText("prompt", event.target.value, "prompt")} placeholder="Enter personally verified benchmark prompt or case text" className={`${inputClassName} resize-y leading-6`} />
                <FieldError id="error-prompt" message={errors.prompt} />
              </label>
              <label className="min-w-0 text-sm font-semibold text-slate-700 sm:col-span-2" htmlFor="field-referenceNotes">
                Reference judgment or evaluation guidance <span className="font-normal text-slate-400">(optional)</span>
                <textarea id="field-referenceNotes" name="referenceNotes" rows={5} value={form.referenceNotes} disabled={caseFieldsLocked} onChange={(event) => updateText("referenceNotes", event.target.value)} placeholder="Enter your verified reference judgment or evaluation guidance" className={`${inputClassName} resize-y leading-6`} />
              </label>
            </div>
          </FormSection>

          <FormSection number="02" title="Model response" description="Paste the complete response exactly as it should be evaluated.">
            <label className="text-sm font-semibold text-slate-700" htmlFor="field-response">
              Response being evaluated <span className="text-red-600" aria-hidden="true">*</span>
              <textarea id="field-response" name="response" rows={12} value={form.response} disabled={locked} required aria-invalid={Boolean(errors.response)} aria-describedby={errors.response ? "error-response" : undefined} onChange={(event) => updateText("response", event.target.value, "response")} placeholder="Paste the model response" className={`${inputClassName} resize-y leading-6`} />
              <FieldError id="error-response" message={errors.response} />
            </label>
          </FormSection>

          <FormSection number="03" title="Dimension scoring" description="Choose exactly one score from 1 to 5 for every dimension.">
            <div id="field-scores" tabIndex={-1} aria-invalid={Boolean(errors.scores)} aria-describedby={errors.scores ? "error-scores" : undefined} className="min-w-0 outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-4">
              <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2 rounded-lg bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
                <span><strong className="text-slate-900">1</strong> = poor</span>
                <span><strong className="text-slate-900">3</strong> = mixed / adequate</span>
                <span><strong className="text-slate-900">5</strong> = strong</span>
              </div>
              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                {dimensionDetails.map(({ name }) => <ScoreControl key={name} dimension={name} value={form.scores[name]} disabled={locked} onChange={(score) => updateScore(name, score)} />)}
              </div>
              <FieldError id="error-scores" message={errors.scores} />
            </div>
          </FormSection>

          <FormSection number="04" title="Error taxonomy" description="Select every applicable label, or indicate that no major error is present.">
            <fieldset id="field-errors" tabIndex={-1} disabled={locked} aria-invalid={Boolean(errors.errors)} aria-describedby={errors.errors ? "error-errors" : undefined} className="min-w-0 outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-4">
              <legend className="sr-only">Error taxonomy selections</legend>
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {errorTaxonomy.map((label) => {
                  const checked = form.errors.includes(label);
                  const disabled = locked || (noMajorErrorSelected && label !== "NO_MAJOR_ERROR");
                  return (
                    <label key={label} className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 ${checked ? "border-teal-600 bg-teal-50 text-teal-950" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
                      <input type="checkbox" name="errors" value={label} checked={checked} disabled={disabled} onChange={(event) => toggleError(label, event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-teal-700" />
                      <span className="min-w-0 break-words font-mono text-xs font-semibold leading-5">{label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">Selecting <span className="font-mono font-semibold">NO_MAJOR_ERROR</span> clears and disables all other labels. Uncheck it to select a specific error.</p>
              <FieldError id="error-errors" message={errors.errors} />
            </fieldset>
          </FormSection>

          <FormSection number="05" title="Verdict and rationale" description="Choose one overall verdict and optionally record concise reviewer notes.">
            <fieldset id="field-verdict" tabIndex={-1} disabled={locked} aria-invalid={Boolean(errors.verdict)} aria-describedby={errors.verdict ? "error-verdict" : undefined} className="min-w-0 outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-4">
              <legend className="text-sm font-semibold text-slate-700">Overall verdict <span className="text-red-600" aria-hidden="true">*</span></legend>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {overallVerdicts.map((verdict) => {
                  const checked = form.verdict === verdict;
                  return (
                    <label key={verdict} className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 ${checked ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400"} ${locked ? "cursor-not-allowed opacity-70" : ""}`}>
                      <input type="radio" className="sr-only" name="verdict" value={verdict} checked={checked} required onChange={() => { setForm((current) => ({ ...current, verdict })); clearValidationError("verdict"); setConfirmClear(false); }} />
                      {verdict}
                    </label>
                  );
                })}
              </div>
              <FieldError id="error-verdict" message={errors.verdict} />
            </fieldset>
            <label className="mt-6 block text-sm font-semibold text-slate-700" htmlFor="field-reviewerNotes">
              Reviewer notes <span className="font-normal text-slate-400">(optional)</span>
              <textarea id="field-reviewerNotes" name="reviewerNotes" rows={5} value={form.reviewerNotes} disabled={locked} onChange={(event) => updateText("reviewerNotes", event.target.value)} placeholder="Record a concise evaluation rationale" className={`${inputClassName} resize-y leading-6`} />
            </label>
          </FormSection>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div>
              <p className="font-semibold">Stored privately in this browser</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">Saving appends this evaluation to <code className="break-all font-mono text-xs text-teal-300">{EVALUATIONS_STORAGE_KEY}</code>. Nothing is uploaded.</p>
            </div>
            <div className="mt-5 flex shrink-0 flex-wrap gap-3 sm:mt-0 sm:justify-end">
              {!locked && <button type="button" onClick={requestClear} className="button-secondary">{benchmarkCase ? "Clear assessment" : "Clear form"}</button>}
              {!locked && <button type="submit" className="button-primary">Save evaluation</button>}
              {locked && <button type="button" onClick={resetForm} className="button-primary">Start new evaluation</button>}
            </div>
          </div>

          {confirmClear && !locked && (
            <div role="alert" aria-labelledby="clear-confirmation-title" aria-describedby="clear-confirmation-description" className="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p id="clear-confirmation-title" className="font-semibold text-amber-950">Clear this evaluation?</p>
                <p id="clear-confirmation-description" className="mt-1 text-sm leading-6 text-amber-800">{benchmarkCase ? "All unsaved response and assessment information will be removed. The verified case will remain loaded." : "All entered, unsaved information will be removed."}</p>
              </div>
              <div className="mt-4 flex gap-3 sm:mt-0">
                <button type="button" onClick={() => setConfirmClear(false)} className="button-secondary">Keep editing</button>
                <button type="button" onClick={resetForm} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">Clear entered data</button>
              </div>
            </div>
          )}

          {storageError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{storageError}</p>}
        </form>
      </div>
    </div>
  );
}
