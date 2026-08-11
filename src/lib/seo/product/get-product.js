import { cache } from 'react';

export const getProductById = cache(async function getProductById(id) {
  if (!id) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/products/${id}`,
      {
        next: {
          revalidate: 3600,
          tags: [`product:${id}`],
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    // این قسمت را با ساختار واقعی API خودت هماهنگ کن
    return result?.data || result?.product || result;
  } catch (error) {
    console.error('Get product SEO error:', error);
    return null;
  }
});
