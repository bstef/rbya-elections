import { z } from "zod";

export const commentSchema = z.object({
  candidateId: z.string().uuid(),
  type: z.enum(["positive", "negative"]),
  content: z
    .string()
    .trim()
    .min(10, "Please share a bit more detail (at least 10 characters)")
    .max(5000),
  submitterName: z.string().trim().min(1, "Your name is required"),
  submitterEmail: z.string().trim().email("Enter a valid email address"),
});

export type CommentInput = z.infer<typeof commentSchema>;
