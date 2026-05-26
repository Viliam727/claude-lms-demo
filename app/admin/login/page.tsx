import { AdminLoginForm } from "@/components/admin/login-form";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-wide text-gray-400">LMS Demo</p>
          <h1 className="text-2xl font-semibold mt-1">Course Admin</h1>
          <p className="text-sm text-gray-500 mt-2">
            Referenčný admin pre integrátorov
          </p>
        </div>
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <AdminLoginForm />
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          <Link href="/" className="hover:text-gray-600">
            ← Späť na demo
          </Link>
        </p>
      </div>
    </div>
  );
}
