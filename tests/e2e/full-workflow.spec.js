import { test, expect } from '@playwright/test';

test.describe('URL Encoder/Decoder E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete encode -> copy -> decode roundtrip', async ({ page }) => {
    const originalUrl = 'https://example.com/path?param=hello world&other=test!@#';

    // Step 1: Enter URL and encode
    await page.fill('textarea', originalUrl);
    await page.click('#encode-btn');

    // Verify encoded result appears
    await expect(page.locator('.result-text')).toBeVisible();
    const encodedResult = await page.locator('.result-text').inputValue();
    expect(encodedResult).toContain('%20'); // Space encoded
    expect(encodedResult).toContain('%3F'); // ? encoded

    // Step 2: Copy the result
    await page.click('.copy-btn');

    // Verify success feedback
    await expect(page.locator('.copy-success')).toBeVisible();

    // Step 3: Clear and paste encoded result for decoding
    await page.click('#clear-btn');
    await page.fill('textarea', encodedResult);
    await page.click('#decode-btn');

    // Verify decoded result matches original
    const decodedResult = await page.locator('.result-text').inputValue();
    expect(decodedResult).toBe(originalUrl);
  });

  test('multiple encode/decode operations work', async ({ page }) => {
    const testCases = [
      'https://example.com',
      'user@domain.com',
      'path/to/file with spaces.html',
      'query?param1=value1&param2=value2'
    ];

    for (const testCase of testCases) {
      // Clear previous content
      await page.fill('textarea', '');

      // Encode
      await page.fill('textarea', testCase);
      await page.click('#encode-btn');

      const encodedResult = await page.locator('.result-text').inputValue();
      expect(encodedResult).toBeTruthy();

      // Decode
      await page.fill('textarea', encodedResult);
      await page.click('#decode-btn');

      const decodedResult = await page.locator('.result-text').inputValue();
      expect(decodedResult).toBe(testCase);
    }
  });

  test('application works in different browsers', async ({ page, browserName }) => {
    await page.fill('textarea', 'https://example.com/test?param=value');
    await page.click('#encode-btn');

    const result = await page.locator('.result-text').inputValue();
    expect(result).toBe('https%3A//example.com/test%3Fparam%3Dvalue');

    // Verify UI elements are properly displayed
    await expect(page.locator('#encode-btn')).toBeVisible();
    await expect(page.locator('#decode-btn')).toBeVisible();
    await expect(page.locator('.copy-btn')).toBeVisible();
  });

  test('application works on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify responsive layout
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('#encode-btn')).toBeVisible();
    await expect(page.locator('#decode-btn')).toBeVisible();

    // Test functionality on mobile
    await page.fill('textarea', 'mobile test url');
    await page.click('#encode-btn');

    await expect(page.locator('.result-text')).toBeVisible();
    const result = await page.locator('.result-text').inputValue();
    expect(result).toContain('mobile%20test%20url');
  });

  test('application handles browser back/forward', async ({ page }) => {
    // Enter some text and encode
    await page.fill('textarea', 'initial url');
    await page.click('#encode-btn');

    // Navigate to another page (simulate by changing URL fragment)
    await page.goto('/#test');

    // Go back
    await page.goBack();

    // Application should still be functional
    await page.fill('textarea', 'new url');
    await page.click('#encode-btn');

    const result = await page.locator('.result-text').inputValue();
    expect(result).toContain('new%20url');
  });

  test('application works offline (cached)', async ({ page, context }) => {
    // First load to cache resources
    await page.goto('/');

    // Simulate offline
    await context.setOffline(true);

    // Reload page (should work from cache)
    await page.reload();

    // Verify functionality still works
    await page.fill('textarea', 'offline test');
    await page.click('#encode-btn');

    const result = await page.locator('.result-text').inputValue();
    expect(result).toContain('offline%20test');
  });

  test('performance requirements are met', async ({ page }) => {
    // Test page load time
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(2000); // <2s load time

    // Test encoding speed
    await page.fill('textarea', 'performance test url');

    const encodeStartTime = Date.now();
    await page.click('#encode-btn');
    await page.locator('.result-text').waitFor();
    const encodeTime = Date.now() - encodeStartTime;

    expect(encodeTime).toBeLessThan(50); // <50ms encoding
  });

  test('accessibility features work correctly', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.tagName)).toBe('TEXTAREA');

    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement.id)).toBe('encode-btn');

    // Test ARIA labels
    const textarea = page.locator('textarea');
    await expect(textarea).toHaveAttribute('aria-label');

    const encodeBtn = page.locator('#encode-btn');
    await expect(encodeBtn).toHaveAttribute('aria-label');

    // Test screen reader compatibility
    const resultDisplay = page.locator('.result-display-container');
    await expect(resultDisplay).toHaveAttribute('aria-live', 'polite');
  });

  test('error handling works correctly', async ({ page }) => {
    // Test with malformed encoded input
    await page.fill('textarea', 'hello%GGworld');
    await page.click('#decode-btn');

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Invalid');

    // Error should clear when input changes
    await page.fill('textarea', 'valid input');
    await expect(page.locator('.error-message')).toBeHidden();
  });

  test('copy functionality works correctly', async ({ page }) => {
    await page.fill('textarea', 'copy test');
    await page.click('#encode-btn');

    // Test copy button
    await page.click('.copy-btn');

    // Should show success feedback
    await expect(page.locator('.copy-success')).toBeVisible();

    // Success feedback should auto-hide after delay
    await page.waitForTimeout(3000);
    await expect(page.locator('.copy-success')).toBeHidden();
  });
});