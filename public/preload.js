const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  isElectron: true,
  onOllamaProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('ollama-setup-progress', listener);
    return () => ipcRenderer.removeListener('ollama-setup-progress', listener);
  },
});
