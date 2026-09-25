import { seoConfig } from '@/lib/seo/seo-config';

/**
 * Generates the dynamic robots.txt configuration for search engine crawlers.
 * In Next.js App Router, placing this file in `src/app/robots.js` 
 * automatically exposes `/robots.txt`.
 *
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/user-panel',
          '/user-panel/*',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/auth',
          '/auth/*',
          '/api',
          '/api/*',
          '/*?*search=*', // Prevents indexing dynamic query spam searches
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}
