import { OGImageRoute } from 'astro-og-canvas';
import { getSortedPosts } from '../../lib/posts';

// Ottieni i post locali
const sortedPosts = await getSortedPosts();

// Mappa delle pagine statiche
const pages: Record<string, any> = {
  'index': { title: 'Pwnissa', description: 'CTF Team' },
  'about': { title: 'About Us', description: 'CTF Team' },
  'members': { title: 'The Team', description: 'CTF Team' },
  'our-pets': { title: 'Our Pets', description: 'CTF Team' },
  'blog': { title: 'Blog', description: 'CTF Team' }
};

// Aggiungi i post del blog (solo quelli locali) alla mappa
for (const post of sortedPosts) {
  if (post.isLocal) {
    // Rimuove slash iniziale/finale per uniformare la route
    const cleanPath = post.url.replace(/^\/|\/$/g, '');
    pages[cleanPath] = {
      title: post.frontmatter.title,
      description: 'CTF Team'
    };
  }
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: pages,
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/logo1.png',
      size: [200], // Logo size
    },
    bgGradient: [
      [10, 10, 10], // --bg-primary approx
      [37, 40, 44], // --bg-secondary approx
    ],
    border: {
      color: [217, 173, 41], // --accent-gold
      width: 10,
      side: 'inline-start',
    },
    font: {
      title: {
        color: [255, 255, 255],
        size: 72,
        weight: 'Normal',
        families: ['Inter', 'sans-serif'],
      },
      description: {
        color: [217, 173, 41], // accent-gold
        size: 40,
        weight: 'Normal',
        families: ['Inter', 'sans-serif'],
      },
    },
  }),
});
