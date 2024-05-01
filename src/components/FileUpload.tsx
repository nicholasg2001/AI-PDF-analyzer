'use client';
import { InboxIcon } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = () => {

    const { getRootProps, getInputProps } = useDropzone({
        accept: {'application/pdf': [".pdf"] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            console.log(acceptedFiles)
        }
    });

    return (
        <div className="p-2 bg-white dark:bg-slate-700 rounded-xl">
            <div {...getRootProps({
                className: 'border-dashed border-2 dark:border-gray-400 rounded-xl cursor-pointer bg-gray-50 dark:bg-slate-600 py-8 flex justify-center items-center flex-col',

            })}>
                <input {...getInputProps()}/>
                <>
                    <InboxIcon className="w-10 h-10 text-black dark:text-slate-200" />
                    <p className="mt-2 text-sm dark:text-slate-200 text-slate-500">Drop PDF Here</p>
                </>
            </div>
        </div>
    )
}

export default FileUpload;