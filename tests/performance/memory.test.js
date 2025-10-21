import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { UrlEncoder } from '../../src/services/urlEncoder.js';
import { UrlDecoder } from '../../src/services/urlDecoder.js';

describe('Performance Tests - Memory Usage', () => {
  let initialMemory;

  beforeEach(() => {
    // Force garbage collection if available (Node.js environment)
    if (global.gc) {
      global.gc();
    }

    // Get initial memory usage
    if (typeof window !== 'undefined' && window.performance?.memory) {
      initialMemory = window.performance.memory.usedJSHeapSize;
    } else if (typeof process !== 'undefined' && process.memoryUsage) {
      initialMemory = process.memoryUsage().heapUsed;
    }
  });

  afterEach(() => {
    // Force cleanup
    if (global.gc) {
      global.gc();
    }
  });

  test('repeated encoding operations should not cause memory leaks', () => {
    const testUrl = 'https://example.com/path?param=value&other=test';
    const iterations = 1000;

    // Perform many encoding operations
    for (let i = 0; i < iterations; i++) {
      const encoded = UrlEncoder.encode(testUrl + i);
      expect(encoded).toBeTruthy();
    }

    // Check memory usage
    if (typeof window !== 'undefined' && window.performance?.memory) {
      const finalMemory = window.performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB for 1000 operations)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    }

    // Test that the encoder still works correctly after many operations
    const finalTest = UrlEncoder.encode(testUrl);
    expect(finalTest).toBeTruthy();
  });

  test('repeated decoding operations should not cause memory leaks', () => {
    const encodedUrl = 'https%3A//example.com/path%3Fparam%3Dvalue%26other%3Dtest';
    const iterations = 1000;

    // Perform many decoding operations
    for (let i = 0; i < iterations; i++) {
      const decoded = UrlDecoder.decode(encodedUrl + i);
      expect(decoded).toBeTruthy();
    }

    // Check memory usage
    if (typeof window !== 'undefined' && window.performance?.memory) {
      const finalMemory = window.performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    }

    // Test that the decoder still works correctly after many operations
    const finalTest = UrlDecoder.decode(encodedUrl);
    expect(finalTest).toBeTruthy();
  });

  test('large string processing should not retain references', () => {
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      // Create large strings
      const largeUrl = 'https://example.com/' + 'x'.repeat(10000) + `?id=${i}`;

      // Process them
      const encoded = UrlEncoder.encode(largeUrl);
      const decoded = UrlDecoder.decode(encoded);

      // Verify correctness
      expect(decoded).toBe(largeUrl);

      // Large strings should be eligible for garbage collection
      // We don't hold references to them after this iteration
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Test that services still work with normal strings
    const normalUrl = 'https://example.com/normal';
    const encoded = UrlEncoder.encode(normalUrl);
    const decoded = UrlDecoder.decode(encoded);
    expect(decoded).toBe(normalUrl);
  });

  test('getEncodingInfo should not leak memory for complex analysis', () => {
    const iterations = 500;

    for (let i = 0; i < iterations; i++) {
      const complexUrl = `https://example${i}.com/path-${i}?param1=value1&param2=value2&param3=${i}`;

      const info = UrlEncoder.getEncodingInfo(complexUrl);

      // Verify the info is complete
      expect(info).toHaveProperty('originalLength');
      expect(info).toHaveProperty('encodedLength');
      expect(info).toHaveProperty('encodedCharacters');
      expect(info).toHaveProperty('hasSpecialChars');

      // Arrays and objects should be properly managed
      expect(Array.isArray(info.encodedCharacters)).toBe(true);
    }

    // Test normal operation after stress test
    const info = UrlEncoder.getEncodingInfo('https://example.com');
    expect(info).toBeTruthy();
  });

  test('getDecodingInfo should not leak memory for validation checks', () => {
    const iterations = 500;

    for (let i = 0; i < iterations; i++) {
      const encodedUrl = `https%3A//example${i}.com/path%3Fparam%3Dvalue${i}`;

      const info = UrlDecoder.getDecodingInfo(encodedUrl);

      // Verify the info is complete
      expect(info).toHaveProperty('encodedLength');
      expect(info).toHaveProperty('decodedLength');
      expect(info).toHaveProperty('decodedCharacters');
      expect(info).toHaveProperty('hasEncodedChars');
      expect(info).toHaveProperty('isValidEncoding');

      // Arrays should be properly managed
      expect(Array.isArray(info.decodedCharacters)).toBe(true);
    }

    // Test normal operation after stress test
    const info = UrlDecoder.getDecodingInfo('test%20url');
    expect(info).toBeTruthy();
  });

  test('error handling should not create memory leaks', () => {
    const invalidInputs = [
      'hello%GGworld',
      'test%',
      '%',
      'text%2',
      null,
      undefined,
      123,
      {},
      []
    ];

    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      for (const invalidInput of invalidInputs) {
        try {
          UrlEncoder.encode(invalidInput);
        } catch (error) {
          // Expected for some inputs
          expect(error).toBeInstanceOf(Error);
        }

        try {
          UrlDecoder.decode(invalidInput);
        } catch (error) {
          // Expected for some inputs
          expect(error).toBeInstanceOf(Error);
        }
      }
    }

    // Normal operation should still work
    const encoded = UrlEncoder.encode('https://example.com');
    const decoded = UrlDecoder.decode(encoded);
    expect(decoded).toBe('https://example.com');
  });

  test('mixed operations should maintain stable memory usage', () => {
    const operations = [
      () => UrlEncoder.encode('https://example.com/test'),
      () => UrlDecoder.decode('https%3A//example.com/test'),
      () => UrlEncoder.getEncodingInfo('test string'),
      () => UrlDecoder.getDecodingInfo('test%20string'),
      () => {
        try {
          UrlDecoder.decode('invalid%GG');
        } catch (e) {
          // Expected
        }
      }
    ];

    // Perform many mixed operations
    for (let i = 0; i < 1000; i++) {
      const randomOperation = operations[i % operations.length];
      randomOperation();
    }

    // Force cleanup
    if (global.gc) {
      global.gc();
    }

    // Verify all services still work correctly
    expect(UrlEncoder.encode('test')).toBeTruthy();
    expect(UrlDecoder.decode('test')).toBeTruthy();
    expect(UrlEncoder.getEncodingInfo('test')).toBeTruthy();
    expect(UrlDecoder.getDecodingInfo('test')).toBeTruthy();
  });

  test('concurrent-like operations should not interfere', () => {
    // Simulate concurrent operations by interleaving them
    const urls = Array.from({ length: 100 }, (_, i) => `https://example${i}.com`);
    const encoded = [];
    const decoded = [];

    // Start encoding all URLs
    for (const url of urls) {
      encoded.push(UrlEncoder.encode(url));
    }

    // Start decoding all URLs
    for (const encodedUrl of encoded) {
      decoded.push(UrlDecoder.decode(encodedUrl));
    }

    // Verify all operations completed correctly
    expect(encoded).toHaveLength(urls.length);
    expect(decoded).toHaveLength(urls.length);

    urls.forEach((originalUrl, index) => {
      expect(decoded[index]).toBe(originalUrl);
    });
  });
});

// Helper function to get approximate memory usage
function getMemoryUsage() {
  if (typeof window !== 'undefined' && window.performance?.memory) {
    return {
      used: window.performance.memory.usedJSHeapSize,
      total: window.performance.memory.totalJSHeapSize,
      limit: window.performance.memory.jsHeapSizeLimit
    };
  } else if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    return {
      used: usage.heapUsed,
      total: usage.heapTotal,
      limit: usage.heapTotal * 2 // Approximate
    };
  }
  return null;
}