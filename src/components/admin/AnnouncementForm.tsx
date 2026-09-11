"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateAnnouncement } from "@/app/admin/announcement/actions";
import { Label, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { Election } from "@/lib/types/models";

export function AnnouncementForm({ election }: { election: Election }) {
  const [text, setText] = useState(election.custom_announcement ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save(value: string) {
    startTransition(async () => {
      const res = await updateAnnouncement(election.id, value.trim() || null);
      setMessage(res.message ?? null);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    save(text);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {message && <Banner tone="info">{message}</Banner>}

      <div>
        <Label htmlFor="customAnnouncement">Announcement</Label>
        <p className="mb-1.5 text-xs text-ink-faint">
          Any link you include -- like{" "}
          <span className="text-ink-muted">https://rbya.org/convention</span>{" "}
          -- becomes clickable automatically once saved.
        </p>
        <Textarea
          id="customAnnouncement"
          name="customAnnouncement"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Convention has been moved to October 3rd due to weather."
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save announcement"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending || !text}
          onClick={() => {
            setText("");
            save("");
          }}
        >
          Clear announcement
        </Button>
      </div>
    </form>
  );
}
