export const BASE_URL = "https://eca528966d51.ngrok-free.app";

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
  // Append each threshold as an individual field
  for (const [key, value] of Object.entries(thresholds)) {
    formData.append(key, value.toString());
  }

  const response = await fetch(`${BASE_URL}/process`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to reprocess image");

  return await response.blob(); // .zip file blob
}
