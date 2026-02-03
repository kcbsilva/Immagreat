"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ShieldCheck,
} from "lucide-react";

export default function ClassroomRoomPage() {
  const params = useParams<{ roomId: string }>();
  const roomId = params?.roomId ?? "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roomUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/students/classroom/${roomId}`;
  }, [roomId]);

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
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
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

  function leave() {
    // stop devices
    const stream = streamRef.current;
    streamRef.current = null;
    stream?.getTracks().forEach((t) => t.stop());

    window.location.href = "/students/classroom";
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E6E6E6] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#808080]">
              Classroom room
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#4D4D4D] sm:text-3xl">
              Room <span className="font-mono">{roomId}</span>
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#808080]">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#E6E6E6] bg-white px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#C52D2F]" />
                Local-only MVP
              </span>
              <span className="rounded-full bg-[#FFF5F5] px-3 py-1">
                Next: multi-user WebRTC
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyInvite}
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              <Copy className="h-4 w-4" />
              Copy invite link
            </button>
            <Link
              href="/students/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[#E6E6E6] bg-white px-4 py-2 text-xs font-semibold text-[#4D4D4D] shadow-sm transition hover:-translate-y-0.5 hover:border-[#C52D2F] hover:text-[#C52D2F]"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="overflow-hidden rounded-3xl border border-[#E6E6E6] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-[360px] w-full object-cover md:h-[460px]"
              />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                  Participants
                </p>
                <p className="mt-2 text-sm text-[#808080]">
                  You (local preview)
                </p>
              </div>

              <div className="rounded-2xl border border-[#E6E6E6] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#808080]">
                  Controls
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
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
              </div>

              <p className="text-xs text-[#808080]">
                This page is a UI+permissions scaffold. For real Zoom/Teams-like
                multi-user video, we’ll add WebRTC + a small signaling server.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
