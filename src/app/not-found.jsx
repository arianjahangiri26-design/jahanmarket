'use client'

import {Button, Card} from "@heroui/react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      
      <Card className="max-w-md w-full p-8 text-center shadow-xl bg-wite/70 backdrop-blur-lg">

        <h1 className="text-6xl font-bold text-indigo-600 mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold mb-3">
          صفحه پیدا نشد
        </h2>

        <p className="text-gray-600 mb-6">
          صفحه‌ای که دنبال آن هستید وجود ندارد یا حذف شده است.
        </p>

        <div className="flex flex-col gap-3">

          <Link href="/">
            <Button color="primary" className="w-full">
              بازگشت به خانه
            </Button>
          </Link>

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
  )
}
