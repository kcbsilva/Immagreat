"use client";
import { Shield, Users, School, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.user?.role !== "ADMIN") {
          router.push("/landing");
          return;
        }
        setAdminEmail(data.user.email);
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#C52D2F]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C52D2F]">
            System Control
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[#4D4D4D]">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-[#808080]">
            Logged in as{" "}
            <span className="font-bold text-[#4D4D4D]">{adminEmail}</span>
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs ring-4 ring-slate-100">
          AD
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/admin/students"
          className="group relative overflow-hidden rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Users className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF5F5] text-[#C52D2F]">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-[#4D4D4D]">Students</h2>
            <p className="mt-2 text-sm text-[#808080]">
              Add, edit, and manage all student accounts.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#C52D2F]">
              Manage Students{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link
          href="/admin/teachers"
          className="group relative overflow-hidden rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <School className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <School className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-[#4D4D4D]">Teachers</h2>
            <p className="mt-2 text-sm text-[#808080]">
              Review teacher accounts and class assignments.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600">
              Manage Teachers{" "}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <div className="rounded-3xl border border-[#222] bg-[#222] p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -bottom-8 -right-8 opacity-10">
            <Shield className="h-40 w-40" />
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">System Security</h2>
            <p className="mt-2 text-sm text-gray-400">
              Access audit logs and security settings.
            </p>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Protection: Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
