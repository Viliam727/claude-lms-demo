import Link from "next/link";
import { createLessonAction } from "../../../../../actions";
import { Button } from "@/components/ui/button";
import { LessonFields } from "@/components/admin/lesson-fields";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ moduleId?: string }>;
}

export default async function NewLessonPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { moduleId } = await searchParams;

  if (!moduleId) {
    return (
      <p className="text-red-600">Chýba moduleId v URL.</p>
    );
  }

  return (
    <div className="max-w-lg">
      <Link
        href={`/admin/courses/${id}`}
        className="text-sm text-gray-500 hover:text-gray-800"
      >
        ← Späť na kurz
      </Link>
      <h1 className="text-2xl font-semibold mt-4 mb-6">Nová lekcia</h1>

      <form
        action={createLessonAction.bind(null, id)}
        className="bg-white border rounded-xl p-6 space-y-4"
      >
        <input type="hidden" name="module_id" value={moduleId} />
        <div>
          <label className="block text-sm font-medium mb-1.5">Názov *</label>
          <input
            name="title"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Poradie</label>
          <input
            name="position"
            type="number"
            defaultValue={1}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <LessonFields type="text" />
        <Button type="submit">Vytvoriť lekciu</Button>
      </form>
    </div>
  );
}
