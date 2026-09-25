'use client';

import { Button, Card } from "@heroui/react";

export default function ErrorPage({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      
      <Card className="p-8 max-w-md text-center shadow-xl bg-white/70 backdrop-blur">
        <h1 className="text-4xl font-bold text-indigo-600 mb-3">
          اوه! مشکلی پیش اومد
        </h1>

        <p className="text-gray-600 mb-6">
          {error?.message || "خطای غیرمنتظره‌ای رخ داد."}
        </p>

        <div className="flex flex-col gap-3">
          
          <Button 
            color="primary"
            className="w-full"
            onPress={() => reset()}
          >
            تلاش مجدد
          </Button>

          <Button 
            color="secondary"
            className="w-full"
            onPress={() => window.location.reload()}
          >
            رفرش صفحه
          </Button>

        </div>
      </Card>
    </div>
  );
}
