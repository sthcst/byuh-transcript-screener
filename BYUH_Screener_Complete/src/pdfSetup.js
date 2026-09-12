import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

// Keep PDF extraction self-contained. The screener component currently points
// at a CDN worker; importing this module after the component replaces that
// remote URL with the worker bundled by Webpack/Electron.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDF_OPERATION_TIMEOUT_MS = 15000;

const withTimeout = (promise, label) => {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out after ${Math.round(PDF_OPERATION_TIMEOUT_MS / 1000)} seconds. Please try the PDF again.`
        )
      );
    }, PDF_OPERATION_TIMEOUT_MS);
  });

  return Promise.race([Promise.resolve(promise), timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
};

const patchAsyncMethod = (prototype, methodName, labelFactory) => {
  if (!prototype || typeof prototype[methodName] !== 'function') {
    console.warn(`PDF.js watchdog could not patch ${methodName}.`);
    return;
  }

  const marker = `__byuh_${methodName}_watchdog__`;
  if (prototype[marker]) return;

  const originalMethod = prototype[methodName];

  prototype[methodName] = function patchedPdfMethod(...args) {
    let operation;

    try {
      operation = originalMethod.apply(this, args);
    } catch (error) {
      return Promise.reject(error);
    }

    return withTimeout(operation, labelFactory.call(this, ...args));
  };

  Object.defineProperty(prototype, marker, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false,
  });
};

// TranscriptScreener_Beautiful calls these methods while walking every page.
// If PDF.js or its worker stops responding, its existing catch blocks now get
// a normal error instead of leaving the UI on "Extracting data..." forever.
patchAsyncMethod(
  pdfjsLib.PDFDocumentProxy && pdfjsLib.PDFDocumentProxy.prototype,
  'getPage',
  (pageNumber) => `Loading PDF page ${pageNumber}`
);

patchAsyncMethod(
  pdfjsLib.PDFPageProxy && pdfjsLib.PDFPageProxy.prototype,
  'getTextContent',
  function getTextContentLabel() {
    return `Extracting text from PDF page ${this.pageNumber || '?'}`;
  }
);

export { PDF_OPERATION_TIMEOUT_MS };
