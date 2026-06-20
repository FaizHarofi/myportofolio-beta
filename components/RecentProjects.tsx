"use client";

import { useEffect, useRef, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { FolderKanban, Rocket, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";
import { PinContainer } from "./ui/Pin";

const RecentProjects = ({ projects }: { projects: Project[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {projects.length === 0 ? (
        <ProjectsEmpty />
      ) : (
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
          {projects.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] shrink-0 relative transition-shadow duration-500",
                  isHovered &&
                    "shadow-[0_25px_60px_-15px_rgba(56,189,248,0.5)]"
                )}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {isHovered && (
                  <>
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-scan-line pointer-events-none z-[70]" />
                    <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-sky-400 to-transparent animate-scan-line-x pointer-events-none z-[70]" />
                  </>
                )}

                <PinContainer title={item.link} href={item.link}>
                  <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                    <div
                      className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                      style={{ backgroundColor: "#13162D" }}
                    >
                      <img src="/bg.png" alt="bgimg" />
                    </div>
                    <img
                      src={item.img}
                      alt="cover"
                      className="z-10 absolute bottom-0"
                    />
                  </div>

                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {item.title}
                  </h1>

                  <p
                    className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                    style={{
                      color: "#BEC1DD",
                      margin: "1vh 0",
                    }}
                  >
                    {item.des}
                  </p>

                  <div className="flex items-center justify-between mt-7 mb-3">
                    <div className="flex items-center">
                      {item.iconLists.map((icon, index) => (
                        <div
                          key={index}
                          className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                          style={{
                            transform: `translateX(-${5 * index + 2}px)`,
                          }}
                        >
                          <img src={icon} alt="icon5" className="p-2" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center">
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        Check Live Site
                      </p>
                      <FaLocationArrow className="ms-3" color="#38BDF8" />
                    </div>
                  </div>
                </PinContainer>
              </div>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
};

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
