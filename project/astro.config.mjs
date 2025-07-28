// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

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
    remarkPlugins: [],
    rehypePlugins: []
  }
});
