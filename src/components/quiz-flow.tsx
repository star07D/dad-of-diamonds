"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ, resultsHref, type QuizAnswers } from "@/lib/quiz";

export function QuizFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new question so keyboard and screen-reader users land
  // on it. Skipped on first render — the page shouldn't grab focus on load.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
    moved.current = true;
  }, [step]);

  const question = QUIZ[step];

  function choose(value: string) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step < QUIZ.length - 1) {
      setStep(step + 1);
    } else {
      router.push(resultsHref(next as QuizAnswers));
    }
  }

  return (
    // Fixed minimum height so the footer doesn't move between questions.
    <div className="min-h-[34rem]">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={QUIZ.length}
        aria-valuenow={step + 1}
        aria-valuetext={`Question ${step + 1} of ${QUIZ.length}`}
      >
        {QUIZ.map((q, i) => (
          <span
            key={q.key}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>

      <p className="eyebrow mt-6">
        Question {step + 1} of {QUIZ.length}
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl outline-none"
      >
        {question.title}
      </h2>
      <p className="mt-2 text-muted">{question.help}</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {question.options.map((o) => {
          const selected = answers[question.key] === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => choose(o.value)}
              aria-pressed={selected}
              className={`rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0 ${
                selected ? "border-accent bg-surface-muted" : "border-border bg-surface"
              }`}
            >
              <span className="block font-medium">{o.label}</span>
              {o.hint && (
                <span className="mt-1 block text-sm text-muted">{o.hint}</span>
              )}
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="mt-8 text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Back
        </button>
      )}
    </div>
  );
}
