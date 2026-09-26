import Link from 'next/link'
import type { NewsItem } from '@/lib/types'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`
}

export default function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-sm">
      <h2 className="text-sm font-bold text-white bg-neutral-800 px-3 py-2">
        関連ニュース
      </h2>
      {items.length === 0 ? (
        <p className="px-3 py-4 text-xs text-neutral-400">現在ニュースはありません</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((item) => (
            <li key={item.id} className="px-3 py-2 hover:bg-neutral-50">
              <Link href={`/news/${item.id}`} className="block">
                <span className="text-[11px] text-neutral-400 tabular-nums">
                  {formatDate(item.published_at)}
                </span>
                <p className="text-xs text-neutral-800 leading-snug line-clamp-2">
                  {item.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
