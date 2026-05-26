export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Award, BookOpen } from "lucide-react";
import { getCourses, getEnrollments } from "@/lib/lms-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";

export default async function MyCoursesPage() {
  const [enrollments, courses] = await Promise.all([getEnrollments(), getCourses()]);
  const courseMap = new Map(courses.map((c) => [c.id, c]));

  return (
    <>
      <SiteHeader active="my-courses" />

      <main className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Moje kurzy</h1>
          <p className="mt-2 text-muted-foreground">
            Kurzy, na ktoré ste zapísaní, a váš postup
          </p>
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Zatiaľ nemáte žiadne kurzy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Prehliadnite katalóg a zapíšte sa na prvý kurz
            </p>
            <Link href="/" className="mt-6 inline-block">
              <Button className="gap-2">
                Prehliadnuť kurzy
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => {
              const course = courseMap.get(enrollment.course_id);
              const completed = Boolean(enrollment.certificate_url);

              return (
                <article
                  key={enrollment.id}
                  className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight">
                          {course?.title ?? enrollment.course_id}
                        </h2>
                        {completed && (
                          <Badge className="gap-1 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10">
                            <Award className="size-3" />
                            Dokončené
                          </Badge>
                        )}
                      </div>
                      {course?.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {course && course.modules[0]?.lessons[0] && (
                        <Link href={`/learn/${course.id}/${course.modules[0].lessons[0].id}`}>
                          <Button size="sm" className="gap-1.5">
                            Pokračovať
                            <ArrowRight className="size-3.5" />
                          </Button>
                        </Link>
                      )}
                      {enrollment.certificate_url && (
                        <Link href={`/certificate/${enrollment.id}`}>
                          <Button variant="outline" size="sm">
                            Certifikát
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
