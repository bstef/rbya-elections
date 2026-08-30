import { z } from "zod";

export const delegateEntrySchema = z.object({
  name: z.string().trim().min(1, "Delegate name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  delegateType: z.enum(["present", "absentee"]),
});

export const delegateRegistrationSchema = z.object({
  churchName: z.string().trim().min(1, "Church name is required"),
  cityState: z.string().trim().min(1, "City and state are required"),
  pastorName: z.string().trim().min(1, "Pastor's name is required"),
  youthLeaderName: z.string().trim().min(1, "Youth leader's name is required"),
  registeredByName: z.string().trim().min(1, "Your name is required"),
  registeredByEmail: z.string().trim().email("Enter a valid email address"),
  delegates: z
    .array(delegateEntrySchema)
    .min(1, "Add at least one delegate"),
});

export type DelegateEntryInput = z.infer<typeof delegateEntrySchema>;
export type DelegateRegistrationInput = z.infer<typeof delegateRegistrationSchema>;
