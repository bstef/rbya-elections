"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { setCandidatePhoto } from "@/lib/actions/candidate-photo";
import { Avatar } from "@/components/ui/Avatar";
import { Banner } from "@/components/ui/Card";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoUploadField({
  token,
  name,
  initialImageUrl,
}: {
  token: string;
  name?: string;
  initialImageUrl?: string | null;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large -- please choose one under 5MB.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${token}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("candidate-photos")
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        setError("Couldn't upload that photo. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("candidate-photos").getPublicUrl(path);

      const result = await setCandidatePhoto(token, publicUrl);
      if (result.status === "error") {
        setError(result.message ?? "Something went wrong saving your photo.");
        return;
      }

      setImageUrl(publicUrl);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Avatar imageUrl={imageUrl} name={name} size={64} />
        <div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-page">
            {isPending ? "Uploading..." : imageUrl ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isPending}
            />
          </label>
          <p className="mt-1 text-xs text-ink-faint">JPEG, PNG, or WebP, up to 5MB.</p>
        </div>
      </div>
      {error && <Banner tone="error">{error}</Banner>}
    </div>
  );
}
