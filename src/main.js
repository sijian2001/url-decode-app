import { UrlInput } from './components/UrlInput.js';
import { ActionButtons } from './components/ActionButtons.js';
import { ResultDisplay } from './components/ResultDisplay.js';
import { CopyButton } from './components/CopyButton.js';
import { UrlEncoder } from './services/urlEncoder.js';
import { UrlDecoder } from './services/urlDecoder.js';
import { Validator } from './services/validator.js';

/**
 * Main Application Class
 * Orchestrates all components and manages application state
 */
class UrlCodecApp {
  constructor() {
    this.components = {};
    this.state = {
      currentInput: '',
      currentResult: null,
      lastOperation: null,
      isProcessing: false
    };

    this.initializationPromise = this.initialize();
  }

  /**
   * Initialize the application
   */
  initialize() {
    try {
      this.showLoading();
      this.initializeComponents();
      this.setupEventListeners();
      this.setupKeyboardShortcuts();
      this.hideLoading();

      // Initialize button states based on current input
      const initialValue = this.components.urlInput.getValue();
      this.handleInputChange(initialValue);

      // Focus input field for better UX
      if (this.components.urlInput) {
        this.components.urlInput.focus();
      }

    } catch (error) {
      console.error('App initialization failed:', error);
      this.showError('アプリケーションの初期化に失敗しました。ページをリロードしてください。');
    }
  }

  /**
   * Show loading indicator
   */
  showLoading() {
    const loadingEl = document.getElementById('app-loading');
    const appEl = document.getElementById('app');

    if (loadingEl && appEl) {
      loadingEl.style.display = 'flex';
      appEl.style.display = 'none';
    }
    // No artificial delay to ensure components are ready immediately for tests
  }

  /**
   * Hide loading indicator
   */
  hideLoading() {
    const loadingEl = document.getElementById('app-loading');
    const appEl = document.getElementById('app');

    if (loadingEl && appEl) {
      loadingEl.style.display = 'none';
      appEl.style.display = 'block';
    }
  }

  /**
   * Show error message
   */
  async showError(message) {
    const errorEl = document.getElementById('app-error');
    const messageEl = document.getElementById('error-message');
    const appEl = document.getElementById('app');
    const loadingEl = document.getElementById('app-loading');

    if (errorEl && messageEl) {
      messageEl.textContent = message;
      errorEl.hidden = false;

      if (appEl) appEl.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'none';

      // Setup retry button
      const retryBtn = document.getElementById('retry-btn');
      if (retryBtn) {
        retryBtn.onclick = () => {
          errorEl.hidden = true;
          this.initialize();
        };
      }
    }
  }

  /**
   * Initialize all components
   */
  initializeComponents() {
    // Initialize main components with error handling for each
    try {
      this.components.urlInput = new UrlInput('url-input-container');
    } catch (error) {
      console.error('UrlInput initialization failed:', error);
      throw new Error('URL入力コンポーネントの初期化に失敗しました');
    }

    try {
      this.components.actionButtons = new ActionButtons('action-buttons-container');
    } catch (error) {
      console.error('ActionButtons initialization failed:', error);
      throw new Error('ボタンコンポーネントの初期化に失敗しました');
    }

    try {
      this.components.resultDisplay = new ResultDisplay('result-display-container');
    } catch (error) {
      console.error('ResultDisplay initialization failed:', error);
      throw new Error('結果表示コンポーネントの初期化に失敗しました');
    }

    // Initialize copy button - this is optional
    this.initializeCopyButton();
  }

  /**
   * Initialize copy button functionality
   * This is called separately because the button is initially hidden
   */
  initializeCopyButton() {
    try {
      const copyBtn = document.getElementById('copy-btn');
      if (copyBtn) {
        this.components.copyButton = new CopyButton('copy-btn', () => {
          return this.components.resultDisplay.getResult() || '';
        });
      }
    } catch (error) {
      console.warn('CopyButton initialization skipped:', error.message);
      // Don't throw - copy button is not critical for initial load
    }
  }

