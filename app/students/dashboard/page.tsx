"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  GraduationCap,
  Headphones,
  MessageCircle,
  Upload,
  Video,
  Loader2,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/students/login");
          return;
        }
        const data = await res.json();
        if (data.user?.role !== "STUDENT" && data.user?.role !== "ADMIN") {
          router.push("/landing");
          return;
        }
        setUser(data.user);
      } catch (err) {
        router.push("/students/login");
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
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF5F5] text-[#C52D2F] font-bold text-2xl shadow-inner group transition hover:scale-105">
            {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Welcome back
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#4D4D4D] sm:text-3xl">
              {user?.firstName
                ? `${user.firstName}’s Dashboard`
                : "Student Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-[#808080]">
              Logged in as{" "}
              <span className="font-semibold text-[#4D4D4D]">
                {user?.email}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/landing#intake"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-2.5 text-xs font-bold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={<GraduationCap className="h-5 w-5" />}
          title="My Classes"
          body="Your current program modules and homework."
          cta="Open Classes"
        />
        <Card
          icon={<Video className="h-5 w-5" />}
          title="Classroom"
          body="Join live sessions with your teacher."
          cta="Join Room"
          href="/students/classroom"
        />
        <Card
          icon={<Calendar className="h-5 w-5" />}
          title="Schedule"
          body="Sessions, attendance, and reminders."
          cta="View Calendar"
          href="/students/calendar"
        />
        <Card
          icon={<FileText className="h-5 w-5" />}
          title="Documents"
          body="Manage your translations and forms."
          cta="View Files"
        />
        <Card
          icon={<Upload className="h-5 w-5" />}
          title="Uploads"
          body="Submit work or documentation."
          cta="Upload Now"
        />
        <Card
          icon={<Headphones className="h-5 w-5" />}
          title="Support"
          body="Need help? Get quick answers."
          cta="Get Help"
        />
      </section>

      <div className="rounded-2xl bg-[#222] p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheckIcon className="h-24 w-24" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Security Note
        </p>
        <p className="mt-2 text-sm text-gray-300 leading-relaxed max-w-2xl">
          Your account is protected with role-based session tokens. All data is
          now securely stored in our central database.
        </p>
      </div>
    </div>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Card({
  icon,
  title,
  body,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  href?: string;
}) {
  const inner = (
    <div className="relative overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white p-6 shadow-lg shadow-black/5 transition hover:shadow-xl hover:shadow-black/10 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F5] via-transparent to-transparent opacity-80" />
      <div className="relative flex items-start gap-4 flex-1">
        <div className="rounded-xl bg-[#FFF0F0] p-3 text-[#C52D2F] shadow-sm">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#4D4D4D]">{title}</h3>
          <p className="text-sm text-[#808080] leading-relaxed">{body}</p>
        </div>
      </div>
      <div className="relative mt-6">
        <span className="inline-flex w-full items-center justify-center rounded-full border border-[#E6E6E6] bg-white px-4 py-2.5 text-xs font-bold text-[#4D4D4D] shadow-sm transition group-hover:border-[#C52D2F] group-hover:text-[#C52D2F]">
          {cta}
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group h-full">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className="group text-left h-full">
      {inner}
    </button>
  );
}
