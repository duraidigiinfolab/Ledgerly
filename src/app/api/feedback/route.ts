import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"]),
  message: z.string().min(5, "Message must be at least 5 characters"),
  rating: z.number().min(1).max(5).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = feedbackSchema.parse(body);

    await prisma.feedback.create({
      data: {
        userId: session.user.id,
        type: validated.type,
        message: validated.message,
        rating: validated.rating,
      },
    });

    return NextResponse.json(
      { message: "Thank you for your feedback!" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
