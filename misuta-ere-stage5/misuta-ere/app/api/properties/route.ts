import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type PropertyPayload = {
  title?: string
  description?: string
  lat?: number
  lng?: number
  event_date?: string
  image_url?: string | null
  created_by?: string | null
}

export async function POST(request: Request) {
  let body: PropertyPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 })
  }

  const { title, description, lat, lng, event_date, image_url, created_by } = body

  if (
    !title?.trim() ||
    !description?.trim() ||
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !event_date
  ) {
    return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 })
  }

  const supabase = await createClient()

  // RLSのinsertポリシーで status = 'pending' のみ許可しているため、
  // クライアントから届いたstatusは一切信用せず、常にpendingとして保存する。
  const { data: inserted, error } = await supabase
    .from('properties')
    .insert({
      title: title.trim().slice(0, 200),
      description: description.trim().slice(0, 4000),
      lat,
      lng,
      event_date,
      image_url: image_url ?? null,
      created_by: created_by?.trim() ? created_by.trim().slice(0, 60) : null,
      status: 'pending',
    })
    .select()
    .single()

  if (error || !inserted) {
    console.error('[POST /api/properties]', error)
    return NextResponse.json({ error: '投稿の保存に失敗しました。' }, { status: 500 })
  }

  const isAutoPublishMode = process.env.SUBMISSION_MODE === 'auto'

  if (!isAutoPublishMode) {
    return NextResponse.json({ data: inserted })
  }

  // 即時公開モード：service role でRLSを越えてpublishedに更新する
  const admin = createAdminClient()
  const { data: published, error: publishError } = await admin
    .from('properties')
    .update({ status: 'published' })
    .eq('id', inserted.id)
    .select()
    .single()

  if (publishError || !published) {
    console.error('[POST /api/properties] auto-publish failed', publishError)
    // 自動公開に失敗した場合は承認待ちのまま返す（データは失われない）
    return NextResponse.json({ data: inserted })
  }

  return NextResponse.json({ data: published })
}
