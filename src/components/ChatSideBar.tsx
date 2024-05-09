'use client'

import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { MessageCircle, PlusCircle, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from './theme-toggle'
import { UserButton } from '@clerk/nextjs'

type Props = {
    chats: DrizzleChat[],
    chatId: number,

}

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-black bg-gray-300 dark:bg-gray-800">
        <Link href='/'>
            <Button className="w-full font-semibold bg-gray-400 text-black text-md hover:bg-gray-900 border-dashed border-gray-500 dark:border-black dark:bg-slate-700 dark:hover:bg-slate-900 dark:text-white border">
                <PlusCircle className="mr-2 w-4 h-4"/>
                New Chat
            </Button>
        </Link>

        <div className="flex flex-col gap-2 mt-4">
            {chats.map(chat => (
                <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className={
                        cn('rounded-lg p-3 text-gray-800 dark:text-slate-100 flex items-center', {
                            'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white': chat.id === chatId,
                            'hover:text-black dark:hover:text-white': chat.id !== chatId,
                        })
                    }>
                        <MessageCircle className="mr-2"/>
                        <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
                    </div>
                </Link>
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