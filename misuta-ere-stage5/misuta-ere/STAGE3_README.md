# 段階3：事故事例一覧・詳細ページ＋コメント欄

## Supabaseでの追加設定

SQL Editorで `supabase/stage3_policies.sql` を実行してください。
`property_comments` テーブルのRLSを有効化し、以下を許可します。

- 誰でもコメント可能。ただし **対象の物件が `status = 'published'` の場合のみ**（承認待ち・却下された物件へのコメントはDB側で拒否）
- 誰でもコメント閲覧可能
- update / delete は用意しない（削除は段階6でservice roleを使う管理者専用APIから行う）

## このファイル群に含まれるもの

- `app/properties/page.tsx`：公開済み事例の一覧ページ（サムネイル＋タイトル＋日付）
- `app/properties/[id]/page.tsx`：詳細ページ（物件情報＋町内地図＋コメント欄）。
  存在しない/未公開のIDは `notFound()`（404）を返す
- `components/properties/PropertyCard.tsx`：一覧用カード
- `components/comments/PropertyComments.tsx`：コメント一覧＋投稿フォーム（クライアントコンポーネント。投稿後は画面内で即時反映）
- `app/api/comments/route.ts`：コメント投稿API（対象物件が公開済みか検証してから保存）
- `components/map/TownMap.tsx`：`linkToDetail` propを追加し、詳細ページ内のミニ地図ではマーカークリックによる遷移を無効化できるようにした

## 動作確認手順

1. `supabase/stage3_policies.sql` を実行
2. 段階2で `published` の物件を1件作成（`SUBMISSION_MODE=auto` で投稿するか、Supabase上で直接 `status` を書き換える）
3. `/properties` で一覧に表示されることを確認
4. 一覧または `/`（トップページの地図マーカー）から詳細ページへ遷移できることを確認
5. 詳細ページでコメントを投稿し、即座に一覧に反映されることを確認
6. トップページのサイドバー「最新のコメント」からのリンク（`#comment-xxx`）でその投稿にスクロールすることを確認

## 未実装（次段階以降）

- `/board`（町民掲示板）
- `/admin`（承認・却下・削除を行う管理ダッシュボード）
