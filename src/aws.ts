import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});


export const uploadFile = async (fileName: string, localFilePath: string) => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is not set in the environment variables");
    }

    const fileContent = fs.readFileSync(localFilePath);
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
    });

    try {
        const response = await s3Client.send(command);
        console.log(response);
    } catch (err) {
        console.error("Error", err);
        throw err; // Re-throw the error for the caller to handle
    }
}
