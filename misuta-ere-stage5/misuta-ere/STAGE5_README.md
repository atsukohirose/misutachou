# 段階5：管理人ログイン画面

DB設計の `admins` はテーブルを持たず、Supabase Auth の users をそのまま管理者として扱う方針です
（Auth に登録されている＝ログインできる＝管理者、というシンプルな構成）。

## Supabaseでの追加設定

管理者アカウントを事前に作成してください。

1. Supabaseダッシュボード → Authentication → Users → **Add user**
2. メールアドレスとパスワードを設定（「Auto Confirm User」を有効にしておくと確認メール不要）

## 追加パッケージ

段階2で `@supabase/ssr` は導入済みのため追加インストールは不要です。

## このファイル群に含まれるもの

- `middleware.ts`：Next.jsミドルウェア本体。`/admin/:path*` にマッチさせている
- `lib/supabase/middleware.ts`：セッション検証処理。`/admin/dashboard` 配下は未ログインなら
  `/admin/login?redirectTo=元のパス` にリダイレクトする
- `app/admin/login/page.tsx` + `components/admin/AdminLoginForm.tsx`：
  メール＋パスワードのログインフォーム（`useSearchParams`を使うためSuspenseで包んでいる）
- `app/admin/dashboard/page.tsx`：ログイン後の仮ダッシュボード。
  ページ自身でも認証確認をしている（ミドルウェアと二重の保護）
- `components/admin/LogoutButton.tsx`：ログアウト処理

## 認証の仕組み

`@supabase/ssr` のブラウザ用クライアントはセッションをCookieに保存するため、
クライアントコンポーネントで `signInWithPassword` した直後から、サーバーコンポーネントや
ミドルウェアでも同じログイン状態を認識できます。ログイン成功後に `router.refresh()` を
呼んでいるのはそのためです。

## 動作確認手順

1. Supabaseダッシュボードで管理者アカウントを作成
2. ログインせずに `/admin/dashboard` に直接アクセス → `/admin/login?redirectTo=/admin/dashboard` に
   リダイレクトされることを確認
3. 作成したアカウントでログイン → ダッシュボードへ遷移することを確認
4. 「ログアウト」→ 再度 `/admin/dashboard` にアクセスするとログイン画面に戻されることを確認

## 未実装（次段階）

- `/admin/dashboard` 本体：ニュース投稿、承認待ち投稿の承認/却下/削除、コメント削除、掲示板管理
