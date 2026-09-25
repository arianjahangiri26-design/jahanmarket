import { seoConfig } from './seo-config';

export function stripHtml(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function limitText(value = '', maxLength = 160) {
  const text = stripHtml(value);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function toAbsoluteUrl(value) {
  if (!value) {
    return seoConfig.defaultImage;
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `${seoConfig.siteUrl}${value.startsWith('/') ? '' : '/'}${value}`;
}

export function getProductId(params) {
  const id = params?.id;

  if (Array.isArray(id)) {
    return id[0];
  }

  return id;
}

export function getProductTitle(product) {
  return (
    product?.title ||
    product?.name ||
    product?.productName ||
    'محصول'
  );
}

export function getProductDescription(product) {
  return limitText(
    product?.summary ||
      product?.shortDescription ||
      product?.description ||
      'مشاهده مشخصات و اطلاعات محصول در جهان مارکت.',
    160
  );
}

export function getProductImage(product) {
  const image =
    product?.thumbnail ||
    product?.image ||
    product?.images?.[0] ||
    seoConfig.defaultImage;

  if (typeof image === 'object') {
    return image.url || image.src || seoConfig.defaultImage;
  }

  return image;
}
