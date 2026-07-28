'use client';

import { Button } from "@heroui/react";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center bg-white p-10 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            خطای سراسری!
          </h1>

          <p className="text-gray-700 mb-6">
            {error?.message || "یک خطای جدی رخ داده است."}
          </p>

          <Button color="danger" onPress={() => reset()}>
            تلاش دوباره
          </Button>
        </div>
      </body>
    </html>
  );
}
