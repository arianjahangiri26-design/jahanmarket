"use client";

import React from "react";

const locales = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "EN" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const current = typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean)[0] : "fa";

  function changeLocale(code) {
    if (typeof window === "undefined") return;
    const { pathname, search, hash } = window.location;
    const segments = pathname.split("/").filter(Boolean);

    if (["fa", "en", "ar"].includes(segments[0])) {
      segments[0] = code;
    } else {
      segments.unshift(code);
    }

    const newPath = "/" + segments.join("/") + (search || "") + (hash || "");
    window.location.href = newPath;
  }

  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => changeLocale(l.code)}
          aria-pressed={current === l.code}
          className={`px-3 py-1 rounded ${current === l.code ? "bg-blue-600 text-white" : "bg-transparent text-gray-700"}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
