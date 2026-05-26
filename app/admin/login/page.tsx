import Link from "next/link";
import { Layers } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Layers className="size-5" />
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            LMS Demo
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Course Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Referenčný admin pre integrátorov
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <AdminLoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Späť na demo
          </Link>
        </p>
      </div>
    </div>
  );
}
