export const dynamic = "force-dynamic";


import Link from "next/link";
import { getEnrollments } from "@/lib/lms-client";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ enrollmentId: string }>;
}

export default async function CertificatePage({ params }: Props) {
  const { enrollmentId } = await params;
  const enrollments = await getEnrollments();
  const enrollment = enrollments.find((e) => e.id === enrollmentId);

  if (!enrollment?.certificate_url) {
    return (
      <main className="max-w-lg mx-auto px-6 py-20 text-center">
        <p className="text-gray-500">Certifikát ešte nie je dostupný.</p>
        <Link href="/my-courses" className="mt-4 inline-block">
          <Button variant="outline">Späť na moje kurzy</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="border-4 border-yellow-400 rounded-2xl p-12 space-y-6">
        <div className="text-5xl">🎓</div>
        <h1 className="text-3xl font-semibold text-gray-900">Certifikát o absolvovaní</h1>
        <p className="text-gray-500 text-lg">
          {enrollment.course?.title ?? enrollment.course_id}
        </p>
        <p className="text-sm text-gray-400">
          Vydaný: {new Date(enrollment.created_at).toLocaleDateString("sk-SK")}
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <a href={enrollment.certificate_url} target="_blank" rel="noopener noreferrer">
            <Button>Stiahnuť certifikát</Button>
          </a>
          <Link href="/my-courses">
            <Button variant="outline">Moje kurzy</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
