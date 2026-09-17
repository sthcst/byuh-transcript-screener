/**
 * OLLAMA SERVICE MANAGER
 * Starts the Ollama runtime and AI vision model that ship bundled inside the
 * packaged app itself (see `extraResources` in package.json and the
 * "Download Ollama runtime" / "Pre-pull the AI vision model" steps in
 * .github/workflows/build-windows.yml, which fetch and pre-pull these at
 * build time). No network access is needed at runtime - everything the AI
 * reader needs already shipped in the installer.
 */

const { spawn, exec } = require('child_process');
const path = require('path');

const OLLAMA_EXE = path.join(process.resourcesPath, 'ollama-bin', 'ollama.exe');
const MODEL_DIR = path.join(process.resourcesPath, 'ollama-models');
const MODEL_NAME = 'qwen2.5vl:7b';

let ollamaProcess = null;

const noop = () => {};

/**
 * Check if Ollama is running
 */
// Explicitly 127.0.0.1, not "localhost" - Node's fetch can resolve
// "localhost" to the IPv6 loopback (::1) on Windows, while Ollama binds
// IPv4-only, which made this check silently and permanently fail even
// though the server (and the renderer, whose fetch resolves IPv4 first)
// was working fine.
const checkOllamaStatus = async () => {
  try {
    const response = await fetch('http://127.0.0.1:11434/api/tags', {
      method: 'GET',
      timeout: 2000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Wait for Ollama to be ready
 */
const waitForOllama = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(async () => {
      const isReady = await checkOllamaStatus();
      if (isReady) {
        clearInterval(checkInterval);
        resolve();
        return;
      }
      if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Ollama startup timeout'));
      }
    }, 500);
  });
};

/**
 * Start the bundled Ollama runtime, pointed at the bundled model directory.
 */
const startOllama = async (onProgress = noop) => {
  const isRunning = await checkOllamaStatus();
  if (isRunning) {
    return true;
  }

  onProgress({ stage: 'starting-ollama', message: '🚀 Starting AI reader...' });

  ollamaProcess = spawn(OLLAMA_EXE, ['serve'], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      OLLAMA_MODELS: MODEL_DIR,
      OLLAMA_HOST: '127.0.0.1:11434',
    },
  });
  ollamaProcess.unref();

  // A first-ever launch of a freshly-installed binary can be held up well
  // past a few seconds (e.g. Windows Defender real-time scanning), even
  // though the process itself never errors - it just doesn't bind the port
  // yet. Give it a generous window rather than failing a slow-but-healthy
  // start.
  const spawnError = new Promise((_, reject) => {
    ollamaProcess.on('error', (err) => reject(new Error(`Failed to launch Ollama: ${err.message}`)));
  });
  await Promise.race([waitForOllama(120000), spawnError]);
  return true;
};

/**
 * Stop Ollama service
 */
const stopOllama = () => {
  try {
    if (ollamaProcess) {
      ollamaProcess.kill();
      ollamaProcess = null;
    }
    exec('taskkill /IM ollama.exe /F', noop);
    return true;
  } catch (error) {
    console.error('Failed to stop Ollama:', error);
    return false;
  }
};

/**
 * Full setup - just starting the bundled runtime now that the model ships
 * pre-pulled inside the app, so this should normally take a few seconds.
 */
const setupOllama = async (onProgress = noop) => {
  try {
    await startOllama(onProgress);
    onProgress({ stage: 'ready', message: '✅ AI reader is ready.' });
    return true;
  } catch (error) {
    console.error('Ollama setup failed:', error);
    onProgress({
      stage: 'error',
      message: `⚠️ AI reader failed to start: ${error.message}. PDF grades can still be entered manually.`,
    });
    return false;
  }
};

module.exports = {
  startOllama,
  stopOllama,
  checkOllamaStatus,
  setupOllama,
  MODEL_NAME,
};
