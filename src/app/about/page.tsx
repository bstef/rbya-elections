export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">How RBYA Elections Work</h1>
        <p className="mt-1 text-slate-600">
          A summary of the process, for transparency. This app enforces these
          rules in its logic, not just in this page&apos;s copy.
        </p>
      </div>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Nominations</h2>
        <p className="text-slate-700">
          Anyone can nominate an RBYA member for a committee position. The
          nomination window opens well ahead of Convention and closes 48
          hours beforehand. The nominee then has until that same 48-hour
          cutoff to confirm they accept the nomination -- only confirmed,
          accepted nominees appear publicly.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Comments</h2>
        <p className="text-slate-700">
          Anyone can leave a note of support (&ldquo;seconding&rdquo;) for a candidate,
          which is shown publicly. Objections can also be submitted, but they
          are never shown online -- they&apos;re reviewed by the election
          committee and may be read aloud at Convention immediately before
          voting on that candidate.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Delegates</h2>
        <p className="text-slate-700">
          Each affiliated church may register one delegate for every ten
          youth (rounding up for the remainder) -- a &ldquo;youth&rdquo; being any person
          under 40, baptized, active in the church&apos;s youth activities,
          and counted as a member there. Churches register their delegate
          list in advance; the election committee verifies it before any
          delegate can log in to vote.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-semibold text-slate-900">Voting</h2>
        <p className="text-slate-700">
          Delegates present at Convention can vote on candidates. Delegates
          voting by absentee ballot may only vote for committee candidates,
          not on other Convention business, and must submit before the
          absentee deadline. A candidate is elected with more than 50% of the
          ballots cast for their position.
        </p>
      </section>
    </div>
  );
}
