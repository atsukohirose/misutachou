-- ============================================================
-- 段階3：詳細ページのコメント欄用 RLS ポリシー
-- Supabase の SQL Editor で実行してください。
-- ============================================================

alter table property_comments enable row level security;

-- 誰でもコメント可能。ただし対象の物件が「公開済み」の場合のみ。
create policy "anyone can insert comments on published properties"
  on property_comments for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from properties p
      where p.id = property_id
        and p.status = 'published'
    )
  );

-- 誰でもコメントを閲覧可能
create policy "anyone can select comments"
  on property_comments for select
  to anon, authenticated
  using (true);

-- update / delete のポリシーは作成しない（削除は段階6の管理者用APIがservice roleで実行）
