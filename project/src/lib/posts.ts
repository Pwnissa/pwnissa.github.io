import { memberBlogFeeds } from '../config';
import { fetchAllMemberPosts } from './rss-fetcher';

export interface PostFrontmatter {
  title: string;
  author: string;
  date: string;
  tags: string[];
  description?: string;
  image?: string;
  [key: string]: any;
}

export interface Post {
  url?: string;
  frontmatter: PostFrontmatter;
  isLocal: boolean;
  [key: string]: any;
}

export async function getSortedPosts(): Promise<Post[]> {
  // Fetch local blog posts using modern import.meta.glob instead of deprecated Astro.glob
  const localModules = import.meta.glob('../pages/blog/**/*.{md,mdx}', { eager: true });
  const localPosts = Object.values(localModules) as any[];

  // Fetch member posts from RSS feeds if feeds are configured
  let memberPosts: any[] = [];
  if (memberBlogFeeds && memberBlogFeeds.length > 0) {
    try {
      memberPosts = await fetchAllMemberPosts(memberBlogFeeds);
    } catch (error) {
      console.warn('Error fetching member posts:', error);
    }
  }

  // Combine and sort all posts by date (newest first)
  const allPosts: Post[] = [
    ...localPosts.map(post => ({
      ...post,
      url: post.url,
      frontmatter: post.frontmatter as PostFrontmatter,
      isLocal: true,
    })),
    ...memberPosts.map(post => ({
      url: post.link,
      frontmatter: {
        title: post.title,
        author: post.author,
        date: post.pubDate.toISOString().split('T')[0],
        tags: post.tags,
        description: post.description,
      },
      isLocal: false,
    })),
  ];

  return allPosts.sort((a, b) => 
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}
