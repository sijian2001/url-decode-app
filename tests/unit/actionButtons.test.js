import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ActionButtons } from '../../src/components/ActionButtons.js';

describe('ActionButtons', () => {
  let container;
  let actionButtons;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    actionButtons = new ActionButtons('test-container');
  });

  test('constructor should create button elements in container', () => {
    expect(container.querySelector('#encode-btn')).toBeTruthy();
    expect(container.querySelector('#decode-btn')).toBeTruthy();
    expect(container.querySelector('#clear-btn')).toBeTruthy();
  });

  test('onEncode() should register encode button callback', () => {
    const callback = vi.fn();
    actionButtons.onEncode(callback);

    const encodeBtn = container.querySelector('#encode-btn');
    encodeBtn.click();

    expect(callback).toHaveBeenCalledOnce();
  });

  test('onDecode() should register decode button callback', () => {
    const callback = vi.fn();
    actionButtons.onDecode(callback);

    const decodeBtn = container.querySelector('#decode-btn');
    decodeBtn.click();

    expect(callback).toHaveBeenCalledOnce();
  });

  test('onClear() should register clear button callback', () => {
    const callback = vi.fn();
    actionButtons.onClear(callback);

    const clearBtn = container.querySelector('#clear-btn');
    clearBtn.click();

    expect(callback).toHaveBeenCalledOnce();
  });

  test('setEnabled() should enable/disable all buttons', () => {
    actionButtons.setEnabled(false);

    expect(container.querySelector('#encode-btn').disabled).toBe(true);
    expect(container.querySelector('#decode-btn').disabled).toBe(true);

    actionButtons.setEnabled(true);

    expect(container.querySelector('#encode-btn').disabled).toBe(false);
    expect(container.querySelector('#decode-btn').disabled).toBe(false);
  });

  test('setEncodeEnabled() should control encode button state', () => {
    actionButtons.setEncodeEnabled(false);
    expect(container.querySelector('#encode-btn').disabled).toBe(true);

    actionButtons.setEncodeEnabled(true);
    expect(container.querySelector('#encode-btn').disabled).toBe(false);
  });

  test('setDecodeEnabled() should control decode button state', () => {
    actionButtons.setDecodeEnabled(false);
    expect(container.querySelector('#decode-btn').disabled).toBe(true);

    actionButtons.setDecodeEnabled(true);
    expect(container.querySelector('#decode-btn').disabled).toBe(false);
  });

  test('showProcessing() should show loading state', () => {
    actionButtons.showProcessing('encode');
    const encodeBtn = container.querySelector('#encode-btn');
    const spinner = encodeBtn.querySelector('.loading-spinner');

    expect(spinner.hidden).toBe(false);
    expect(encodeBtn.disabled).toBe(true);
  });

  test('hideProcessing() should hide loading state', () => {
    actionButtons.showProcessing('encode');
    actionButtons.hideProcessing();

    const encodeBtn = container.querySelector('#encode-btn');
    const spinner = encodeBtn.querySelector('.loading-spinner');

    expect(spinner.hidden).toBe(true);
    expect(encodeBtn.disabled).toBe(false);
  });
});