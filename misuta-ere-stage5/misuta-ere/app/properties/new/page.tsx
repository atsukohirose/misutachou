import type { Metadata } from 'next'
import PropertyForm from '@/components/forms/PropertyForm'

export const metadata: Metadata = {
  title: '事故事例を投稿 | 三栖田えれ_β',
}

export default function NewPropertyPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-base font-bold mb-1">事故事例を投稿する</h1>
      <p className="text-xs text-neutral-500 mb-4">
        投稿内容はすべてフィクションです。地図上の場所をクリックしてから、右側のフォームに入力してください。
      </p>
      <PropertyForm />
    </div>
  )
}
