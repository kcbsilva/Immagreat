import Image from "next/image";
import Link from "next/link";
import logo from "../landing/assets/logo.png";

export default function TeachersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#4D4D4D]">
      <header className="sticky top-0 z-30 border-b border-[#E6E6E6] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#E6E6E6] bg-white/80 p-1">
              <Image src={logo} alt="ImmaGreat logo" fill sizes="40px" className="object-contain" priority />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#C52D2F] leading-tight">ImmaGreat</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#808080]">
                Teacher Portal
              </p>
            </div>
          </Link>

          <Link
            href="/landing"
            className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
