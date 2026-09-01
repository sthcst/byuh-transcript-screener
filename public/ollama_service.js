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
const OLLAMA_EXE = path.join(OLLAMA_DIR, 'ollama.exe');
const MODEL_DIR = path.join(OLLAMA_DIR, 'models');
const OLLAMA_DOWNLOAD_URL = 'https://github.com/ollama/ollama/releases/download/v0.1.14/ollama-windows-x64.exe';

let ollamaProcess = null;

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
 * Download Ollama executable if not exists
 */
const downloadOllama = () => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(OLLAMA_EXE)) {
      console.log('Ollama already downloaded');
      resolve(true);
      return;
    }

    console.log('Downloading Ollama...');
    const file = fs.createWriteStream(OLLAMA_EXE);

    https
      .get(OLLAMA_DOWNLOAD_URL, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          https.get(response.headers.location, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log('Ollama downloaded successfully');
              resolve(true);
            });
          });
        } else {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log('Ollama downloaded successfully');
            resolve(true);
          });
        }
      })
      .on('error', (err) => {
        fs.unlink(OLLAMA_EXE, () => {}); // Delete incomplete file
        console.error('Failed to download Ollama:', err);
        reject(err);
      });
  });
};

/**
 * Start Ollama service
 */
const startOllama = async () => {
  try {
    ensureOllamaDir();

    // Check if already running
    const isRunning = await checkOllamaStatus();
    if (isRunning) {
      console.log('Ollama already running');
      return true;
    }

    // Download if needed
    await downloadOllama();

    // Start Ollama process
    console.log('Starting Ollama service...');
    ollamaProcess = spawn(OLLAMA_EXE, ['serve'], {
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        OLLAMA_MODELS: MODEL_DIR,
      },
    });

    ollamaProcess.unref();

    // Wait for Ollama to be ready
    await waitForOllama(30000); // Wait up to 30 seconds

    console.log('Ollama started successfully');
    return true;
  } catch (error) {
    console.error('Failed to start Ollama:', error);
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
      try {
        const isReady = await checkOllamaStatus();
        if (isReady) {
          clearInterval(checkInterval);
          resolve();
        }
      } catch (err) {
        // Still waiting
      }

      if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Ollama startup timeout'));
      }
    }, 1000);
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
 * Stop Ollama service
 */
const stopOllama = () => {
  try {
    if (ollamaProcess) {
      ollamaProcess.kill();
      ollamaProcess = null;
    }

    // Also try to kill via taskkill
    exec('taskkill /IM ollama.exe /F', (err) => {
      if (!err) {
        console.log('Ollama stopped');
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to stop Ollama:', error);
    return false;
  }
};

/**
 * Pull Llama 2 model
 */
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

/**
 * Full setup - download, install, start, pull model
 */
const setupOllama = async () => {
  try {
    console.log('Setting up Ollama...');

    // Start service
    const started = await startOllama();
    if (!started) {
      throw new Error('Failed to start Ollama');
    }

    // Pull model
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
