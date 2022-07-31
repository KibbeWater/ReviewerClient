import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	quitProgram: () => ipcRenderer.send('quit'),
});
