'use client'

import { useState, type FormEvent } from 'react'
import type { PropertyComment } from '@/lib/types'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`
}

type Props = {
  propertyId: string
  initialComments: PropertyComment[]
}

export default function PropertyComments({ propertyId, initialComments }: Props) {
  const [comments, setComments] = useState<PropertyComment[]>(initialComments)
  const [authorName, setAuthorName] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!body.trim()) {
      setError('コメント本文を入力してください。')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          author_name: authorName.trim() || undefined,
          body: body.trim(),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'コメントの投稿に失敗しました。')
      }

      setComments((prev) => [...prev, json.data as PropertyComment])
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コメントの投稿に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-sm font-bold text-white bg-neutral-800 px-3 py-2">
        コメント（{comments.length}）
      </h2>

      {comments.length === 0 ? (
        <p className="text-xs text-neutral-400 py-4">まだコメントはありません。</p>
      ) : (
        <ul className="divide-y divide-neutral-100 bg-white border border-t-0 border-neutral-200">
          {comments.map((c) => (
            <li key={c.id} id={`comment-${c.id}`} className="px-3 py-2 scroll-mt-20">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-neutral-800">{c.author_name}</span>
                <span className="text-[11px] text-neutral-400">
                  {formatDateTime(c.created_at)}
                </span>
              </div>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap mt-1">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-4 bg-neutral-50 border border-neutral-200 p-3 space-y-2">
        <div className="flex gap-2">
          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={40}
            placeholder="ニックネーム（空欄可）"
            className="w-40 border border-neutral-300 rounded-sm px-2 py-1 text-xs"
          />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="コメントを入力（誰でも投稿できます）"
          className="w-full border border-neutral-300 rounded-sm px-2 py-1 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-sm disabled:opacity-50"
        >
          {submitting ? '投稿中…' : 'コメントする'}
        </button>
      </form>
    </section>
  )
}
