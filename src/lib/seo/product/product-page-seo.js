// src/lib/seo/product-page-seo.js
import { getProductById } from './get-product';
import { getProductId, getProductTitle, getProductDescription, getProductImage } from './seo-utils';
import { buildMetadata } from './universal-seo'; // استفاده از تابع عمومی

export async function resolveProductMetadata(params) {
  const { id } = await params;
  const productId = getProductId({ id });
  const product = await getProductById(productId);

  if (!product) {
    return {
      metadata: buildMetadata({ title: 'محصول یافت نشد', noIndex: true }),
      product: null,
      productId
    };
  }

  return {
    metadata: buildMetadata({
      title: getProductTitle(product),
      description: getProductDescription(product),
      image: getProductImage(product),
      path: `/product-details/${productId}`,
      type: 'og:product'
    }),
    product,
    productId
  };
}
