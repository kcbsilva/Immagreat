"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Video, ArrowRight } from "lucide-react";

function makeRoomId() {
  // short-ish, human-friendly, URL-safe
  return Math.random().toString(36).slice(2, 8) + "-" + Math.random().toString(36).slice(2, 6);
}

export default function ClassroomHomePage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const canJoin = useMemo(() => roomId.trim().length >= 4, [roomId]);

  function createRoom() {
    const id = makeRoomId();
    router.push(`/students/classroom/${id}`);
  }

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!canJoin) return;
    router.push(`/students/classroom/${roomId.trim()}`);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[#FFF0F0] p-3 text-[#C52D2F]">
            <Video className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Classroom
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              Video conference room
            </h1>
            <p className="mt-2 text-sm text-[#808080]">
              MVP: local preview + room link. Next step: realtime multi-user calling (WebRTC + signaling).
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={createRoom}
            className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            Create room
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/students/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-3 text-sm font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            Back to dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
        <h2 className="text-lg font-semibold text-[#4D4D4D]">Join a room</h2>
        <form onSubmit={joinRoom} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room code (e.g. ab12cd-ef34)"
            className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={!canJoin}
            className="inline-flex items-center justify-center rounded-2xl bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a92325] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Join
          </button>
        </form>
      </section>
    </div>
  );
}
