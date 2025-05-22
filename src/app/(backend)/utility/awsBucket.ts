"use server";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type UploadImage = (imageId: string, secure?: boolean) => Promise<string>;

dotenv.config();

const bucketName = process.env.BUCKET_NAME || "";
const bucketRegion = process.env.BUCKET_REGION || "";
const bucketAccess = process.env.BUCKET_ACCESS_KEY || "";
const bucketSecret = process.env.BUCKET_SECRET_KEY || "";

const s3 = new S3Client({
  credentials: {
    accessKeyId: bucketAccess,
    secretAccessKey: bucketSecret,
  },
  region: bucketRegion,
});

export const uploadImage: UploadImage = async (fileId, secure?: boolean) => {
  const params = {
    Bucket: secure ? process.env.AWS_HINDS_APP_MEDIA_BUCKET_NAME : bucketName,
    Key: fileId,
  };
  const command = new PutObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 6 });
  return presignedUrl;
};

export const getImageSigned = async (id: string) => {
  const params = {
    Bucket: process.env.AWS_HINDS_APP_MEDIA_BUCKET_NAME,
    Key: id,
  };
  const command = new GetObjectCommand(params);
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 24 * 2 });
  return presignedUrl;
};

export const deleteImages = async (imageId: string) => {
  const params = {
    Bucket: bucketName,
    Key: imageId,
  };
  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    return { acknowledge: true };
  } catch (err) {
    return { acknowledge: false, message: (err as Error).message };
  }
};
