"use client";

import React from "react";
import { Quote, Inbox, Sparkles } from "lucide-react";

import type { Company, Testimonial } from "@/lib/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

const Clients = ({
  testimonials,
  companies,
}: {
  testimonials: Testimonial[];
  companies: Company[];
}) => {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        Kind words from
        <span className="text-purple"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        {hasTestimonials ? (
          <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden w-full">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        ) : (
          <TestimonialsEmpty />
        )}

        {companies.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-16 max-lg:mt-10">
            {companies.map((company) => (
              <React.Fragment key={company.id}>
                <div className="flex md:max-w-60 max-w-32 gap-2">
                  <img
                    src={company.img}
                    alt={company.name}
                    className="md:w-10 w-5"
                  />
                  <img
                    src={company.nameImg}
                    alt={company.name}
                    width={company.id === 4 || company.id === 5 ? 100 : 150}
                    className="md:w-24 w-20"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};

function TestimonialsEmpty() {
  return (
    <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center sm:px-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
      >
        <div className="absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto inline-flex">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-white/10 text-violet-300">
          <Inbox size={26} strokeWidth={1.5} />
        </div>
        <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
          <Sparkles size={11} strokeWidth={2.5} />
        </span>
      </div>

      <h3 className="relative mt-5 text-xl font-bold text-white sm:text-2xl">
        No recent testimonials
      </h3>
      <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400 sm:text-[15px]">
        There are no testimonials to show here yet. Check back soon — kind
        words from clients will appear in this section as they come in.
      </p>
    </div>
  );
};

export default Clients;
