export const runtime = "edge";

import Link from "next/link";
import { getCourses } from "@/lib/lms-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Link href="/my-courses">
          <Button variant="outline">Moje kurzy</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Žiadne kurzy.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter>
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full">Zobraziť kurz</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
