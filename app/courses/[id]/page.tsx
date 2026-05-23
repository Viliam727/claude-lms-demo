export const dynamic = "force-dynamic";


import Link from "next/link";
import { getCourse } from "@/lib/lms-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnrollButton } from "./enroll-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block">
        ← Späť na kurzy
      </Link>

      <h1 className="text-3xl font-semibold text-gray-900 mb-2">{course.title}</h1>
      <p className="text-gray-500 mb-8">{course.description}</p>

      <div className="space-y-4 mb-10">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle className="text-base">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center gap-3 text-sm text-gray-700">
                    <LessonTypeIcon type={lesson.type} />
                    <span>{lesson.title}</span>
                    <Badge variant="outline" className="ml-auto text-xs capitalize">
                      {lesson.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <EnrollButton courseId={course.id} />
    </main>
  );
}

function LessonTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    video: "▶",
    text: "📄",
    quiz: "❓",
    file: "📎",
  };
  return <span>{icons[type] ?? "•"}</span>;
}
