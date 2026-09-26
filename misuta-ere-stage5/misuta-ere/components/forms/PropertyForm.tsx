'use client'

import { useState, type FormEvent } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { LatLng } from '@/components/map/PropertyPickerMap'

const PropertyPickerMap = dynamic(() => import('@/components/map/PropertyPickerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm bg-neutral-100 border border-neutral-300 rounded-sm">
      地図を読み込み中…
    </div>
  ),
})

type SubmitResult = {
  status: 'published' | 'pending'
}

export default function PropertyForm() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [pin, setPin] = useState<LatLng | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmitResult | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !description.trim() || !eventDate || !pin) {
      setError('タイトル・詳細本文・発生日・地図上の場所はすべて必須です。')
      return
    }

    setSubmitting(true)

    try {
      let image_url: string | null = null

      if (imageFile) {
        const supabase = createClient()
        const fileExt = imageFile.name.split('.').pop() ?? 'jpg'
        const filePath = `${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error('画像のアップロードに失敗しました。')
        }

        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath)
        image_url = publicUrlData.publicUrl
      }

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          lat: pin.lat,
          lng: pin.lng,
          event_date: eventDate,
          image_url,
          created_by: createdBy.trim() || null,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? '投稿の送信に失敗しました。')
      }

      setResult({ status: json.data.status })
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の送信に失敗しました。')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <p className="text-lg font-bold mb-2">投稿ありがとうございました</p>
        {result.status === 'published' ? (
          <p className="text-sm text-neutral-600">
            投稿は公開されました。トップページの地図に反映されています。
          </p>
        ) : (
          <p className="text-sm text-neutral-600">
            この投稿は管理者の承認後に公開されます。しばらくお待ちください。
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 text-sm bg-neutral-800 text-white rounded-sm"
        >
          トップページへ戻る
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="h-[50vh] lg:h-[65vh] min-h-[360px]">
          <PropertyPickerMap value={pin} onChange={setPin} />
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          {pin
            ? `選択中の座標：x=${Math.round(pin.lng)}, y=${Math.round(pin.lat)}（ドラッグで微調整できます）`
            : '地図をクリックして場所を選択してください'}
        </p>
      </div>

      <div className="w-full lg:w-96 space-y-4">
        <div>
          <label className="block text-xs font-bold mb-1">タイトル *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
            placeholder="例：三栖田駅前ビル"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">詳細本文 *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={4000}
            rows={6}
            className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
            placeholder="事例の詳細を記入してください（架空の内容です）"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">発生日 *</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">画像（任意）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">投稿者名（任意）</label>
          <input
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            maxLength={60}
            className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm"
            placeholder="空欄の場合は匿名として扱われます"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-red-800 text-white text-sm font-bold rounded-sm disabled:opacity-50"
        >
          {submitting ? '投稿中…' : 'この内容で投稿する'}
        </button>

        <p className="text-[11px] text-neutral-400">
          ※ 投稿内容はすべてフィクションとして扱われます。実在の人物・場所を示す情報は記載しないでください。
        </p>
      </div>
    </form>
  )
}
