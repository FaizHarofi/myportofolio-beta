import Link from "next/link";
import {
  getCompanies,
  getExperiences,
  getGridItems,
  getNavItems,
  getProjects,
  getSocials,
  getTestimonials,
} from "@/lib/data";

export default async function AdminDashboard() {
  const [nav, grid, projects, testimonials, companies, experiences, socials] =
    await Promise.all([
      getNavItems(),
      getGridItems(),
      getProjects(),
      getTestimonials(),
      getCompanies(),
      getExperiences(),
      getSocials(),
    ]);

  const stats = [
    { label: "Nav Items", count: nav.length, href: "/admin/nav" },
    { label: "Grid Items", count: grid.length, href: "/admin/grid-items" },
    { label: "Projects", count: projects.length, href: "/admin/projects" },
    { label: "Testimonials", count: testimonials.length, href: "/admin/testimonials" },
    { label: "Companies", count: companies.length, href: "/admin/companies" },
    { label: "Experience", count: experiences.length, href: "/admin/experience" },
    { label: "Social Media", count: socials.length, href: "/admin/social" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">
        Manage all your portfolio content from here.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-sky-500 transition"
          >
            <div className="text-3xl font-bold text-sky-400">{s.count}</div>
            <div className="mt-1 text-sm text-slate-300">{s.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
