import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	quitProgram: () => ipcRenderer.send('quit'),
	maximiseWindow: () => ipcRenderer.send('maximise'),
	minimiseWindow: () => ipcRenderer.send('minimise'),
});
