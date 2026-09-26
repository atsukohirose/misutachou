# 段階4：町民掲示板

事故事例とは完全に独立した、町全体向けの雑談・情報交換用スレッド掲示板です。

## Supabaseでの追加設定

SQL Editorで `supabase/stage4_policies.sql` を実行してください。
`board_threads` / `board_replies` のRLSを有効化し、誰でもスレッド作成・レス投稿・閲覧ができるようにします
（承認制ではなく即時反映——事故事例のような承認フローは設けていません）。

## このファイル群に含まれるもの

- `app/board/page.tsx`：スレッド一覧ページ（レス数を`board_replies(count)`で集計して表示）
- `app/board/new/page.tsx`：新規スレッド作成ページ
- `app/board/[threadId]/page.tsx`：スレッド詳細（レス一覧＋投稿フォーム）。存在しないIDは404
- `components/board/ThreadForm.tsx`：新規スレッド作成フォーム
- `components/board/ThreadList.tsx`：一覧表示用リスト
- `components/board/ThreadReplies.tsx`：レス一覧＋投稿フォーム（投稿後は画面内に即時反映）
- `app/api/board/threads/route.ts`：スレッド作成API
- `app/api/board/replies/route.ts`：レス投稿API（対象スレッドの実在確認あり）

## 動作確認手順

1. `supabase/stage4_policies.sql` を実行
2. `/board` → 「＋ 新規スレッド作成」からスレッドを作成
3. 作成後、自動的にスレッド詳細ページへ遷移することを確認
4. レスを投稿し、即座に一覧へ反映されることを確認
5. `/board` の一覧で「レス N」の数が正しくカウントされていることを確認

## 未実装（次段階）

- `/admin`（ログイン・承認/却下/削除・ニュース投稿を行う管理ダッシュボード）
  ※ 掲示板のスレッド／レス削除も段階6でここに追加します
