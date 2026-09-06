"use client";

import Image from "next/image";
import Link from "next/link";

export default function BannerPlacementCard({ banner, isCompact = false }) {
  if (!banner) return null;

  const desktopImage = banner.desktopImage?.trim();
  const mobileImage = banner.mobileImage?.trim() || desktopImage;

  if (!desktopImage && !mobileImage) return null;

  const href = banner.link?.trim() || "#";
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  const title = banner.title?.trim() || "بنر تبلیغاتی";

  // Dynamic aspect ratio based on grid density
  const heightClass = isCompact
    ? "h-28 sm:h-36 md:h-44 lg:h-48"
    : "h-36 sm:h-48 md:h-56 lg:h-64";

  const cardContent = (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${heightClass}`}
    >
      {/* Desktop Image */}
      {desktopImage && (
        <Image
          src={desktopImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="hidden md:block object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}

      {/* Mobile Image */}
      {mobileImage && (
        <Image
          src={mobileImage}
          alt={title}
          fill
          sizes="100vw"
          className="block md:hidden object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}

      {/* Optional Badge */}
      {banner.badgeText && (
        <span className="absolute top-3 right-3 z-10 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {banner.badgeText}
        </span>
      )}
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        aria-label={title}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block w-full" aria-label={title}>
      {cardContent}
    </Link>
  );
}
