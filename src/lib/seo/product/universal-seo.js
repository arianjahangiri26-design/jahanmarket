// src/lib/seo/universal-seo.js
import { seoConfig } from './seo-config';
import { toAbsoluteUrl, limitText } from './seo-utils';

export function buildMetadata({ 
  title, 
  description, 
  image, 
  path, 
  noIndex = false,
  type = 'website' 
}) {
  // اگر دیتایی نیامد، از مقادیر پیش‌فرض استفاده کن
  const finalTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const finalDescription = limitText(description || seoConfig.defaultDescription, 160);
  const finalImage = toAbsoluteUrl(image || seoConfig.defaultImage);
  const finalUrl = `${seoConfig.siteUrl}${path || ''}`;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: finalUrl },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      type,
      title: finalTitle,
      description: finalDescription,
      url: finalUrl,
      images: [{ url: finalImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },
  };
}
