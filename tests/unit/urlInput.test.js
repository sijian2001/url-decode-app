import { describe, test, expect, beforeEach } from 'vitest';
import { UrlInput } from '../../src/components/UrlInput.js';

describe('UrlInput', () => {
  let container;
  let urlInput;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    urlInput = new UrlInput('test-container');
  });

  test('constructor should create input component in container', () => {
    expect(container.querySelector('textarea')).toBeTruthy();
    expect(container.querySelector('label')).toBeTruthy();
    expect(container.querySelector('.input-status')).toBeTruthy();
  });

  test('getValue() should return current input value', () => {
    const textarea = container.querySelector('textarea');
    textarea.value = 'test value';
    expect(urlInput.getValue()).toBe('test value');
  });

  test('setValue() should set input value', () => {
    urlInput.setValue('new value');
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe('new value');
  });

  test('clear() should empty the input', () => {
    urlInput.setValue('some text');
    urlInput.clear();
    expect(urlInput.getValue()).toBe('');
  });

  test('focus() should focus the input element', () => {
    urlInput.focus();
    expect(document.activeElement).toBe(container.querySelector('textarea'));
  });

  test('onInput() should register callback for input events', () => {
    let callbackValue = null;
    urlInput.onInput((value) => {
      callbackValue = value;
    });

    const textarea = container.querySelector('textarea');
    textarea.value = 'test input';
    textarea.dispatchEvent(new Event('input'));

    expect(callbackValue).toBe('test input');
  });

  test('setPlaceholder() should set placeholder text', () => {
    urlInput.setPlaceholder('Enter your URL here');
    const textarea = container.querySelector('textarea');
    expect(textarea.placeholder).toBe('Enter your URL here');
  });

  test('isValid() should return validation status', () => {
    expect(urlInput.isValid()).toBe(true); // empty is valid by default
    urlInput.setValue('https://example.com');
    expect(urlInput.isValid()).toBe(true);
  });

  test('isEmpty() should detect empty input', () => {
    expect(urlInput.isEmpty()).toBe(true);
    urlInput.setValue('content');
    expect(urlInput.isEmpty()).toBe(false);
  });
});