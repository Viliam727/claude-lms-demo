export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourse } from "@/lib/lms-client";
import {
  countLessons,
  estimateDurationMinutes,
  formatDuration,
  getCourseLevel,
  getLessonTypeIcon,
} from "@/lib/course-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "./enroll-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);

  const lessonCount = countLessons(course);
  const duration = formatDuration(estimateDurationMinutes(course));
  const level = getCourseLevel(course);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
        ← Späť na kurzy
      </Link>

      <div className="mb-2">
        <Badge variant="secondary" className="text-xs font-normal">{level}</Badge>
      </div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-500 mb-4">{course.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
        <span>📚 {course.modules.length} moduly</span>
        <span>·</span>
        <span>🎓 {lessonCount} lekcií</span>
        <span>·</span>
        <span>⏱ {duration}</span>
      </div>

      {/* Čo sa naučíš */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Čo sa naučíš</h2>
        <ul className="space-y-1.5">
          {course.modules.map((module) => (
            <li key={module.id} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-500 mt-0.5 shrink-0">✓</span>
              <span>{module.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Obsah kurzu */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Obsah kurzu</h2>
      <div className="space-y-4 mb-10">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{module.title}</CardTitle>
              <p className="text-xs text-gray-400">{module.lessons.length} lekcií</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-base leading-none">{getLessonTypeIcon(lesson.type)}</span>
                    <span className="flex-1">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs capitalize shrink-0">
                      {lesson.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <EnrollButton courseId={course.id} firstLessonId={course.modules[0]?.lessons[0]?.id ?? ""} />
    </main>
  );
}
