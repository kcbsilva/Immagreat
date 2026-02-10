"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "../landing/assets/logo.png";
import { LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#4D4D4D]">
      <header className="sticky top-0 z-30 border-b border-[#E6E6E6] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#E6E6E6] bg-white/80 p-1">
              <Image
                src={logo}
                alt="ImmaGreat logo"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1e293b] leading-tight">
                ImmaGreat
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C52D2F]">
                Admin Panel
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {!isAuthPage && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            )}
            <Link
              href="/landing"
              className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              Back to site
            </Link>
          </div>
        </div>

        {/* Sub-header nav - Only show if NOT on an auth page */}
        {!isAuthPage && (
          <div className="border-t border-[#E6E6E6] bg-white/70">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 md:px-10">
              <nav className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  href="/admin/dashboard"
                  className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/students"
                  className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
                >
                  Manage Students
                </Link>
                <Link
                  href="/admin/teachers"
                  className="rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
                >
                  Manage Teachers
                </Link>
              </nav>
              <p className="hidden text-xs text-[#808080] sm:block">
                Full control • Manage platform users
              </p>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
        {children}
      </main>
    </div>
  );
}
