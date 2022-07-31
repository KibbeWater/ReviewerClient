import { contextBridge, ipcRenderer } from 'electron';

console.log('preload.js');

contextBridge.exposeInMainWorld('electronAPI', {
	quitProgram: () => {
		console.log('quitProgram');
		ipcRenderer.send('quit');
	},
});
