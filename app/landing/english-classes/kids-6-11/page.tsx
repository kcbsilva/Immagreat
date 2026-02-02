import Link from "next/link";

export default function KidsSixToElevenPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="text-sm font-semibold text-[#C52D2F]">
        English Classes
      </div>
      <h1 className="text-3xl font-semibold text-[#1A1A1A]">Kids 6 - 11</h1>
      <p className="text-base text-[#4D4D4D]">
        Structured fluency building with stories, projects, and everyday
        conversation practice.
      </p>
      <div className="rounded-2xl border border-[#E6E6E6] bg-white p-6">
        <p className="text-sm font-semibold text-[#4D4D4D]">What to expect</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5A5A5A]">
          <li>Vocabulary expansion for school and social settings.</li>
          <li>Reading comprehension and short writing prompts.</li>
          <li>Confidence-building speaking practice.</li>
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
