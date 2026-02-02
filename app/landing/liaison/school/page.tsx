import Link from "next/link";

export default function SchoolLiaisonPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">Liasion</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">School Liaison</h1>
      <p className="text-base text-[#4D4D4D]">
        Coordination support for school documentation, admissions readiness, and
        timeline planning.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">How we help</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>Guidance for transcripts, letters, and academic records.</li>
          <li>Checklist for admissions documentation and deadlines.</li>
          <li>Support for study-plan readiness and proof lists.</li>
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
