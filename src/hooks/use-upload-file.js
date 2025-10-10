import { useMutation } from "@tanstack/react-query";

const UPLOAD_ENDPOINT = "https://chat-chatcuek.satrya.dev/api/files";

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }
  const result = await response.json();
  const filename = result.filename || file.name;
  return {
    ...result,
    filePath: `https://chat-chatcuek.satrya.dev/api/files/${filename}`
  };
}

export function useUploadFile() {
  return useMutation(uploadFile);
}