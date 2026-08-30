import { z } from "zod";

export const nominationSchema = z.object({
  position: z.enum([
    "president",
    "vice_president_east",
    "vice_president_west",
    "treasurer",
    "controller",
    "committee",
  ]),
  name: z.string().trim().min(1, "Nominee name is required"),
  church: z.string().trim().min(1, "Home church is required"),
  location: z.string().trim().min(1, "City and state are required"),
  email: z.string().trim().email("Enter a valid email address"),
  background: z
    .string()
    .trim()
    .min(10, "Please share a bit more background (at least 10 characters)")
    .max(5000),
  reasons: z
    .string()
    .trim()
    .min(10, "Please share a bit more detail (at least 10 characters)")
    .max(5000),
  submitterName: z.string().trim().min(1, "Your name is required"),
  submitterEmail: z.string().trim().email("Enter a valid email address"),
  pastorContact: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
});

export type NominationInput = z.infer<typeof nominationSchema>;
