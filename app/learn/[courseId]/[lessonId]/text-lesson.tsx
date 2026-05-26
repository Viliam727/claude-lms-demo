"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Lesson, TextContent } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface Props {
  lesson: Lesson;
  content: TextContent;
  enrollmentId: string;
}

export function TextLesson({ lesson, content, enrollmentId }: Props) {
  const router = useRouter();
  const [marking, setMarking] = useState(false);
  const [done, setDone] = useState(false);

  async function markComplete() {
    setMarking(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, lessonId: lesson.id, completed: true }),
    });
    setDone(true);
    setMarking(false);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div
        className="prose-lesson"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content.markdown) }}
      />
      {!done ? (
        <Button onClick={markComplete} disabled={marking} className="gap-2">
          {marking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ukladám...
            </>
          ) : (
            "Označiť ako prečítané"
          )}
        </Button>
      ) : (
        <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="size-4" />
          Lekcia dokončená
        </p>
      )}
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
