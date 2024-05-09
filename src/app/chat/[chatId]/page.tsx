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

    const { userId } = await auth();
    if (!userId){
        return redirect('/sign-in');
    }

    //_chats are the ACTUAL chats returned from db
    //chats is just the schema
    const _chats= await db
        .select()
        .from(chats)
        .where(eq(chats.userId, userId));

    //there are no chats
    if(!_chats){
        return redirect('/');
    }

    if(!_chats.find(chat=>chat.id === parseInt(chatId))){
        return redirect('/');
    }


    return (
        <div className="flex max-h-screen overflow-scroll">
            <div className="flex w-full max-h-screen overflow-scroll">
                {/* chat sidebar */}
                <div className="flex-[1] max-w-xs">
                    <ChatSideBar />
                </div>

                {/* pdf viewer */}
                <div className="max-h-screen p-4 overflow-scroll flex-[5]">
                    <PDFViewer />
                </div>

                {/* chat component */}
                <div className="flex-[3] border-l-4 border-l-slate-200 dark:border-l-slate-700">
                    <ChatComponent />
                </div>
            </div>
        </div>
    )
}

export default ChatPage;