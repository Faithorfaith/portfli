import Link from "next/link";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?redirectTo=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="admin-theme min-h-screen bg-paper text-ink">
      <header className="border-b border-shelf-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="font-display text-lg tracking-tight text-ink">
            Open<span className="text-accent">Shelf</span> Admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-ink-muted">{user.name}</span>
            <Link href="/" className="text-ink-muted hover:text-accent">
              View public site
            </Link>
            <form action={signOut}>
              <button className="text-accent hover:text-accent-hover">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
