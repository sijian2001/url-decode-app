import { describe, test, expect } from 'vitest';
import { Validator } from '../../src/services/validator.js';

describe('Validator', () => {
  test('isValidUrl() should validate URL format', () => {
    expect(Validator.isValidUrl('https://example.com')).toBe(true);
    expect(Validator.isValidUrl('http://test.org/path?param=value')).toBe(true);
    expect(Validator.isValidUrl('ftp://files.example.com')).toBe(true);
    expect(Validator.isValidUrl('mailto:test@example.com')).toBe(true);
    expect(Validator.isValidUrl('not a url')).toBe(false);
    expect(Validator.isValidUrl('')).toBe(false);
  });

  test('isEmpty() should detect empty/whitespace strings', () => {
    expect(Validator.isEmpty('')).toBe(true);
    expect(Validator.isEmpty('   ')).toBe(true);
    expect(Validator.isEmpty('\t\n  ')).toBe(true);
    expect(Validator.isEmpty('content')).toBe(false);
    expect(Validator.isEmpty(' content ')).toBe(false);
  });

  test('hasInvalidChars() should detect problematic characters', () => {
    expect(Validator.hasInvalidChars('normal text')).toBe(false);
    expect(Validator.hasInvalidChars('https://example.com')).toBe(false);
    expect(Validator.hasInvalidChars('<script>alert("xss")</script>')).toBe(true);
    expect(Validator.hasInvalidChars('javascript:void(0)')).toBe(true);
  });

  test('exceedsLength() should check length limits', () => {
    const shortText = 'hello';
    const longText = 'a'.repeat(10000);

    expect(Validator.exceedsLength(shortText, 100)).toBe(false);
    expect(Validator.exceedsLength(longText, 100)).toBe(true);
    expect(Validator.exceedsLength('', 100)).toBe(false);
  });

  test('sanitizeInput() should clean user input safely', () => {
    const dangerousInput = '<script>alert("xss")</script>hello';
    const sanitized = Validator.sanitizeInput(dangerousInput);

    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('</script>');

    const normalInput = 'https://example.com?param=value';
    expect(Validator.sanitizeInput(normalInput)).toBe(normalInput);
  });
});