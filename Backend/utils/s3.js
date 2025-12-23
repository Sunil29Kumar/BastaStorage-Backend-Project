
import dotenv from "dotenv";
dotenv.config();

import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function generateSignedUrl({ fileName, fileType }) {

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            ContentType: fileType,
        });

        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour validity
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        return {
            uploadURL,
            fileUrl,
        };

    } catch (error) {
        return res.status(500).json({ error: "Could not generate signed URL", details: error.message });
    }
}



// Implementation for get files from S3 can be added here
export async function createGetSignedUrl({ fileKey, fileName, download = false }) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            ResponseContentDisposition: `${download ? "attachment" : "inline"}; filename="${fileName}"`,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour validity
        return url;

    } catch (error) {
        return null;
    }
}


export async function deleteFileFromS3(fileKey) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        });

        const result = await s3Client.send(command);
        return result;

    } catch (error) {
        throw new Error("Could not delete file from S3: " + error.message);
    }
}



export async function deleteFilesFromS3(fileKeys) {
    try {
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: fileKeys.map((key) => ({ Key: key })),
                Quiet: false,
            },
        };

        const command = new DeleteObjectsCommand(deleteParams);
        const result = await s3Client.send(command);
        return result;

    } catch (error) {
        throw new Error("Could not delete files from S3: " + error.message);
    }
}