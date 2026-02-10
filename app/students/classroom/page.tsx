"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Video, Loader2, Search } from "lucide-react";

export default function ClassroomHomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await fetch("/api/students/classrooms");
        if (res.ok) {
          const data = await res.json();
          setClassrooms(data.classrooms || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  const canJoin = useMemo(() => roomId.trim().length >= 4, [roomId]);

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!canJoin) return;
    router.push(`/students/classroom/${roomId.trim()}`);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF5F5] p-4 text-[#C52D2F] shadow-inner">
            <Video className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#808080]">
              Virtual Campus
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#4D4D4D]">
              Classroom Portal
            </h1>
            <p className="mt-2 text-sm text-[#808080] max-w-xl">
              Connect with your teachers and classmates in real-time. Join your
              assigned sessions below or enter a specific room code.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/students/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-6 py-2.5 text-xs font-bold text-[#4D4D4D] transition hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#808080] flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C52D2F]" />
            Your Active Enrollments
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C52D2F]" />
            </div>
          ) : classrooms.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-100 p-12 text-center">
              <p className="text-sm text-[#808080]">
                You are not currently assigned to any classrooms.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {classrooms.map((c) => (
                <div
                  key={c.id}
                  className="group relative overflow-hidden rounded-[24px] border border-[#E6E6E6] bg-white p-6 transition hover:shadow-xl hover:shadow-black/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-[#808080] uppercase tracking-widest">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[#4D4D4D]">
                        {c.title}
                      </h3>
                      <p className="mt-2 text-xs font-mono text-[#808080] uppercase">
                        {c.id}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/students/classroom/${c.id}`)}
                      className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white transition group-hover:bg-[#C52D2F] group-hover:scale-110"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#E6E6E6] bg-[#FFF8F8] p-8 self-start">
          <div className="flex items-center gap-3 mb-6">
            <Search className="h-5 w-5 text-[#C52D2F]" />
            <h2 className="text-lg font-bold text-[#4D4D4D]">Quick Access</h2>
          </div>
          <p className="text-xs text-[#808080] mb-4">
            Enter a direct classroom code to jump into a session.
          </p>
          <form onSubmit={joinRoom} className="space-y-3">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Code: ab12cd-ef34"
              className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-5 py-4 text-sm font-bold outline-none focus:border-[#C52D2F] transition"
            />
            <button
              type="submit"
              disabled={!canJoin}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-30"
            >
              Enter Room
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
