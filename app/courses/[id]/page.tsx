export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, Layers } from "lucide-react";
import { FileText, HelpCircle, PlayCircle } from "lucide-react";
import { getCourse } from "@/lib/lms-client";
import {
  countLessons,
  estimateDurationMinutes,
  formatDuration,
  getCourseGradient,
  getCourseLevel,
  getLessonTypeLabel,
} from "@/lib/course-utils";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { EnrollButton } from "./enroll-button";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

function LessonTypeIcon({ type }: { type: string }) {
  const className = "size-4 shrink-0 text-muted-foreground";
  switch (type) {
    case "video":
      return <PlayCircle className={className} />;
    case "text":
      return <FileText className={className} />;
    case "quiz":
      return <HelpCircle className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);

  const lessonCount = countLessons(course);
  const duration = formatDuration(estimateDurationMinutes(course));
  const level = getCourseLevel(course);
  const gradient = getCourseGradient(course.id);

  return (
    <>
      <SiteHeader active="courses" />

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Späť na kurzy
        </Link>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className={cn("relative px-8 py-10 bg-gradient-to-br text-white", gradient)}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.15),transparent_55%)]" />
            <div className="relative space-y-4">
              <Badge className="border-0 bg-white/20 text-white backdrop-blur-sm">
                {level}
              </Badge>
              <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                {course.title}
              </h1>
              {course.description && (
                <p className="max-w-2xl text-base leading-relaxed text-white/85">
                  {course.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2 text-sm text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="size-4" />
                  {course.modules.length} modulov
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-4" />
                  {lessonCount} lekcií
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" />
                  {duration}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-8">
              <section className="rounded-xl border bg-muted/30 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                  <CheckCircle2 className="size-4 text-primary" />
                  Čo sa naučíte
                </h2>
                <ul className="space-y-2.5">
                  {course.modules.map((module) => (
                    <li
                      key={module.id}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        ✓
                      </span>
                      {module.title}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-lg font-semibold tracking-tight">Obsah kurzu</h2>
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div
                      key={module.id}
                      className="overflow-hidden rounded-xl border bg-card"
                    >
                      <div className="border-b bg-muted/40 px-5 py-3">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Modul {moduleIndex + 1}
                        </p>
                        <h3 className="font-semibold">{module.title}</h3>
                      </div>
                      <ul className="divide-y">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-3 px-5 py-3.5 text-sm"
                          >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                              {lessonIndex + 1}
                            </span>
                            <LessonTypeIcon type={lesson.type} />
                            <span className="flex-1 font-medium">{lesson.title}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {getLessonTypeLabel(lesson.type)}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <p className="text-sm font-medium">Pripravení začať?</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Simulujte platbu a zapíšte sa na kurz. Demo používa testovacieho
                  používateľa.
                </p>
                <div className="mt-4">
                  <EnrollButton
                    courseId={course.id}
                    firstLessonId={course.modules[0]?.lessons[0]?.id ?? ""}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
