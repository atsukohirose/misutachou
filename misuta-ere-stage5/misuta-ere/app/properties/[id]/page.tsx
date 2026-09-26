import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PropertyComments from '@/components/comments/PropertyComments'
import type { Property, PropertyComment } from '@/lib/types'

const TownMap = dynamic(() => import('@/components/map/TownMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs bg-neutral-100 border border-neutral-300 rounded-sm">
      地図を読み込み中…
    </div>
  ),
})

type Params = { params: Promise<{ id: string }> }

async function getProperty(id: string) {
  const supabase = await createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()

  if (!property) return null

  const { data: comments } = await supabase
    .from('property_comments')
    .select('*')
    .eq('property_id', id)
    .order('created_at', { ascending: true })

  return {
    property: property as Property,
    comments: (comments as PropertyComment[] | null) ?? [],
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  const result = await getProperty(id)
  return {
    title: result ? `${result.property.title} | 三栖田えれ_β` : '三栖田えれ_β',
  }
}

export default async function PropertyDetailPage({ params }: Params) {
  const { id } = await params
  const result = await getProperty(id)

  if (!result) {
    notFound()
  }

  const { property, comments } = result

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-3 py-1.5 mb-4">
        この事例は架空の物語です。実在の場所・人物・事件とは関係ありません。
      </p>

      <h1 className="text-lg font-bold text-neutral-900 mb-1">{property.title}</h1>
      <p className="text-xs text-neutral-400 mb-4">発生日：{property.event_date}</p>

      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="md:w-1/2 space-y-3">
          {property.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full rounded-sm border border-neutral-200 object-cover"
            />
          )}
          <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {property.description}
          </p>
        </div>

        <div className="md:w-1/2">
          <p className="text-xs font-bold text-neutral-500 mb-1">町内の場所</p>
          <div className="h-64 md:h-full min-h-[220px]">
            <TownMap properties={[property]} linkToDetail={false} />
          </div>
        </div>
      </div>

      <PropertyComments propertyId={property.id} initialComments={comments} />
    </div>
  )
}
