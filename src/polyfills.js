// Electron 27 bundles Chromium 118, which predates Promise.withResolvers
// (added in Chrome 119). pdfjs-dist relies on it internally, so without
// this polyfill PDF parsing fails with "Promise.withResolvers is not a
// function". Must be imported before any module that touches pdfjs-dist.
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
