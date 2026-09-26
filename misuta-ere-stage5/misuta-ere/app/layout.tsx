import type { Metadata } from 'next'
import Link from 'next/link'
import FictionDisclaimer from '@/components/ui/FictionDisclaimer'
import './globals.css'

export const metadata: Metadata = {
  title: '三栖田えれ_β',
  description: '架空の町「三栖田町」の事故物件情報まとめサイト（フィクション）',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen flex flex-col">
        <FictionDisclaimer />

        <header className="bg-neutral-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-bold tracking-wide text-lg">
              三栖田えれ<span className="text-red-400">_β</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="hover:text-neutral-300">
                トップ
              </Link>
              <Link href="/board" className="hover:text-neutral-300">
                町民掲示板
              </Link>
              <Link href="/properties/new" className="hover:text-neutral-300">
                事例を投稿
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="mt-8">
          <FictionDisclaimer compact />
          <p className="text-center text-[11px] text-neutral-400 py-3">
            © 三栖田えれ_β（フィクション） / お問い合わせは管理人まで
          </p>
        </footer>
      </body>
    </html>
  )
}
