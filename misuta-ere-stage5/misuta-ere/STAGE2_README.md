# 段階2：事故事例投稿フォーム（地図ピン設置＋保存＋承認フロー）

## 追加の環境変数（.env.local）

```
# サーバー専用（絶対にNEXT_PUBLIC_を付けない／ブラウザに出さない）
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# 'auto' = 投稿を即時公開 / 'manual'（省略時のデフォルト） = 管理者の承認待ち
SUBMISSION_MODE=manual
```

`SUPABASE_SERVICE_ROLE_KEY` は Supabase ダッシュボードの
Project Settings → API → `service_role` から取得できます。

## 承認フローの設計

- RLS では「anon/authenticated は `status = 'pending'` の行しか insert できない」ポリシーのみを設定しています。
  これにより、仮にAPI側のロジックに不備があっても、承認なしで `published` として直接投稿されることはありません。
- `SUBMISSION_MODE=auto` の場合のみ、`/api/properties` が保存直後に **service role クライアント（RLSを迂回）** で
  同じ行を `published` に更新します。つまり「即時公開」は "承認をスキップする特別ルート" ではなく、
  "投稿直後に管理者相当の権限で自動承認する" という扱いです。
- 承認制（`manual`）の場合は `pending` のまま保存され、段階6の管理ダッシュボードで承認するまで
  トップページの地図には表示されません（`select` ポリシーが `published` のみ許可しているため）。

## Supabaseでの追加設定

1. SQL Editorで `supabase/stage2_policies.sql` を実行してください。
2. Storage で `property-images` バケットを **Public** で作成してください
   （バケット自体の作成はダッシュボードから行い、ポリシーはSQLで設定します）。

## このファイル群に含まれるもの

- `components/map/mapConfig.ts`：地図の画像URL・サイズ・座標範囲を共通化（既存の`TownMap.tsx`もこちらを参照するよう更新）
- `components/map/PropertyPickerMap.tsx`：クリックでピンを設置・ドラッグで微調整できる地図
- `components/forms/PropertyForm.tsx`：投稿フォーム本体（画像アップロード含む）
- `app/properties/new/page.tsx`：投稿フォームページ
- `app/api/properties/route.ts`：投稿保存API（pending固定保存→autoモードならservice roleで公開）
- `lib/supabase/admin.ts`：Service Role専用クライアント（サーバー限定・段階6でも再利用）
- `supabase/stage2_policies.sql`：RLS・Storageポリシー

## 動作確認手順

1. `.env.local` に `SUPABASE_SERVICE_ROLE_KEY` と `SUBMISSION_MODE` を追加
2. `supabase/stage2_policies.sql` を実行
3. Storageバケット `property-images` を作成
4. `/properties/new` にアクセスし、地図クリック→フォーム入力→投稿
5. `SUBMISSION_MODE=manual` なら投稿後もトップページの地図に反映されないこと（承認待ち）、
   `auto` に変えて再投稿するとトップページに即反映されることを確認

## 未実装（次段階以降）

- `/properties/[id]`（投稿一覧・詳細ページ、まだ生成されていないので投稿後にリンクできる先がない）
- `/board`（町民掲示板）
- `/admin`（承認・却下・削除を行う管理ダッシュボード）
