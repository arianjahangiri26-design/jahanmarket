import { seoConfig } from '@/lib/seo/seo-config';

/**
 * Fetches products for the dynamic sitemap.
 * Hits the internal admin products endpoint or returns an empty array safely.
 */
async function fetchProductsForSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/admin/products`, {
      next: { revalidate: 86400 }, // 24-hour cache
    });

    if (!res.ok) return [];

    const data = await res.json();
    const products = data?.data || data?.products || (Array.isArray(data) ? data : []);

    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('[Sitemap Error] Products fetch failed:', error);
    return [];
  }
}

/**
 * Fetches categories for dynamic category routes.
 */
async function fetchCategoriesForSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/admin/categories`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const categories = data?.data || data?.categories || (Array.isArray(data) ? data : []);

    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('[Sitemap Error] Categories fetch failed:', error);
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = seoConfig.siteUrl;

  // 1. Static Core Pages (Matched with your project directory tree)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/static-pages/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/static-pages/shipping`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/static-pages/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Fetch Dynamic Data in Parallel
  const [products, categories] = await Promise.all([
    fetchProductsForSitemap(),
    fetchCategoriesForSitemap(),
  ]);

  // 3. Dynamic Products URLs -> /product-details/[id]
  const productRoutes = products
    .filter((item) => item?._id || item?.id)
    .map((item) => {
      const id = item._id || item.id;
      return {
        url: `${baseUrl}/product-details/${id}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

  // 4. Dynamic Categories URLs -> /categories/[slug]
  const categoryRoutes = categories
    .filter((cat) => cat?.slug || cat?._id || cat?.id)
    .map((cat) => {
      const identifier = cat.slug || cat._id || cat.id;
      return {
        url: `${baseUrl}/categories/${identifier}`,
        lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
