export const dynamic = "force-dynamic";

import { Sparkles } from "lucide-react";
import { getCourses } from "@/lib/lms-client";
import { countLessons } from "@/lib/course-utils";
import { CourseCard } from "@/components/course-card";
import { SiteHeader } from "@/components/site-header";

export default async function HomePage() {
  const courses = await getCourses();
  const totalLessons = courses.reduce((sum, c) => sum + countLessons(c), 0);

  const uniqueCourses = courses.filter(
    (course, index, all) => all.findIndex((c) => c.title === course.title) === index
  );

  return (
    <>
      <SiteHeader active="courses" />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Referenčná implementácia pre integrátorov
          </div>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Učte sa cez modernú{" "}
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              headless LMS
            </span>{" "}
            platformu
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Demo ukazuje študentský flow — katalóg kurzov, enrollment, prehrávač lekcií,
            progress a certifikáty. Všetko napojené na LMS API.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-xl border bg-card/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-bold tabular-nums">{uniqueCourses.length}</p>
              <p className="text-xs text-muted-foreground">kurzov v katalógu</p>
            </div>
            <div className="rounded-xl border bg-card/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-2xl font-bold tabular-nums">{totalLessons}</p>
              <p className="text-xs text-muted-foreground">lekcií celkom</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Dostupné kurzy</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Vyberte si kurz a začnite sa učiť
              </p>
            </div>
          </div>

          {uniqueCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card/50 py-20 text-center">
              <p className="text-muted-foreground">Zatiaľ žiadne kurzy v katalógu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
              {uniqueCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
