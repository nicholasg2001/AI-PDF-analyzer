import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params:{
        chatId: string,
    }
};

const ChatPage = async ({ params : { chatId } }: Props) => {

  const { userId } : { userId: string | null } = auth();

    if (!userId){
        return redirect('/sign-in');
    }

    //_chats are the ACTUAL chats returned from db
    //chats is just the table
    const _chats= await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));

    //there are no chats
    if(!_chats){
        return redirect('/');
    }

    const cIdToInt = parseInt(chatId);

    if(!_chats.find(chat=>chat.id === cIdToInt)){
        return redirect('/');
    }

    const currentChat = _chats.find(chat=> chat.id === cIdToInt);

    return (
        <div className="flex flex-col md:flex-row max-h-screen overflow-scroll">
          <div className="flex md:w-full max-h-screen overflow-scroll">
            <div className="flex-[1] max-w-xs md:block hidden">
              <ChatSideBar chats={_chats} chatId={cIdToInt} />
            </div>
            <div className="max-h-screen p-4 overflow-scroll flex-[4] md:block">
              <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
            </div>
            <div className="flex-[4] border-l-4 border-l-slate-200 dark:border-l-slate-700 md:block">
              <ChatComponent chatId={cIdToInt} />
            </div>
          </div>
          {/* Mobile View */}
          <div className="md:hidden flex flex-col h-screen">
            <div className="flex-[1] max-h-[20%] overflow-scroll">
              <ChatSideBar chats={_chats} chatId={cIdToInt} />
            </div>
            <div className="flex-[2] max-h-[40%] overflow-scroll">
              <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
            </div>
            <div className="flex-[3] max-h-[40%] border-t-4 border-t-slate-200 dark:border-t-slate-700 overflow-scroll">
              <ChatComponent chatId={cIdToInt} />
            </div>
          </div>
        </div>
      )
}

export default ChatPage;