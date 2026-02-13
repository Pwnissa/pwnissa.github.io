// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  //base: '',
  site: 'https://pwnissa.it/',
  integrations: [mdx()],
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