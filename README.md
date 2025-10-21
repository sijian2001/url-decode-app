# URL Codec Tool

HTMLベースのURLエンコード/デコードツールです。直感的なWeb UIで、RFC 3986 に準拠した安全なエンコード/デコードを高速に実行します。

## 🌟 特徴
- シンプルな操作: 入力 → Encode/Decode → 結果
- 高速処理: 50ms 以内を目標
- プライバシー保護: データの保存・外部送信なし
- レスポンシブ対応 & アクセシビリティ考慮
- ワンクリックコピー機能

## 🚀 クイックスタート
`ash
# リポジトリ取得
git clone <repository-url>
cd url-decode-app

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
# => http://localhost:5173
`

## 本番ビルド
`ash
npm run build
npm run preview  # ローカルでビルド結果を確認
`

## 🛠️ 開発
- フロントエンド: Vanilla JS (ES2020+), HTML5, CSS3
- ツール: Vite, Vitest (unit/integration), Playwright (E2E)
- 品質: ESLint, Prettier

### プロジェクト構造
`
src/                    # ソースコード
  components/          # UIコンポーネント
  services/            # エンコード/デコード/バリデータ
  styles/              # スタイル
  index.html           # エントリ HTML
  main.js              # エントリ JS

tests/                 # テスト
  unit/                # ユニット
  integration/         # 統合
  e2e/                 # E2E
  performance/         # パフォーマンス
specs/                 # 設計仕様
`

### スクリプト
`ash
npm run dev        # 開発
npm test           # 単体・統合テスト
npm run test:ui    # Vitest UI
npm run test:e2e   # E2E
npm run lint       # Lint
npm run lint:fix   # Lintの自動修正
npm run format     # フォーマット
npm run build      # 本番ビルド
npm run preview    # ビルドの確認
`

## 🧪 テスト
`ash
npm test                       # すべて
npm test -- --watch            # 監視モード
npm test -- tests/unit/urlEncoder.test.js  # 特定のファイル
`

## 📋 仕様・原則
- RFC 3986 準拠
- 入力データを保存・送信しない
- 明確で最小限のUI

## 🔧 実務メモ
- Node.js 推奨: 18 以上
- Playwright の初回セットアップ: 
px playwright install
- 再現性の高いインストール: CIでは 
pm ci を推奨

## 🤝 コントリビューション
1. フォークしてブランチ作成: git checkout -b feature/awesome
2. 変更とテスト: 
pm test
3. コミット: eat: ...（Conventional Commits）
4. プッシュ: git push origin feature/awesome
5. PR 作成（詳細な説明・スクリーンショット・関連Issueを添付）

詳細は AGENTS.md を参照してください。

## 📄 ライセンス
MIT License
