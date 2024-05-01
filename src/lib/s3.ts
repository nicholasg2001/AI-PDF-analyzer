import AWS from 'aws-sdk';
export async function uploadToS3(file: File){
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

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,

        }
        //Monitor upload progress
        const upload = s3.putObject(params).on('httpUploadProgress', event => {
            console.log('Uploading to s3...', parseInt(((event.loaded * 100) / event.total).toString())) + "%";
        }).promise()

        await upload.then(data => {
            console.log('successfully uploaded to S3!', file_key)
        })

        return Promise.resolve({
            file_key,
            file_name: file.name
        })


    } catch (error) {
        console.log(error);
    }
}

export function getS3Url(file_key: string){
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
    return url;
}