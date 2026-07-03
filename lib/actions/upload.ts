"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getCurrentUser } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BOOK_BYTES = 30 * 1024 * 1024;
const MAX_COVER_BYTES = 6 * 1024 * 1024;
const BOOK_TYPES = [".pdf", ".epub"];
const COVER_TYPES = [".jpg", ".jpeg", ".png", ".webp"];

type UploadState = { url?: string; fileName?: string; error?: string };

async function saveFile(file: File, allowedExt: string[], maxBytes: number) {
  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return { error: `Unsupported file type "${ext || "unknown"}". Allowed: ${allowedExt.join(", ")}` };
  }
  if (file.size > maxBytes) {
    return { error: `File is too large. Maximum size is ${Math.round(maxBytes / (1024 * 1024))}MB.` };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, fileName), buffer);

  return { url: `/uploads/${fileName}`, fileName: file.name };
}

export async function uploadBookFile(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before uploading." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a file first." };

  return saveFile(file, BOOK_TYPES, MAX_BOOK_BYTES);
}

export async function uploadCoverImage(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before uploading." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image first." };

  return saveFile(file, COVER_TYPES, MAX_COVER_BYTES);
}
