"use client";

import { useTransition } from "react";
import { updateElection } from "@/app/admin/elections/actions";
import { Button } from "@/components/ui/Button";

export function PublishResultsButton({
  electionId,
  published,
}: {
  electionId: string;
  published: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant={published ? "secondary" : "primary"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await updateElection(electionId, { results_published: !published });
        })
      }
    >
      {isPending ? "Saving..." : published ? "Unpublish results" : "Publish results"}
    </Button>
  );
}
