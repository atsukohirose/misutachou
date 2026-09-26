import Link from 'next/link'

export type RecentComment = {
  id: string
  author_name: string
  body: string
  created_at: string
  property_id: string
  property_title: string
}

function truncate(text: string, max = 40) {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

export default function RecentComments({ items }: { items: RecentComment[] }) {
  return (
    <section className="bg-white border border-neutral-200 rounded-sm">
      <h2 className="text-sm font-bold text-white bg-neutral-800 px-3 py-2">
        最新のコメント
      </h2>
      {items.length === 0 ? (
        <p className="px-3 py-4 text-xs text-neutral-400">まだコメントはありません</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {items.map((c) => (
            <li key={c.id} className="px-3 py-2 hover:bg-neutral-50">
              <Link href={`/properties/${c.property_id}#comment-${c.id}`} className="block">
                <p className="text-[11px] text-neutral-400 truncate">
                  {c.property_title}
                </p>
                <p className="text-xs text-neutral-800 leading-snug">
                  <span className="font-bold mr-1">{c.author_name}:</span>
                  {truncate(c.body)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
