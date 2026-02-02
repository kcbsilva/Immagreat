import Link from "next/link";

export default function FrenchTeensTwelveToSeventeenPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">French Classes</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">Teens 12 - 17</h1>
      <p className="text-base text-[#4D4D4D]">
        Academic readiness for high school and post-secondary pathways with
        writing and speaking coaching.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">What to expect</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>Essay structure, critical reading, and presentation skills.</li>
          <li>Vocabulary tied to academic subjects.</li>
          <li>Confidence for interviews, school, and group work.</li>
        </ul>
      </div>
      <Link
        className="text-sm font-semibold text-[#C52D2F] hover:underline"
        href="/immagrate"
      >
        Back to Immagrate
      </Link>
    </main>
  );
}
