import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/sanity.queries';
import { getEvents } from '@/lib/sanity.queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    '',
    '/about',
    '/sponsors',
    '/join-us',
    '/contact',
    '/rules',
    '/posts',
    '/events',
  ];

  // Get dynamic pages
  const posts = await getPosts().catch(() => []);
  const events = await getEvents().catch(() => []);

  const postPages = posts.map((post: any) => ({
    url: `${siteUrl}/posts/${post.slug?.current || post.slug}`,
    lastModified: post._updatedAt || post.publishedAt || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const eventPages = events.map((event: any) => ({
    url: `${siteUrl}/events/${event.year || event._id}`,
    lastModified: event._updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.8,
    })),
    ...postPages,
    ...eventPages,
  ];
}

