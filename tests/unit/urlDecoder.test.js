import { describe, test, expect } from 'vitest';
import { UrlDecoder } from '../../src/services/urlDecoder.js';

describe('UrlDecoder', () => {
  test('decode() should decode percent-encoded strings', () => {
    const input = 'https%3A//example.com/path%3Fparam%3Dhello%20world';
    const expected = 'https://example.com/path?param=hello world';
    const result = UrlDecoder.decode(input);
    expect(result).toBe(expected);
  });

  test('decode() should handle empty string', () => {
    const input = '';
    const expected = '';
    const result = UrlDecoder.decode(input);
    expect(result).toBe(expected);
  });

  test('decode() should handle malformed encoded strings gracefully', () => {
    const input = 'hello%GGworld'; // Invalid hex
    expect(() => UrlDecoder.decode(input)).toThrow();
  });

  test('decode() should handle strings without encoding', () => {
    const input = 'https://example.com/normalpath';
    const expected = 'https://example.com/normalpath';
    const result = UrlDecoder.decode(input);
    expect(result).toBe(expected);
  });

  test('isValidEncodedInput() should validate encoding format', () => {
    expect(UrlDecoder.isValidEncodedInput('hello%20world')).toBe(true);
    expect(UrlDecoder.isValidEncodedInput('normal text')).toBe(true);
    expect(UrlDecoder.isValidEncodedInput('hello%GGworld')).toBe(false);
    expect(UrlDecoder.isValidEncodedInput('incomplete%2')).toBe(false);
    expect(UrlDecoder.isValidEncodedInput('trailing%')).toBe(false);
  });

  test('getDecodingInfo() should return correct statistics', () => {
    const input = 'hello%20world%40example.com';
    const info = UrlDecoder.getDecodingInfo(input);

    expect(info).toHaveProperty('encodedLength');
    expect(info).toHaveProperty('decodedLength');
    expect(info).toHaveProperty('decodedCharacters');
    expect(info).toHaveProperty('hasEncodedChars');
    expect(info).toHaveProperty('isValidEncoding');

    expect(info.hasEncodedChars).toBe(true);
    expect(info.isValidEncoding).toBe(true);
    expect(Array.isArray(info.decodedCharacters)).toBe(true);
  });
});