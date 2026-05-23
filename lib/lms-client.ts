import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Course, Enrollment, Progress } from "./types";

const DEMO_USER_ID = "demo_user_001";
const LMS_BASE_URL = "https://claude-lms.devmanag.workers.dev";

async function lmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { env } = getCloudflareContext();
  const envRecord = env as Record<string, unknown>;

  const apiKey = (envRecord.LMS_API_KEY as string) ?? process.env.LMS_API_KEY ?? "";
  const lmsBinding = envRecord.LMS_API as Fetcher | undefined;

  if (!apiKey) {
    console.error("[LMS] LMS_API_KEY is missing!");
    throw new Error("LMS_API_KEY not configured");
  }

  const fullUrl = `${LMS_BASE_URL}${path}`;
  console.log(`[LMS] ${init?.method ?? "GET"} ${fullUrl} (binding=${!!lmsBinding})`);

  const fetcher: typeof fetch = lmsBinding
    ? ((input, fetchInit) => lmsBinding.fetch(input as RequestInfo, fetchInit)) as typeof fetch
    : fetch;

  const res = await fetcher(fullUrl, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[LMS] Error ${res.status} on ${fullUrl}: ${body}`);
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
