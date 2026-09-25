import { toAbsoluteUrl } from '@/lib/seo/seo-utils';
import { seoConfig } from '@/lib/seo/seo-config';

export default function ProductJsonLd({ product }) {
  if (!product) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name || product.title,
    description: product.summary || product.description,
    image: [toAbsoluteUrl(product.image || product.thumbnail)],
    sku: String(product._id || product.id),
    offers: {
      '@type': 'Offer',
      url: `${seoConfig.siteUrl}/product-details/${product._id || product.id}`,
      priceCurrency: 'IRR',
      price: product.price || 0,
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
