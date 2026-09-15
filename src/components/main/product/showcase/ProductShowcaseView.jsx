// src/components/product/showcase/ProductShowcaseView.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "../product-card/ProductCard";
 
 
export default function ProductShowcaseView({ title, subtitle, href, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="product-showcase-container">
      {/* هدر بخش (همان کدی که در پیام قبلی بود) */}
      
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
