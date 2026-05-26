"use server";

import {
  createCourse,
  createLesson,
  createModule,
  deleteCourse,
  updateCourse,
  updateLesson,
} from "@/lib/lms-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCourseAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;
  const status = (formData.get("status") as string) || "draft";

  const course = await createCourse({ title, description, status });
  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin/courses/${course.id}`);
}

export async function updateCourseAction(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  await updateCourse(courseId, { title, description, status });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteCourseAction(courseId: string) {
  await deleteCourse(courseId);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function createModuleAction(courseId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const position = Number(formData.get("position") || 0);

  await createModule(courseId, { title, position });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/");
}

export async function createLessonAction(courseId: string, formData: FormData) {
  const moduleId = formData.get("module_id") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const position = Number(formData.get("position") || 0);

  let content: Record<string, unknown> = {};
  if (type === "video") {
    content = { url: formData.get("url") as string };
  } else if (type === "text") {
    content = { markdown: formData.get("markdown") as string };
  } else if (type === "quiz") {
    const raw = formData.get("quiz_json") as string;
    content = JSON.parse(raw || '{"questions":[],"pass_score":60}');
  }

  const lesson = await createLesson(moduleId, { title, type, content, position });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/");
  redirect(`/admin/courses/${courseId}/lessons/${lesson.id}`);
}

export async function updateLessonAction(
  courseId: string,
  lessonId: string,
  formData: FormData
) {
  const title = formData.get("title") as string;
  const position = Number(formData.get("position") || 0);
  const type = formData.get("type") as string;

  let content: Record<string, unknown> = {};
  if (type === "video") {
    content = { url: formData.get("url") as string };
  } else if (type === "text") {
    content = { markdown: formData.get("markdown") as string };
  } else if (type === "quiz") {
    content = JSON.parse(
      (formData.get("quiz_json") as string) || '{"questions":[],"pass_score":60}'
    );
  }

  await updateLesson(lessonId, { title, position, content });
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath("/");
}
