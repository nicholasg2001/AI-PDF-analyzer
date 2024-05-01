import AWS from 'aws-sdk';
import fs from 'fs';


export async function downloadFromS3(file_key: string){
    try {
        
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'us-east-2'
        })

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        }
        
        const object = await s3.getObject(params).promise();

        //Download temporary folder to file system with current date
        const file_name = `/tmp/pdf-${Date.now()}.pdf`
        
        fs.writeFileSync(file_name, object.Body as Buffer);

    } catch (error) {
        console.error(error);
        return null;
    }
}