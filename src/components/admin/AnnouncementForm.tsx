"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateElection } from "@/app/admin/elections/actions";
import { Label, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { Election } from "@/lib/types/models";

export function AnnouncementForm({ election }: { election: Election }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customAnnouncement = String(formData.get("customAnnouncement")).trim() || null;

    startTransition(async () => {
      const res = await updateElection(election.id, {
        custom_announcement: customAnnouncement,
      });
      setMessage(res.message ?? null);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {message && <Banner tone="info">{message}</Banner>}

      <div>
        <Label htmlFor="customAnnouncement">Announcement</Label>
        <Textarea
          id="customAnnouncement"
          name="customAnnouncement"
          rows={3}
          defaultValue={election.custom_announcement ?? ""}
          placeholder="e.g. Convention has been moved to October 3rd due to weather."
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save announcement"}
      </Button>
    </form>
  );
}
