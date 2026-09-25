import { cache } from 'react';
import { seoConfig } from '@/lib/seo/seo-config';
import { limitText, stripHtml, toAbsoluteUrl } from '@/lib/seo/seo-utils';

// تابع کمکی برای استخراج شناسه محصول
export function getProductId(params) {
  if (!params) return null;

  // اگر پارامتر params.id یا params.slug باشد
  const idValue = params.id || params.slug || params;

  if (Array.isArray(idValue)) {
    return idValue.length > 0 ? String(idValue[0]).trim() : null;
  }

  if (typeof idValue === 'string' || typeof idValue === 'number') {
    return String(idValue).trim();
  }

  return null;
}

// تابع فچ محصول از API با کش
export const getProductById = cache(async (id) => {
  if (!id) return null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // روت API محصول (مطابق با روت پروژه شما)
    const res = await fetch(`${baseUrl}/api/admin/products/${id}`, {
      cache: 'no-store', // یا next: { revalidate: 60 }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.product || data?.data || data || null;
  } catch (error) {
    console.error('Error fetching product for SEO:', error);
    return null;
  }
});

// ساختار متادیتای سئو
export function buildProductMetadata(product, productId) {
  const fallbackTitle = `محصول در ${seoConfig?.siteName || 'جهان مارکت'}`;
  const title = product?.title || product?.name || fallbackTitle;
  const rawDescription = product?.description || product?.shortDescription || seoConfig?.defaultDescription || '';
  const cleanDescription = limitText(stripHtml(rawDescription), 160);

  // دریافت اولین عکس در صورت آرایه بودن
  const rawImage = Array.isArray(product?.images) 
    ? product.images[0] 
    : product?.image || product?.thumbnail || '/images/product-placeholder.png';
  
  const absoluteImage = toAbsoluteUrl(rawImage);

  const productUrl = productId 
    ? `${seoConfig?.siteUrl || ''}/product-details/${productId}`
    : seoConfig?.siteUrl || '';

  return {
    title,
    description: cleanDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: cleanDescription,
      url: productUrl,
      siteName: seoConfig?.siteName || 'جهان مارکت',
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fa_IR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: [absoluteImage],
    },
    robots: {
      index: Boolean(product),
      follow: Boolean(product),
    },
  };
}

// تابع تجمیع‌کننده
export async function resolveProductMetadata(params) {
  const resolvedParams = await params;
  const productId = getProductId(resolvedParams);

  if (!productId) {
    return {
      productId: null,
      product: null,
      metadata: {
        title: 'محصول یافت نشد',
        robots: { index: false, follow: false },
      },
    };
  }

  const product = await getProductById(productId);

  if (!product) {
    return {
      productId,
      product: null,
      metadata: {
        title: `محصول یافت نشد | ${seoConfig?.siteName || 'جهان مارکت'}`,
        robots: { index: false, follow: false },
      },
    };
  }

  return {
    productId,
    product,
    metadata: buildProductMetadata(product, productId),
  };
}
