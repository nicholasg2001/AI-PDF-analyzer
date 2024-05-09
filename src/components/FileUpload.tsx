'use client';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { InboxIcon, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const FileUpload = () => {

    const router = useRouter();
    const [uploading, setUploading] = React.useState(false);

    const { mutate, isLoading } = useMutation({

        mutationFn: async ({
            file_key, 
            file_name
        }: {
            file_key: string, 
            file_name: string
        }) => {
            const response = await axios.post("/api/create-chat", {
                file_key, 
                file_name
            });
            return response.data;
        },
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: {'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0]
            if(file.size > 10 * 1024 * 1024){
                //bigger than 10MB
                toast.error("File too large");
                return;
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                if (!data?.file_key || !data.file_name){
                    toast.error("Something went wrong");
                    return;
                }
                mutate(data, {
                    onSuccess: ({ chat_id }) => {
                        toast.success("Chat created!");
                        router.push(`/chat/${chat_id}`)

                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
                        console.log(error);
                    }
                })
                console.log("data", data);
            } catch(error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        }
    });

    return (
        <div className="p-2 bg-white dark:bg-black rounded-xl">
            <div {...getRootProps({
                className: 'border-dashed border-4 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800 py-8 flex justify-center items-center flex-col',
            })}>
                <input {...getInputProps()}/>
                {uploading || isLoading ? (
                    <>
                    <Loader2 className="h-10 w-10 text-black dark:text-white animate-spin"/>
                    <p className="mt-2 px-24 text-sm text-slate-500 dark:text-slate-200">
                        Sending to GPT...
                    </p>
                    </>
                ) : (
                    <>
                        <InboxIcon className="w-10 h-10 text-black dark:text-slate-200" />
                        <p className="mt-2 px-24 text-md dark:text-slate-200 text-slate-500">Drop PDF Here</p>
                    </>
            )}
            </div>
        </div>
    )
}

export default FileUpload;