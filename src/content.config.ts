import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      tagline: z.string(),
      year: z.string(),
      status: z.enum(['live', 'archived', 'wip']),
      role: z.string(),
      stack: z.array(z.string()).min(1),
      links: z.object({
        live: z.url().optional(),
        repo: z.url().optional(),
      }),
      cover: image(),
      coverAlt: z.string(),
      // The one number a work row leads with, e.g. { value: '48', label: 'jurisdictions' }.
      metric: z.object({ value: z.string(), label: z.string() }),
      featured: z.boolean(),
      order: z.number().int(),
    }),
});

export const collections = { work };
