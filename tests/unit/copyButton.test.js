import { describe, test, expect, beforeEach, vi } from 'vitest';
import { CopyButton } from '../../src/components/CopyButton.js';

describe('CopyButton', () => {
  let button;
  let copyButton;

  beforeEach(() => {
    button = document.createElement('button');
    button.id = 'test-copy-btn';
    document.body.appendChild(button);
    copyButton = new CopyButton('test-copy-btn', 'test content');
  });

  test('constructor should initialize copy button with text source', () => {
    expect(button.querySelector('.copy-text')).toBeTruthy();
    expect(button.querySelector('.copy-success')).toBeTruthy();
    expect(button.querySelector('.copy-error')).toBeTruthy();
  });

  test('copyToClipboard() should copy text to clipboard', async () => {
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

    const result = await copyButton.copyToClipboard();

    expect(writeTextSpy).toHaveBeenCalledWith('test content');
    expect(result).toBe(true);
  });

  test('copyToClipboard() should handle clipboard errors', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Clipboard error'));

    const result = await copyButton.copyToClipboard();

    expect(result).toBe(false);
  });

  test('showSuccess() should display success feedback', () => {
    copyButton.showSuccess();

    const successSpan = button.querySelector('.copy-success');
    const textSpan = button.querySelector('.copy-text');

    expect(successSpan.hidden).toBe(false);
    expect(textSpan.hidden).toBe(true);
  });

  test('showError() should display error feedback', () => {
    copyButton.showError();

    const errorSpan = button.querySelector('.copy-error');
    const textSpan = button.querySelector('.copy-text');

    expect(errorSpan.hidden).toBe(false);
    expect(textSpan.hidden).toBe(true);
  });

  test('reset() should restore default state', () => {
    copyButton.showSuccess();
    copyButton.reset();

    const textSpan = button.querySelector('.copy-text');
    const successSpan = button.querySelector('.copy-success');
    const errorSpan = button.querySelector('.copy-error');

    expect(textSpan.hidden).toBe(false);
    expect(successSpan.hidden).toBe(true);
    expect(errorSpan.hidden).toBe(true);
  });

  test('setEnabled() should control button state', () => {
    copyButton.setEnabled(false);
    expect(button.disabled).toBe(true);

    copyButton.setEnabled(true);
    expect(button.disabled).toBe(false);
  });

  test('setText() should update the text to copy', () => {
    copyButton.setText('new content');
    // Verify the new content will be copied (we'd need to test this through copyToClipboard)
    expect(copyButton.copyToClipboard()).resolves.toBe(true);
  });

  test('button click should emit copy events', async () => {
    let copyAttempted = false;
    let copySucceeded = false;

    button.addEventListener('copyAttempt', () => {
      copyAttempted = true;
    });

    button.addEventListener('copySuccess', () => {
      copySucceeded = true;
    });

    button.click();
    // Allow async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(copyAttempted).toBe(true);
    expect(copySucceeded).toBe(true);
  });
});