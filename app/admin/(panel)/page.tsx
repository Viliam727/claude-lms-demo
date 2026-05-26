export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCoursesList } from "@/lib/lms-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminCoursesPage() {
  const courses = await getCoursesList();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Kurzy</h1>
          <p className="text-gray-500 text-sm mt-1">
            Referenčná správa kurzov cez LMS API
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button>+ Nový kurz</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center bg-white">
          <p className="text-gray-400 mb-4">Zatiaľ žiadne kurzy</p>
          <Link href="/admin/courses/new">
            <Button>Vytvoriť prvý kurz</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50/50">
                <th className="px-5 py-3 font-medium">Názov</th>
                <th className="px-5 py-3 font-medium">Stav</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="font-medium hover:text-blue-600"
                    >
                      {course.title}
                    </Link>
                    {course.description && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                        {course.description}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={course.status === "published" ? "default" : "secondary"}>
                      {course.status === "published" ? "Publikovaný" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/courses/${course.id}`}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Náhľad →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
