"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

type ChatMessage = {
  id: string;
  role: "teacher" | "student";
  name: string;
  text: string;
  ts: number;
};

function channelName(roomId: string) {
  return `immagreat_classroom_${roomId}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function StudentClassroomRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId ?? "";

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [classroom, setClassroom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const bcRef = useRef<BroadcastChannel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/students/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const roomRes = await fetch(`/api/classrooms/${roomId}`);
        if (!roomRes.ok) {
          const err = await roomRes.json();
          setError(err.error || "Room not found");
          return;
        }
        const roomData = await roomRes.json();
        setClassroom(roomData.classroom);
      } catch (err) {
        setError("Connection error");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [roomId, router]);

  useEffect(() => {
    const bc = new BroadcastChannel(channelName(roomId));
    bcRef.current = bc;
    bc.onmessage = (ev) => {
      const data = ev.data as ChatMessage;
      if (!data?.id) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [...prev, data].slice(-200);
      });
    };
    return () => bc.close();
  }, [roomId]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: uid(),
      role: "student",
      name: user?.firstName || "Student",
      text,
      ts: Date.now(),
    };
    setDraft("");
    setMessages((prev) => [...prev, msg]);
    bcRef.current?.postMessage(msg);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#C52D2F]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_0.5fr] max-w-7xl mx-auto">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#808080]">
              Student Classroom
            </p>
            <h2 className="mt-1 text-3xl font-bold text-[#4D4D4D]">
              {classroom?.title}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-bold text-green-600 uppercase tracking-widest">
                Live Now
              </p>
            </div>
          </div>
          <Link
            href="/students/dashboard"
            className="h-12 px-6 rounded-full border border-[#E6E6E6] flex items-center justify-center text-xs font-bold text-[#4D4D4D] hover:border-[#C52D2F] transition"
          >
            Leave Class
          </Link>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-12 text-center border-2 border-dashed border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl flex items-center justify-center">
            <div className="text-center p-12">
              <p className="text-white font-bold text-lg">
                Class is in session
              </p>
              <p className="mt-2 text-white/50 text-sm max-w-xs mx-auto">
                Teacher video stream will appear here when they start the
                broadcast.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="h-12 w-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              </div>
            </div>
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3 text-green-400" /> Secure
              Connection
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-sm flex flex-col h-[600px] lg:h-auto">
        <div className="flex items-center gap-2 mb-6 text-[#C52D2F]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#808080]">
            Chat with the class
          </p>
        </div>

        <div className="flex-1 overflow-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <p className="text-xs font-bold uppercase tracking-widest">
                Say hello!
              </p>
              <p className="mt-2 text-[10px]">
                Your messages are visible to the teacher and classmates.
              </p>
            </div>
          ) : (
            messages
              .sort((a, b) => a.ts - b.ts)
              .map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "student" && m.name === user?.firstName ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] font-bold text-[#808080] uppercase tracking-widest mb-1">
                    {m.name}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "student" && m.name === user?.firstName ? "bg-[#C52D2F] text-white rounded-tr-none" : "bg-slate-100 text-[#4D4D4D] rounded-tl-none border border-slate-50"}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type message..."
            className="flex-1 rounded-2xl border border-[#E6E6E6] bg-white px-5 py-3 text-sm outline-none focus:border-[#C52D2F]"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="rounded-2xl bg-[#C52D2F] px-5 py-3 text-sm font-bold text-white transition"
          >
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
