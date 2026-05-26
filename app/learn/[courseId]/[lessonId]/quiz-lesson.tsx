"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Lesson, QuizContent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  lesson: Lesson;
  content: QuizContent;
  enrollmentId: string;
}

export function QuizLesson({ lesson, content, enrollmentId }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = content.questions.every((_, i) => answers[i] !== undefined);

  const correctCount = content.questions.filter(
    (q, i) => answers[i] === q.correct_option_index
  ).length;
  const score = Math.round((correctCount / content.questions.length) * 100);
  const passed = score >= content.pass_score;

  async function submit() {
    setSubmitting(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, lessonId: lesson.id, completed: passed, score }),
    });
    setSubmitted(true);
    setSubmitting(false);
    router.refresh();
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="space-y-8">
      {content.questions.map((q, qi) => (
        <div key={qi} className="space-y-3">
          <p className="font-semibold text-foreground">
            <span className="mr-2 inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
              {qi + 1}
            </span>
            {q.text}
          </p>
          <ul className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = oi === q.correct_option_index;
              return (
                <li key={oi}>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      submitted
                        ? isCorrect
                          ? "border-emerald-500/50 bg-emerald-50 text-emerald-900"
                          : selected
                            ? "border-red-400/50 bg-red-50 text-red-900"
                            : "border-border text-muted-foreground"
                        : selected
                          ? "border-primary bg-primary/5 text-foreground ring-2 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    {opt.text}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {!submitted ? (
        <Button onClick={submit} disabled={!allAnswered || submitting}>
          {submitting ? "Vyhodnocujem..." : "Odovzdať kvíz"}
        </Button>
      ) : (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border p-4 text-sm",
            passed
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          )}
        >
          {passed ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 size-5 shrink-0" />
          )}
          <div>
            <p className="font-medium">
              {passed
                ? `Úspešne! Skóre: ${score}%`
                : `Neúspešné. Skóre: ${score}%`}
            </p>
            <p className="mt-0.5 text-xs opacity-80">
              Potrebné minimum: {content.pass_score}%
            </p>
            {!passed && (
              <button
                type="button"
                onClick={reset}
                className="mt-2 text-xs font-medium underline underline-offset-2"
              >
                Skúsiť znova
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
