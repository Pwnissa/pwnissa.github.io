// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true
    }
  }
});