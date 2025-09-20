import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function uploadToSupabase(
  localPath,
  originalname,
  mimetype,
  userId
) {
  // Create a unique storage path: per-user folder
  const filePath = `users/${userId}/${Date.now()}_${originalname}`;

  // Read file from disk
  const fileBuffer = fs.readFileSync(localPath);

  // Upload to Supabase storage
  const { data, error } = await supabase.storage
    .from("uploads") // 👈 your bucket name
    .upload(filePath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: mimetype,
    });

  if (error) throw error;

  // Get a public URL (if bucket is public)
  const { data: pub } = supabase.storage.from("uploads").getPublicUrl(filePath);

  return {
    storagePath: filePath,
    url: pub.publicUrl,
  };
}
