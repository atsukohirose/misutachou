'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function ThreadForm() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('スレッドタイトルを入力してください。')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/board/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'スレッドの作成に失敗しました。')
      }

      router.push(`/board/${json.data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'スレッドの作成に失敗しました。')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-3">
      <div>
        <label className="block text-xs font-bold mb-1">スレッドタイトル *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
          placeholder="例：三栖田駅前の再開発について"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-neutral-800 text-white text-sm font-bold rounded-sm disabled:opacity-50"
      >
        {submitting ? '作成中…' : 'スレッドを作成する'}
      </button>

      <p className="text-[11px] text-neutral-400">
        ※ 町民掲示板の内容もすべてフィクションの世界観の一部として扱われます。
      </p>
    </form>
  )
}
