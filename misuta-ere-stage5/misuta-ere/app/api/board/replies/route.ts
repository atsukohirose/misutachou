import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ReplyPayload = {
  thread_id?: string
  author_name?: string
  body?: string
}

export async function POST(request: Request) {
  let payload: ReplyPayload

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 })
  }

  const { thread_id, author_name, body } = payload

  if (!thread_id || !body?.trim()) {
    return NextResponse.json({ error: '必須項目が不足しています。' }, { status: 400 })
  }

  const supabase = await createClient()

  // 対象スレッドが実在するか確認してから挿入する
  const { data: thread } = await supabase
    .from('board_threads')
    .select('id')
    .eq('id', thread_id)
    .maybeSingle()

  if (!thread) {
    return NextResponse.json({ error: '対象のスレッドが見つかりません。' }, { status: 404 })
  }

  const { data: inserted, error } = await supabase
    .from('board_replies')
    .insert({
      thread_id,
      author_name: author_name?.trim() ? author_name.trim().slice(0, 40) : '名無しの町民',
      body: body.trim().slice(0, 1000),
    })
    .select()
    .single()

  if (error || !inserted) {
    console.error('[POST /api/board/replies]', error)
    return NextResponse.json({ error: 'レスの保存に失敗しました。' }, { status: 500 })
  }

  return NextResponse.json({ data: inserted })
}
