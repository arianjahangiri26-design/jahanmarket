"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import { SoldProductsDesign } from "../ui/SoldProductsDesign";
 
 
/**
 * Returns the current week index based on the number of full weeks
 * passed since the beginning of the year.
 */
function getCurrentWeekIndex() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffInMs = now - startOfYear;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return Math.floor(diffInDays / 7);
}

/**
 * Logic component for showing top sold products in weekly rotating groups.
 */
export function SoldProductsLogic() {
  const { request, loading } = useFetch();
  const [products, setProducts] = useState([]);
  const [weekIndex, setWeekIndex] = useState(getCurrentWeekIndex());

  /**
   * Fetch products from the server.
   */
  const loadProducts = useCallback(async () => {
    try {
      const result = await request({
        url: "/api/admin/products",
        method: "GET",
      });

      const items = result?.data?.data;

      if (Array.isArray(items)) {
        setProducts(items);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    }
  }, [request]);

  /**
   * Load products when the component mounts.
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Update the week index periodically so the UI changes automatically
   * when a new week starts.
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWeekIndex(getCurrentWeekIndex());
    }, 60 * 60 * 1000); // Check every hour.

    return () => clearInterval(intervalId);
  }, []);

  /**
   * Sort products by sold count in descending order.
   */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (b?.sold || 0) - (a?.sold || 0));
  }, [products]);

  /**
   * Select 7 products based on the current week index.
   * Each week shows the next group of products.
   */
  const weeklyProducts = useMemo(() => {
    if (sortedProducts.length === 0) return [];

    const groupSize = 7;
    const totalGroups = Math.ceil(sortedProducts.length / groupSize);
    const activeGroupIndex = weekIndex % totalGroups;

    const start = activeGroupIndex * groupSize;
    const end = start + groupSize;

    return sortedProducts.slice(start, end);
  }, [sortedProducts, weekIndex]);

  return (
    <SoldProductsDesign
      products={weeklyProducts}
      loading={loading}
    />
  );
}
