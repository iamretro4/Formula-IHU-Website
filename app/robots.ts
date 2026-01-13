import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/studio/',
          '/api/',
          '/team-portal/',
          '/registration-tests/admin/',
          '/test-email/',
          '/studio-debug/',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

