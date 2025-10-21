# Component Interface Contracts

## UrlInput Component

### Interface
```javascript
class UrlInput {
  constructor(containerId)
  getValue(): string
  setValue(value: string): void
  clear(): void
  focus(): void
  onInput(callback: (value: string) => void): void
  setPlaceholder(text: string): void
  isValid(): boolean
  isEmpty(): boolean
}
```

### Events
- `input`: Fired when user types in the field
- `clear`: Fired when input is cleared
- `focus`: Fired when input receives focus
- `blur`: Fired when input loses focus

### DOM Contract
```html
<div class="url-input-container">
  <label for="url-input">Enter URL or encoded text:</label>
  <textarea id="url-input" placeholder="Paste your URL here..."></textarea>
  <div class="input-status"></div>
</div>
```

## ActionButtons Component

### Interface
```javascript
class ActionButtons {
  constructor(containerId)
  onEncode(callback: () => void): void
  onDecode(callback: () => void): void
  onClear(callback: () => void): void
  setEnabled(enabled: boolean): void
  setEncodeEnabled(enabled: boolean): void
  setDecodeEnabled(enabled: boolean): void
  showProcessing(operation: string): void
  hideProcessing(): void
}
```

### Events
- `encode`: User clicked encode button
- `decode`: User clicked decode button
- `clear`: User clicked clear button

### DOM Contract
```html
<div class="action-buttons-container">
  <button id="encode-btn" class="btn btn-primary">
    <span>Encode URL</span>
    <div class="loading-spinner" hidden></div>
  </button>
  <button id="decode-btn" class="btn btn-primary">
    <span>Decode URL</span>
    <div class="loading-spinner" hidden></div>
  </button>
  <button id="clear-btn" class="btn btn-secondary">Clear</button>
</div>
```

## ResultDisplay Component

### Interface
```javascript
class ResultDisplay {
  constructor(containerId)
  showResult(result: string, operation: string): void
  hideResult(): void
  getResult(): string | null
  isVisible(): boolean
  setLoading(loading: boolean): void
  showError(message: string): void
  clearError(): void
}
```

### Events
- `resultShown`: Fired when result is displayed
- `resultHidden`: Fired when result is hidden
- `copyRequested`: User wants to copy result

### DOM Contract
```html
<div class="result-display-container">
  <div class="result-header">
    <h3 class="operation-label"></h3>
    <div class="result-meta"></div>
  </div>
  <div class="result-content">
    <textarea class="result-text" readonly></textarea>
    <div class="error-message" hidden></div>
  </div>
  <div class="result-actions">
    <button class="copy-btn">Copy Result</button>
  </div>
</div>
```

## CopyButton Component

### Interface
```javascript
class CopyButton {
  constructor(buttonId, textSource)
  copyToClipboard(): Promise<boolean>
  showSuccess(): void
  showError(): void
  reset(): void
  setEnabled(enabled: boolean): void
  setText(text: string): void
}
```

### Events
- `copySuccess`: Text successfully copied
- `copyError`: Copy operation failed
- `copyAttempt`: User attempted to copy

### DOM Contract
```html
<button class="copy-button" data-text-source="result">
  <span class="copy-text">Copy Result</span>
  <span class="copy-success" hidden>✓ Copied!</span>
  <span class="copy-error" hidden>Copy failed</span>
</button>
```

## Service Layer Contracts

### UrlEncoder Service

```javascript
class UrlEncoder {
  static encode(input: string): string
  static isValidInput(input: string): boolean
  static getEncodingInfo(input: string): EncodingInfo
}

interface EncodingInfo {
  originalLength: number
  encodedLength: number
  encodedCharacters: string[]
  hasSpecialChars: boolean
}
```

### UrlDecoder Service

```javascript
class UrlDecoder {
  static decode(input: string): string
  static isValidEncodedInput(input: string): boolean
  static getDecodingInfo(input: string): DecodingInfo
}

interface DecodingInfo {
  encodedLength: number
  decodedLength: number
  decodedCharacters: string[]
  hasEncodedChars: boolean
  isValidEncoding: boolean
}
```

### Validator Service

```javascript
class Validator {
  static isValidUrl(input: string): boolean
  static isEmpty(input: string): boolean
  static hasInvalidChars(input: string): boolean
  static exceedsLength(input: string, maxLength: number): boolean
  static sanitizeInput(input: string): string
}
```

## Event Contracts

### Application Events
```javascript
// Custom events for component communication
const AppEvents = {
  INPUT_CHANGED: 'app:input-changed',
  ENCODE_REQUESTED: 'app:encode-requested',
  DECODE_REQUESTED: 'app:decode-requested',
  OPERATION_COMPLETE: 'app:operation-complete',
  OPERATION_ERROR: 'app:operation-error',
  COPY_REQUESTED: 'app:copy-requested',
  COPY_COMPLETE: 'app:copy-complete'
};
```

### Event Data Structures
```javascript
interface InputChangedEvent {
  detail: {
    value: string,
    isEmpty: boolean,
    isValid: boolean
  }
}

interface OperationCompleteEvent {
  detail: {
    operation: 'encode' | 'decode',
    input: string,
    result: string,
    timestamp: Date
  }
}

interface OperationErrorEvent {
  detail: {
    operation: 'encode' | 'decode',
    input: string,
    error: string,
    timestamp: Date
  }
}
```

## CSS Contract

### Required CSS Classes
```css
/* Component container classes */
.url-input-container { }
.action-buttons-container { }
.result-display-container { }

/* State classes */
.loading { }
.error { }
.success { }
.disabled { }
.hidden { }

/* Component-specific classes */
.btn { }
.btn-primary { }
.btn-secondary { }
.result-text { }
.copy-button { }
.loading-spinner { }
```

### CSS Custom Properties
```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --border-color: #ced4da;
  --text-color: #212529;
  --bg-color: #ffffff;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
}
```