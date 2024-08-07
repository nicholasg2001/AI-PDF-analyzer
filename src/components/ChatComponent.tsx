"use client";

import React from 'react';
import { Input } from './ui/input';
import { useChat, Message } from 'ai/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import MessageList from './MessageList';


type Props = { chatId: number }

const ChatComponent = ({ chatId }: Props) => {

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
        const response = await axios.get<Message[]>("/api/get-messages", {
            params : { chatId },
        });
        return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
        chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if(messageContainer){
        messageContainer.scrollTo({
            top: messageContainer.scrollHeight,
            behavior: "smooth",
        });
    }
  }, [messages])

  return (
    <div className="relative max-h-scren overflow-visible">
        <div className="sticky top-0 inset-x-0 p-2 bg-gray-300 text dark:bg-slate-800 h-fit">
            <h3 className="text-2xl text-center text-black dark:text-gray-200 font-bold">Chat</h3>
        </div>

        <MessageList messages={messages}/>

        <form onSubmit={handleSubmit} className="sticky inset-x-0 my-2 px-2 py-4 bg-white dark:bg-gray-600">
            <div className="flex">
                <Input 
                    value={input} 
                    onChange={handleInputChange} 
                    placeholder="Ask any question..." 
                    className="w-full text-black dark:text-gray-200"
                />
                <Button className="bg-gray-100 dark:hover:bg-gray-900 dark:bg-gray-800 ml-2">
                    <Send className="text-black dark:text-gray-300 h-4 w-4"/>
                </Button>
            </div>
        </form>
    </div>
  )
}

export default ChatComponent