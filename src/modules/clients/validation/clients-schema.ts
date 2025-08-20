import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Name is too long"),
  industry: z.string().optional(),
  contacts: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
  profileImage: z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .refine(
      (file) => {
        if (!file || typeof file === "string") return true;
        return file.size <= 5 * 1024 * 1024;
      },
      {
        message: "Profile image must be less than 5MB",
      }
    ),
});

export type ClientFormValues = z.infer<typeof clientSchema> & {
  _id?: string;
};
