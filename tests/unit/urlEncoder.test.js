import { describe, test, expect } from 'vitest';
import { UrlEncoder } from '../../src/services/urlEncoder.js';

describe('UrlEncoder', () => {
  test('encode() should encode standard URL characters', () => {
    const input = 'https://example.com/path?param=hello world';
    const expected = 'https%3A//example.com/path%3Fparam%3Dhello%20world';
    const result = UrlEncoder.encode(input);
    expect(result).toBe(expected);
  });

  test('encode() should handle empty string', () => {
    const input = '';
    const expected = '';
    const result = UrlEncoder.encode(input);
    expect(result).toBe(expected);
  });

  test('encode() should encode special characters correctly', () => {
    const input = 'user@example.com?test=value&other=special!@#$%^&*()';
    const result = UrlEncoder.encode(input);
    expect(result).toContain('%40'); // @ symbol
    expect(result).toContain('%3F'); // ? symbol
    expect(result).toContain('%26'); // & symbol
    expect(result).toContain('%21'); // ! symbol
  });

  test('encode() should be RFC 3986 compliant', () => {
    const input = 'hello world+test@example.com';
    const result = UrlEncoder.encode(input);
    expect(result).toBe('hello%20world%2Btest%40example.com');
  });

  test('isValidInput() should accept any string input', () => {
    expect(UrlEncoder.isValidInput('https://example.com')).toBe(true);
    expect(UrlEncoder.isValidInput('')).toBe(true);
    expect(UrlEncoder.isValidInput('любой текст')).toBe(true);
    expect(UrlEncoder.isValidInput('🚀💫')).toBe(true);
  });

  test('getEncodingInfo() should return correct statistics', () => {
    const input = 'hello world';
    const info = UrlEncoder.getEncodingInfo(input);

    expect(info).toHaveProperty('originalLength');
    expect(info).toHaveProperty('encodedLength');
    expect(info).toHaveProperty('encodedCharacters');
    expect(info).toHaveProperty('hasSpecialChars');

    expect(info.originalLength).toBe(11);
    expect(info.hasSpecialChars).toBe(true);
    expect(Array.isArray(info.encodedCharacters)).toBe(true);
  });
});