"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
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
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="h-11 w-full gap-2 text-base shadow-md shadow-primary/20"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Spracovávam...
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          Simulovať platbu a zapísať sa
        </>
      )}
    </Button>
  );
}