  /**
   * Set up event listeners for component interactions
   */
  setupEventListeners() {
    // Input change handlers
    this.components.urlInput.onInput((value) => {
      this.handleInputChange(value);
    });

    // Action button handlers
    this.components.actionButtons.onEncode(() => {
      this.handleEncode();
    });

    this.components.actionButtons.onDecode(() => {
      this.handleDecode();
    });

    this.components.actionButtons.onClear(() => {
      this.handleClear();
    });

    // Result display events
    document.addEventListener('copyRequested', () => {
      this.handleCopyRequest();
    });

    // Error handling
    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    });
  }

  /**
   * Set up keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Enter: Encode
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!this.components.urlInput.isEmpty()) {
          this.handleEncode();
        }
      }

      // Ctrl/Cmd + Shift + Enter: Decode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
        if (!this.components.urlInput.isEmpty()) {
          this.handleDecode();
        }
      }

      // Escape: Clear
      if (event.key === 'Escape') {
        event.preventDefault();
        this.handleClear();
      }
    });

    // Enter in the input field triggers encode by default (no modifiers)
    const inputEl = this.components?.urlInput?.textarea;
    if (inputEl) {
      inputEl.addEventListener('keydown', (event) => {
        if (!event.shiftKey && !event.ctrlKey && !event.metaKey && event.key === 'Enter') {
          event.preventDefault();
          if (!this.components.urlInput.isEmpty()) {
            this.handleEncode();
          }
        }
      });
    }
  }

  /**
   * Handle input value changes
   */
  handleInputChange(value) {
    this.state.currentInput = value;

    // Update button states
    const isEmpty = Validator.isEmpty(value);
    this.components.actionButtons.setEncodeEnabled(!isEmpty);
    this.components.actionButtons.setDecodeEnabled(!isEmpty);

    // Clear any previous error when user updates input
    if (this.components?.resultDisplay) {
      this.components.resultDisplay.clearError();
    }

    // Clear previous results when input changes
    if (this.state.currentResult && this.components.resultDisplay.isVisible()) {
      this.components.resultDisplay.hideResult();
      this.state.currentResult = null;
      this.state.lastOperation = null;
    }
  }

  /**
   * Handle encode operation
   */
  async handleEncode() {
    if (this.state.isProcessing) return;

    const input = this.components.urlInput.getValue();
    if (Validator.isEmpty(input)) {
      return;
    }

    try {
      this.state.isProcessing = true;
      this.components.actionButtons.showProcessing('encode');
      this.components.resultDisplay.setLoading(true);

      // Validate input
      const validation = Validator.validateInput(input, { maxLength: 10000 });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Add slight delay for better UX (shows loading state)
      await new Promise(resolve => setTimeout(resolve, 50));

      // Perform encoding
      const encodedResult = UrlEncoder.encode(input);

      // Update state and display
      this.state.currentResult = encodedResult;
      this.state.lastOperation = 'encode';

      this.components.resultDisplay.showResult(encodedResult, 'encode');

    } catch (error) {
      console.error('Encoding error:', error);
      this.components.resultDisplay.showError(
        'エンコードエラー: ' + error.message
      );
    } finally {
      this.state.isProcessing = false;
      // Ensure the result loading indicator is cleared
      if (this.components?.resultDisplay) {
        this.components.resultDisplay.setLoading(false);
      }
      this.components.actionButtons.hideProcessing();
    }
  }

  /**
   * Handle decode operation
   */
  async handleDecode() {
    if (this.state.isProcessing) return;

    const input = this.components.urlInput.getValue();
    if (Validator.isEmpty(input)) {
      return;
    }

    try {
      this.state.isProcessing = true;
      this.components.actionButtons.showProcessing('decode');
      this.components.resultDisplay.setLoading(true);

      // Validate input format
      if (!UrlDecoder.isValidEncodedInput(input)) {
        throw new Error('Invalid encoded input');
      }

      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 50));

      // Perform decoding
      const decodedResult = UrlDecoder.decode(input);

      // Update state and display
      this.state.currentResult = decodedResult;
      this.state.lastOperation = 'decode';

      this.components.resultDisplay.showResult(decodedResult, 'decode');

    } catch (error) {
      console.error('Decoding error:', error);
      this.components.resultDisplay.showError(
        'デコードエラー: ' + error.message
      );
    } finally {
      this.state.isProcessing = false;
      // Ensure the result loading indicator is cleared
      if (this.components?.resultDisplay) {
        this.components.resultDisplay.setLoading(false);
      }
      this.components.actionButtons.hideProcessing();
    }
  }

  /**
   * Handle clear operation
   */
  handleClear() {
    this.components.urlInput.clear();
    this.components.resultDisplay.hideResult();
    this.components.actionButtons.reset();

    // Reset state
    this.state.currentInput = '';
    this.state.currentResult = null;
    this.state.lastOperation = null;

    // Focus input for next operation
    this.components.urlInput.focus();
  }

  /**
   * Handle copy request from result display
   */
  async handleCopyRequest() {
    if (!this.state.currentResult) {
      return;
    }

    try {
      // The CopyButton component handles the actual copying
      // This is just for additional app-level handling if needed
      console.log('Copy requested for:', this.state.currentResult);
    } catch (error) {
      console.error('Copy operation failed:', error);
    }
  }

  /**
   * Get current application state (for debugging)
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Check if app is ready
   */
  isReady() {
    return this.initializationPromise;
  }
}

// Initialize the application when DOM is loaded
let app;

async function initializeApp() {
  // Initialize immediately to support test environment setup
  app = new UrlCodecApp();
  return app;
}

// Auto-initialize when script loads
initializeApp();

// Export for testing
export { UrlCodecApp, initializeApp };

// Global error handling for development
if (import.meta.env?.DEV) {
  window.app = app;
  console.log('Development mode: app instance available as window.app');
}
