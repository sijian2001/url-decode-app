# ブラウザテスト

Playwrightを使用したURL Codec Applicationのエンドツーエンドブラウザテスト

## テスト構成

### テストファイル
- `url-codec.spec.js`: メインテストスイート

### 結果ディレクトリ
- `result/`: スクリーンショットが保存されるディレクトリ

## テスト内容

### 1. アプリケーションロード (01-app-loaded.png)
- アプリケーションが正常にロードされることを確認
- 主要なUI要素の表示確認
- タイトル、入力フィールド、ボタンの確認

### 2. 英語URLエンコード (02-encode-english.png)
- シンプルな英語URLのエンコード機能テスト
- 文字数カウントの確認
- エンコード結果の検証

### 3. 日本語URLエンコード (03-encode-japanese.png)
- 漢字とスペースを含むURLのエンコードテスト
- RFC 3986準拠のエンコード確認
- 全角文字の正しい変換確認

### 4. URLデコード (04-decode-url.png)
- エンコードされたURLのデコード機能テスト
- 日本語文字の正しい復元確認

### 5. コピー機能 (05-copy-success.png)
- 結果をクリップボードにコピーする機能テスト
- コピー成功メッセージの表示確認

### 6. クリア機能 (06-cleared.png)
- 入力と結果をクリアする機能テスト
- UIの初期状態への復帰確認
- ボタンの無効化確認

### 7. ボタン状態制御 (07-button-states.png)
- 入力の有無によるボタンの有効/無効切り替えテスト

### 8. 文字数カウント (08-character-count.png)
- リアルタイム文字数カウント機能のテスト
- 短いテキストと長いテキストでの動作確認

### 9. 結果メタデータ (09-result-metadata.png)
- 結果表示のメタデータ（文字数、タイムスタンプ等）の確認

### 10-11. ラウンドトリップテスト (10-roundtrip-encoded.png, 11-roundtrip-decoded.png)
- エンコード→デコードのラウンドトリップテスト
- データの完全性確認
- 日本語文字の往復変換確認

## テスト実行方法

### 全テスト実行
```bash
npx playwright test tests/browser/url-codec.spec.js
```

### Chromiumのみ実行
```bash
npx playwright test tests/browser/url-codec.spec.js --project=chromium
```

### シーケンシャル実行（デバッグ用）
```bash
npx playwright test tests/browser/url-codec.spec.js --workers=1
```

### レポート表示
```bash
npx playwright show-report
```

## テスト結果

✅ **全10テスト成功**

- アプリケーションロード
- 英語URLエンコード
- 日本語URLエンコード（漢字・スペース対応）
- URLデコード
- コピー機能
- クリア機能
- ボタン状態制御
- 文字数カウント
- 結果メタデータ表示
- エンコード/デコードラウンドトリップ

## スクリーンショット

全テストケースのスクリーンショットは`result/`ディレクトリに保存されます。

## 技術詳細

- **テストフレームワーク**: Playwright
- **ブラウザ**: Chromium (Firefox, Webkitでも実行可能)
- **タイムアウト**: 各アサーション5秒、処理待機100-200ms
- **並列実行**: 対応（デフォルトは並列、`--workers=1`でシーケンシャル）

## 注意事項

1. テスト実行前に開発サーバーが起動している必要があります（`npm run dev`）
2. playwright.config.jsで`reuseExistingServer: true`が設定されています
3. Chromium headlessモードではクリップボードAPIの動作が制限される場合があります
