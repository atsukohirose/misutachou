-- ============================================================
-- 段階4：町民掲示板用 RLS ポリシー
-- Supabase の SQL Editor で実行してください。
-- ============================================================

alter table board_threads enable row level security;
alter table board_replies enable row level security;

-- スレッドは誰でも作成・閲覧可能
create policy "anyone can insert threads"
  on board_threads for insert
  to anon, authenticated
  with check (true);

create policy "anyone can select threads"
  on board_threads for select
  to anon, authenticated
  using (true);

-- レスは誰でも投稿・閲覧可能
create policy "anyone can insert replies"
  on board_replies for insert
  to anon, authenticated
  with check (true);

create policy "anyone can select replies"
  on board_replies for select
  to anon, authenticated
  using (true);

-- update / delete のポリシーは作成しない（削除は段階6のservice role管理者APIのみ）
