'use client'

import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from './theme-toggle'
import { UserButton } from '@clerk/nextjs'
import { ConfirmToast } from 'react-confirm-toast';
import axios from 'axios'


type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({ chats, chatId }: Props) => {

    const [chatList, setChatList] = useState(chats);
    
    const deletePDFandChats = async (chat_id: number) => {
        try {
            const response = await axios.delete('/api/delete-chat', {
                data: {
                    chatId: chat_id,
                },
            });

            console.log('Deletion successful', response.data.deleted_pdf);

            setChatList(chats => chats.filter(chat => chat.id !== chat_id));
        }
        catch (error) {
            console.error("Error deleting chat, associated messages, and PDF:", error);
        }
    };



    return (
    <div className="w-full h-screen p-4 text-black bg-gray-300 dark:bg-gray-800">
        <Link href='/'>
            <Button className="w-full font-semibold bg-gray-400 text-black text-md hover:bg-gray-900 border-dashed border-gray-500 dark:border-black dark:bg-slate-700 dark:hover:bg-slate-900 dark:text-white border">
                <PlusCircle className="mr-2 w-4 h-4"/>
                New Chat
            </Button>
        </Link>

        <div className="flex flex-col gap-2 mt-4">
            {chatList.map(chat => (
                <div key={chat.id} className="flex flex-row">
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={
                            cn('rounded-lg p-2 text-gray-800 dark:text-slate-100 flex items-center', {
                                'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white': chat.id === chatId,
                                'hover:text-black hover:bg-gray-400 dark:hover:text-white dark:hover:bg-gray-700': chat.id !== chatId,
                            })
                        }>
                            <MessageCircle className="mr-2"/>
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
                        </div>
                    </Link>
                    <ConfirmToast
                        asModal={true}
                        customCancel={'Cancel'}
                        customConfirm={'Confirm'}
                        customFunction={() => deletePDFandChats(chat.id)}
                        message={'Are you sure you want to delete this PDF and all associated chats?'}
                        showCloseIcon={false}
                        theme={'snow'}
                    >
                        <button className="text-black dark:text-gray-200 h-2 w-4 mt-2 pl-1 mr-1 hover:text-red-600 dark:hover:text-red-600">
                            <Trash2 />
                        </button>
                    </ConfirmToast>
                </div>
            ))}
        </div>

        <div className="absolute bottom-4 left-4">
            <div className="flex gap-2 items-start flex-col">
                <Link className="text-md font-semibold dark:text-white hover:dark:text-gray-400 " href='/'>Home</Link>
                <div className="flex flex-row gap-2">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>
            </div>
        </div>
    </div>
    )
    }

export default ChatSideBar;