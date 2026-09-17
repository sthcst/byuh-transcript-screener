/**
 * Automated end-to-end smoke test for the packaged Windows build, run in CI
 * on a real Windows machine (GitHub Actions windows-latest) since the app
 * can't be launched or tested from the macOS dev machine this is authored
 * on. Launches the actual built .exe, drives the real upload flow through
 * Chrome DevTools Protocol (the same technique Playwright/Puppeteer use to
 * set file inputs), and asserts the AI actually reads the known contents of
 * a fixture transcript image correctly - not just that the app starts.
 *
 * Usage: node test/windows-e2e-smoke-test.js <path-to-exe>
 */

const { spawn } = require('child_process');
const path = require('path');
const WebSocket = require('ws');

const EXE_PATH = process.argv[2];
if (!EXE_PATH) {
  console.error('Usage: node windows-e2e-smoke-test.js <path-to-exe>');
  process.exit(1);
}

const FIXTURE_PDF = path.resolve(__dirname, 'fixtures', 'sample_transcript.pdf');
const DEBUG_PORT = 9333;

// Ground truth for test/fixtures/sample_transcript.pdf - keep in sync if the
// fixture image changes.
const EXPECTED_SUBJECTS = {
  Filipino: '88',
  English: '91',
  Mathematics: '85',
  Science: '90',
  'Araling Panlipunan (Social Studies)': '87',
  MAPEH: '93',
  'TLE (Technology and Livelihood Education)': '89',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDevtools(port, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`http://localhost:${port}/json`);
      if (res.ok) {
        const targets = await res.json();
        const page = targets.find((t) => t.type === 'page');
        if (page) return page;
      }
    } catch {
      // not up yet
    }
    await sleep(1000);
  }
  throw new Error(`DevTools endpoint on port ${port} did not become available in time`);
}

function cdpClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const pending = new Map();
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value ?? a.description).join(' ');
      console.log('[app console]', msg.params.type, text);
    }
  });
  const ready = new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });
  const send = (method, params) =>
    new Promise((resolve) => {
      const myId = id++;
      pending.set(myId, resolve);
      ws.send(JSON.stringify({ id: myId, method, params }));
    });
  const evaluate = async (expression, opts = {}) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, ...opts });
    if (res.result?.exceptionDetails) {
      throw new Error(`Evaluate failed: ${JSON.stringify(res.result.exceptionDetails)}`);
    }
    return res.result?.result?.value;
  };
  return { ready, send, evaluate, close: () => ws.close() };
}

async function main() {
  console.log('Launching', EXE_PATH);
  const appProcess = spawn(EXE_PATH, [`--remote-debugging-port=${DEBUG_PORT}`], {
    stdio: 'inherit',
  });

  let exitCode = 1;
  try {
    const page = await waitForDevtools(DEBUG_PORT, 60000);
    console.log('DevTools page found:', page.url);

    const client = cdpClient(page.webSocketDebuggerUrl);
    await client.ready;
    await client.send('Runtime.enable');

    // Wait for the AI reader to report ready (bundled Ollama + model starting
    // up), not just for the window to exist.
    console.log('Waiting for AI Reader to report ready...');
    const aiReadyDeadline = Date.now() + 120000;
    let aiStatus = null;
    while (Date.now() < aiReadyDeadline) {
      aiStatus = await client.evaluate(`(() => {
        const els = Array.from(document.querySelectorAll('span'));
        const el = els.find(e => e.textContent && e.textContent.includes('AI Reader'));
        return el ? el.textContent : null;
      })()`);
      if (aiStatus && aiStatus.includes('Ready')) break;
      await sleep(2000);
    }
    if (!aiStatus || !aiStatus.includes('Ready')) {
      throw new Error(`AI Reader never became ready. Last status: ${aiStatus}`);
    }
    console.log('AI Reader status:', aiStatus);

    // Select a school and grade scale to reveal the upload section.
    await client.evaluate(`(() => {
      const select = document.querySelector('select');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
      setter.call(select, 'adamson');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await sleep(500);
    await client.evaluate(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const scaleBtn = buttons.find(b => b.textContent.includes('0-100'));
      if (!scaleBtn) throw new Error('scale button not found');
      scaleBtn.click();
    })()`);
    await sleep(500);

    // Drive the real file input via CDP (the same mechanism used by
    // browser-automation tools) to trigger the actual upload handler.
    await client.send('DOM.enable');
    const doc = await client.send('DOM.getDocument');
    const qs = await client.send('DOM.querySelector', {
      nodeId: doc.result.root.nodeId,
      selector: 'input[type="file"]',
    });
    await client.send('DOM.setFileInputFiles', { files: [FIXTURE_PDF], nodeId: qs.result.nodeId });
    console.log('Fixture PDF submitted, waiting for AI extraction...');

    // Poll for the final success/error status message.
    const extractionDeadline = Date.now() + 180000;
    let statusText = null;
    while (Date.now() < extractionDeadline) {
      statusText = await client.evaluate(`(() => {
        const els = Array.from(document.querySelectorAll('div'));
        const el = els.find(e => e.textContent && (e.textContent.includes('✅') || e.textContent.includes('❌')) && e.textContent.includes('AI'));
        return el ? el.textContent : null;
      })()`);
      if (statusText) break;
      await sleep(3000);
    }
    console.log('Extraction status:', statusText);
    if (!statusText || !statusText.includes('✅')) {
      throw new Error(`Extraction did not succeed. Status: ${statusText}`);
    }

    // Read back the actual form field values and check them against the
    // known-correct contents of the fixture image.
    const values = await client.evaluate(`JSON.stringify(
      Array.from(document.querySelectorAll('input[placeholder="Subject"], input[placeholder="Grade"]')).map(i => i.value)
    )`);
    const pairs = JSON.parse(values);
    console.log('Extracted subject/grade pairs:', pairs);

    const actual = {};
    for (let i = 0; i < pairs.length; i += 2) {
      actual[pairs[i]] = pairs[i + 1];
    }

    const mismatches = [];
    for (const [subject, expectedGrade] of Object.entries(EXPECTED_SUBJECTS)) {
      if (actual[subject] !== expectedGrade) {
        mismatches.push(`${subject}: expected ${expectedGrade}, got ${actual[subject] ?? '(missing)'}`);
      }
    }

    if (mismatches.length > 0) {
      throw new Error(`Extraction accuracy mismatch:\n${mismatches.join('\n')}`);
    }

    console.log('✅ All subjects and grades extracted correctly.');
    client.close();
    exitCode = 0;
  } catch (err) {
    console.error('❌ Smoke test failed:', err.message);
    exitCode = 1;
  } finally {
    appProcess.kill('SIGKILL');
  }

  process.exit(exitCode);
}

main();
