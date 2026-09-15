import React from "react";

const BannerAds = ({ title, subtitle, image, link, badge, bg }) => {
  return (
    <a
      href={link}
      className={`
        group relative flex items-center justify-between
        rounded-2xl p-4 mb-4 overflow-hidden
        bg-gradient-to-br ${bg}
        shadow-sm hover:shadow-xl
        transition-all duration-300
      `}
    >
      {/* Content */}
      <div className="z-10">
        {badge && (
          <span className="inline-block mb-2 text-[11px] font-bold text-white bg-red-500 px-3 py-1 rounded-full">
            {badge}
          </span>
        )}

        <h4 className="text-sm font-extrabold text-gray-900">
          {title}
        </h4>
        <p className="mt-1 text-xs text-gray-600">
          {subtitle}
        </p>
      </div>

      {/* Image */}
      <div className="relative w-20 shrink-0">
        <img
          src={image}
          alt={title}
          className="
            w-full transition-transform duration-300
            group-hover:scale-110
          "
        />
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/40" />
    </a>
  );
};

export default BannerAds;
