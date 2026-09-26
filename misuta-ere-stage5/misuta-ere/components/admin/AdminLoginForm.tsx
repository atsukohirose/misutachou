'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('メールアドレスまたはパスワードが正しくありません。')
      setSubmitting(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white border border-neutral-200 rounded-sm p-6"
    >
      <div>
        <label className="block text-xs font-bold mb-1">メールアドレス</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
          autoComplete="username"
        />
      </div>

      <div>
        <label className="block text-xs font-bold mb-1">パスワード</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 bg-neutral-900 text-white text-sm font-bold rounded-sm disabled:opacity-50"
      >
        {submitting ? 'ログイン中…' : 'ログイン'}
      </button>
    </form>
  )
}
