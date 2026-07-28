import Image from "next/image";

export default function ProductGallery({ image, title }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_35%)]" />
      
      <div className="relative flex  min-h-[420px] items-center justify-center rounded-[24px] bg-white">
        <Image
          src={image || "/images/placeholder.png"}
          alt={title || "product"}
          width={500}
          height={500}
          className="h-auto max-h-[360px] rounded-[24px]  w-auto object-contain transition duration-300 hover:scale-105"
          priority
        />
      </div>
    </div>
  );
}
