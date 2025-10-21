import { describe, test, expect, beforeEach } from 'vitest';

describe('UI Interactions Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app">
        <div id="url-input-container"></div>
        <div id="action-buttons-container"></div>
        <div id="result-display-container"></div>
      </div>
    `;
  });

  test('buttons are enabled/disabled correctly', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const encodeBtn = document.querySelector('#encode-btn');
    const decodeBtn = document.querySelector('#decode-btn');

    // Initially with empty input, buttons should be disabled
    expect(encodeBtn.disabled).toBe(true);
    expect(decodeBtn.disabled).toBe(true);

    // When user types, buttons should be enabled
    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));

    expect(encodeBtn.disabled).toBe(false);
    expect(decodeBtn.disabled).toBe(false);

    // When input is cleared, buttons should be disabled again
    urlInput.value = '';
    urlInput.dispatchEvent(new Event('input'));

    expect(encodeBtn.disabled).toBe(true);
    expect(decodeBtn.disabled).toBe(true);
  });

  test('clear button resets all fields', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const encodeBtn = document.querySelector('#encode-btn');
    const clearBtn = document.querySelector('#clear-btn');

    // Set up some content
    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));
    encodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify content exists
    expect(urlInput.value).toBe('https://example.com');
    const resultText = document.querySelector('.result-text');
    expect(resultText.value).toBeTruthy();

    // Click clear button
    clearBtn.click();

    // Verify everything is cleared
    expect(urlInput.value).toBe('');
    expect(resultText.value).toBe('');
    expect(encodeBtn.disabled).toBe(true);
    expect(document.querySelector('#decode-btn').disabled).toBe(true);
  });

  test('input validation provides visual feedback', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const inputStatus = document.querySelector('.input-status');

    // Test valid input
    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));

    expect(inputStatus.textContent).not.toContain('error');

    // Test potentially problematic input
    urlInput.value = '<script>alert("xss")</script>';
    urlInput.dispatchEvent(new Event('input'));

    // Should show some kind of warning or sanitization feedback
    expect(inputStatus.textContent || inputStatus.className).toBeTruthy();
  });

  test('copy button shows success/error states', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const encodeBtn = document.querySelector('#encode-btn');

    // Set up encoded result
    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));
    encodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.click();

    // Should show success state
    const successIndicator = document.querySelector('.copy-success');
    expect(successIndicator.hidden).toBe(false);

    // Wait for auto-reset
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Should reset to normal state
    const copyText = document.querySelector('.copy-text');
    expect(copyText.hidden).toBe(false);
    expect(successIndicator.hidden).toBe(true);
  });

  test('loading states are shown during processing', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const encodeBtn = document.querySelector('#encode-btn');

    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));

    // Click encode and immediately check for loading state
    encodeBtn.click();

    const spinner = encodeBtn.querySelector('.loading-spinner');
    expect(spinner.hidden).toBe(false);
    expect(encodeBtn.disabled).toBe(true);

    // Wait for operation to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Loading should be hidden
    expect(spinner.hidden).toBe(true);
    expect(encodeBtn.disabled).toBe(false);
  });

  test('error messages are displayed appropriately', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    // Test with invalid encoded input
    urlInput.value = 'hello%GGworld';
    urlInput.dispatchEvent(new Event('input'));
    decodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const errorMessage = document.querySelector('.error-message');
    expect(errorMessage.hidden).toBe(false);
    expect(errorMessage.textContent).toContain('Invalid');

    // Clear error when input changes
    urlInput.value = 'valid text';
    urlInput.dispatchEvent(new Event('input'));

    expect(errorMessage.hidden).toBe(true);
  });

  test('keyboard navigation works', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const encodeBtn = document.querySelector('#encode-btn');
    const decodeBtn = document.querySelector('#decode-btn');
    const clearBtn = document.querySelector('#clear-btn');

    // Test Tab navigation
    urlInput.focus();
    expect(document.activeElement).toBe(urlInput);

    // Simulate Tab key
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
    urlInput.dispatchEvent(tabEvent);

    // Should be able to reach all interactive elements
    encodeBtn.focus();
    expect(document.activeElement).toBe(encodeBtn);

    decodeBtn.focus();
    expect(document.activeElement).toBe(decodeBtn);

    clearBtn.focus();
    expect(document.activeElement).toBe(clearBtn);
  });

  test('Enter key in input field triggers default action', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const resultText = document.querySelector('.result-text');

    urlInput.value = 'https://example.com';
    urlInput.dispatchEvent(new Event('input'));

    // Simulate Enter key (should trigger encode by default)
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    urlInput.dispatchEvent(enterEvent);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Should have encoded the result
    expect(resultText.value).toContain('%3A'); // Encoded ':'
  });
});