/**
 * OLLAMA SERVICE MANAGER
 * Handles startup and status checking of Ollama.
 * Windows uses the app-managed binary; macOS/Linux use an installed Ollama CLI.
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');
const https = require('https');

const OLLAMA_DIR = path.join(os.homedir(), '.byuh-ollama');
const WINDOWS_OLLAMA_EXE = path.join(OLLAMA_DIR, 'ollama.exe');
const MODEL_DIR = path.join(OLLAMA_DIR, 'models');
const OLLAMA_DOWNLOAD_URL = 'https://github.com/ollama/ollama/releases/download/v0.1.14/ollama-windows-x64.exe';

let ollamaProcess = null;
let startedByThisApp = false;

const ensureOllamaDir = () => {
  if (!fs.existsSync(OLLAMA_DIR)) {
    fs.mkdirSync(OLLAMA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }
};

const getOllamaExecutable = () => {
  if (process.env.OLLAMA_BINARY) {
    return process.env.OLLAMA_BINARY;
  }

  if (process.platform === 'win32') {
    return WINDOWS_OLLAMA_EXE;
  }

  if (process.platform === 'darwin') {
    const macAppBinary = '/Applications/Ollama.app/Contents/Resources/ollama';
    if (fs.existsSync(macAppBinary)) {
      return macAppBinary;
    }
  }

  return 'ollama';
};

const downloadOllama = () => {
  return new Promise((resolve, reject) => {
    if (process.platform !== 'win32') {
      resolve(true);
      return;
    }

    if (fs.existsSync(WINDOWS_OLLAMA_EXE)) {
      console.log('Ollama already downloaded');
      resolve(true);
      return;
    }

    console.log('Downloading Ollama...');
    const file = fs.createWriteStream(WINDOWS_OLLAMA_EXE);

    const finishDownload = (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Ollama downloaded successfully');
        resolve(true);
      });
    };

    https
      .get(OLLAMA_DOWNLOAD_URL, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location, finishDownload).on('error', reject);
        } else {
          finishDownload(response);
        }
      })
      .on('error', (err) => {
        fs.unlink(WINDOWS_OLLAMA_EXE, () => {});
        console.error('Failed to download Ollama:', err);
        reject(err);
      });
  });
};

const spawnOllama = (executable) => {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ['serve'], {
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        OLLAMA_MODELS: MODEL_DIR,
      },
    });

    child.once('error', reject);
    child.once('spawn', () => resolve(child));
  });
};

const startOllama = async () => {
  try {
    ensureOllamaDir();

    const isRunning = await checkOllamaStatus();
    if (isRunning) {
      console.log('Ollama already running');
      return true;
    }

    if (process.platform === 'win32') {
      await downloadOllama();
    }

    const executable = getOllamaExecutable();
    console.log(`Starting Ollama service with: ${executable}`);

    try {
      ollamaProcess = await spawnOllama(executable);
      startedByThisApp = true;
    } catch (error) {
      ollamaProcess = null;
      startedByThisApp = false;

      if (error && error.code === 'ENOENT' && process.platform !== 'win32') {
        console.warn('Ollama is not installed on this system. Continuing without local OCR/AI support.');
        return false;
      }

      console.warn('Unable to launch Ollama. Continuing without local OCR/AI support:', error.message || error);
      return false;
    }

    ollamaProcess.on('error', (error) => {
      console.warn('Ollama process error:', error.message || error);
    });
    ollamaProcess.unref();

    await waitForOllama(30000);

    console.log('Ollama started successfully');
    return true;
  } catch (error) {
    console.error('Failed to start Ollama:', error);
    return false;
  }
};

const waitForOllama = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(async () => {
      try {
        const isReady = await checkOllamaStatus();
        if (isReady) {
          clearInterval(checkInterval);
          resolve();
          return;
        }
      } catch (err) {
        // Still waiting.
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Ollama startup timeout'));
      }
    }, 1000);
  });
};

const checkOllamaStatus = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

const stopOllama = () => {
  try {
    if (ollamaProcess && startedByThisApp) {
      ollamaProcess.kill();
      ollamaProcess = null;
      startedByThisApp = false;
    }

    if (process.platform === 'win32') {
      exec('taskkill /IM ollama.exe /F', (err) => {
        if (!err) {
          console.log('Ollama stopped');
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to stop Ollama:', error);
    return false;
  }
};

const pullLlamaModel = async () => {
  try {
    const isRunning = await checkOllamaStatus();
    if (!isRunning) {
      console.log('Ollama not running, cannot pull model');
      return false;
    }

    console.log('Pulling Llama 2 model...');

    const response = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'llama2' }),
    });

    if (!response.ok) {
      console.error('Failed to pull model');
      return false;
    }

    console.log('Llama 2 model ready');
    return true;
  } catch (error) {
    console.error('Error pulling model:', error);
    return false;
  }
};

const setupOllama = async () => {
  try {
    console.log('Setting up Ollama...');

    const started = await startOllama();
    if (!started) {
      console.warn('Ollama unavailable; app will continue without local OCR/AI support.');
      return false;
    }

    const modelReady = await pullLlamaModel();
    if (!modelReady) {
      console.warn('Model not ready, but Ollama is running');
    }

    console.log('Ollama setup complete');
    return true;
  } catch (error) {
    console.error('Ollama setup failed:', error);
    return false;
  }
};

module.exports = {
  startOllama,
  stopOllama,
  checkOllamaStatus,
  pullLlamaModel,
  setupOllama,
  OLLAMA_DIR,
};
