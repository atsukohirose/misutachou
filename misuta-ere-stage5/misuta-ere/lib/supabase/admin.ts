import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service Role Key を使う管理者専用クライアント。
 * RLSをすべてバイパスするため、絶対に 'use client' コンポーネントやブラウザに
 * 露出させないこと。API Routes / Server Actions からのみ呼び出す。
 *
 * 用途：
 * - 承認制モードでの管理者による承認／却下／削除（段階6）
 * - 即時公開モードでの自動公開（段階2）
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
