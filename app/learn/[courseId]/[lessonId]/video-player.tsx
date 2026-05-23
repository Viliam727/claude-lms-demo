"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={content.url}
          controls
          className="w-full h-full"
          onEnded={markComplete}
        />
      </div>
      {!done ? (
        <Button onClick={markComplete} disabled={marking} variant="outline">
          {marking ? "Ukladám..." : "Označiť ako dokončené"}
        </Button>
      ) : (
        <p className="text-green-600 text-sm font-medium">✓ Lekcia dokončená</p>
      )}
    </div>
  );
}
