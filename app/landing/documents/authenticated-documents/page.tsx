import Link from "next/link";

export default function AuthenticatedDocumentsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">Documents</div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">
        Authenticated Documents
      </h1>
      <p className="text-base text-[#4D4D4D]">
        Guidance for document authentication steps, including notarization and
        legalization when required.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">Common cases</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>Notarized copies for school or immigration packets.</li>
          <li>
            Authentication for international use and embassy requirements.
          </li>
          <li>Step-by-step checklists by document type.</li>
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
