import {
  Palette,
  Code2,
  TerminalSquare,
  GraduationCap,
  Sparkles,
  User as UserIcon,
  Camera,
  MapPin,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";
import { getProfile, getSkills, getEducations, type Skill, type Education } from "@/lib/data";
import { cn } from "@/lib/utils";

const TONE_BY_GROUP: Record<
  string,
  { card: string; icon: string; chip: string }
> = {
  design: {
    card: "from-fuchsia-500/15 via-fuchsia-500/5 border-fuchsia-400/25",
    icon: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30",
    chip: "bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-400/25",
  },
  web: {
    card: "from-violet-500/15 via-violet-500/5 border-violet-400/25",
    icon: "bg-violet-500/20 text-violet-300 border-violet-400/30",
    chip: "bg-violet-500/10 text-violet-200 border-violet-400/25",
  },
  other: {
    card: "from-sky-500/15 via-sky-500/5 border-sky-400/25",
    icon: "bg-sky-500/20 text-sky-300 border-sky-400/30",
    chip: "bg-sky-500/10 text-sky-200 border-sky-400/25",
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
  return Sparkles;
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
  const firstName = profile.name.split(" ")[0] ?? profile.name;

  return (
    <section
      id="info"
      className="relative w-full overflow-hidden py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* HERO: avatar + identity */}
        <div className="flex flex-col items-center text-center">
          <AvatarCircle
            avatar={profile.avatar}
            name={profile.name}
          />

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {profile.name}
          </h1>

          <p className="mt-2 text-base font-medium text-sky-400 sm:text-lg">
            {profile.role}
          </p>

          {profile.location ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin size={12} />
              {profile.location}
            </p>
          ) : null}
        </div>

        {/* BIO paragraphs */}
        {(profile.bio1 || profile.bio2) ? (
          <div className="mx-auto mt-12 max-w-3xl space-y-4 text-center">
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
        ) : null}

        {/* TERMINAL */}
        <Terminal
          name={profile.name}
          role={profile.role}
          location={profile.location}
          skills={skills}
        />

        {/* SKILLS */}
        {grouped.length > 0 ? (
          <div className="mt-20">
            <SectionHeading
              eyebrow="Skills"
              title="What I work with"
              subtitle="Tools and technologies I use to bring ideas to life."
            />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {grouped.map((group) => (
                <SkillCard key={group.name} group={group} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-20 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 px-6 py-14 text-center text-sm text-slate-400">
            No skills yet — add them from{" "}
            <a
              href="/admin/skills"
              className="font-medium text-violet-300 hover:text-violet-200 underline underline-offset-2"
            >
              /admin/skills
            </a>
            .
          </div>
        )}

        {/* EDUCATION */}
        {educations.length > 0 ? (
          <div className="mt-20">
            <SectionHeading
              eyebrow="Education"
              title="Background"
              subtitle="Schools and academic milestones."
            />

            <div className="relative mt-6">
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-[19px] hidden w-px bg-gradient-to-b from-emerald-400/40 via-white/10 to-transparent sm:block"
                style={{ top: "12px", height: "calc(100% - 24px)" }}
              />
              <ol className="space-y-3">
                {educations.map((edu) => (
                  <EducationCard key={edu.id} edu={edu} />
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Subcomponents                                                              */
/* -------------------------------------------------------------------------- */

function AvatarCircle({
  avatar,
  name,
}: {
  avatar: string | null;
  name: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      {/* Glow rings */}
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-full bg-gradient-to-br from-sky-500/30 via-violet-500/30 to-fuchsia-500/30 opacity-60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-full bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 opacity-50"
      />

      <div className="relative h-36 w-36 sm:h-40 sm:w-40 overflow-hidden rounded-full bg-gradient-to-br from-sky-500 via-violet-500 to-fuchsia-500 p-[3px] shadow-2xl shadow-violet-500/30">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
              <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {initials || <UserIcon size={48} className="text-slate-600" />}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Camera badge hint for "no photo yet" state */}
      {!avatar ? (
        <div
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-lg"
          title="Upload your photo in /admin/profile"
        >
          <Camera size={15} strokeWidth={2.2} />
        </div>
      ) : null}
    </div>
  );
}

function SkillCard({ group }: { group: { name: string; items: Skill[] } }) {
  const t = toneFor(group.name);
  const Icon = iconFor(group.name);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-xl sm:p-6",
        t.card
      )}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-2.5">
          <span
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border",
              t.icon
            )}
          >
            <Icon size={17} />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">{group.name}</h3>
            <p className="text-[11px] text-slate-400">
              {group.items.length}{" "}
              {group.items.length === 1 ? "skill" : "skills"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {group.items.map((item) => (
            <span
              key={item.id}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium",
                t.chip
              )}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function EducationCard({ edu }: { edu: Education }) {
  return (
    <li className="group relative flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 p-5 backdrop-blur-xl transition-all hover:border-white/15 hover:bg-slate-900/60">
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-500/20 text-emerald-300 sm:self-start">
        <GraduationCap size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-bold text-white sm:text-lg">
            {edu.school}
          </h3>
          <span className="font-mono text-[11px] text-slate-400">
            {edu.period}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-emerald-300">
          {edu.level}
        </p>
        {edu.description ? (
          <p className="mt-2 text-sm leading-relaxed text-white">
            {edu.description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-2">
      <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-400">
        <span className="h-1 w-6 rounded-full bg-sky-400/60" />
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
    </div>
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
    <div className="mt-12">
      <SectionHeading
        eyebrow="Shell"
        title="Quick lookup"
        subtitle="The essentials in a single command."
      />

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
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
            zsh
          </span>
        </div>

        <div className="space-y-3 p-6 font-mono text-sm leading-relaxed">
          <TermLine prompt="/name" />
          <TermOut>{name}</TermOut>

          <TermLine prompt="/role" />
          <TermOut>{role}</TermOut>

          <TermLine prompt="/location" />
          <TermOut>{`${name.split(" ")[0]} from ${location}`}</TermOut>

          <TermLine prompt="ls /skills" />
          <TermOut>
            {skills.length === 0 ? (
              <span className="text-slate-500">No skills yet</span>
            ) : (
              <span className="inline-flex flex-wrap gap-x-4 gap-y-1">
                {designSkills.map((label) => (
                  <span key={label} className="text-sky-300">
                    · {label}
                  </span>
                ))}
                {webSkills.map((label) => (
                  <span key={label} className="text-amber-300">
                    · {label}
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
                      · {s.label}
                    </span>
                  ))}
              </span>
            )}
          </TermOut>

          <p className="pt-2">
            <span className="text-emerald-400">$</span>{" "}
            <span className="ml-1 inline-block h-4 w-2.5 -mb-0.5 animate-pulse bg-emerald-400 align-middle" />
          </p>
        </div>
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
