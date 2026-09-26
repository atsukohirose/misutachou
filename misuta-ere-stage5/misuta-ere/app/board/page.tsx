import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ThreadList, { type ThreadListItem } from '@/components/board/ThreadList'

export const metadata: Metadata = {
  title: '町民掲示板 | 三栖田えれ_β',
}

type RawThreadRow = {
  id: string
  title: string
  created_at: string
  board_replies: { count: number }[] | null
}

function normalizeThreads(rows: RawThreadRow[] | null): ThreadListItem[] {
  if (!rows) return []
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    created_at: row.created_at,
    reply_count: row.board_replies?.[0]?.count ?? 0,
  }))
}

export default async function BoardPage() {
  const supabase = await createClient()

  const { data: rawThreads } = await supabase
    .from('board_threads')
    .select('id, title, created_at, board_replies(count)')
    .order('created_at', { ascending: false })

  const threads = normalizeThreads(rawThreads as RawThreadRow[] | null)

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-base font-bold">町民掲示板</h1>
        <Link href="/board/new" className="text-xs text-red-800 font-bold hover:underline">
          ＋ 新規スレッド作成
        </Link>
      </div>
      <p className="text-xs text-neutral-400 mb-4">
        事故事例とは独立した、町全体向けの雑談・情報交換スレッドです。
      </p>

      <ThreadList threads={threads} />
    </div>
  )
}
