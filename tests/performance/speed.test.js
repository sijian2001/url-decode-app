import { describe, test, expect } from 'vitest';
import { UrlEncoder } from '../../src/services/urlEncoder.js';
import { UrlDecoder } from '../../src/services/urlDecoder.js';

describe('Performance Tests - Encoding/Decoding Speed', () => {
  const SPEED_THRESHOLD = 50; // 50ms constitutional requirement

  test('URL encoding should complete within 50ms for typical URLs', () => {
    const testUrls = [
      'https://example.com',
      'https://example.com/path?param=value&other=test',
      'https://user@example.com:8080/path/to/resource?query=value#fragment',
      'mailto:test@example.com?subject=Hello World&body=Test message',
      'ftp://files.example.com/path/to/file.zip'
    ];

    testUrls.forEach(url => {
      const startTime = performance.now();
      const encoded = UrlEncoder.encode(url);
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(SPEED_THRESHOLD);
      expect(encoded).toBeTruthy();
    });
  });

  test('URL decoding should complete within 50ms for typical URLs', () => {
    const encodedUrls = [
      'https%3A//example.com',
      'https%3A//example.com/path%3Fparam%3Dvalue%26other%3Dtest',
      'https%3A//user%40example.com%3A8080/path/to/resource%3Fquery%3Dvalue%23fragment',
      'mailto%3Atest%40example.com%3Fsubject%3DHello%20World%26body%3DTest%20message',
      'ftp%3A//files.example.com/path/to/file.zip'
    ];

    encodedUrls.forEach(encodedUrl => {
      const startTime = performance.now();
      const decoded = UrlDecoder.decode(encodedUrl);
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(SPEED_THRESHOLD);
      expect(decoded).toBeTruthy();
    });
  });

  test('encoding/decoding should handle long URLs efficiently', () => {
    // Create a long URL (2048 characters - typical browser limit)
    const baseUrl = 'https://example.com/very/long/path/';
    const longPath = 'segment/'.repeat(300);
    const queryParams = Array.from({ length: 50 }, (_, i) => `param${i}=value${i}`).join('&');
    const longUrl = baseUrl + longPath + '?' + queryParams;

    expect(longUrl.length).toBeGreaterThan(2000);

    // Test encoding
    const encodeStart = performance.now();
    const encoded = UrlEncoder.encode(longUrl);
    const encodeEnd = performance.now();
    const encodeDuration = encodeEnd - encodeStart;

    expect(encodeDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(encoded).toBeTruthy();

    // Test decoding
    const decodeStart = performance.now();
    const decoded = UrlDecoder.decode(encoded);
    const decodeEnd = performance.now();
    const decodeDuration = decodeEnd - decodeStart;

    expect(decodeDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(decoded).toBe(longUrl);
  });

  test('bulk operations should maintain performance', () => {
    const urls = Array.from({ length: 100 }, (_, i) =>
      `https://example${i}.com/path?param=value${i}&test=data${i}`
    );

    // Bulk encoding test
    const encodeStart = performance.now();
    const encoded = urls.map(url => UrlEncoder.encode(url));
    const encodeEnd = performance.now();
    const totalEncodeDuration = encodeEnd - encodeStart;
    const avgEncodeDuration = totalEncodeDuration / urls.length;

    expect(avgEncodeDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(encoded).toHaveLength(urls.length);

    // Bulk decoding test
    const decodeStart = performance.now();
    const decoded = encoded.map(encodedUrl => UrlDecoder.decode(encodedUrl));
    const decodeEnd = performance.now();
    const totalDecodeDuration = decodeEnd - decodeStart;
    const avgDecodeDuration = totalDecodeDuration / encoded.length;

    expect(avgDecodeDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(decoded).toHaveLength(encoded.length);

    // Verify roundtrip accuracy
    urls.forEach((originalUrl, index) => {
      expect(decoded[index]).toBe(originalUrl);
    });
  });

  test('Unicode and special characters should not impact performance', () => {
    const unicodeUrls = [
      'https://例え.テスト/パス?クエリ=値',
      'https://example.com/путь?запрос=значение',
      'https://مثال.اختبار/مسار?استعلام=قيمة',
      'https://example.com/🚀🌟💫?emoji=🔥&test=⭐',
      'https://example.com/mixed-用户-пользователь-مستخدم?test=value'
    ];

    unicodeUrls.forEach(url => {
      // Encoding performance
      const encodeStart = performance.now();
      const encoded = UrlEncoder.encode(url);
      const encodeEnd = performance.now();
      const encodeDuration = encodeEnd - encodeStart;

      expect(encodeDuration).toBeLessThan(SPEED_THRESHOLD);
      expect(encoded).toBeTruthy();

      // Decoding performance
      const decodeStart = performance.now();
      const decoded = UrlDecoder.decode(encoded);
      const decodeEnd = performance.now();
      const decodeDuration = decodeEnd - decodeStart;

      expect(decodeDuration).toBeLessThan(SPEED_THRESHOLD);
      expect(decoded).toBe(url);
    });
  });

  test('error cases should not cause performance degradation', () => {
    const invalidInputs = [
      'hello%GGworld', // Invalid hex
      'test%',         // Incomplete percent encoding
      '%',             // Lone percent
      'text%2',        // Incomplete sequence
      '',              // Empty string
      ' '.repeat(1000) // Long whitespace
    ];

    invalidInputs.forEach(input => {
      const start = performance.now();

      try {
        UrlDecoder.decode(input);
      } catch (error) {
        // Errors are expected for invalid inputs
      }

      const end = performance.now();
      const duration = end - start;

      // Even error cases should be fast
      expect(duration).toBeLessThan(SPEED_THRESHOLD);
    });
  });

  test('getEncodingInfo and getDecodingInfo should be performant', () => {
    const testUrl = 'https://example.com/path?param=hello world&other=test@example.com';

    // Test encoding info performance
    const encodingInfoStart = performance.now();
    const encodingInfo = UrlEncoder.getEncodingInfo(testUrl);
    const encodingInfoEnd = performance.now();
    const encodingInfoDuration = encodingInfoEnd - encodingInfoStart;

    expect(encodingInfoDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(encodingInfo).toHaveProperty('originalLength');
    expect(encodingInfo).toHaveProperty('encodedLength');

    // Test decoding info performance
    const encodedUrl = UrlEncoder.encode(testUrl);
    const decodingInfoStart = performance.now();
    const decodingInfo = UrlDecoder.getDecodingInfo(encodedUrl);
    const decodingInfoEnd = performance.now();
    const decodingInfoDuration = decodingInfoEnd - decodingInfoStart;

    expect(decodingInfoDuration).toBeLessThan(SPEED_THRESHOLD);
    expect(decodingInfo).toHaveProperty('encodedLength');
    expect(decodingInfo).toHaveProperty('decodedLength');
  });
});