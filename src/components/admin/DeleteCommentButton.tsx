"use client";

import { useTransition } from "react";
import { deleteComment } from "@/app/admin/comments/actions";
import { Button } from "@/components/ui/Button";

export function DeleteCommentButton({ commentId }: { commentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="danger"
      disabled={isPending}
      onClick={() => startTransition(async () => { await deleteComment(commentId); })}
    >
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
