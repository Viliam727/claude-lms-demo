"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Props {
  courseId: string;
  firstLessonId: string;
}

export function EnrollButton({ courseId, firstLessonId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (!res.ok) throw new Error("Enroll failed");
      router.push(`/learn/${courseId}/${firstLessonId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full" size="lg">
      {loading ? "Spracovávam..." : "Simulovať platbu a zapísať sa"}
    </Button>
  );
}
