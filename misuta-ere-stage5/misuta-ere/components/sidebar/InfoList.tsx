import type { NewsItem } from '@/lib/types'

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')}`
}

export default function InfoList({ items }: { items: NewsItem[] }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-sm">
      <h2 className="text-sm font-bold text-white bg-neutral-600 px-3 py-2">
        新着情報
      </h2>
      {items.length === 0 ? (
        <p className="px-3 py-4 text-xs text-neutral-400">お知らせはありません</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((item) => (
            <li key={item.id} className="px-3 py-2">
              <span className="text-[11px] text-neutral-400 tabular-nums mr-2">
                {formatDate(item.published_at)}
              </span>
              <span className="text-xs text-neutral-700">{item.title}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
