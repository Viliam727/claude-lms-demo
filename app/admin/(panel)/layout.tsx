import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
