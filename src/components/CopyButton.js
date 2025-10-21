/**
 * CopyButton component - Handles copying text to clipboard
 */
export class CopyButton {
  constructor(buttonId, textSource) {
    this.button = document.getElementById(buttonId);
    if (!this.button) {
      throw new Error(`Button with id "${buttonId}" not found`);
    }

    this.textSource = textSource;
    this.resetTimeout = null;
    this.render();
    this.setupEventListeners();
  }

  /**
   * Render the copy button HTML structure
   */
  render() {
    // Use existing structure from ResultDisplay
    // Don't recreate the spans, just find them
    this.copyText = this.button.querySelector('.copy-text');
    this.copySuccess = this.button.querySelector('.copy-success');
    this.copyError = this.button.querySelector('.copy-error');

    // Verify all required elements exist
    if (!this.copyText || !this.copySuccess || !this.copyError) {
      console.error('Copy button missing required elements');
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    this.button.addEventListener('click', async (event) => {
      event.preventDefault();
      await this.handleCopyClick();
    });
  }

  /**
   * Handle copy button click
   */
  async handleCopyClick() {
    // Dispatch copy attempt event
    this.dispatchEvent('copyAttempt');

    try {
      const success = await this.copyToClipboard();
      if (success) {
        this.showSuccess();
        this.dispatchEvent('copySuccess');
      } else {
        this.showError();
        this.dispatchEvent('copyError');
      }
    } catch (error) {
      this.showError();
      this.dispatchEvent('copyError', { error: error.message });
    }
  }

  /**
   * Copy text to clipboard
   * @returns {Promise<boolean>} Promise resolving to success status
   */
  async copyToClipboard() {
    try {
      let textToCopy = this.textSource;

      // If textSource is a string, use it directly
      if (typeof this.textSource === 'string') {
        textToCopy = this.textSource;
      }
      // If it's a function, call it to get the text
      else if (typeof this.textSource === 'function') {
        textToCopy = this.textSource();
      }
      // If it's an element ID, get the element's value
      else if (typeof this.textSource === 'string') {
        const element = document.getElementById(this.textSource);
        if (element) {
          textToCopy = element.value || element.textContent;
        }
      }

      // Use the Clipboard API if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        return true;
      }

      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;

    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  }

  /**
   * Show success feedback
   */
  showSuccess() {
    this.copyText.hidden = true;
    this.copyError.hidden = true;
    this.copySuccess.hidden = false;

    this.button.classList.add('success');

    // Auto-reset after 2 seconds
    this.scheduleReset(2000);
  }

  /**
   * Show error feedback
   */
  showError() {
    this.copyText.hidden = true;
    this.copySuccess.hidden = true;
    this.copyError.hidden = false;

    this.button.classList.add('error');

    // Auto-reset after 3 seconds
    this.scheduleReset(3000);
  }

  /**
   * Reset to default state
   */
  reset() {
    // Clear any pending reset
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.copyText.hidden = false;
    this.copySuccess.hidden = true;
    this.copyError.hidden = true;

    this.button.classList.remove('success', 'error');
  }

  /**
   * Schedule automatic reset
   * @param {number} delay - Delay in milliseconds
   */
  scheduleReset(delay) {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.resetTimeout = setTimeout(() => {
      this.reset();
    }, delay);
  }

  /**
   * Enable or disable the button
   * @param {boolean} enabled - Whether button should be enabled
   */
  setEnabled(enabled) {
    this.button.disabled = !enabled;
  }

  /**
   * Update the text to copy
   * @param {string} text - New text to copy
   */
  setText(text) {
    this.textSource = text;
  }

  /**
   * Dispatch custom events
   * @param {string} eventType - Type of event
   * @param {Object} detail - Event detail data
   */
  dispatchEvent(eventType, detail = {}) {
    const event = new CustomEvent(eventType, {
      detail,
      bubbles: true
    });
    this.button.dispatchEvent(event);
  }
}