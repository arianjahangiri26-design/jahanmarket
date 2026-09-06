import { cache } from 'react';
import { seoConfig } from '../seo-config';
import { limitText } from '../seo-utils';
 ;
 
/**
 * Fetch category information by slug with deduplication cache.
 */
export const getCategoryBySlug = cache(async (slug) => {
  if (!slug) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/categories/${slug}`, {
      next: { revalidate: 3600, tags: [`category:${slug}`] },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || data?.category || data || null;
  } catch (error) {
    console.error('Error fetching category for SEO:', error);
    return null;
  }
});

/**
 * Generate SEO metadata dynamically for category/search pages.
 */
export async function generateCategoryMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlugParts = resolvedParams?.category;
  const slugParts = Array.isArray(rawSlugParts)
    ? rawSlugParts
    : rawSlugParts
    ? [rawSlugParts]
    : [];

  const mainSlug = slugParts[slugParts.length - 1]; // Last subcategory or main category
  const searchQuery = Array.isArray(resolvedSearchParams?.q)
    ? resolvedSearchParams?.q[0]
    : resolvedSearchParams?.q;

  // 1. اگر کاربر در حال جستجو باشد
  if (searchQuery) {
    const queryText = String(searchQuery).trim();
    const title = `جستجوی «${queryText}» | ${seoConfig.siteName}`;
    const description = `مشاهده و خرید آنلاین نتایج جستجو برای «${queryText}» با بهترین قیمت در فروشگاه جهان مارکت.`;

    return {
      title,
      description,
      // صفحات سرچ داخلی نباید ایندکس شوند تا از جریمه محتوای تکراری گوگل جلوگیری شود
      robots: { index: false, follow: true },
    };
  }

  // 2. اگر صفحه اصلی دسته‌بندی‌ها باشد (بدون انتخاب اسلاگ)
  if (!mainSlug) {
    const title = `دسته‌بندی محصولات | ${seoConfig.siteName}`;
    const description = 'مشاهده و بررسی انواع دسته‌بندی کالاهای دیجیتال، لوازم جانبی و محصولات فروشگاه جهان مارکت.';
    const url = `${seoConfig.siteUrl}/categories`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: seoConfig.siteName,
        type: 'website',
      },
    };
  }

  // 3. صفحه یک دسته‌بندی خاص (فچ اطلاعات دسته‌بندی)
  const categoryData = await getCategoryBySlug(mainSlug);
  const categoryTitle = categoryData?.title || categoryData?.name || decodeURIComponent(mainSlug);
  const categoryDesc = limitText(
    categoryData?.description ||
      `خرید انواع محصولات در دسته‌بندی ${categoryTitle} با بهترین قیمت، ضمانت اصالت و ارسال سریع در جهان مارکت.`,
    160
  );
  const categoryUrl = `${seoConfig.siteUrl}/categories/${slugParts.join('/')}`;

  return {
    title: `${categoryTitle} | ${seoConfig.siteName}`,
    description: categoryDesc,
    alternates: { canonical: categoryUrl },
    openGraph: {
      title: `${categoryTitle} | ${seoConfig.siteName}`,
      description: categoryDesc,
      url: categoryUrl,
      siteName: seoConfig.siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} | ${seoConfig.siteName}`,
      description: categoryDesc,
    },
  };
}
