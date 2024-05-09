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
            
        </div>
    )
}

export default ChatPage;