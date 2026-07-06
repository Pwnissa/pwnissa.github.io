// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  //base: '',
  site: 'https://pwnissa.it/',
  integrations: [mdx(), sitemap()],
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: 'dracula',
      wrap: true
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  }
});