import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?redirectTo=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10">
      <AdminSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
