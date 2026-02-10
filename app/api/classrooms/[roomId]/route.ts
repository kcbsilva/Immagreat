import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession } from "../../_lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Next.js 15+ Params are a Promise
  const resolvedParams = await params;
  const { roomId } = resolvedParams;

  try {
    const classroom = await (prisma.classroomSession.findUnique({
      where: { id: roomId },
      include: {
        primaryTeacher: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        enrollments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
      } as any,
    }) as any);

    if (!classroom) {
      return NextResponse.json(
        { error: "Classroom not found" },
        { status: 404 },
      );
    }

    // Check if user is teacher or enrolled student
    const isTeacher =
      classroom.primaryTeacherId === session.sub || session.role === "ADMIN";
    const isEnrolled = (classroom.enrollments as any[]).some(
      (e: any) => e.userId === session.sub,
    );

    if (!isTeacher && !isEnrolled) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ classroom });
  } catch (error) {
    console.error("Failed to fetch classroom room:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
