// Fetch and parse RSS feeds at build time
// Filters for posts tagged with "pwnissa"

interface MemberPost {
  title: string;
  link: string;
  pubDate: Date;
  author: string;
  description: string;
  source: string;
  sourceName: string;
  tags: string[];
  isMemberPost: boolean;
}

async function fetchRSSFeed(url: string, memberName: string): Promise<MemberPost[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch RSS from ${memberName}: ${response.statusText}`);
      return [];
    }

    const text = await response.text();
    return parseRSSFeed(text, memberName, url);
  } catch (error) {
    console.warn(`Error fetching RSS feed for ${memberName}:`, error);
    return [];
  }
}

async function checkPostForPwnissaMeta(postUrl: string): Promise<boolean> {
  try {
    const response = await fetch(postUrl);
    if (!response.ok) return false;
    
    const html = await response.text();
    // Check for meta tag: <meta name="pwnissa" content="true">
    return /<meta\s+name=["']pwnissa["']\s+content=["']true["']/i.test(html);
  } catch (error) {
    return false;
  }
}

function parseRSSFeed(xml: string, memberName: string, feedUrl: string): MemberPost[] {
  const posts: MemberPost[] = [];

  try {
    // Simple regex-based XML parsing for RSS feeds
    // Match each <item> element
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let itemMatch;

    while ((itemMatch = itemRegex.exec(xml)) !== null) {
      const itemContent = itemMatch[1];

      // Extract fields from item
      const titleMatch = itemContent.match(/<title[^>]*>([^<]+)<\/title>/);
      const linkMatch = itemContent.match(/<link[^>]*>([^<]+)<\/link>/);
      const pubDateMatch = itemContent.match(/<pubDate>([^<]+)<\/pubDate>/);
      const descriptionMatch = itemContent.match(/<description[^>]*>[\s\S]*?<!\[CDATA\[([\s\S]*?)\]\]>[\s\S]*?<\/description>/);
      const categoryMatches = itemContent.match(/<category[^>]*>([^<]+)<\/category>/g) || [];

      const title = titleMatch?.[1]?.trim() || 'Untitled';
      const link = linkMatch?.[1]?.trim() || '';
      const pubDate = pubDateMatch?.[1]?.trim() || new Date().toISOString();
      const description = descriptionMatch?.[1]?.trim() || '';
      const categories = categoryMatches.map((cat) => {
        const match = cat.match(/<category[^>]*>([^<]+)<\/category>/);
        return match?.[1]?.trim().toLowerCase() || '';
      });

      // Check if post has pwnissa tag in RSS
      const hasRSSTag = categories.some((cat) => cat.includes('pwnissa')) ||
        title.toLowerCase().includes('[pwnissa]') ||
        description.toLowerCase().includes('pwnissa');

      // Store post with flag indicating whether to check HTML later
      posts.push({
        title,
        link,
        pubDate: new Date(pubDate),
        author: memberName,
        description: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
        source: feedUrl,
        sourceName: memberName,
        tags: categories.filter((cat) => cat !== 'pwnissa'),
        isMemberPost: true,
        _hasRSSTag: hasRSSTag,
        _linkToCheck: link,
      } as any);
    }
  } catch (error) {
    console.warn(`Error parsing RSS feed for ${memberName}:`, error);
  }

  return posts;
}

export async function fetchAllMemberPosts(memberBlogFeeds: Array<{ nickname: string; rssFeed: string }>): Promise<MemberPost[]> {
  let allPosts: MemberPost[] = [];

  for (const member of memberBlogFeeds) {
    const posts = await fetchRSSFeed(member.rssFeed, member.nickname);
    
    // Check posts without RSS tags for HTML meta tag
    for (const post of posts) {
      const hasRSSTag = (post as any)._hasRSSTag;
      if (!hasRSSTag && (post as any)._linkToCheck) {
        const hasMeta = await checkPostForPwnissaMeta((post as any)._linkToCheck);
        if (!hasMeta) {
          // Skip posts without pwnissa tag
          continue;
        }
      }
      
      // Clean up temporary fields
      delete (post as any)._hasRSSTag;
      delete (post as any)._linkToCheck;
      allPosts.push(post);
    }
  }

  // Sort by date, newest first
  allPosts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return allPosts;
}

export type { MemberPost };
