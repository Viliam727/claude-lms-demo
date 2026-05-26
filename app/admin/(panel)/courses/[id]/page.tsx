export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourse } from "@/lib/lms-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createModuleAction,
  deleteCourseAction,
  updateCourseAction,
} from "../../../actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCoursePage({ params }: Props) {
  const { id } = await params;
  const course = await getCourse(id);

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
        ← Späť na kurzy
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <p className="text-xs font-mono text-gray-400 mt-1">{course.id}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/courses/${course.id}`}>
            <Button variant="outline" size="sm">Náhľad</Button>
          </Link>
          <form action={deleteCourseAction.bind(null, id)}>
            <Button variant="destructive" size="sm" type="submit">
              Zmazať
            </Button>
          </form>
        </div>
      </div>

      <form
        action={updateCourseAction.bind(null, id)}
        className="bg-white border rounded-xl p-6 space-y-4 mb-8"
      >
        <h2 className="font-medium">Nastavenia kurzu</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Názov</label>
          <input
            name="title"
            defaultValue={course.title}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Popis</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={course.description ?? ""}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Stav</label>
          <select
            name="status"
            defaultValue={course.status}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Publikovaný</option>
          </select>
        </div>
        <Button type="submit" variant="outline">Uložiť kurz</Button>
      </form>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Moduly a lekcie</h2>
        </div>

        {course.modules.map((module) => (
          <div key={module.id} className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{module.title}</h3>
                <p className="text-xs text-gray-400">position: {module.position}</p>
              </div>
              <Link href={`/admin/courses/${id}/lessons/new?moduleId=${module.id}`}>
                <Button size="sm" variant="outline">+ Lekcia</Button>
              </Link>
            </div>
            {module.lessons.length === 0 ? (
              <p className="text-sm text-gray-400">Žiadne lekcie</p>
            ) : (
              <ul className="space-y-2">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between text-sm border rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {lesson.type}
                      </Badge>
                      <span>{lesson.title}</span>
                    </div>
                    <Link
                      href={`/admin/courses/${id}/lessons/${lesson.id}`}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      Upraviť
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <form
          action={createModuleAction.bind(null, id)}
          className="bg-white border border-dashed rounded-xl p-5 space-y-3"
        >
          <h3 className="text-sm font-medium text-gray-600">Pridať modul</h3>
          <div className="flex gap-3">
            <input
              name="title"
              placeholder="Názov modulu"
              required
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <input
              name="position"
              type="number"
              defaultValue={course.modules.length + 1}
              className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <Button type="submit">Pridať</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
