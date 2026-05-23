"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
          <p className="font-medium text-gray-900">
            {qi + 1}. {q.text}
          </p>
          <ul className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = oi === q.correct_option_index;
              return (
                <li key={oi}>
                  <button
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-colors",
                      submitted
                        ? isCorrect
                          ? "border-green-500 bg-green-50 text-green-800"
                          : selected
                          ? "border-red-400 bg-red-50 text-red-800"
                          : "border-gray-200 text-gray-400"
                        : selected
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 hover:border-gray-400 text-gray-700"
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
        <div className={cn("rounded-lg p-4 text-sm font-medium", passed ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800")}>
          {passed
            ? `✓ Úspešne! Skóre: ${score}% (potrebné: ${content.pass_score}%)`
            : `✗ Neúspešné. Skóre: ${score}% (potrebné: ${content.pass_score}%)`}
          {!passed && (
            <button onClick={reset} className="ml-4 underline text-xs">
              Skúsiť znova
            </button>
          )}
        </div>
      )}
    </div>
  );
}
