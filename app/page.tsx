"use client"

import Link from "next/link";
import AIBot from "@/app/components/AIBot";
import ImageUploadForm from "@/app/components/ImageUploadForm";
import ImageGenerateForm from "./components/ImageGenerateForm";

export default function Home() {

  return (
    <div className="w-full max-w-2xl text-center space-y-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
        React & Next.js
      </h1>
      <p className="text-lg md:text-xl text-gray-600">
        サンプルアプリを作成しよう！
      </p>
      <div className="space-x-4">
        <Link href="counter/"
          className="px-6 py-3 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 transition">
          はじめる
        </Link>
      </div>

      <AIBot />

      <ImageUploadForm />

      <ImageGenerateForm />
    </div>
  );
}
