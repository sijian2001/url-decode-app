import { describe, test, expect, beforeEach } from 'vitest';

describe('Decoding Workflow Integration', () => {
  beforeEach(() => {
    // Set up a mock DOM for the complete application
    document.body.innerHTML = `
      <div id="app">
        <div id="url-input-container"></div>
        <div id="action-buttons-container"></div>
        <div id="result-display-container"></div>
      </div>
    `;
  });

  test('user can enter encoded text and decode it', async () => {
    const encodedUrl = 'https%3A//example.com/path%3Fparam%3Dhello%20world';
    const expectedDecoded = 'https://example.com/path?param=hello world';

    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');
    const resultText = document.querySelector('.result-text');

    // User enters encoded URL
    urlInput.value = encodedUrl;
    urlInput.dispatchEvent(new Event('input'));

    // User clicks decode button
    decodeBtn.click();

    // Wait for decoding operation
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify result
    expect(resultText.value).toBe(expectedDecoded);
    expect(resultText.style.display).not.toBe('none');
  });

  test('decoded result is displayed correctly', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    urlInput.value = 'test%40example.com';
    urlInput.dispatchEvent(new Event('input'));
    decodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const operationLabel = document.querySelector('.operation-label');
    const resultText = document.querySelector('.result-text');

    expect(operationLabel.textContent).toContain('Decoded');
    expect(resultText.value).toContain('@'); // %40 decoded to @
  });

  test('user can copy decoded result', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    urlInput.value = 'https%3A//example.com';
    urlInput.dispatchEvent(new Event('input'));
    decodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.click();

    // Check if clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Check for success feedback
    const successIndicator = document.querySelector('.copy-success');
    expect(successIndicator.hidden).toBe(false);
  });

  test('decoding works with complex encoded strings', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    // Complex encoded string with multiple special characters
    urlInput.value = 'user%40example.com%3Fsubject%3DHello%20World%26body%3DTest%20message';
    urlInput.dispatchEvent(new Event('input'));
    decodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const resultText = document.querySelector('.result-text');
    expect(resultText.value).toContain('@');
    expect(resultText.value).toContain('?');
    expect(resultText.value).toContain('&');
    expect(resultText.value).toContain(' '); // Decoded space
  });

  test('error handling for invalid encoded text', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    // Test with malformed encoded text
    urlInput.value = 'hello%GGworld'; // Invalid hex
    urlInput.dispatchEvent(new Event('input'));
    decodeBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    const errorMessage = document.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.hidden).toBe(false);
    expect(errorMessage.textContent).toContain('Invalid');
  });

  test('graceful handling of malformed input', async () => {
    const { initializeApp } = await import('../../src/main.js');
    initializeApp();

    const urlInput = document.querySelector('textarea');
    const decodeBtn = document.querySelector('#decode-btn');

    // Test various malformed inputs
    const malformedInputs = [
      'incomplete%2',    // Incomplete percent encoding
      'trailing%',       // Trailing percent
      '%',              // Lone percent
      'normal text'     // Text without encoding (should pass through)
    ];

    for (const input of malformedInputs) {
      urlInput.value = input;
      urlInput.dispatchEvent(new Event('input'));
      decodeBtn.click();

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should either show result or error, but not crash
      const errorMessage = document.querySelector('.error-message');
      const resultText = document.querySelector('.result-text');

      if (input === 'normal text') {
        // Normal text should pass through
        expect(resultText.value).toBe(input);
      } else {
        // Malformed input should show error or handle gracefully
        expect(errorMessage || resultText).toBeTruthy();
      }
    }
  });
});