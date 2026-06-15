import {
  getCompanies,
  getExperiences,
  getGridItems,
  getNavItems,
  getProjects,
  getSocials,
  getTestimonials,
} from "@/lib/data";

import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Footer from "@/components/Footer";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import Experience from "@/components/Experience";
import RecentProjects from "@/components/RecentProjects";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [navItems, gridItems, projects, testimonials, companies, experiences, socials] =
    await Promise.all([
      getNavItems(),
      getGridItems(),
      getProjects(),
      getTestimonials(),
      getCompanies(),
      getExperiences(),
      getSocials(),
    ]);

  const navForComponent = navItems.map((n) => ({ name: n.name, link: n.link }));
  const socialForComponent = socials.map((s) => ({ id: s.id, img: s.img }));

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navForComponent} />
        <Hero />
        <Grid items={gridItems} />
        <RecentProjects projects={projects} />
        <Clients
          testimonials={testimonials}
          companies={companies}
        />
        <Experience items={experiences} />
        <Approach />
        <Footer socials={socialForComponent} />
      </div>
    </main>
  );
}
