export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourses } from "@/lib/lms-client";
import {
  countLessons,
  estimateDurationMinutes,
  formatDuration,
  getCourseLevel,
} from "@/lib/course-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Kurzy</h1>
          <p className="text-gray-500 mt-1">Vyberte si kurz a začnite sa učiť</p>
        </div>
        <div className="flex items-center gap-2">
        <Link href="/my-courses">
          <Button variant="outline">Moje kurzy</Button>
        </Link>
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="text-gray-400">
            Admin
          </Button>
        </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Žiadne kurzy.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const lessonCount = countLessons(course);
            const duration = formatDuration(estimateDurationMinutes(course));
            const level = getCourseLevel(course);
            return (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs font-normal">
                      {level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{course.modules.length} {course.modules.length === 1 ? "modul" : "moduly"}</span>
                    <span>·</span>
                    <span>{lessonCount} {lessonCount === 1 ? "lekcia" : "lekcií"}</span>
                    <span>·</span>
                    <span>{duration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full">Zobraziť kurz</Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
