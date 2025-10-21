import { describe, test, expect, beforeEach } from 'vitest';
import { ResultDisplay } from '../../src/components/ResultDisplay.js';

describe('ResultDisplay', () => {
  let container;
  let resultDisplay;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    resultDisplay = new ResultDisplay('test-container');
  });

  test('constructor should create result display elements', () => {
    expect(container.querySelector('.result-display-container')).toBeTruthy();
    expect(container.querySelector('.operation-label')).toBeTruthy();
    expect(container.querySelector('.result-text')).toBeTruthy();
    expect(container.querySelector('.copy-btn')).toBeTruthy();
  });

  test('showResult() should display result with operation type', () => {
    resultDisplay.showResult('encoded%20text', 'encode');

    const resultText = container.querySelector('.result-text');
    const operationLabel = container.querySelector('.operation-label');

    expect(resultText.value).toBe('encoded%20text');
    expect(operationLabel.textContent).toContain('Encoded');
    expect(resultDisplay.isVisible()).toBe(true);
  });

  test('hideResult() should hide the result display', () => {
    resultDisplay.showResult('test', 'encode');
    resultDisplay.hideResult();

    expect(resultDisplay.isVisible()).toBe(false);
  });

  test('getResult() should return current result value', () => {
    resultDisplay.showResult('test result', 'decode');
    expect(resultDisplay.getResult()).toBe('test result');

    resultDisplay.hideResult();
    expect(resultDisplay.getResult()).toBeNull();
  });

  test('setLoading() should show/hide loading state', () => {
    resultDisplay.setLoading(true);
    // Check for loading indicator
    expect(container.querySelector('.loading')).toBeTruthy();

    resultDisplay.setLoading(false);
    expect(container.querySelector('.loading')).toBeFalsy();
  });

  test('showError() should display error message', () => {
    resultDisplay.showError('Invalid input provided');

    const errorMsg = container.querySelector('.error-message');
    expect(errorMsg.textContent).toBe('Invalid input provided');
    expect(errorMsg.hidden).toBe(false);
  });

  test('clearError() should hide error message', () => {
    resultDisplay.showError('Error message');
    resultDisplay.clearError();

    const errorMsg = container.querySelector('.error-message');
    expect(errorMsg.hidden).toBe(true);
  });

  test('copy button should emit copyRequested event', () => {
    let eventFired = false;
    container.addEventListener('copyRequested', () => {
      eventFired = true;
    });

    resultDisplay.showResult('test', 'encode');
    const copyBtn = container.querySelector('.copy-btn');
    copyBtn.click();

    expect(eventFired).toBe(true);
  });
});