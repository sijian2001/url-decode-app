/**
 * UrlDecoder service - RFC 3986 compliant URL decoding
 */
export class UrlDecoder {
  /**
   * Decode a percent-encoded URL string
   * @param {string} input - The encoded URL string to decode
   * @returns {string} The decoded URL string
   */
  static decode(input) {
    if (!input || typeof input !== 'string') {
      return '';
    }

    try {
      // Use decodeURIComponent for RFC 3986 compliance
      return decodeURIComponent(input);
    } catch (error) {
      throw new Error(`Decoding failed: Invalid encoding sequence`);
    }
  }

  /**
   * Validate if input contains valid percent-encoding
   * @param {string} input - The input to validate
   * @returns {boolean} True if input is valid
   */
  static isValidEncodedInput(input) {
    if (typeof input !== 'string') {
      return false;
    }

    // Check for invalid percent-encoding patterns
    const invalidPatterns = [
      /%[^0-9A-Fa-f]/,  // % followed by non-hex
      /%[0-9A-Fa-f]$/,  // % followed by single hex digit at end
      /%$/              // trailing %
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(input)) {
        return false;
      }
    }

    // Check for incomplete percent sequences
    const percentMatches = input.match(/%/g);
    const completeMatches = input.match(/%[0-9A-Fa-f]{2}/g);

    if (percentMatches && completeMatches) {
      return percentMatches.length === completeMatches.length;
    }

    // If no percent signs, it's valid (normal text)
    return !percentMatches;
  }

  /**
   * Get detailed information about the decoding operation
   * @param {string} input - The input string to analyze
   * @returns {Object} Decoding information object
   */
  static getDecodingInfo(input) {
    if (typeof input !== 'string') {
      throw new Error('Invalid input type');
    }

    const isValidEncoding = this.isValidEncodedInput(input);
    const hasEncodedChars = /%[0-9A-Fa-f]{2}/.test(input);

    let decodedLength = 0;
    let decodedCharacters = [];

    if (isValidEncoding) {
      try {
        const decoded = this.decode(input);
        decodedLength = decoded.length;

        // Extract characters that were decoded from percent-encoding
        const matches = input.match(/%[0-9A-Fa-f]{2}/g);
        if (matches) {
          decodedCharacters = matches.map(match => {
            try {
              return decodeURIComponent(match);
            } catch {
              return match;
            }
          });
        }
      } catch {
        // Decoding failed, but we can still provide basic info
        decodedLength = 0;
      }
    }

    return {
      encodedLength: input.length,
      decodedLength,
      decodedCharacters,
      hasEncodedChars,
      isValidEncoding
    };
  }
}