import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let payload: { title?: string }

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 })
  }

  const title = payload.title?.trim()

  if (!title) {
    return NextResponse.json({ error: 'スレッドタイトルは必須です。' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: inserted, error } = await supabase
    .from('board_threads')
    .insert({ title: title.slice(0, 100) })
    .select()
    .single()

  if (error || !inserted) {
    console.error('[POST /api/board/threads]', error)
    return NextResponse.json({ error: 'スレッドの作成に失敗しました。' }, { status: 500 })
  }

  return NextResponse.json({ data: inserted })
}
