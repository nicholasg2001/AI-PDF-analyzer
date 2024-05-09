import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToASCII } from './utils';

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


export async function loadS3IntoPinecone(file_key: string){
    
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
    //documents object is a 2d array, so we use .flat()
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    //upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index('aipdf')
    console.log('Inserting vectors into pinecone');

    const namespace = pineconeIndex.namespace(convertToASCII(file_key));
    await namespace.upsert(vectors);

    return documents[0];

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
    const documents = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000), //pinecone string size is max 36k bytes
            }
        })
    ]);

    return documents;
}

const embedDocument = async (document: Document) => {
    
    try {
        
        //convert pageContent in vectors
        const embeddings = await getEmbeddings(document.pageContent);

        //create id for each vector in pinecone
        const hash = md5(document.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: document.metadata.text,
                pageNumber: document.metadata.pageNumber
            }
        } as PineconeRecord

    } catch (error) {
        console.log('error embedding document', error);
        throw error;
    }
}