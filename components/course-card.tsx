import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import type { Course } from "@/lib/types";
import {
  countLessons,
  estimateDurationMinutes,
  formatDuration,
  getCourseGradient,
  getCourseLevel,
} from "@/lib/course-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  const lessonCount = countLessons(course);
  const duration = formatDuration(estimateDurationMinutes(course));
  const level = getCourseLevel(course);
  const gradient = getCourseGradient(course.id);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <div className={cn("relative h-28 bg-gradient-to-br px-5 py-4", gradient)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
        <Badge
          variant="secondary"
          className="relative border-0 bg-white/20 text-[11px] font-medium text-white backdrop-blur-sm"
        >
          {level}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold leading-snug tracking-tight text-foreground line-clamp-2">
            {course.title}
          </h2>
          {course.description && (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Layers className="size-3.5 opacity-70" />
            {course.modules.length}{" "}
            {course.modules.length === 1 ? "modul" : "moduly"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5 opacity-70" />
            {lessonCount} {lessonCount === 1 ? "lekcia" : "lekcií"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 opacity-70" />
            {duration}
          </span>
        </div>

        <Link href={`/courses/${course.id}`} className="mt-auto">
          <Button className="w-full gap-2 group-hover:shadow-md">
            Zobraziť kurz
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
