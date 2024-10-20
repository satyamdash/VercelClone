import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create an S3 client instance
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        // Use non-null assertion (!) as we assume these env vars are set
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Function to upload a file to S3
export const uploadFile = async (fileName: string, localFilePath: string) => {
    // Get the bucket name from environment variables
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is not set in the environment variables");
    }

    // Read the contents of the local file
    const fileContent = fs.readFileSync(localFilePath);

    // Create a PutObjectCommand to upload the file to S3
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,  // The name of the file in S3
        Body: fileContent,  // The actual file content
    });

    try {
        // Send the upload command to S3
        const response = await s3Client.send(command);
        console.log(response);
    } catch (err) {
        console.error("Error", err);
        throw err; // Re-throw the error for the caller to handle
    }
}
