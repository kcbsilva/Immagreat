import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { requireEnv } from "../../_lib/env";
import { getSession } from "../../_lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { room?: string };
  const room = body.room?.trim();
  if (!room) return NextResponse.json({ error: "Missing room" }, { status: 400 });

  const apiKey = requireEnv("LIVEKIT_API_KEY");
  const apiSecret = requireEnv("LIVEKIT_API_SECRET");

  const at = new AccessToken(apiKey, apiSecret, {
    identity: session.sub,
    name: session.email,
  });

  // Permissions: teachers publish, students subscribe, moderators can publish data (later).
  const canPublish = session.role === "TEACHER" || session.role === "MODERATOR";
  const canSubscribe = true;

  at.addGrant({
    room,
    roomJoin: true,
    canPublish,
    canSubscribe,
    canPublishData: session.role !== "STUDENT",
  });

  const token = await at.toJwt();
  return NextResponse.json({ token });
}
