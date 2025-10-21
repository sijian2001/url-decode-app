/**
 * Validator service - Input validation and sanitization
 */
export class Validator {
  /**
   * Validate if a string is a well-formed URL
   * @param {string} input - The string to validate as URL
   * @returns {boolean} True if input is a valid URL
   */
  static isValidUrl(input) {
    if (!input || typeof input !== 'string') {
      return false;
    }

    try {
      const url = new URL(input);
      // Check for common URL protocols
      const validProtocols = ['http:', 'https:', 'ftp:', 'mailto:', 'file:'];
      return validProtocols.includes(url.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Check if string is empty or contains only whitespace
   * @param {string} input - The string to check
   * @returns {boolean} True if string is empty or whitespace-only
   */
  static isEmpty(input) {
    if (typeof input !== 'string') {
      return true;
    }
    return input.trim().length === 0;
  }

  /**
   * Check for potentially dangerous characters
   * @param {string} input - The string to check
   * @returns {boolean} True if string contains invalid characters
   */
  static hasInvalidChars(input) {
    if (typeof input !== 'string') {
      return false;
    }

    // Check for script tags and javascript: protocol
    const dangerousPatterns = [
      /<script[^>]*>/i,
      /<\/script>/i,
      /javascript:/i,
      /<iframe[^>]*>/i,
      /<object[^>]*>/i,
      /<embed[^>]*>/i,
      /on\w+\s*=/i  // Event handlers like onclick=
    ];

    return dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check if string exceeds maximum allowed length
   * @param {string} input - The string to check
   * @param {number} maxLength - Maximum allowed length
   * @returns {boolean} True if string exceeds length limit
   */
  static exceedsLength(input, maxLength) {
    if (typeof input !== 'string' || typeof maxLength !== 'number') {
      return false;
    }
    return input.length > maxLength;
  }

  /**
   * Sanitize user input by removing dangerous content
   * @param {string} input - The string to sanitize
   * @returns {string} Sanitized string
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }

    // Remove script tags and their content
    let sanitized = input.replace(/<script[^>]*>.*?<\/script>/gi, '');

    // Remove other potentially dangerous tags
    sanitized = sanitized.replace(/<(iframe|object|embed)[^>]*>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    return sanitized;
  }

  /**
   * Comprehensive input validation
   * @param {string} input - The input to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result with details
   */
  static validateInput(input, options = {}) {
    const {
      maxLength = 10000,
      allowEmpty = true,
      requireUrl = false
    } = options;

    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Type check
    if (typeof input !== 'string') {
      result.isValid = false;
      result.errors.push('Input must be a string');
      return result;
    }

    // Empty check
    if (this.isEmpty(input)) {
      if (!allowEmpty) {
        result.isValid = false;
        result.errors.push('Input cannot be empty');
      }
      return result;
    }

    // Length check
    if (this.exceedsLength(input, maxLength)) {
      result.isValid = false;
      result.errors.push(`Input exceeds maximum length of ${maxLength} characters`);
    }

    // URL format check
    if (requireUrl && !this.isValidUrl(input)) {
      result.warnings.push('Input does not appear to be a valid URL');
    }

    // Security check
    if (this.hasInvalidChars(input)) {
      result.warnings.push('Input contains potentially unsafe content');
    }

    return result;
  }
}