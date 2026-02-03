import { NextResponse } from "next/server";
import { getSession } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  return NextResponse.json({ session });
}
