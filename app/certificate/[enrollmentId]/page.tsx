export const dynamic = "force-dynamic";

import Link from "next/link";
import { Award, Download } from "lucide-react";
import { getEnrollments } from "@/lib/lms-client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

interface Props {
  params: Promise<{ enrollmentId: string }>;
}

export default async function CertificatePage({ params }: Props) {
  const { enrollmentId } = await params;
  const enrollments = await getEnrollments();
  const enrollment = enrollments.find((e) => e.id === enrollmentId);

  if (!enrollment?.certificate_url) {
    return (
      <>
        <SiteHeader active="my-courses" />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <p className="text-muted-foreground">Certifikát ešte nie je dostupný.</p>
          <Link href="/my-courses" className="mt-6 inline-block">
            <Button variant="outline">Späť na moje kurzy</Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader active="my-courses" />

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-10 text-center shadow-lg sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.55_0.16_264/0.08),transparent_60%)]" />
          <div className="relative space-y-6">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Award className="size-8" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Certifikát o absolvovaní
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {enrollment.course?.title ?? enrollment.course_id}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Vydaný{" "}
              {new Date(enrollment.created_at).toLocaleDateString("sk-SK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a href={enrollment.certificate_url} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <Download className="size-4" />
                  Stiahnuť certifikát
                </Button>
              </a>
              <Link href="/my-courses">
                <Button variant="outline">Moje kurzy</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
