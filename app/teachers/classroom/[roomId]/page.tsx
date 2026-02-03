"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

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

  const [teacherEmail] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("immagreat_teacher_email");
  });

  useEffect(() => {
    if (!teacherEmail) router.replace("/teachers/login");
  }, [teacherEmail, router]);

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

  // Local self-preview only (MVP)
  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        const message = e instanceof Error ? e.message : "Could not access camera/microphone.";
        setError(message);
      }
    }

    start();

    return () => {
      cancelled = true;
      const stream = streamRef.current;
      streamRef.current = null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  async function copyInvite() {
    if (!roomUrl) return;
    await navigator.clipboard.writeText(roomUrl);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;

    const msg: ChatMessage = {
      id: uid(),
      role: "teacher",
      name: teacherEmail ?? "Teacher",
      text,
      ts: Date.now(),
    };

    setDraft("");
    setMessages((prev) => [...prev, msg]);
    bcRef.current?.postMessage(msg);
  }

  function leave() {
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((t) => t.stop());
    router.push("/teachers/dashboard");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">Teacher classroom</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              {roomId}
            </h1>
            <p className="mt-2 text-sm text-[#808080]">
              Students watch via the invite link. (MVP: local preview + chat; video broadcast is next.)
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyInvite}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              <Copy className="h-4 w-4" /> Copy student link
            </button>
            <Link
              href={`/students/classroom/${roomId}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              Student view
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#E6E6E6] bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="h-[420px] w-full object-cover" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMicOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            {micOn ? (
              <>
                <Mic className="h-4 w-4" /> Mic on
              </>
            ) : (
              <>
                <MicOff className="h-4 w-4" /> Mic off
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCamOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
          >
            {camOn ? (
              <>
                <Video className="h-4 w-4" /> Camera on
              </>
            ) : (
              <>
                <VideoOff className="h-4 w-4" /> Camera off
              </>
            )}
          </button>

          <button
            type="button"
            onClick={leave}
            className="inline-flex items-center gap-2 rounded-full bg-[#C52D2F] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(197,45,47,0.35)] transition hover:-translate-y-0.5 hover:bg-[#a92325]"
          >
            <PhoneOff className="h-4 w-4" /> Leave
          </button>
        </div>
      </section>

      <aside className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">Class chat</p>
        <div className="mt-4 h-[420px] overflow-auto rounded-2xl border border-[#E6E6E6] bg-[#FFF8F8] p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-[#808080]">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {messages
                .slice()
                .sort((a, b) => a.ts - b.ts)
                .map((m) => (
                  <div key={m.id} className="rounded-2xl border border-[#E6E6E6] bg-white p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold text-[#4D4D4D] truncate">{m.name}</p>
                      <p className="text-[11px] text-[#808080]">{new Date(m.ts).toLocaleTimeString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-[#4D4D4D]">{m.text}</p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message the class…"
            className="w-full rounded-2xl border border-[#E6E6E6] bg-white px-4 py-3 text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            onClick={sendMessage}
            className="rounded-2xl bg-[#C52D2F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a92325]"
          >
            Send
          </button>
        </div>
      </aside>
    </div>
  );
}
