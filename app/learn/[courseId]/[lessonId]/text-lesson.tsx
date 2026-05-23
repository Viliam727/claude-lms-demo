"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    <div className="space-y-6">
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(content.markdown) }}
      />
      {!done ? (
        <Button onClick={markComplete} disabled={marking}>
          {marking ? "Ukladám..." : "Označiť ako prečítané"}
        </Button>
      ) : (
        <p className="text-green-600 text-sm font-medium">✓ Lekcia dokončená</p>
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
