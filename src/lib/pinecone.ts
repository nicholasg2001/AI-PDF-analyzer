import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'

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

    //split and segment pdf into documents
    // pdf -> pages -> documents
    const documents = await Promise.all(pages.map(prepareDocument));


    //vectorize and embed each document

    
    return pages;
}


//Make sure each text object in documents are within proper size range
export const truncateStringByBytes = (str: string, bytes: number) => {
    const encoder = new TextEncoder();
    return new TextDecoder('utf-8').decode(encoder.encode(str).slice(0, bytes))
}


const prepareDocument = async (page: PDFPage) => {

    let { pageContent, metadata } = page

    //replace all new lines with empty string
    pageContent = pageContent.replace(/\n/g, '')

    //split each document
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000), //pinecone string size is max 36k bytes
            }
        })
    ]);

    return docs;
}