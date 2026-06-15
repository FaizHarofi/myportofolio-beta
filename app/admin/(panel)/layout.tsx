import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/grid-items", label: "Grid Items" },
  { href: "/admin/icons", label: "Tech Icons" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/social", label: "Social Media" },
  { href: "/admin/nav", label: "Nav Items" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col">
        <div className="mb-6 px-2">
          <h2 className="text-lg font-bold text-sky-400">Admin Panel</h2>
          <p className="text-xs text-slate-500 mt-1">
            <Link href="/" className="hover:text-sky-300">
              ← Back to site
            </Link>
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-sky-300 transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-md border border-slate-700 hover:border-red-500 hover:text-red-400 px-3 py-2 text-sm transition"
          >
            Logout
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
