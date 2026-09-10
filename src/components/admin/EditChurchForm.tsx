"use client";

import { useState, useTransition } from "react";
import { updateChurch } from "@/app/admin/churches/actions";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Card";
import type { Church } from "@/lib/types/models";

export function EditChurchForm({ church }: { church: Church }) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    name: church.name,
    cityState: church.city_state ?? "",
    pastorName: church.pastor_name ?? "",
    youthLeaderName: church.youth_leader_name ?? "",
    phone: church.phone ?? "",
    website: church.website ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="w-full space-y-3 rounded-md border border-hairline bg-page p-3">
      {error && <Banner tone="error">{error}</Banner>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${church.id}`}>Church name</Label>
          <Input
            id={`name-${church.id}`}
            value={fields.name}
            onChange={(e) => setFields({ ...fields, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`cityState-${church.id}`}>City, State</Label>
          <Input
            id={`cityState-${church.id}`}
            value={fields.cityState}
            onChange={(e) => setFields({ ...fields, cityState: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`pastorName-${church.id}`}>Pastor&apos;s name</Label>
          <Input
            id={`pastorName-${church.id}`}
            value={fields.pastorName}
            onChange={(e) => setFields({ ...fields, pastorName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`youthLeaderName-${church.id}`}>Youth leader&apos;s name</Label>
          <Input
            id={`youthLeaderName-${church.id}`}
            value={fields.youthLeaderName}
            onChange={(e) => setFields({ ...fields, youthLeaderName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`phone-${church.id}`}>Phone</Label>
          <Input
            id={`phone-${church.id}`}
            type="tel"
            value={fields.phone}
            onChange={(e) => setFields({ ...fields, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor={`website-${church.id}`}>Website</Label>
          <Input
            id={`website-${church.id}`}
            type="url"
            value={fields.website}
            onChange={(e) => setFields({ ...fields, website: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await updateChurch(church.id, fields);
              if (result.status === "error") {
                setError(result.message ?? "Something went wrong.");
                return;
              }
              setError(null);
              setOpen(false);
            })
          }
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
        <Button variant="secondary" disabled={isPending} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
