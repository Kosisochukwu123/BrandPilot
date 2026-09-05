// src/server/services/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadBase64Image(base64: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
}