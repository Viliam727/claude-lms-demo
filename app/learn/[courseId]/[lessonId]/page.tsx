export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  Menu,
  PlayCircle,
} from "lucide-react";
import { getCourse, getProgress, getEnrollmentForCourse } from "@/lib/lms-client";
import type { Lesson, VideoContent, TextContent, QuizContent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "./video-player";
import { TextLesson } from "./text-lesson";
import { QuizLesson } from "./quiz-lesson";
import { getLessonTypeLabel } from "@/lib/course-utils";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

function LessonNavIcon({ type, completed }: { type: string; completed: boolean }) {
  if (completed) return <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />;
  const className = "size-3.5 shrink-0 text-muted-foreground";
  switch (type) {
    case "video":
      return <PlayCircle className={className} />;
    case "text":
      return <FileText className={className} />;
    case "quiz":
      return <HelpCircle className={className} />;
    default:
      return null;
  }
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;
  const [course, progressList, enrollment] = await Promise.all([
    getCourse(courseId),
    getProgress(courseId),
    getEnrollmentForCourse(courseId),
  ]);

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lesson = allLessons.find((l) => l.id === lessonId);
  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center p-12 text-destructive">
        Lekcia nenájdená.
      </div>
    );
  }
  if (!enrollment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Nie ste zapísaný na tento kurz.</p>
        <Link href={`/courses/${courseId}`} className="text-sm text-primary hover:underline">
          Zobraziť detail kurzu
        </Link>
      </div>
    );
  }

  const completedIds = new Set(
    progressList.filter((p) => p.completed).map((p) => p.lesson_id)
  );
  const progressPct =
    allLessons.length > 0
      ? Math.round((completedIds.size / allLessons.length) * 100)
      : 0;

  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  const sidebar = (
    <nav className="space-y-5">
      {course.modules.map((module) => (
        <div key={module.id}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {module.title}
          </p>
          <ul className="space-y-0.5">
            {module.lessons.map((l) => {
              const active = l.id === lessonId;
              const completed = completedIds.has(l.id);
              return (
                <li key={l.id}>
                  <Link
                    href={`/learn/${courseId}/${l.id}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <LessonNavIcon type={l.type} completed={completed} />
                    <span className="truncate">{l.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 flex-col border-r bg-card/50 md:flex">
        <div className="border-b p-4">
          <Link
            href={`/courses/${courseId}`}
            className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Späť na kurz
          </Link>
          <p className="line-clamp-2 text-sm font-semibold leading-snug">{course.title}</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Pokrok</span>
              <span className="font-medium tabular-nums">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-1.5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">{sidebar}</div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="border-b bg-card/80 px-6 py-3 md:hidden">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium">
              <Menu className="size-4" />
              Obsah kurzu · {progressPct}%
            </summary>
            <div className="mt-3 max-h-64 overflow-y-auto border-t pt-3">{sidebar}</div>
          </details>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
          <div className="mb-6 flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {getLessonTypeLabel(lesson.type)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Lekcia {currentIdx + 1} z {allLessons.length}
            </span>
          </div>

          <h1 className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
            {lesson.title}
          </h1>

          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <LessonContent
              lesson={lesson}
              courseId={courseId}
              enrollmentId={enrollment.id}
            />
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t pt-6">
            {prevLesson ? (
              <Link
                href={`/learn/${courseId}/${prevLesson.id}`}
                className="inline-flex max-w-[45%] items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4 shrink-0" />
                <span className="truncate">{prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link
                href={`/learn/${courseId}/${nextLesson.id}`}
                className="inline-flex max-w-[45%] items-center gap-1.5 text-right text-sm font-medium text-primary hover:text-primary/80"
              >
                <span className="truncate">{nextLesson.title}</span>
                <ArrowRight className="size-4 shrink-0" />
              </Link>
            ) : (
              <Link
                href="/my-courses"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Dokončiť kurz
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function LessonContent({
  lesson,
  courseId,
  enrollmentId,
}: {
  lesson: Lesson;
  courseId: string;
  enrollmentId: string;
}) {
  switch (lesson.type) {
    case "video":
      return (
        <VideoPlayer
          lesson={lesson}
          content={lesson.content as VideoContent}
          enrollmentId={enrollmentId}
        />
      );
    case "text":
      return (
        <TextLesson
          lesson={lesson}
          content={lesson.content as TextContent}
          enrollmentId={enrollmentId}
        />
      );
    case "quiz":
      return (
        <QuizLesson
          lesson={lesson}
          content={lesson.content as QuizContent}
          enrollmentId={enrollmentId}
        />
      );
    default:
      return <p className="text-muted-foreground">Tento typ lekcie nie je podporovaný.</p>;
  }
}
