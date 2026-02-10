"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Loader2,
} from "lucide-react";

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

export default function TeacherClassroomRoomPage() {
  const router = useRouter();
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId ?? "";

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [classroom, setClassroom] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");

  const roomUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/students/classroom/${roomId}`;
  }, [roomId]);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/teachers/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        const roomRes = await fetch(`/api/classrooms/${roomId}`);
        if (!roomRes.ok) {
          const err = await roomRes.json();
          setError(err.error || "Room not found");
          setIsLoading(false);
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

  // Set up chat channel
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

    return () => {
      bc.close();
      bcRef.current = null;
    };
  }, [roomId]);

  // Local physical media
  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        setError("Camera/Mic access denied.");
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  async function copyInvite() {
    await navigator.clipboard.writeText(roomUrl);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: uid(),
      role: "teacher",
      name: user?.firstName || "Teacher",
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
              Live Classroom
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#4D4D4D]">
              {classroom?.title}
            </h1>
            <p className="mt-2 text-sm text-[#808080]">
              Enrolled: {classroom?.enrollments?.length || 0} students
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyInvite}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-5 py-2.5 text-xs font-bold text-[#4D4D4D] hover:border-[#C52D2F] transition"
            >
              <Copy className="h-4 w-4" /> Copy Student Link
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-12 text-center border-2 border-dashed border-red-100">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : (
          <div className="relative aspect-video overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 flex gap-4">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition ${micOn ? "bg-white text-slate-900" : "bg-[#C52D2F] text-white"}`}
              >
                {micOn ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition ${camOn ? "bg-white text-slate-900" : "bg-[#C52D2F] text-white"}`}
              >
                {camOn ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="absolute top-6 right-6">
              <button
                onClick={() => router.push("/teachers/dashboard")}
                className="h-12 px-6 rounded-full bg-[#C52D2F] text-white font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-[#a92325] transition"
              >
                <PhoneOff className="h-4 w-4" /> End Session
              </button>
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-sm flex flex-col h-[600px] lg:h-auto">
        <div className="flex items-center gap-2 mb-6 text-[#C52D2F]">
          <span className="h-2 w-2 rounded-full bg-[#C52D2F] animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-widest">
            Live Chat
          </p>
        </div>

        <div className="flex-1 overflow-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <p className="text-xs font-bold uppercase tracking-widest">
                No messages yet
              </p>
              <p className="mt-2 text-[10px]">
                Messages sent here are visible to all students.
              </p>
            </div>
          ) : (
            messages
              .sort((a, b) => a.ts - b.ts)
              .map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.role === "teacher" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[9px] font-bold text-[#808080] uppercase tracking-widest mb-1">
                    {m.name}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "teacher" ? "bg-[#C52D2F] text-white rounded-tr-none" : "bg-[#FFF5F5] text-[#4D4D4D] rounded-tl-none border border-red-50"}`}
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
            className="rounded-2xl bg-[#C52D2F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a92325]"
          >
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
