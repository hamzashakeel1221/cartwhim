// Shrinks a photo in the browser before upload: phone photos are 4 to 10 MB, we only need ~1400px.
async function render(file: File, max: number, quality: number): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.max(1, Math.round(bmp.width * scale));
  const h = Math.max(1, Math.round(bmp.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff"; // transparent PNGs get a white background
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Could not read this image"))), "image/jpeg", quality));
}

export async function prepareUpload(file: File): Promise<{ photo: Blob; thumb: Blob }> {
  let photo = await render(file, 1400, 0.85);
  if (photo.size > 1_200_000) photo = await render(file, 1100, 0.75);
  const thumb = await render(file, 560, 0.8);
  return { photo, thumb };
}
