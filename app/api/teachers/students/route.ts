import { NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { getSession } from "../../_lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch students enrolled in classes taught by this teacher
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
        enrollments: {
          some: {
            classroomSession: {
              primaryTeacherId: session.sub,
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        enrollments: {
          where: {
            classroomSession: {
              primaryTeacherId: session.sub,
            },
          },
          select: {
            classroomSession: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      } as any,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
