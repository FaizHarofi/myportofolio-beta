import type { Metadata } from "next";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import About from "@/components/About";
import { getNavItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Info | FaizHarofi's Portfolio",
  description:
    "About FaizHarofi — web developer from Pekanbaru, Riau, Indonesia.",
};

export default async function InfoPage() {
  const navItems = await getNavItems();
  const navForComponent = navItems.map((n) => ({ name: n.name, link: n.link }));

  return (
    <main className="relative bg-black-100 flex flex-col items-center overflow-x-clip mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navForComponent} />
        <div className="pt-28 sm:pt-32">
          <About />
        </div>
      </div>
    </main>
  );
}
