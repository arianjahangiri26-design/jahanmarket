import React from "react";

const BannerAds = ({ 
  title, 
  subtitle, 
  image, 
  link, 
  badge, 
  bg = "from-[#0B3C5D]/5 via-white to-[#E25B45]/5" 
}) => {
  return (
    <a
      href={link}
      className={`
        group relative flex items-center justify-between
        rounded-[24px] p-5 mb-5 overflow-hidden
        bg-gradient-to-br ${bg}
        border border-[#E2E8F0]
        shadow-sm hover:shadow-xl hover:border-[#0B3C5D]/20
        transition-all duration-500 ease-out
      `}
    >
      {/* Content - محتوا */}
      <div className="z-10 relative space-y-1">
        {badge && (
          <span className="inline-block mb-1 text-[10px] font-black text-white bg-[#E25B45] px-3 py-1 rounded-full tracking-wider shadow-sm">
            {badge}
          </span>
        )}

        <h4 className="text-sm font-black text-[#0A2540] group-hover:text-[#0B3C5D] transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs font-medium text-[#627D98]">
          {subtitle}
        </p>
      </div>

      {/* Image - تصویر */}
      <div className="relative w-24 shrink-0 z-10">
        <img
          src={image}
          alt={title}
          className="
            w-full h-auto object-contain transition-transform duration-500 ease-out
            group-hover:scale-110 group-hover:rotate-2
          "
        />
      </div>

      {/* Hover Glow - هاله نوری شیک در هنگام هاور */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#0B3C5D]/5 to-transparent pointer-events-none" />
    </a>
  );
};

export default BannerAds;
