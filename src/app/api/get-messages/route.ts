import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {

  const url = new URL(req.url);
  const searchParam = new URLSearchParams(url.searchParams);
  const chatId = searchParam.get("chatId")

  if (!chatId){
    return NextResponse.json({ error: "Missing chat id" }, { status : 400 });
  }

  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chat_id, chatId));
  return NextResponse.json(_messages);
  };