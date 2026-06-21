"use client";

import { useEffect, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { FolderKanban, Rocket, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { ClippedCircle } from "@/components/unlumen-ui/clipped-circle";

const RecentProjects = ({ projects }: { projects: Project[] }) => {
  const visibleProjects = projects.filter((p) => Boolean(p.enabled));
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [start, setStart] = useState(false);

  const enableMarquee = visibleProjects.length >= 2;

  useEffect(() => {
    if (enableMarquee) {
      addAnimation();
    } else {
      setStart(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableMarquee]);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const cloned = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(cloned);
        }
      });

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
        containerRef.current.style.setProperty(
          "--animation-duration",
          "60s"
        );
      }
      setStart(true);
    }
  }

  return (
    <div className="py-20" id="projects">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>

      {visibleProjects.length === 0 ? (
        <ProjectsEmpty />
      ) : enableMarquee ? (
        <div
          ref={containerRef}
          className="scroller relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
        >
          <div
            ref={scrollerRef}
            className={cn(
              "flex gap-12 py-6 w-max flex-nowrap",
              start && "animate-scroll",
              "hover:[animation-play-state:paused]"
            )}
          >
            {visibleProjects.map((item, idx) => (
              <ProjectCard
                key={`${item.id}-${idx}`}
                item={item}
                idx={idx}
                hoveredIdx={hoveredIdx}
                setHoveredIdx={setHoveredIdx}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex justify-center">
          <ProjectCard
            item={visibleProjects[0]}
            idx={0}
            hoveredIdx={hoveredIdx}
            setHoveredIdx={setHoveredIdx}
          />
        </div>
      )}
    </div>
  );
};

function ProjectCard({
  item,
  idx,
  hoveredIdx,
  setHoveredIdx,
}: {
  item: Project;
  idx: number;
  hoveredIdx: number | null;
  setHoveredIdx: (i: number | null) => void;
}) {
  const isHovered = hoveredIdx === idx;
  return (
    <div
      className={cn(
        "lg:min-h-[24rem] h-[20rem] flex items-center justify-center sm:w-72 w-[80vw] shrink-0 relative transition-shadow duration-500",
        isHovered && "shadow-[0_25px_60px_-15px_rgba(56,189,248,0.5)]"
      )}
      onMouseEnter={() => setHoveredIdx(idx)}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      <div className="relative h-full w-full rounded-xl p-px transition-all duration-300 bg-gradient-to-br from-white/15 via-white/5 to-white/10 hover:from-white/30 hover:via-white/10 hover:to-white/20">
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="relative block w-full h-full cursor-pointer overflow-hidden rounded-xl bg-slate-950/80 ring-1 ring-inset ring-white/10 transition-transform duration-300 hover:-translate-y-1"
          >
            <CardInner item={item} />
            <ClippedCircle
              circleSize={220}
              circleClassName="bg-violet-500/30"
            />
          </a>
        ) : (
          <div className="relative block w-full h-full cursor-pointer overflow-hidden rounded-xl bg-slate-950/80 ring-1 ring-inset ring-white/10">
            <CardInner item={item} />
            <ClippedCircle
              circleSize={220}
              circleClassName="bg-violet-500/30"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CardInner({ item }: { item: Project }) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="relative flex w-full items-center justify-center overflow-hidden h-[14vh] lg:h-[18vh] mb-6 rounded-xl bg-[#13162D]">
        <img
          src={item.img}
          alt={item.title}
          className="z-10 absolute bottom-0 max-h-full w-auto object-contain"
        />
      </div>

      <h1 className="font-bold lg:text-lg md:text-base text-sm line-clamp-1 text-white">
        {item.title}
      </h1>

      <p
        className="lg:text-sm font-light text-xs line-clamp-2 text-white/75"
        style={{ margin: "0.6vh 0" }}
      >
        {item.des}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center">
          {item.iconLists.map((icon, index) => (
            <div
              key={index}
              className="border border-white/[.2] rounded-full bg-black lg:w-8 lg:h-8 w-6 h-6 flex justify-center items-center"
              style={{
                transform: `translateX(-${4 * index + 2}px)`,
              }}
            >
              <img src={icon} alt="icon5" className="p-1.5" />
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center">
          <p className="flex lg:text-sm text-xs text-purple">
            Live Site
          </p>
          <FaLocationArrow className="ms-2" color="#38BDF8" size={12} />
        </div>
      </div>
    </div>
  );
}

function ProjectsEmpty() {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-3xl overflow-hidden rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center sm:px-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
      >
        <div className="absolute -top-16 left-1/3 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto inline-flex">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 to-sky-500/30 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-sky-500/10 border border-white/10 text-violet-300">
          <FolderKanban size={26} strokeWidth={1.5} />
        </div>
        <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/30">
          <Rocket size={11} strokeWidth={2.5} />
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-bold text-white sm:text-2xl">
        No projects to showcase yet
      </h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400 sm:text-[15px]">
        The project shelf is empty for now. New work will show up here as
        it&apos;s published — keep an eye on this space.
      </p>

      <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/20 px-3 py-1.5 text-[11px] font-medium text-slate-400">
        <Sparkles size={11} className="text-violet-300" />
        Coming soon
      </div>
    </div>
  );
}

export default RecentProjects;
