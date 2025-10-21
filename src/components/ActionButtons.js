/**
 * ActionButtons component - Encode, decode, and clear buttons
 */
export class ActionButtons {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.callbacks = {
      encode: [],
      decode: [],
      clear: []
    };

    this.render();
    this.setupEventListeners();
  }

  /**
   * Render the action buttons HTML structure
   */
  render() {
    this.container.innerHTML = `
      <div class="action-buttons-container">
        <button id="encode-btn" class="btn btn-primary" aria-label="Encode URL" tabindex="0">
          <span>Encode URL</span>
          <div class="loading-spinner" hidden></div>
        </button>
        <button id="decode-btn" class="btn btn-primary" aria-label="Decode URL" tabindex="0">
          <span>Decode URL</span>
          <div class="loading-spinner" hidden></div>
        </button>
        <button id="clear-btn" class="btn btn-secondary" aria-label="Clear input">
          Clear
        </button>
      </div>
    `;

    this.encodeBtn = this.container.querySelector('#encode-btn');
    this.decodeBtn = this.container.querySelector('#decode-btn');
    this.clearBtn = this.container.querySelector('#clear-btn');
  }

  /**
   * Set up event listeners for all buttons
   */
  setupEventListeners() {
    this.encodeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.notifyCallbacks('encode');
    });

    this.decodeBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.notifyCallbacks('decode');
    });

    this.clearBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.notifyCallbacks('clear');
    });
  }

  /**
   * Notify callbacks for the specified action
   * @param {string} action - The action type ('encode', 'decode', 'clear')
   */
  notifyCallbacks(action) {
    const actionCallbacks = this.callbacks[action] || [];
    actionCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Error in ${action} callback:`, error);
      }
    });
  }

  /**
   * Register a callback for encode button clicks
   * @param {Function} callback - Function to call on encode
   */
  onEncode(callback) {
    if (typeof callback === 'function') {
      this.callbacks.encode.push(callback);
    }
  }

  /**
   * Register a callback for decode button clicks
   * @param {Function} callback - Function to call on decode
   */
  onDecode(callback) {
    if (typeof callback === 'function') {
      this.callbacks.decode.push(callback);
    }
  }

  /**
   * Register a callback for clear button clicks
   * @param {Function} callback - Function to call on clear
   */
  onClear(callback) {
    if (typeof callback === 'function') {
      this.callbacks.clear.push(callback);
    }
  }

  /**
   * Enable or disable all action buttons
   * @param {boolean} enabled - Whether buttons should be enabled
   */
  setEnabled(enabled) {
    this.encodeBtn.disabled = !enabled;
    this.decodeBtn.disabled = !enabled;
    // Clear button is always enabled
  }

  /**
   * Enable or disable the encode button
   * @param {boolean} enabled - Whether button should be enabled
   */
  setEncodeEnabled(enabled) {
    this.encodeBtn.disabled = !enabled;
  }

  /**
   * Enable or disable the decode button
   * @param {boolean} enabled - Whether button should be enabled
   */
  setDecodeEnabled(enabled) {
    this.decodeBtn.disabled = !enabled;
  }

  /**
   * Show processing state for a specific operation
   * @param {string} operation - 'encode' or 'decode'
   */
  showProcessing(operation) {
    let button, spinner, text;

    if (operation === 'encode') {
      button = this.encodeBtn;
      spinner = this.encodeBtn.querySelector('.loading-spinner');
      text = this.encodeBtn.querySelector('span');
    } else if (operation === 'decode') {
      button = this.decodeBtn;
      spinner = this.decodeBtn.querySelector('.loading-spinner');
      text = this.decodeBtn.querySelector('span');
    } else {
      return;
    }

    if (spinner && text) {
      spinner.hidden = false;
      text.style.opacity = '0.6';
      button.disabled = true;
      button.classList.add('processing');
    }
  }

  /**
   * Hide processing state for all buttons
   */
  hideProcessing() {
    [this.encodeBtn, this.decodeBtn].forEach(button => {
      const spinner = button.querySelector('.loading-spinner');
      const text = button.querySelector('span');

      if (spinner && text) {
        spinner.hidden = true;
        text.style.opacity = '1';
        button.classList.remove('processing');
        // Re-enable the button; main logic may adjust afterward
        button.disabled = false;
      }
    });

    // Re-enable buttons based on current input state
    // This will be handled by the main application logic
  }

  /**
   * Reset all buttons to default state
   */
  reset() {
    this.hideProcessing();
    this.setEnabled(false);
  }
}
