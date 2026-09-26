-- ============================================================
-- 段階2：投稿フォーム用 RLS ポリシー
-- Supabase の SQL Editor で実行してください。
-- ============================================================

alter table properties enable row level security;

-- 誰でも投稿できるが、status は必ず 'pending' でなければ弾く
-- （これにより、APIのバグ等でも承認なしの公開はDB側で防止される）
create policy "anyone can insert pending properties"
  on properties for insert
  to anon, authenticated
  with check (status = 'pending');

-- 公開されている物件のみ誰でも閲覧可能
create policy "anyone can select published properties"
  on properties for select
  to anon, authenticated
  using (status = 'published');

-- update / delete のポリシーは意図的に作成しない
-- （承認・却下・削除は service role を使う管理者専用APIのみが行う。段階6で実装）

-- ============================================================
-- Storage: 投稿画像用バケット
-- ダッシュボードの Storage から 'property-images' バケットを
-- 「Public」で作成した上で、以下のポリシーを設定してください。
-- ============================================================

-- 誰でもアップロード可能（投稿フォームからの画像添付用）
create policy "anyone can upload property images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'property-images');

-- 誰でも閲覧可能（公開バケットなので基本不要だが明示しておく）
create policy "anyone can view property images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');
