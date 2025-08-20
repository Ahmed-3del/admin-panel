import { z } from "zod";

const localizedString = z.object({
  ar: z.string(),
  en: z.string(),
});

const serviceSchema = z.object({
  // title: z.string(),
  // titleAr: z.string().optional(),
  description: localizedString,
  descriptionAr: z.string().optional(),
  category: z.string(),
  name: localizedString,
  testimonials: z.array(z.string()),

  importance: z.array(
    z.object({
      desc: localizedString,
    })
  ),

  techUsedInService: z.array(
    z.object({
      title: localizedString,
      desc: localizedString,
    })
  ),

  distingoshesUs: z.array(
    z.object({
      description: localizedString,
    })
  ),

  techUsedInServiceIcons: z.array(z.any()).optional(),
  distingoshesUsIcons: z.array(z.any()).optional(),

  seo: z.array(
    z.object({
      language: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
      keywords: z.string(),
      canonicalTag: z.string(),
      structuredData: z.record(z.any()),
    })
  ),

  image: z.any().optional(),

  designPhase: z.object({
    title: localizedString,
    desc: localizedString,
    image: z.string().optional(),
    satisfiedClientValues: z.object({
      title: localizedString,
    }),
    values: z.array(
      z.object({
        title: localizedString,
        desc: localizedString,
      })
    ),
  }),

  designPhaseImage: z.any().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
export default serviceSchema;
