import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    layout: z.string().optional(), // Left in for backwards compatibility with old files
  }),
});

export const collections = {
  'blog': blogCollection,
};
