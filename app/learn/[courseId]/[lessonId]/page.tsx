export const dynamic = "force-dynamic";


import Link from "next/link";
import { getCourse, getProgress, getEnrollmentForCourse } from "@/lib/lms-client";
import type { Lesson, VideoContent, TextContent, QuizContent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VideoPlayer } from "./video-player";
import { TextLesson } from "./text-lesson";
import { QuizLesson } from "./quiz-lesson";
import { getLessonTypeIcon } from "@/lib/course-utils";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
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
  if (!lesson) return <div className="p-12 text-red-500">Lekcia nenájdená.</div>;
  if (!enrollment) return <div className="p-12 text-red-500">Nie ste zapísaný na tento kurz.</div>;

  const completedIds = new Set(
    progressList.filter((p) => p.completed).map((p) => p.lesson_id)
  );
  const progressPct = Math.round((completedIds.size / allLessons.length) * 100);

  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-gray-50 p-4 hidden md:flex flex-col">
        <Link href={`/courses/${courseId}`} className="text-sm text-gray-500 hover:text-gray-800 mb-4 block">
          ← Späť na kurz
        </Link>
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">{progressPct}% dokončené</div>
          <Progress value={progressPct} className="h-1.5" />
        </div>
        <nav className="space-y-3 flex-1 overflow-y-auto">
          {course.modules.map((module) => (
            <div key={module.id}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                {module.title}
              </p>
              <ul className="space-y-0.5">
                {module.lessons.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/learn/${courseId}/${l.id}`}
                      className={`flex items-center gap-2 text-sm rounded px-2 py-1.5 ${
                        l.id === lessonId
                          ? "bg-gray-200 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="shrink-0 text-xs w-4 text-center">
                        {completedIds.has(l.id) ? "✓" : getLessonTypeIcon(l.type)}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="capitalize">{lesson.type}</Badge>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">{lesson.title}</h1>

        <LessonContent lesson={lesson} courseId={courseId} enrollmentId={enrollment.id} />

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t">
          {prevLesson ? (
            <Link href={`/learn/${courseId}/${prevLesson.id}`} className="text-sm text-gray-500 hover:text-gray-800">
              ← {prevLesson.title}
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/learn/${courseId}/${nextLesson.id}`} className="text-sm text-gray-500 hover:text-gray-800">
              {nextLesson.title} →
            </Link>
          ) : (
            <Link href="/my-courses" className="text-sm text-gray-500 hover:text-gray-800">
              Dokončiť kurz →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

function LessonContent({ lesson, courseId, enrollmentId }: { lesson: Lesson; courseId: string; enrollmentId: string }) {
  switch (lesson.type) {
    case "video":
      return <VideoPlayer lesson={lesson} content={lesson.content as VideoContent} enrollmentId={enrollmentId} />;
    case "text":
      return <TextLesson lesson={lesson} content={lesson.content as TextContent} enrollmentId={enrollmentId} />;
    case "quiz":
      return <QuizLesson lesson={lesson} content={lesson.content as QuizContent} enrollmentId={enrollmentId} />;
    default:
      return <p className="text-gray-500">Tento typ lekcie nie je podporovaný.</p>;
  }
}
