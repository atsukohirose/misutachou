import Link from 'next/link'

export type ThreadListItem = {
  id: string
  title: string
  created_at: string
  reply_count: number
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`
}

export default function ThreadList({ threads }: { threads: ThreadListItem[] }) {
  if (threads.length === 0) {
    return <p className="text-sm text-neutral-400 py-12 text-center">まだスレッドがありません。</p>
  }

  return (
    <ul className="divide-y divide-neutral-100 bg-white border border-neutral-200 rounded-sm">
      {threads.map((thread) => (
        <li key={thread.id} className="hover:bg-neutral-50">
          <Link href={`/board/${thread.id}`} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-800 truncate">{thread.title}</p>
              <p className="text-[11px] text-neutral-400">{formatDate(thread.created_at)}</p>
            </div>
            <span className="flex-shrink-0 text-xs text-neutral-500 ml-4">
              レス {thread.reply_count}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
