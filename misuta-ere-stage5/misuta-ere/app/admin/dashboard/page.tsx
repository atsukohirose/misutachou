import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/admin/LogoutButton'

export const metadata: Metadata = {
  title: '管理ダッシュボード | 三栖田えれ_β',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // middlewareでも保護しているが、直接アクセスされた場合の保険として二重にチェックする
  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-bold">管理ダッシュボード</h1>
          <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="bg-white border border-neutral-200 rounded-sm p-6 text-sm text-neutral-500">
        ログインに成功しました。承認待ちの投稿確認、ニュース投稿、
        コメント・掲示板の管理機能はこの次の段階で実装します。
      </div>
    </div>
  )
}
