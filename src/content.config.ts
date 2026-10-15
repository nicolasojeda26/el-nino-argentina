import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const noticias = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/noticias" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tag: z.string().default("El Niño"),
    author: z.string().default("El Niño Argentina"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { noticias };
