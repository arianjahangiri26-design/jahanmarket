import { seoConfig } from './seo-config';
import {
  getProductDescription,
  getProductImage,
  getProductTitle,
  toAbsoluteUrl,
} from './seo-utils';

export function buildProductSchema(product, productId) {
  const title = getProductTitle(product);
  const description = getProductDescription(product);
  const image = toAbsoluteUrl(getProductImage(product));

  const productUrl = `${seoConfig.siteUrl}/product-details/${productId}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',

    name: title,
    description,
    image: [image],
    url: productUrl,

    sku: String(product?._id || product?.id || productId),
  };

  const price = product?.price;
  const stock = product?.stock ?? product?.inventory;

  if (price !== undefined && price !== null) {
    schema.offers = {
      '@type': 'Offer',
      url: productUrl,
      price: String(price),

      // این مقدار را بر اساس واحد واقعی قیمت خودت تغییر بده
      priceCurrency: 'IRR',

      availability:
        Number(stock) > 0 || stock === undefined
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',

      itemCondition: 'https://schema.org/NewCondition',
    };
  }

  const rating =
    product?.rating ||
    product?.averageRating ||
    product?.ratings?.average;

  const reviewCount =
    product?.reviewCount ||
    product?.commentsCount ||
    product?.ratings?.count;

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(rating),
      reviewCount: String(reviewCount),
    };
  }

  return schema;
}
 