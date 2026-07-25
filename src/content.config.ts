import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishDate: z.coerce.date(),
  kategori: z.string().default('Teknologi'),
  draft: z.boolean().default(false),
});

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artikel' }),
  schema: articleSchema,
});

const berita = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
  schema: articleSchema,
});

export const collections = { artikel, berita };
