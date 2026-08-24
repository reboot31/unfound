import { Reveal } from "@/components/reveal";
import { WaitlistForm } from "@/components/waitlist-form";
import { Wordmark } from "@/components/wordmark";

const PROBLEMS = [
  {
    title: "Availability is not a signal",
    body: "The senior people on the market are the ones between things. The person you actually want is three quarters into a good year and not thinking about it. A shortlist built from who applied is a shortlist built from who was free.",
  },
  {
    title: "Fifteen years compresses badly",
    body: "Two lines on a profile cannot tell you whether someone rebuilt a team after it broke or inherited it already working. Senior hires turn on context that never survives a résumé.",
  },
  {
    title: "Looking has a cost",
    body: "A Director who updates a profile has told their company something. So the strong ones stay still, and the market never sees them at all.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "You tell one person what you want",
    body: "The role, or the move. Once, in detail, to a human being.",
  },
  {
    n: "2",
    title: "We go and find it",
    body: "Nothing is posted. No profile is listed. No search returns you.",
  },
  {
    n: "3",
    title: "A few introductions, with context",
    body: "Two or three, each with the reasoning attached. Not a pipeline.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8 md:px-10">
        <Wordmark className="text-xl text-ink" />
        <span className="eyebrow hidden sm:block">India · Opening soon</span>
      </header>

      <main>
        {/* Hero ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-28 md:px-10 md:pt-32 md:pb-44">
          <h1 className="max-w-[16ch] font-serif text-[clamp(2.75rem,8.5vw,5.25rem)] leading-[1.02] font-light tracking-[-0.03em] text-balance text-ink">
            The best ones <span className="resolve">aren&rsquo;t obvious</span>.
          </h1>
          <p className="mt-10 max-w-[46ch] text-lg leading-[1.65] text-ink-soft md:text-xl">
            At VP, Director and Head-of level, the person who would be right for
            the role is usually not looking, not listed, and not going to answer
            a recruiter. Unfound is how the two of you meet anyway.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#waitlist"
              className="inline-flex h-12 items-center rounded-sm bg-spruce px-8 text-[0.9375rem] font-medium text-paper transition-opacity hover:opacity-90"
            >
              Request an invitation
            </a>
            <span className="text-sm text-ink-faint">
              Engineering and non-engineering. Pre-launch.
            </span>
          </div>
        </section>

        {/* Problem ──────────────────────────────────────────── */}
        <section className="border-t border-rule bg-paper-raised">
          <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-36">
            <Reveal>
              <p className="eyebrow">Why senior hiring stalls</p>
            </Reveal>
            <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-10">
              {PROBLEMS.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <article className="max-w-[38ch]">
                    <h2 className="font-serif text-2xl leading-snug font-normal tracking-[-0.015em] text-ink">
                      {item.title}
                    </h2>
                    <p className="mt-4 leading-[1.7] text-ink-soft">
                      {item.body}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works ─────────────────────────────────────── */}
        <section className="border-t border-rule">
          <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-36">
            <Reveal>
              <p className="eyebrow">How it works</p>
            </Reveal>
            <ol className="mt-14 md:mt-20">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 90}>
                  <li className="grid gap-3 border-t border-rule py-8 md:grid-cols-[3rem_1fr_1fr] md:gap-10 md:py-10 last:border-b">
                    <span className="font-mark text-sm text-ink-faint tabular-nums">
                      {step.n}
                    </span>
                    <h2 className="font-serif text-2xl leading-snug font-normal tracking-[-0.015em] text-ink md:text-[1.75rem]">
                      {step.title}
                    </h2>
                    <p className="leading-[1.7] text-ink-soft md:pt-2">
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Two sides ────────────────────────────────────────── */}
        <section className="border-t border-rule bg-paper-raised">
          <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-36">
            <Reveal>
              <h2 className="max-w-[20ch] font-serif text-[clamp(1.9rem,4.5vw,2.75rem)] leading-[1.15] font-light tracking-[-0.02em] text-balance text-ink">
                Curated, in both directions.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-2 md:gap-20">
              <Reveal>
                <div className="max-w-[42ch]">
                  <p className="eyebrow">If you&rsquo;re open to a move</p>
                  <p className="mt-6 leading-[1.75] text-ink-soft">
                    You are not in a database and you do not appear in anyone
                    else&rsquo;s search. Nobody browses you. We come to you when
                    there is something specific worth an hour of your time, and
                    stay quiet otherwise. For most people that is a few times a
                    year.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={90}>
                <div className="max-w-[42ch]">
                  <p className="eyebrow">If you&rsquo;re hiring</p>
                  <p className="mt-6 leading-[1.75] text-ink-soft">
                    We screen the role before we screen anyone for it: a real
                    mandate, honest compensation, a decision-maker in the room.
                    If those are missing we will tell you, and we will not run
                    it. What comes back is short enough to read properly.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Waitlist ─────────────────────────────────────────── */}
        <section id="waitlist" className="bg-ink text-paper">
          <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-36">
            <div className="grid gap-16 md:grid-cols-[1fr_1.15fr] md:gap-24">
              <div>
                <p className="eyebrow text-white/45">The waitlist</p>
                <h2 className="mt-6 max-w-[18ch] font-serif text-[clamp(1.9rem,4.5vw,2.75rem)] leading-[1.15] font-light tracking-[-0.02em] text-balance text-paper">
                  We open in small batches.
                </h2>
                <p className="mt-6 max-w-[38ch] leading-[1.75] text-white/55">
                  A few people on each side at a time, so every introduction
                  still earns the reply. Tell us which side you&rsquo;re on.
                </p>
              </div>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-paper">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 border-t border-white/10 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
          <Wordmark className="text-base text-paper" />
          <div className="flex flex-col gap-2 text-sm text-white/45 sm:flex-row sm:gap-8">
            <a
              href="mailto:hello@unfoundhq.com"
              className="transition-colors hover:text-paper"
            >
              hello@unfoundhq.com
            </a>
            <span>Senior roles, India</span>
            <span>© {new Date().getFullYear()} Unfound</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
