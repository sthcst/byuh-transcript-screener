const { app, BrowserWindow } = require('electron');
const path = require('path');
const { setupOllama, stopOllama } = require('./ollama_service');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets/icon.png'),
  });

  // In production, load from bundled HTML
  const startUrl = `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  // Setup Ollama in background (non-blocking)
  setupOllama().catch(err => {
    console.warn('Ollama setup warning:', err);
    // App still works without Ollama
  });

  createWindow();
});

app.on('window-all-closed', () => {
  // Stop Ollama on app exit
  stopOllama();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle app termination
process.on('exit', () => {
  stopOllama();
});
