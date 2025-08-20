import { any, z } from "zod";

// For handling files (e.g., uploaded or existing URLs)
const fileOrString = z.union([z.instanceof(File), z.string()]);

const localizedField = z.object({
  en: z.string().optional(),
  ar: z.string().optional(),
});

const projectSchema = z.object({
  projectNameEn: z.string().min(1, "Project name (EN) is required"),
  projectNameAr: z.string().min(1, "Project name (AR) is required"),
  descriptionEn: z.string().min(1, "Description (EN) is required"),
  descriptionAr: z.string().min(1, "Description (AR) is required"),
  nameEn: z.string().optional(),
  nameAr: z.string().optional(),
  category: z.string().min(1, "Category is required"),

  designScreens: z.object({
    app: z.string().optional(),
    web: z.string().optional(),
  }),

  images: any(),

  client: z.string().optional(),
  status: z.string().optional(),

  seo: z.object({
    metaDescription: z.string().optional(),
    metaTitle: z.string().optional(),
  }),

  region: z.string().optional(),

  screenTypes: z.array(z.string()).optional(),

  screenshots: z
    .array(
      z.object({
        url: z.string(),
      })
    )
    .optional(),

  platform: z.string().optional(),

  responsive: z.object({
    image: z.string(),
    title: localizedField,
    description: localizedField,
  }),

  url: z.string().url("Must be a valid URL"),

  hero: z.object({
    region: z.string().optional(),
    tech: z
      .array(
        z.object({
          icon: z.string(),
        })
      )
      .optional(),
    platforms: z.array(z.string()).optional(),
    downloads: z.string().optional(),
    description: localizedField,
    title: localizedField,
  }),

  contacts: z.array(z.string()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
export default projectSchema;
