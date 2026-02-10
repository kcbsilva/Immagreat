import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "STUDENT" && session.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find sessions where this student is enrolled
    const sessions = await prisma.classroomSession.findMany({
      where: {
        enrollments: {
          some: {
            userId: session.sub,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ classrooms: sessions });
  } catch (error) {
    console.error("Failed to fetch student classrooms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
