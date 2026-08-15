import React from "react";
import { Input, Button } from "@heroui/react";

const AdesCreate = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-800 rounded-2xl shadow-xl p-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            ایجاد بنر تبلیغاتی
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            اطلاعات بنر تبلیغاتی را وارد کنید
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          
          {/* Image */}
          <div>
            <label className="block text-sm mb-2 text-zinc-300">
              تصویر بنر
            </label>
            <Input
              type="file"
              accept="image/*"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-zinc-900 border-zinc-700 hover:border-zinc-600",
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm mb-2 text-zinc-300">
              عنوان
            </label>
            <Input
              type="text"
              placeholder="عنوان بنر"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-zinc-900 border-zinc-700 hover:border-zinc-600",
                input: "text-white placeholder:text-zinc-500",
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2 text-zinc-300">
              توضیحات
            </label>
            <Input
              type="text"
              placeholder="توضیحات کوتاه بنر"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-zinc-900 border-zinc-700 hover:border-zinc-600",
                input: "text-white placeholder:text-zinc-500",
              }}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            ایجاد بنر
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdesCreate;
