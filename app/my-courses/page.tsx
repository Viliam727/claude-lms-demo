export const dynamic = "force-dynamic";


import Link from "next/link";
import { getCourses, getEnrollments } from "@/lib/lms-client";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function MyCoursesPage() {
  const [enrollments, courses] = await Promise.all([getEnrollments(), getCourses()]);

  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Moje kurzy</h1>
        <Link href="/">
          <Button variant="outline">← Všetky kurzy</Button>
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nemáte žiadne zapísané kurzy.</p>
          <Link href="/">
            <Button className="mt-4">Prehliadnuť kurzy</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const course = courseMap.get(enrollment.course_id);
            return (
              <Card key={enrollment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {course?.title ?? enrollment.course_id}
                    </CardTitle>
                    {enrollment.certificate_url && (
                      <Badge variant="secondary">Dokončené</Badge>
                    )}
                  </div>
                  {course?.description && (
                    <CardDescription>{course.description}</CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="gap-2">
                  {course && course.modules[0]?.lessons[0] && (
                    <Link href={`/learn/${course.id}/${course.modules[0].lessons[0].id}`}>
                      <Button size="sm">Pokračovať</Button>
                    </Link>
                  )}
                  {enrollment.certificate_url && (
                    <Link href={`/certificate/${enrollment.id}`}>
                      <Button variant="outline" size="sm">Certifikát</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
