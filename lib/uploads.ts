import { apiFetch } from "./api";

interface SignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

export async function uploadImage(file: File): Promise<string> {
  const { uploadUrl, fileUrl } = await apiFetch<SignedUrlResponse>(
    "/uploads/signed-url",
    {
      method: "POST",
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    },
    true
  );

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) {
    throw new Error("Failed to upload image to storage");
  }

  return fileUrl;
}
