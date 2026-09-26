'use client'

import { useState, type FormEvent } from 'react'
import type { BoardReply } from '@/lib/types'

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`
}

type Props = {
  threadId: string
  initialReplies: BoardReply[]
}

export default function ThreadReplies({ threadId, initialReplies }: Props) {
  const [replies, setReplies] = useState<BoardReply[]>(initialReplies)
  const [authorName, setAuthorName] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!body.trim()) {
      setError('レス本文を入力してください。')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/board/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: threadId,
          author_name: authorName.trim() || undefined,
          body: body.trim(),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? 'レスの投稿に失敗しました。')
      }

      setReplies((prev) => [...prev, json.data as BoardReply])
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'レスの投稿に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {replies.length === 0 ? (
        <p className="text-xs text-neutral-400 py-4">まだレスはありません。最初のレスをどうぞ。</p>
      ) : (
        <ol className="divide-y divide-neutral-100 bg-white border border-neutral-200">
          {replies.map((r, i) => (
            <li key={r.id} className="px-3 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-neutral-400">{i + 1}</span>
                <span className="text-xs font-bold text-neutral-800">{r.author_name}</span>
                <span className="text-[11px] text-neutral-400">{formatDateTime(r.created_at)}</span>
              </div>
              <p className="text-sm text-neutral-700 whitespace-pre-wrap mt-1">{r.body}</p>
            </li>
          ))}
        </ol>
      )}

      <form onSubmit={handleSubmit} className="mt-4 bg-neutral-50 border border-neutral-200 p-3 space-y-2">
        <input
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={40}
          placeholder="ニックネーム（空欄可）"
          className="w-40 border border-neutral-300 rounded-sm px-2 py-1 text-xs"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder="レスを入力（誰でも投稿できます）"
          className="w-full border border-neutral-300 rounded-sm px-2 py-1 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-sm disabled:opacity-50"
        >
          {submitting ? '投稿中…' : 'レスする'}
        </button>
      </form>
    </div>
  )
}
