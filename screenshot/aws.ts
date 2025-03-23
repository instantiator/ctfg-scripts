import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import { AwsSecrets, ScreenshotOptions } from "./config";

export async function uploadToS3(file: string, options: ScreenshotOptions, aws: AwsSecrets) {
  let readStream: fs.ReadStream | undefined = undefined;
  try {
    const client = new S3Client({
      region: options.aws_region,
      credentials: {
        accessKeyId: aws.AWS_ACCESS_KEY,
        secretAccessKey: aws.AWS_ACCESS_SECRET,
      },
    });
    readStream = fs.createReadStream(file);
    const command = new PutObjectCommand({ Bucket: options.aws_bucket, Key: file, Body: readStream });
    const response = await client.send(command);
    console.log("File uploaded successfully", response);
    const uploadUrl = `https://s3.${options.aws_region}.amazonaws.com/${options.aws_bucket}/${file}`;
    return uploadUrl;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  } finally {
    readStream?.destroy();
  }
}
