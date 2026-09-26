import type { Metadata } from 'next'
import { Suspense } from 'react'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export const metadata: Metadata = {
  title: '管理人ログイン | 三栖田えれ_β',
}

export default function AdminLoginPage() {
  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-base font-bold text-center mb-6">管理人ログイン</h1>

      <Suspense fallback={<p className="text-center text-xs text-neutral-400">読み込み中…</p>}>
        <AdminLoginForm />
      </Suspense>

      <p className="text-[11px] text-neutral-400 text-center mt-4">
        管理者アカウントはSupabase Authで発行されたものを使用してください。
      </p>
    </div>
  )
}
