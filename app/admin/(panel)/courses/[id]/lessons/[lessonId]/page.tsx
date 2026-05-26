export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourse } from "@/lib/lms-client";
import type { Lesson, QuizContent, TextContent, VideoContent } from "@/lib/types";
import { updateLessonAction } from "../../../../../actions";
import { Button } from "@/components/ui/button";
import { LessonFields } from "@/components/admin/lesson-fields";

interface Props {
  params: Promise<{ id: string; lessonId: string }>;
}

function lessonDefaults(lesson: Lesson) {
  if (lesson.type === "video") {
    return { url: (lesson.content as VideoContent).url ?? "" };
  }
  if (lesson.type === "text") {
    return { markdown: (lesson.content as TextContent).markdown ?? "" };
  }
  if (lesson.type === "quiz") {
    return {
      quizJson: JSON.stringify(lesson.content as QuizContent, null, 2),
    };
  }
  return {};
}

export default async function EditLessonPage({ params }: Props) {
  const { id, lessonId } = await params;
  const course = await getCourse(id);

  let lesson: Lesson | undefined;
  for (const mod of course.modules) {
    lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) break;
  }

  if (!lesson) {
    return <p className="text-red-600">Lekcia nenájdená.</p>;
  }

  const defaults = lessonDefaults(lesson);

  return (
    <div className="max-w-lg">
      <Link
        href={`/admin/courses/${id}`}
        className="text-sm text-gray-500 hover:text-gray-800"
      >
        ← Späť na kurz
      </Link>
      <h1 className="text-2xl font-semibold mt-4 mb-6">Upraviť lekciu</h1>

      <form
        action={updateLessonAction.bind(null, id, lessonId)}
        className="bg-white border rounded-xl p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1.5">Názov</label>
          <input
            name="title"
            defaultValue={lesson.title}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Poradie</label>
          <input
            name="position"
            type="number"
            defaultValue={lesson.position}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
        <LessonFields
          type={lesson.type}
          defaultUrl={"url" in defaults ? defaults.url : ""}
          defaultMarkdown={"markdown" in defaults ? defaults.markdown : ""}
          defaultQuizJson={"quizJson" in defaults ? defaults.quizJson : undefined}
        />
        <Button type="submit">Uložiť lekciu</Button>
      </form>
    </div>
  );
}
