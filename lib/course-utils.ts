import type { Course } from "./types";

const COURSE_GRADIENTS = [
  "from-violet-600 via-indigo-600 to-blue-700",
  "from-blue-600 via-cyan-600 to-teal-600",
  "from-emerald-600 via-green-600 to-teal-700",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-fuchsia-600 via-purple-600 to-indigo-700",
] as const;

export function getCourseGradient(courseId: string): string {
  const hash = [...courseId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return COURSE_GRADIENTS[hash % COURSE_GRADIENTS.length];
}

export function countLessons(course: Course): number {
  return course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function estimateDurationMinutes(course: Course): number {
  let minutes = 0;
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.type === "video") {
        const content = lesson.content as { duration_sec?: number };
        minutes += content.duration_sec ? Math.ceil(content.duration_sec / 60) : 8;
      } else if (lesson.type === "text") {
        minutes += 5;
      } else if (lesson.type === "quiz") {
        minutes += 4;
      } else {
        minutes += 3;
      }
    }
  }
  return minutes;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hod`;
  return `${h} hod ${m} min`;
}

export function getCourseLevel(course: Course): string {
  const lessons = countLessons(course);
  if (lessons <= 6) return "Začiatočník";
  if (lessons <= 12) return "Stredne pokročilý";
  return "Pokročilý";
}

export function getLessonTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    video: "▶",
    text: "📄",
    quiz: "🎯",
    file: "📎",
  };
  return icons[type] ?? "•";
}

export type LessonType = "video" | "text" | "quiz" | "file";

export function getLessonTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    video: "Video",
    text: "Text",
    quiz: "Kvíz",
    file: "Súbor",
  };
  return labels[type] ?? type;
}
