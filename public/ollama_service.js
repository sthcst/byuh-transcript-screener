/**
 * OLLAMA SERVICE MANAGER
 * Handles installation, startup, and status checking of Ollama
 * Runs on Windows with local binaries
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');

const OLLAMA_DIR = path.join(os.homedir(), '.byuh-ollama');
const MODEL_DIR = path.join(OLLAMA_DIR, 'models');
const INSTALLER_PATH = path.join(OLLAMA_DIR, 'OllamaSetup.exe');
// GitHub's "latest/download" alias always resolves to whatever the current
// release is, so this doesn't go stale like a pinned version tag would.
const OLLAMA_DOWNLOAD_URL = 'https://github.com/ollama/ollama/releases/latest/download/OllamaSetup.exe';
// Vision-capable model - plain "llama2" (the previous model here) is text-only
// and cannot read images at all. Picked after comparing accuracy on a test
// transcript image: llava:7b hallucinated a subject and got every grade
// wrong; qwen2.5vl:7b read all subjects and grades correctly, including on a
// rotated/blurred/noisy version simulating a phone photo.
const MODEL_NAME = 'qwen2.5vl:7b';

let ollamaProcess = null;
let cachedExePath = null;

const noop = () => {};

/**
 * Ensure Ollama directory exists
 */
const ensureOllamaDir = () => {
  if (!fs.existsSync(OLLAMA_DIR)) {
    fs.mkdirSync(OLLAMA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }
};

/**
 * Find the installed ollama.exe under OLLAMA_DIR. The Windows installer's
 * exact layout under a custom /DIR isn't verifiable from this dev machine
 * (macOS), so this searches a couple of directory levels rather than
 * assuming one fixed path.
 */
const findOllamaExe = () => {
  if (cachedExePath && fs.existsSync(cachedExePath)) {
    return cachedExePath;
  }
  const candidates = [
    path.join(OLLAMA_DIR, 'ollama.exe'),
    path.join(OLLAMA_DIR, 'Ollama', 'ollama.exe'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      cachedExePath = candidate;
      return candidate;
    }
  }
  // Fall back to a shallow recursive search under OLLAMA_DIR.
  try {
    const stack = [OLLAMA_DIR];
    let depth = 0;
    while (stack.length && depth < 500) {
      depth++;
      const dir = stack.pop();
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          stack.push(full);
        } else if (entry.name.toLowerCase() === 'ollama.exe') {
          cachedExePath = full;
          return full;
        }
      }
    }
  } catch (err) {
    console.error('Error searching for ollama.exe:', err);
  }
  return null;
};

/**
 * Download the Ollama Windows installer if we don't already have it.
 */
const downloadInstaller = (onProgress) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(INSTALLER_PATH)) {
      resolve(true);
      return;
    }

    onProgress({ stage: 'downloading-ollama', message: '⬇️ Downloading Ollama (one-time setup, ~1.5GB)...' });
    const file = fs.createWriteStream(INSTALLER_PATH);

    const request = (url) => {
      https
        .get(url, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            request(response.headers.location);
            return;
          }
          if (response.statusCode !== 200) {
            file.close();
            fs.unlink(INSTALLER_PATH, noop);
            reject(new Error(`Download failed with status ${response.statusCode}`));
            return;
          }

          const total = parseInt(response.headers['content-length'], 10) || 0;
          let downloaded = 0;
          let lastReportedPercent = -1;

          response.on('data', (chunk) => {
            downloaded += chunk.length;
            if (total > 0) {
              const percent = Math.floor((downloaded / total) * 100);
              if (percent !== lastReportedPercent) {
                lastReportedPercent = percent;
                onProgress({
                  stage: 'downloading-ollama',
                  message: `⬇️ Downloading Ollama... ${percent}%`,
                  percent,
                });
              }
            }
          });

          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        })
        .on('error', (err) => {
          fs.unlink(INSTALLER_PATH, noop);
          reject(err);
        });
    };

    request(OLLAMA_DOWNLOAD_URL);
  });
};

