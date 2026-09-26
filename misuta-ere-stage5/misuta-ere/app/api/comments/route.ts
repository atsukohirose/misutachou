import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type CommentPayload = {
  property_id?: string
  author_name?: string
  body?: string
}

export async function POST(request: Request) {
  let payload: CommentPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 })
  }

  const { property_id, author_name, body } = payload

  if (!property_id || !body?.trim()) {
    return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 })
  }

  const supabase = await createClient()

  // コメント対象が「公開済み」の物件であることを確認してから挿入する。
  // （承認待ち／却下された物件へのコメントは受け付けない）
  const { data: property } = await supabase
    .from('properties')
    .select('id')
    .eq('id', property_id)
    .eq('status', 'published')
    .maybeSingle()

  if (!property) {
    return NextResponse.json({ error: '対象の事例が見つかりません。' }, { status: 404 })
  }

  const { data: inserted, error } = await supabase
    .from('property_comments')
    .insert({
      property_id,
      author_name: author_name?.trim() ? author_name.trim().slice(0, 40) : '名無しの町民',
      body: body.trim().slice(0, 1000),
    })
    .select()
    .single()

  if (error || !inserted) {
    console.error('[POST /api/comments]', error)
    return NextResponse.json({ error: 'コメントの保存に失敗しました。' }, { status: 500 })
  }

  return NextResponse.json({ data: inserted })
}
