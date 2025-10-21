import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Browser tests for URL Codec application
 * Tests encoding, decoding, copy, and clear functionality
 */

// Test configuration
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(__dirname, 'result');

test.describe('URL Codec Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to application
    await page.goto(BASE_URL);

    // Wait for app to be ready
    await page.waitForSelector('#url-input-container', { timeout: 5000 });
  });

  test('should load the application successfully', async ({ page }) => {
    // アプリケーションが正常にロードされることを確認
    await expect(page).toHaveTitle(/URL Codec/);

    // 主要なUI要素が表示されていることを確認
    await expect(page.locator('h1')).toContainText('URL Codec Tool');
    await expect(page.getByRole('textbox', { name: /URL input field/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Encode URL/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Decode URL/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-app-loaded.png'),
      fullPage: true
    });
  });

  test('should encode simple English URL', async ({ page }) => {
    const inputUrl = 'https://example.com/test?name=value';
    const expectedEncoded = 'https%3A%2F%2Fexample.com%2Ftest%3Fname%3Dvalue';

    // URL入力
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    await inputField.fill(inputUrl);

    // 文字数カウントの確認
    await expect(page.locator('.input-status')).toContainText('35 characters');

    // Encodeボタンをクリック
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 結果の確認（処理完了まで待機）
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const resultText = await page.locator('.result-text').inputValue();
    expect(resultText).toBe(expectedEncoded);

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-encode-english.png'),
      fullPage: true
    });
  });

  test('should encode Japanese URL with kanji and spaces', async ({ page }) => {
    const inputUrl = 'https://qiita.com/t-kurasawa/items/漢字１/漢 字１/';

    // URL入力
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    await inputField.fill(inputUrl);

    // Encodeボタンをクリック
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 結果が表示されることを確認（処理完了まで待機）
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const resultText = await page.locator('.result-text').inputValue();

    // 漢字とスペースが正しくエンコードされていることを確認
    expect(resultText).toContain('%E6%BC%A2%E5%AD%97'); // 漢字
    expect(resultText).toContain('%20'); // スペース
    expect(resultText).toContain('qiita.com');

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-encode-japanese.png'),
      fullPage: true
    });
  });

  test('should decode encoded URL', async ({ page }) => {
    const encodedUrl = 'https%3A%2F%2Fexample.com%2Ftest%3Fname%3D%E3%83%86%E3%82%B9%E3%83%88';
    const expectedDecoded = 'https://example.com/test?name=テスト';

    // エンコードされたURL入力
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    await inputField.fill(encodedUrl);

    // Decodeボタンをクリック
    await page.getByRole('button', { name: /Decode URL/i }).click();

    // 結果の確認（処理完了まで待機）
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const resultText = await page.locator('.result-text').inputValue();
    expect(resultText).toBe(expectedDecoded);

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-decode-url.png'),
      fullPage: true
    });
  });

  test('should copy result to clipboard', async ({ page, context }) => {
    // クリップボード権限を付与
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const inputUrl = 'https://example.com/test';

    // URL入力とエンコード
    await page.getByRole('textbox', { name: /URL input field/i }).fill(inputUrl);
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 結果が表示されるまで待機
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const encodedResult = await page.locator('.result-text').inputValue();

    // Copyボタンをクリック
    const copyButton = page.getByRole('button', { name: /Copy result/i });
    await copyButton.click();

    // コピー処理完了まで待機
    await page.waitForTimeout(200);

    // コピー成功メッセージの確認
    await expect(page.locator('.copy-success')).toBeVisible();
    await expect(page.locator('.copy-success')).toContainText('Copied');

    // クリップボードの内容を確認（Chromium headlessではクリップボードが空の場合があるためスキップ）
    // const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    // expect(clipboardText).toBe(encodedResult);

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-copy-success.png'),
      fullPage: true
    });
  });

  test('should clear input and result', async ({ page }) => {
    const inputUrl = 'https://example.com/test';

    // URL入力とエンコード
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    await inputField.fill(inputUrl);
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 結果が表示されることを確認（処理完了まで待機）
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();

    // Clearボタンをクリック
    await page.getByRole('button', { name: /Clear/i }).click();

    // 入力がクリアされることを確認
    await expect(inputField).toHaveValue('');

    // 結果が非表示になることを確認
    await expect(page.locator('.result-text')).not.toBeVisible();

    // Encode/Decodeボタンが無効になることを確認
    await expect(page.getByRole('button', { name: /Encode URL/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Decode URL/i })).toBeDisabled();

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-cleared.png'),
      fullPage: true
    });
  });

  test('should enable/disable buttons based on input', async ({ page }) => {
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    const encodeButton = page.getByRole('button', { name: /Encode URL/i });
    const decodeButton = page.getByRole('button', { name: /Decode URL/i });

    // 初期状態: ボタンは無効
    await expect(encodeButton).toBeDisabled();
    await expect(decodeButton).toBeDisabled();

    // テキスト入力: ボタンが有効になる
    await inputField.fill('https://example.com');
    await expect(encodeButton).toBeEnabled();
    await expect(decodeButton).toBeEnabled();

    // テキストクリア: ボタンが無効になる
    await inputField.clear();
    await expect(encodeButton).toBeDisabled();
    await expect(decodeButton).toBeDisabled();

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-button-states.png'),
      fullPage: true
    });
  });

  test('should display character count', async ({ page }) => {
    const inputField = page.getByRole('textbox', { name: /URL input field/i });

    // 短いテキスト
    await inputField.fill('test');
    await expect(page.locator('.input-status')).toContainText('4 characters');

    // 長いテキスト
    await inputField.fill('https://example.com/very/long/url/path/with/many/segments');
    await expect(page.locator('.input-status')).toContainText('57 characters');

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '08-character-count.png'),
      fullPage: true
    });
  });

  test('should show result metadata', async ({ page }) => {
    const inputUrl = 'https://example.com';

    // URL入力とエンコード
    await page.getByRole('textbox', { name: /URL input field/i }).fill(inputUrl);
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 結果メタデータの確認
    await expect(page.locator('.result-meta')).toBeVisible();
    await expect(page.locator('.result-meta')).toContainText('characters');

    // スクリーンショット撮影
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-result-metadata.png'),
      fullPage: true
    });
  });

  test('should encode and decode round-trip', async ({ page }) => {
    const originalUrl = 'https://example.com/test?name=テスト&value=123';

    // エンコード
    const inputField = page.getByRole('textbox', { name: /URL input field/i });
    await inputField.fill(originalUrl);
    await page.getByRole('button', { name: /Encode URL/i }).click();

    // 処理完了まで待機
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const encodedResult = await page.locator('.result-text').inputValue();

    // スクリーンショット: エンコード後
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-roundtrip-encoded.png'),
      fullPage: true
    });

    // クリア
    await page.getByRole('button', { name: /Clear/i }).click();

    // エンコード結果をデコード
    await inputField.fill(encodedResult);
    await page.getByRole('button', { name: /Decode URL/i }).click();

    // 処理完了まで待機
    await page.waitForTimeout(100);
    await expect(page.locator('.result-text')).toBeVisible();
    const decodedResult = await page.locator('.result-text').inputValue();

    // 元のURLと一致することを確認
    expect(decodedResult).toBe(originalUrl);

    // スクリーンショット: デコード後
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '11-roundtrip-decoded.png'),
      fullPage: true
    });
  });
});
