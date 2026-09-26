# 段階1：トップページ（地図＋マーカー＋サイドバー）

## 追加で必要なパッケージ

```bash
npm install leaflet react-leaflet @supabase/ssr @supabase/supabase-js
npm install -D @types/leaflet
```

## 環境変数（.env.local）

```
NEXT_PUBLIC_SUPABASE_URL=xxxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

## 地図画像について

`components/map/TownMap.tsx` は Leaflet の `CRS.Simple` + `ImageOverlay` を使い、
架空の町のイラスト画像そのものを座標平面として扱う方式です（実在の地理タイルではなく画像1枚を地図にする、
架空マップサイトで最も一般的な実装）。

1. `public/map/misuta-town.png` に町のイラスト画像を配置してください。
2. `TownMap.tsx` 内の `MAP_IMAGE_SIZE`（`[height, width]`）を画像の実ピクセルサイズに合わせて変更してください。
3. `properties.lat` / `properties.lng` は「画像上のピクセル座標（y, x）」として保存します。
   投稿フォーム（段階2）で地図クリック時の座標をそのまま保存する設計にします。

## このファイル群に含まれるもの

- `app/layout.tsx`：ヘッダー・ナビ・フィクション明示バナーを全ページ共通で表示
- `app/page.tsx`：トップページ本体（Supabaseからデータ取得→地図とサイドバーに渡す）
- `app/globals.css`：Tailwindの読み込み
- `components/map/TownMap.tsx`：Leaflet地図本体（クライアントコンポーネント）
- `components/map/PropertyMarker.tsx`：マーカーアイコン生成
- `components/sidebar/NewsList.tsx`：関連ニュース
- `components/sidebar/InfoList.tsx`：新着情報
- `components/sidebar/RecentComments.tsx`：全物件横断の最新コメント
- `components/ui/FictionDisclaimer.tsx`：フィクション明示バナー
- `lib/types.ts`：DB型定義
- `lib/supabase/client.ts` / `server.ts`：Supabaseクライアント

## 未実装（次段階以降）

- `/properties/new`（投稿フォーム）
- `/properties/[id]`（詳細ページ・コメント欄）
- `/board`（町民掲示板）
- `/admin`（管理画面）
- `news/[id]` の詳細ページ（NewsListのリンク先）

## 動作確認のためのダミーデータ（任意）

Supabaseに以下のようなレコードを1件入れておくと、地図とサイドバーの見た目を確認できます。

```sql
insert into properties (title, description, lat, lng, event_date, status)
values ('三栖田駅前ビル', 'テスト用の架空事例です。', 700, 1000, '2024-01-01', 'published');

insert into news (type, title, body)
values ('news', 'サイトを公開しました（テスト）', null);
```
