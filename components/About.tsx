import {
  Palette,
  Code2,
  TerminalSquare,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getSkills, getEducations, getProfile, type Skill, type Education } from "@/lib/data";

const TONE_BY_GROUP: Record<
  string,
  {
    card: string;
    icon: string;
  }
> = {
  design: {
    card: "from-fuchsia-500/15 via-fuchsia-500/5 border-fuchsia-400/25",
    icon: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
  },
  web: {
    card: "from-violet-500/15 via-violet-500/5 border-violet-400/25",
    icon: "bg-violet-500/20 text-violet-300 border-violet-400/30",
  },
  other: {
    card: "from-sky-500/15 via-sky-500/5 border-sky-400/25",
    icon: "bg-sky-500/20 text-sky-300 border-sky-400/30",
  },
};

function toneFor(group: string) {
  const key = group.toLowerCase();
  if (key.includes("design")) return TONE_BY_GROUP.design;
  if (key.includes("web")) return TONE_BY_GROUP.web;
  return TONE_BY_GROUP.other;
}

function iconFor(group: string) {
  const key = group.toLowerCase();
  if (key.includes("design")) return Palette;
  if (key.includes("web")) return Code2;
  return Code2;
}

const skillGroupOrder = ["Design", "Web", "Other"];

function groupSkills(skills: Skill[]) {
  const buckets = new Map<string, Skill[]>();
  for (const s of skills) {
    const arr = buckets.get(s.group_name) ?? [];
    arr.push(s);
    buckets.set(s.group_name, arr);
  }
  const ordered: { name: string; items: Skill[] }[] = [];
  for (const name of skillGroupOrder) {
    const items = buckets.get(name);
    if (items && items.length) ordered.push({ name, items });
  }
  for (const [name, items] of buckets) {
    if (!skillGroupOrder.includes(name) && items.length) {
      ordered.push({ name, items });
    }
  }
  return ordered;
}

export default async function About() {
  const [skills, educations, profile] = await Promise.all([
    getSkills(),
    getEducations(),
    getProfile(),
  ]);
  const grouped = groupSkills(skills);

  return (
    <section id="info" className="w-full py-20">
      <h1 className="heading">
        My <span className="text-purple">info</span>
      </h1>

      <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center">
        {profile.bio1 ? (
          <p className="text-base leading-relaxed text-white sm:text-lg whitespace-pre-line">
            {profile.bio1}
          </p>
        ) : null}
        {profile.bio2 ? (
          <p className="text-base leading-relaxed text-white sm:text-lg whitespace-pre-line">
            {profile.bio2}
          </p>
        ) : null}
      </div>

      <Terminal
        name={profile.name}
        role={profile.role}
        location={profile.location}
        skills={skills}
      />

      {grouped.length > 0 ? (
        <div className="mt-20">
          <h2 className="heading mb-8 text-3xl sm:text-4xl">
            <span className="text-purple">Skills</span>
          </h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
            {grouped.map((group) => {
              const t = toneFor(group.name);
              const Icon = iconFor(group.name);
              return (
                <div
                  key={group.name}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl ${t.card}`}
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-950/5 blur-2xl" />
                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2.5">
                      <span
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${t.icon}`}
                      >
                        <Icon size={17} />
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {group.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full border border-white/10 bg-slate-950/5 px-3 py-1 text-sm text-slate-200"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {educations.length > 0 ? (
        <div className="mt-20">
          <h2 className="heading mb-8 text-3xl sm:text-4xl">
            <span className="text-purple">Education</span>
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {educations.map((edu) => (
              <EducationCard key={edu.id} edu={edu} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function EducationCard({ edu }: { edu: Education }) {
  return (
    <article className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-5 backdrop-blur-xl transition-all hover:border-white/15 hover:bg-slate-900/60">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
        <GraduationCap size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold text-white">{edu.school}</h3>
          <span className="font-mono text-[11px] text-slate-400">
            {edu.period}
          </span>
        </div>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-emerald-300">
          {edu.level}
        </p>
        {edu.description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-white">
            {edu.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function Terminal({
  name,
  role,
  location,
  skills,
}: {
  name: string;
  role: string;
  location: string;
  skills: Skill[];
}) {
  const designSkills = skills
    .filter((s) => s.group_name.toLowerCase().includes("design"))
    .map((s) => s.label);
  const webSkills = skills
    .filter((s) => s.group_name.toLowerCase().includes("web"))
    .map((s) => s.label);

  return (
    <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900/80 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-500/85" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/85" />
        <span className="h-3 w-3 rounded-full bg-green-500/85" />
        <span className="ml-3 inline-flex items-center gap-1.5 font-mono text-xs text-slate-400">
          <TerminalSquare size={12} />
          ~/about — bash
        </span>
        <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-slate-500">
          <Sparkles size={10} />
          80×24
        </span>
      </div>

      <div className="space-y-3 p-6 font-mono text-sm leading-relaxed">
        <TermLine prompt="/My Name:" />
        <TermOut>{name}</TermOut>

        <TermLine prompt="/skill" />
        <TermOut>{role}</TermOut>

        <TermLine prompt="/From" />
        <TermOut>{`${name.split(" ")[0]} from ${location}`}</TermOut>

        <TermLine prompt="ls /skills" />
        <TermOut>
          {skills.length === 0 ? (
            <span className="text-slate-500">No skills yet</span>
          ) : (
            <span className="inline-flex flex-wrap gap-x-4 gap-y-1">
              {designSkills.map((label) => (
                <span key={label} className="text-sky-300">
                  {label}
                </span>
              ))}
              {webSkills.map((label) => (
                <span key={label} className="text-amber-300">
                  {label}
                </span>
              ))}
              {skills
                .filter(
                  (s) =>
                    !s.group_name.toLowerCase().includes("design") &&
                    !s.group_name.toLowerCase().includes("web")
                )
                .map((s) => (
                  <span key={s.id} className="text-emerald-300">
                    {s.label}
                  </span>
                ))}
            </span>
          )}
        </TermOut>

        <p className="pt-1">
          <span className="text-emerald-400">$</span>{" "}
          <span className="ml-1 inline-block h-4 w-2.5 -mb-0.5 animate-pulse bg-emerald-400 align-middle" />
        </p>
      </div>
    </div>
  );
}

function TermLine({ prompt }: { prompt: string }) {
  return (
    <p>
      <span className="select-none text-emerald-400">$</span>{" "}
      <span className="text-slate-100">{prompt}</span>
    </p>
  );
}

function TermOut({ children }: { children: React.ReactNode }) {
  return <p className="ml-4 text-slate-300">{children}</p>;
}

