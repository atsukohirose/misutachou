import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import NewsList from '@/components/sidebar/NewsList'
import InfoList from '@/components/sidebar/InfoList'
import RecentComments, { type RecentComment } from '@/components/sidebar/RecentComments'
import type { Property, NewsItem } from '@/lib/types'

// Leaflet は window に依存するため SSR を無効化して読み込む
const TownMap = dynamic(() => import('@/components/map/TownMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm bg-neutral-100 border border-neutral-300 rounded-sm">
      地図を読み込み中…
    </div>
  ),
})

// Supabase の select 結果（コメント＋物件タイトルの結合）に対応する一時的な型
type RawRecentComment = {
  id: string
  author_name: string
  body: string
  created_at: string
  property_id: string
  properties: { title: string } | { title: string }[] | null
}

function normalizeRecentComments(rows: RawRecentComment[] | null): RecentComment[] {
  if (!rows) return []
  return rows.map((row) => {
    const propertyTitle = Array.isArray(row.properties)
      ? row.properties[0]?.title
      : row.properties?.title
    return {
      id: row.id,
      author_name: row.author_name,
      body: row.body,
      created_at: row.created_at,
      property_id: row.property_id,
      property_title: propertyTitle ?? '(削除された物件)',
    }
  })
}

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: properties }, { data: newsItems }, { data: infoItems }, { data: rawComments }] =
    await Promise.all([
      supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false }),
      supabase
        .from('news')
        .select('*')
        .eq('type', 'news')
        .order('published_at', { ascending: false })
        .limit(6),
      supabase
        .from('news')
        .select('*')
        .eq('type', 'info')
        .order('published_at', { ascending: false })
        .limit(6),
      supabase
        .from('property_comments')
        .select('id, author_name, body, created_at, property_id, properties(title)')
        .order('created_at', { ascending: false })
        .limit(10),
    ])

  const recentComments = normalizeRecentComments(rawComments as RawRecentComment[] | null)

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* サイドバー */}
        <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1 space-y-4">
          <NewsList items={(newsItems as NewsItem[]) ?? []} />
          <InfoList items={(infoItems as NewsItem[]) ?? []} />
          <RecentComments items={recentComments} />
        </aside>

        {/* 地図エリア */}
        <main className="flex-1 order-1 lg:order-2">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="text-base font-bold text-neutral-800">三栖田町 事故物件マップ</h1>
            <span className="text-xs text-neutral-400">
              掲載件数：{(properties as Property[] | null)?.length ?? 0}件
            </span>
          </div>
          <div className="h-[70vh] min-h-[420px]">
            <TownMap properties={(properties as Property[]) ?? []} />
          </div>
        </main>
      </div>
    </div>
  )
}
