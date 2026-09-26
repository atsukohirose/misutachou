import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import type { Property } from '@/lib/types'

export const metadata: Metadata = {
  title: '事故事例一覧 | 三栖田えれ_β',
}

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const list = (properties as Property[] | null) ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-base font-bold">事故事例一覧</h1>
        <Link
          href="/properties/new"
          className="text-xs text-red-800 font-bold hover:underline"
        >
          ＋ 事例を投稿する
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-neutral-400 py-12 text-center">
          まだ公開されている事例はありません。
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
