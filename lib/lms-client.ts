import type { Course, Enrollment, Progress } from "./types";

const DEMO_USER_ID = "demo_user_001";

async function lmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = process.env.LMS_API_URL ?? "";
  const apiKey = process.env.LMS_API_KEY ?? "";
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`LMS API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return ("data" in json ? json.data : json) as T;
}

function parseLessonContent(raw: unknown): unknown {
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function parseCourse(course: Course): Course {
  return {
    ...course,
    modules: (course.modules ?? []).map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).map((l) => ({
        ...l,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: parseLessonContent(l.content) as any,
      })),
    })),
  };
}

export async function getCourses(): Promise<Course[]> {
  const courses = await lmsFetch<Course[]>("/api/v1/courses");
  return courses.map(parseCourse);
}

export async function getCourse(id: string): Promise<Course> {
  const course = await lmsFetch<Course>(`/api/v1/courses/${id}`);
  return parseCourse(course);
}

export function enroll(courseId: string): Promise<Enrollment> {
  return lmsFetch("/api/v1/enrollments", {
    method: "POST",
    body: JSON.stringify({ user_id: DEMO_USER_ID, course_id: courseId }),
  });
}

export function getEnrollments(): Promise<Enrollment[]> {
  return lmsFetch(`/api/v1/enrollments?user_id=${DEMO_USER_ID}`);
}

export async function getEnrollmentForCourse(courseId: string): Promise<Enrollment | null> {
  const enrollments = await getEnrollments();
  return enrollments.find((e) => e.course_id === courseId) ?? null;
}

export function getProgress(courseId: string): Promise<Progress[]> {
  return lmsFetch(
    `/api/v1/progress?user_id=${DEMO_USER_ID}&course_id=${courseId}`
  );
}

export function recordProgress(
  enrollmentId: string,
  lessonId: string,
  completed: boolean,
  score?: number
): Promise<void> {
  return lmsFetch("/api/v1/progress", {
    method: "POST",
    body: JSON.stringify({
      user_id: DEMO_USER_ID,
      enrollment_id: enrollmentId,
      lesson_id: lessonId,
      completed,
      ...(score !== undefined && { score }),
    }),
  });
}
