import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ThreadReplies from '@/components/board/ThreadReplies'
import type { BoardReply, BoardThread } from '@/lib/types'

type Params = { params: Promise<{ threadId: string }> }

async function getThread(threadId: string) {
  const supabase = await createClient()

  const { data: thread } = await supabase
    .from('board_threads')
    .select('*')
    .eq('id', threadId)
    .maybeSingle()

  if (!thread) return null

  const { data: replies } = await supabase
    .from('board_replies')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })

  return {
    thread: thread as BoardThread,
    replies: (replies as BoardReply[] | null) ?? [],
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { threadId } = await params
  const result = await getThread(threadId)
  return {
    title: result ? `${result.thread.title} | 三栖田えれ_β` : '三栖田えれ_β',
  }
}

export default async function ThreadDetailPage({ params }: Params) {
  const { threadId } = await params
  const result = await getThread(threadId)

  if (!result) {
    notFound()
  }

  const { thread, replies } = result

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/board" className="text-xs text-neutral-500 hover:underline">
        ← 町民掲示板一覧へ戻る
      </Link>

      <h1 className="text-base font-bold text-neutral-900 mt-2 mb-4">{thread.title}</h1>

      <ThreadReplies threadId={thread.id} initialReplies={replies} />
    </div>
  )
}
