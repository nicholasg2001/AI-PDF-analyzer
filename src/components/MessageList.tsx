import { cn } from '@/lib/utils';
import { Message } from 'ai/react'
import React from 'react'
import { format } from 'date-fns';

type Props = {
    messages: Message[];
}

const MessageList = ({ messages }: Props) => {
  if (!messages) return <></>

  return (
    <div className="flex flex-col gap-2 px-4">
        {messages.map(message => {
            return (
                <div 
                key={message.id}
                className={cn('flex flex-col', {
                    'justify-end items-end pl-10': message.role === 'user',
                    'justify-start pr-10': message.role === 'system',
                })}
                >
                    <div className={cn('max-w-sm rounded-lg px-3 text-sm py-1 my-2 shadow-md dark:ring-1 ring-1 ring-gray-900/10', {
                        'text-start bg-blue-300 dark:bg-blue-600 text-black dark:text-white': message.role === 'user',
                        'bg-red-200 dark:bg-red-600 text-black dark:text-white': message.role === 'system',
                    })}>
                        <p>{message.content}</p>
                    </div>
                    <p className={cn('text-xs', {
                        'text-right': message.role === 'user',
                        'text-left': message.role === 'system',
                        })}>
                        {message.role === 'user' ? 'You' : 'GPT'}: {format(message.createdAt!, 'MM/dd, h:mm a')}
                    </p>
                </div>
            );
        })}
    </div>
  )
}

export default MessageList