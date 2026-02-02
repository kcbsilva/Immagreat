import Link from "next/link";

export default function EmployerLiaisonPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">Liasion</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">
        Employer Liaison
      </h1>
      <p className="text-base text-[#4D4D4D]">
        Support for coordinating documents and communication with employers
        during immigration preparation.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">How we help</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>Employer-ready checklists and document requests.</li>
          <li>Timelines and reminders to keep paperwork moving.</li>
          <li>Notes on role alignment and supporting evidence.</li>
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
