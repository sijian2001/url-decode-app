import { Validator } from '../services/validator.js';

/**
 * UrlInput component - Handles URL input with validation
 */
export class UrlInput {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.inputCallbacks = [];
    this.render();
    this.setupEventListeners();
  }

  /**
   * Render the input component HTML structure
   */
  render() {
    this.container.innerHTML = `
      <div class="url-input-container">
        <label for="url-input">Enter URL or encoded text:</label>
        <textarea
          id="url-input"
          placeholder="Paste your URL here..."
          rows="3"
          aria-label="URL input field"
        ></textarea>
        <div class="input-status" aria-live="polite"></div>
      </div>
    `;

    this.textarea = this.container.querySelector('#url-input');
    this.statusDiv = this.container.querySelector('.input-status');
  }

  /**
   * Set up event listeners for the input
   */
  setupEventListeners() {
    this.textarea.addEventListener('input', (event) => {
      const value = event.target.value;
      this.updateStatus(value);
      this.notifyCallbacks(value);
    });

    this.textarea.addEventListener('focus', () => {
      this.container.classList.add('focused');
    });

    this.textarea.addEventListener('blur', () => {
      this.container.classList.remove('focused');
    });
  }

  /**
   * Update the status display based on input value
   * @param {string} value - Current input value
   */
  updateStatus(value) {
    if (!value) {
      this.statusDiv.textContent = '';
      this.statusDiv.className = 'input-status';
      return;
    }

    const validation = Validator.validateInput(value, {
      maxLength: 10000,
      allowEmpty: true
    });

    if (validation.warnings.length > 0) {
      this.statusDiv.textContent = validation.warnings[0];
      this.statusDiv.className = 'input-status warning';
    } else {
      this.statusDiv.textContent = `${value.length} characters`;
      this.statusDiv.className = 'input-status valid';
    }
  }

  /**
   * Notify all registered callbacks about input changes
   * @param {string} value - Current input value
   */
  notifyCallbacks(value) {
    this.inputCallbacks.forEach(callback => {
      try {
        callback(value);
      } catch (error) {
        console.error('Error in input callback:', error);
      }
    });
  }

  /**
   * Get the current input value
   * @returns {string} Current input value
   */
  getValue() {
    return this.textarea.value;
  }

  /**
   * Set the input value
   * @param {string} value - Value to set
   */
  setValue(value) {
    this.textarea.value = value || '';
    this.updateStatus(this.textarea.value);
    this.notifyCallbacks(this.textarea.value);
  }

  /**
   * Clear the input field
   */
  clear() {
    this.setValue('');
  }

  /**
   * Focus the input field
   */
  focus() {
    this.textarea.focus();
  }

  /**
   * Register a callback for input events
   * @param {Function} callback - Function to call on input change
   */
  onInput(callback) {
    if (typeof callback === 'function') {
      this.inputCallbacks.push(callback);
    }
  }

  /**
   * Set the placeholder text
   * @param {string} text - Placeholder text
   */
  setPlaceholder(text) {
    this.textarea.placeholder = text;
  }

  /**
   * Check if current input is valid
   * @returns {boolean} True if input is valid
   */
  isValid() {
    const value = this.getValue();
    const validation = Validator.validateInput(value);
    return validation.isValid;
  }

  /**
   * Check if input is empty
   * @returns {boolean} True if input is empty
   */
  isEmpty() {
    return Validator.isEmpty(this.getValue());
  }
}