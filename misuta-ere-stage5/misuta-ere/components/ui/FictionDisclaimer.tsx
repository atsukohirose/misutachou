type FictionDisclaimerProps = {
  compact?: boolean
}

/**
 * 全ページ共通で表示するフィクション明示バナー。
 * layout.tsx のヘッダー直下とフッターに常時配置する想定。
 */
export default function FictionDisclaimer({ compact = false }: FictionDisclaimerProps) {
  if (compact) {
    return (
      <p className="text-xs text-neutral-500 text-center py-2 bg-neutral-100 border-y border-neutral-200">
        「三栖田町」および本サイトに登場する地名・人物・事例はすべて架空のフィクションです。実在の場所・人物・事件とは一切関係ありません。
      </p>
    )
  }

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-6xl mx-auto px-4 py-2 text-xs sm:text-sm leading-relaxed">
        <span className="font-bold mr-1">【フィクションのご案内】</span>
        本サイト「三栖田えれ_β」は創作物です。「三栖田町」およびサイト内の地図・住所・事例・人物・コメントはすべて架空であり、実在の地域・個人・団体・事件とは一切関係ありません。
      </div>
    </div>
  )
}
