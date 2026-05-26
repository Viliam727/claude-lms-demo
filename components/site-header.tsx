import Link from "next/link";
import { BookOpen, GraduationCap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  active?: "courses" | "my-courses";
  className?: string;
}

export function SiteHeader({ active, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
            <Layers className="size-4" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">LMS Demo</span>
            <span className="block text-[11px] text-muted-foreground">Headless reference</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/">
            <Button
              variant={active === "courses" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5"
            >
              <BookOpen className="size-3.5" />
              Kurzy
            </Button>
          </Link>
          <Link href="/my-courses">
            <Button
              variant={active === "my-courses" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1.5"
            >
              <GraduationCap className="size-3.5" />
              Moje kurzy
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Admin
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
