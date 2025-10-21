# URL Codec Tool

HTMLベースのURL エンコード/デコードツールです。シンプルで使いやすいWebインターフェースを提供し、URLの文字列を素早くエンコード・デコードできます。

## 🌟 特徴

- **シンプルな操作**: 直感的なWebインターフェース
- **高速処理**: 50ms以内でエンコード/デコード完了
- **RFC 3986準拠**: 標準規格に完全対応
- **プライバシー保護**: データの永続化や外部送信なし
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **アクセシビリティ**: キーボードナビゲーションとスクリーンリーダー対応
- **コピー機能**: ワンクリックで結果をクリップボードにコピー

## 🚀 クイックスタート

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd url-decode-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

### 本番ビルド

```bash
# 本番用ビルドを作成
npm run build

# ビルド結果をプレビュー
npm run preview
```

## 📖 使い方

### 基本操作

1. **URLエンコード**:
   - テキストエリアにURLを入力
   - 「Encode URL」ボタンをクリック
   - エンコード結果が表示されます

2. **URLデコード**:
   - テキストエリアにエンコード済みURLを入力
   - 「Decode URL」ボタンをクリック
   - デコード結果が表示されます

3. **結果のコピー**:
   - 結果表示エリアの「Copy Result」ボタンをクリック
   - クリップボードに結果がコピーされます

### キーボードショートカット

- `Ctrl + Enter` (または `Cmd + Enter`): URLをエンコード
- `Ctrl + Shift + Enter` (または `Cmd + Shift + Enter`): URLをデコード
- `Escape`: 入力と結果をクリア

## 🛠️ 開発

### 利用技術

- **フロントエンド**: Vanilla JavaScript (ES2020+), HTML5, CSS3
- **ビルドツール**: Vite
- **テスト**: Vitest (ユニット・統合テスト), Playwright (E2Eテスト)
- **コード品質**: ESLint, Prettier

### プロジェクト構造

```
├── src/                    # ソースコード
│   ├── components/         # UIコンポーネント
│   ├── services/           # ビジネスロジック
│   ├── styles/             # スタイルシート
│   ├── index.html          # メインHTMLファイル
│   └── main.js             # アプリケーションエントリーポイント
├── tests/                  # テストファイル
│   ├── unit/               # ユニットテスト
│   ├── integration/        # 統合テスト
│   ├── e2e/                # E2Eテスト
│   └── performance/        # パフォーマンステスト
└── specs/                  # 設計仕様書
```

### スクリプトコマンド

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm test

# テストUI表示
npm run test:ui

# E2Eテスト実行
npm run test:e2e

# コードリント
npm run lint

# コードフォーマット
npm run format

# 本番ビルド
npm run build

# ビルドプレビュー
npm run preview
```

## 🧪 テスト

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモードでテスト実行
npm test -- --watch

# 特定のテストファイル実行
npm test -- tests/unit/urlEncoder.test.js
```

### テスト種別

- **ユニットテスト**: 各コンポーネントとサービスの単体テスト
- **統合テスト**: コンポーネント間の連携テスト
- **E2Eテスト**: ブラウザ上での完全なユーザーワークフローテスト
- **パフォーマンステスト**: 速度とメモリ使用量のテスト

## 📋 仕様

### 機能要件

- **FR-001**: HTMLページでのURL入力フィールド提供
- **FR-002**: URLエンコード機能（RFC 3986準拠）
- **FR-003**: URLデコード機能（RFC 3986準拠）
- **FR-004**: 同一ページでの結果表示
- **FR-005**: 結果のクリップボードコピー機能
- **FR-006**: ページリロード不要の操作
- **FR-007**: 空入力の適切な処理
- **FR-008**: エラーハンドリングとユーザーフィードバック

### パフォーマンス要件

- エンコード/デコード処理: 50ms以内
- ページ読み込み時間: 2秒以内
- メモリ使用量の安定性

### セキュリティ要件

- ユーザー入力データの永続化禁止
- 外部送信禁止
- XSS攻撃対策
- 入力値のサニタイゼーション

## 🎯 憲法的原則

このプロジェクトは以下の憲法的原則に従って開発されています：

### I. シンプリシティファースト
- 単一目的のURL エンコード/デコード機能
- 機能の肥大化を避ける
- ドキュメント不要で直感的に使用可能

### II. Webインターフェース
- ユーザーフレンドリーなWeb UI
- リアルタイムエンコード/デコード
- 明確な視覚的フィードバック

### III. データセーフティ（絶対要件）
- ユーザー入力データのログ・保存・送信禁止
- メモリ上でのみ処理実行
- 分析・テレメトリー・使用状況追跡なし

### IV. 標準準拠
- RFC 3986（URI Generic Syntax）準拠
- 標準のパーセントエンコーディング
- 適切なURLコンポーネント処理

## 🤝 コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

### 開発ガイドライン

- 全ての機能にテストを含める
- ESLintとPrettierの設定に従う
- 憲法的原則を遵守する
- コミットメッセージは英語で記述
- コードコメントは日本語で記述（実装の背景・理由説明用）

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🐛 バグ報告・機能要望

問題を見つけた場合や新機能のご要望がある場合は、[Issues](../../issues) ページで報告してください。

## 📚 関連資料

- [RFC 3986 - Uniform Resource Identifier (URI): Generic Syntax](https://tools.ietf.org/html/rfc3986)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**Constitutional Requirements**: データの永続化なし • RFC 3986準拠 • プライバシー保護