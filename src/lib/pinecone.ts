import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

let pc: Pinecone | null = null;

export const getPineconeClient = () => {
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
  };


type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber: number}
    }
}


export async function loadS3IntoPineCone(file_key: string){
    
    //download and read from pdf
    console.log('Downloading s3 into file system')
    const file_name = await downloadFromS3(file_key);

    if(!file_name){
        throw new Error('Could not download from s3');
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    return pages;
}