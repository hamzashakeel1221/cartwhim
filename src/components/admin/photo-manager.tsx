"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { prepareUpload } from "@/lib/image-resize";

export type PhotoItem = { id: string; url: string; thumb: string };

export async function uploadPhotos(slug: string, files: File[], onProgress?: (done: number) => void): Promise<string | null> {
  let done = 0;
  for (const file of files) {
    try {
      const { photo, thumb } = await prepareUpload(file);
      const body = new FormData();
      body.set("photo", photo, "photo.jpg");
      body.set("thumb", thumb, "thumb.jpg");
      const res = await fetch(`/admin/api/photos?slug=${encodeURIComponent(slug)}`, { method: "POST", body, headers: { "x-cartwhim-admin": "1" } });
      if (!res.ok) return ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? "Upload failed";
    } catch {
      return `Could not read ${file.name}. Use a JPG, PNG or WebP photo.`;
    }
    onProgress?.(++done);
  }
  return null;
}

export function PhotoManager({ slug, photos, builtInCount = 0 }: { slug: string; photos: PhotoItem[]; builtInCount?: number }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const total = photos.length;

  async function add(list: FileList | null) {
    if (!list?.length) return;
    setError(null);
    const files = Array.from(list).slice(0, Math.max(0, 8 - total));
    setBusy(`Uploading 0/${files.length}…`);
    const err = await uploadPhotos(slug, files, (d) => setBusy(`Uploading ${d}/${files.length}…`));
    setBusy(null);
    if (err) setError(err);
    if (input.current) input.current.value = "";
    router.refresh();
  }

  async function act(id: string, method: "DELETE" | "PATCH") {
    setBusy("Saving…");
    const res = await fetch(`/admin/api/photos/${id}`, { method, headers: { "x-cartwhim-admin": "1" } });
    setBusy(null);
    if (!res.ok) setError("Something went wrong, please try again.");
    router.refresh();
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((p, i) => (
          <div key={p.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.thumb} alt={`Photo ${i + 1}`} className="aspect-square w-full object-contain" />
            <div className="flex items-center justify-between gap-1 border-t border-stone-100 px-2 py-1.5 text-xs">
              {i === 0 ? <span className="font-semibold text-brand-600">Main photo</span> : (
                <button type="button" onClick={() => act(p.id, "PATCH")} className="inline-flex items-center gap-1 text-stone-600 hover:text-ink"><Star className="h-3.5 w-3.5" /> Make main</button>
              )}
              <button type="button" onClick={() => act(p.id, "DELETE")} aria-label="Delete photo" className="text-stone-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {total < 8 && (
          <button type="button" onClick={() => input.current?.click()} className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-stone-300 text-sm text-stone-500 hover:border-brand-500 hover:text-brand-600">
            <span className="flex flex-col items-center gap-1"><ImagePlus className="h-6 w-6" />Add photos</span>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => add(e.target.files)} />
      <p className="mt-3 text-xs text-stone-500">
        {builtInCount > 0 && total > 0 ? "These photos replace the built-in ones. " : ""}Add 3 to 8 photos from different angles. With 3 or more, the 3D scroll section appears on the product page.
      </p>
      {busy && <p className="mt-2 text-sm font-medium text-brand-600">{busy}</p>}
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
}
