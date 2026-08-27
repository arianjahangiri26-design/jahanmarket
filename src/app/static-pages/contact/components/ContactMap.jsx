import React from "react";

export default function ContactMap({ query = "ندوم" }) {
  const q = encodeURIComponent(query);
  const src = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <div className="mt-4 h-64 w-full overflow-hidden rounded-lg border">
      <iframe
        title="آدرس ما"
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
