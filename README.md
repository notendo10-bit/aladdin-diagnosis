# 現人神アラジン 思想タイプ診断ツール

## デプロイ手順（Vercel）

### 1. GitHubリポジトリ作成
1. https://github.com にアクセス
2. 右上「+」→「New repository」
3. リポジトリ名: `aladdin-diagnosis`
4. Public / Private どちらでもOK
5. 「Create repository」

### 2. このフォルダをpush
```bash
cd aladdin-diagnosis
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/【あなたのユーザー名】/aladdin-diagnosis.git
git push -u origin main
```

### 3. Vercelにデプロイ
1. https://vercel.com にアクセス（GitHubアカウントでログイン）
2. 「New Project」→ `aladdin-diagnosis` リポジトリを選択
3. 「Import」→ そのまま「Deploy」

### 4. APIキーを設定（重要！）
1. Vercelのプロジェクトページ → 「Settings」→「Environment Variables」
2. 以下を追加：
   - Name: `GOOGLE_API_KEY`
   - Value: `AIzaSy...（Google AI StudioのAPIキー）`（Anthropicコンソールからコピー）
3. 「Save」後、「Deployments」→「Redeploy」

### 完成後のURL
`https://aladdin-diagnosis.vercel.app`

---

## APIキー取得場所
https://aistudio.google.com/app/apikey → Create API key
