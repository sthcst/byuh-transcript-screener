// Electron 27 bundles Chromium 118, which predates several Promise methods
// pdfjs-dist relies on internally: Promise.withResolvers (Chrome 119) and
// Promise.try (Chrome 128). Without these, PDF parsing either throws
// immediately or - worse - throws inside an internal async message handler
// whose rejection is never surfaced, leaving parsing hung forever. Must be
// imported before any module that touches pdfjs-dist.
if (typeof Promise.withResolvers !== 'function') {
  Promise.withResolvers = function withResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (typeof Promise.try !== 'function') {
  Promise.try = function (fn, ...args) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

// pdfjs-dist also uses the Uint8Array base64/hex methods (landed in Chrome
// 133+/137+), well past Chromium 118. Only the plain (no-options) forms it
// actually calls are polyfilled here.
if (typeof Uint8Array.prototype.toBase64 !== 'function') {
  Uint8Array.prototype.toBase64 = function toBase64() {
    let binary = '';
    for (let i = 0; i < this.length; i++) binary += String.fromCharCode(this[i]);
    return btoa(binary);
  };
}

if (typeof Uint8Array.fromBase64 !== 'function') {
  Uint8Array.fromBase64 = function fromBase64(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };
}

if (typeof Uint8Array.prototype.toHex !== 'function') {
  Uint8Array.prototype.toHex = function toHex() {
    return Array.from(this, (b) => b.toString(16).padStart(2, '0')).join('');
  };
}

// pdfjs-dist iterates ReadableStreams with `for await...of`, which needs
// ReadableStream's Symbol.asyncIterator (landed in Chrome 124).
if (typeof ReadableStream.prototype[Symbol.asyncIterator] !== 'function') {
  ReadableStream.prototype[Symbol.asyncIterator] = function asyncIterator() {
    const reader = this.getReader();
    return {
      next: () => reader.read(),
      return: (value) => {
        reader.releaseLock();
        return Promise.resolve({ done: true, value });
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  };
}
