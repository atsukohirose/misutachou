import type { Metadata } from 'next'
import ThreadForm from '@/components/board/ThreadForm'

export const metadata: Metadata = {
  title: '新規スレッド作成 | 三栖田えれ_β',
}

export default function NewThreadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-base font-bold mb-4">新規スレッド作成</h1>
      <ThreadForm />
    </div>
  )
}
