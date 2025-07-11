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

export async function reprocessImage(file: File, thresholds: Record<string, number>): Promise<Blob> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("thresholds", JSON.stringify(thresholds));

  const response = await fetch(`${BASE_URL}/reprocess`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to reprocess image");

  return await response.blob(); // .zip file blob
}