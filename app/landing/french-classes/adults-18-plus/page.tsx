import Link from "next/link";

export default function FrenchAdultsEighteenPlusPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">French Classes</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">Adults 18+</h1>
      <p className="text-base text-[#4D4D4D]">
        Practical French for work, settlement, and TEF/TCF readiness with
        targeted coaching.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">What to expect</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>
            Speaking and listening labs tuned to daily life and job search.
          </li>
          <li>Writing clinics for emails, resumes, and test tasks.</li>
          <li>Goal tracking and weekly practice plans.</li>
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
