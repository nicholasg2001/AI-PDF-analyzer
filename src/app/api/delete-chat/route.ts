import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteFromS3 } from "@/lib/s3";

// /api/delete-chat
export async function DELETE(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { chatId } = body;
    const fileName = await db.select({ key: chats.fileKey }).from(chats).where(eq(chats.id, chatId));
    const chat_id = await db
      .delete(chats)
      .where(eq(chats.id, chatId))
      .returning({
        deleted_pdf: chats.pdfName,
      });

    deleteFromS3(fileName[0].key.replace("uploads/", ""))

    return NextResponse.json(
    {
      deleted_pdf: chat_id[0].deleted_pdf,
    },
    { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}