/**
 * Run the Ollama installer silently. Ollama's Windows installer accepts
 * /DIR="..." (documented) which is an Inno Setup convention, so the standard
 * Inno Setup silent-install flags are used here. This hasn't been verified
 * against a real Windows machine - if silent install doesn't take effect for
 * some reason, the installer would show its normal UI instead of failing.
 */
const runInstaller = (onProgress) => {
  return new Promise((resolve, reject) => {
    onProgress({ stage: 'installing-ollama', message: '📦 Installing Ollama...' });

    const installerProcess = spawn(
      INSTALLER_PATH,
      ['/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART', `/DIR=${OLLAMA_DIR}`],
      { windowsHide: true }
    );

    installerProcess.on('error', reject);
    installerProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Ollama installer exited with code ${code}`));
        return;
      }
      const exePath = findOllamaExe();
      if (!exePath) {
        reject(new Error('Ollama installed but ollama.exe could not be found'));
        return;
      }
      resolve(exePath);
    });
  });
};

/**
 * Check if Ollama is running
 */
const checkOllamaStatus = async () => {
  try {
    const response = await fetch('http://localhost:11434/api/tags', {
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
    }, 1000);
  });
};

/**
 * Ensure Ollama is installed and running.
 */
const startOllama = async (onProgress = noop) => {
  ensureOllamaDir();

  const isRunning = await checkOllamaStatus();
  if (isRunning) {
    return true;
  }

  let exePath = findOllamaExe();
  if (!exePath) {
    await downloadInstaller(onProgress);
    exePath = await runInstaller(onProgress);
  }

  onProgress({ stage: 'starting-ollama', message: '🚀 Starting Ollama...' });
  ollamaProcess = spawn(exePath, ['serve'], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      OLLAMA_MODELS: MODEL_DIR,
    },
  });
  ollamaProcess.unref();

  await waitForOllama(30000);
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
 * Pull the vision model, reporting streamed download progress.
 */
const pullVisionModel = async (onProgress = noop) => {
  try {
    const isRunning = await checkOllamaStatus();
    if (!isRunning) {
      return false;
    }

    // Skip if already pulled.
    const tagsResponse = await fetch('http://localhost:11434/api/tags');
    if (tagsResponse.ok) {
      const { models } = await tagsResponse.json();
      if (models?.some((m) => m.name === MODEL_NAME)) {
        return true;
      }
    }

    onProgress({ stage: 'pulling-model', message: '📦 Downloading AI model (one-time setup, ~6GB)...' });

    const response = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: MODEL_NAME, stream: true }),
    });

    if (!response.ok || !response.body) {
      return false;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let success = false;
    let lastReportedPercent = -1;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        let evt;
        try {
          evt = JSON.parse(line);
        } catch {
          continue;
        }
        if (evt.total && evt.completed) {
          const percent = Math.floor((evt.completed / evt.total) * 100);
          if (percent !== lastReportedPercent) {
            lastReportedPercent = percent;
            onProgress({
              stage: 'pulling-model',
              message: `📦 Downloading AI model... ${percent}%`,
              percent,
            });
          }
        } else if (evt.status) {
          onProgress({ stage: 'pulling-model', message: `📦 ${evt.status}...` });
        }
        if (evt.status === 'success') {
          success = true;
        }
      }
    }

    return success;
  } catch (error) {
    console.error('Error pulling model:', error);
    return false;
  }
};

/**
 * Full setup - install, start, pull model.
 */
const setupOllama = async (onProgress = noop) => {
  try {
    await startOllama(onProgress);
    const modelReady = await pullVisionModel(onProgress);
    if (!modelReady) {
      onProgress({
        stage: 'error',
        message: '⚠️ Ollama is running but the AI model could not be downloaded. PDF grades can still be entered manually.',
      });
      return false;
    }
    onProgress({ stage: 'ready', message: '✅ AI reader is ready.' });
    return true;
  } catch (error) {
    console.error('Ollama setup failed:', error);
    onProgress({
      stage: 'error',
      message: `⚠️ AI setup failed: ${error.message}. PDF grades can still be entered manually.`,
    });
    return false;
  }
};

module.exports = {
  startOllama,
  stopOllama,
  checkOllamaStatus,
  pullVisionModel,
  setupOllama,
  OLLAMA_DIR,
  MODEL_NAME,
};
