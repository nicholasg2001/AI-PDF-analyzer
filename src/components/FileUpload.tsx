'use client';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { InboxIcon, Loader2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileUpload = () => {

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
                    onSuccess: (data) => {
                        toast.success(data.message);
                    },
                    onError: (error) => {
                        toast.error("Error creating chat");
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
        <div className="p-2 bg-white dark:bg-slate-700 rounded-xl">
            <div {...getRootProps({
                className: 'border-dashed border-2 dark:border-gray-400 rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-600 py-8 flex justify-center items-center flex-col',

            })}>
                <input {...getInputProps()}/>
                {(uploading || isLoading) ? (
                    <>
                    <Loader2 className="h-10 w-10 text-black dark:text-white animate-spin"/>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-200">
                        Sending to GPT...
                    </p>
                    </>
                ) : (
                    <>
                        <InboxIcon className="w-10 h-10 text-black dark:text-slate-200" />
                        <p className="mt-2 text-md dark:text-slate-200 text-slate-500">Drop PDF Here</p>
                    </>
            )}
            </div>
        </div>
    )
}

export default FileUpload;