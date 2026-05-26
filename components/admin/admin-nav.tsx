import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export function AdminNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layers className="size-3.5" />
            </div>
            <span className="font-semibold tracking-tight">Course Admin</span>
          </Link>
          <nav className="hidden gap-4 text-sm text-muted-foreground sm:flex">
            <Link href="/admin" className="hover:text-foreground">
              Kurzy
            </Link>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              Demo web
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
