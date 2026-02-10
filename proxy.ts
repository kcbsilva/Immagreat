import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me_in_prod";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (
    pathname.startsWith("/admin") &&
    !pathname.includes("/login") &&
    !pathname.includes("/register")
  ) {
    const token = request.cookies.get("immagreat_session")?.value;
    if (!token)
      return NextResponse.redirect(new URL("/admin/login", request.url));

    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/landing", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect Teacher routes (allow login)
  if (pathname.startsWith("/teachers") && !pathname.includes("/login")) {
    const token = request.cookies.get("immagreat_session")?.value;

    // Note: Teacher Portal currently uses localStorage for MVP auth in some places,
    // but the API is protected by session. We'll enforce session here too.
    if (!token)
      return NextResponse.redirect(new URL("/teachers/login", request.url));

    try {
      const { payload } = await jwtVerify(token, secretKey);
      if (payload.role !== "TEACHER" && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/landing", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/teachers/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teachers/:path*"],
};
