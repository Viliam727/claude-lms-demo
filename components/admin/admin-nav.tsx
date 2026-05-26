import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/logout-button";

export function AdminNav() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-semibold text-gray-900">
            LMS Demo Admin
          </Link>
          <nav className="flex gap-4 text-sm text-gray-500">
            <Link href="/admin" className="hover:text-gray-900">
              Kurzy
            </Link>
            <Link href="/" className="hover:text-gray-900">
              Demo web →
            </Link>
          </nav>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
