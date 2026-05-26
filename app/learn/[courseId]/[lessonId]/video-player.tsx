"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { Lesson, VideoContent } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface Props {
  lesson: Lesson;
  content: VideoContent;
  enrollmentId: string;
}

export function VideoPlayer({ lesson, content, enrollmentId }: Props) {
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
      <div className="overflow-hidden rounded-xl bg-slate-950 shadow-inner ring-1 ring-border/50">
        <video
          src={content.url}
          controls
          className="aspect-video w-full"
          onEnded={markComplete}
        />
      </div>
      {!done ? (
        <Button onClick={markComplete} disabled={marking} variant="outline" className="gap-2">
          {marking ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ukladám...
            </>
          ) : (
            "Označiť ako dokončené"
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
