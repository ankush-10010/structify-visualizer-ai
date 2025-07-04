export const BASE_URL = "https://<your-backend-url>";

export async function processImage(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to process image");

  return await response.blob(); // .zip file blob
}