import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';

import Setup, { FailedToLoad, LoadMap } from './ipc';
import './api/spots';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const PROTOCOL = 'grenaderc';
let mainWindow: BrowserWindow | null = null;

if (require('electron-squirrel-startup')) app.quit();

if (process.defaultApp) {
	if (process.argv.length >= 2)
		app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [path.resolve(process.argv[1])]);
} else app.setAsDefaultProtocolClient(PROTOCOL);

if (!app.requestSingleInstanceLock()) app.quit();
else {
	//const startupURL = process.argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));

	app.on('second-instance', (event, argv) => {
		if (!mainWindow) return;

		const url = argv.find((arg) => arg.startsWith(PROTOCOL + '://'));
		if (url) {
			const [, newUrl] = url.split(PROTOCOL + '://');
			const [executionType, ...args] = newUrl.split('/');

			switch (executionType) {
				case 'loadmap':
					if (args.length !== 1) {
						FailedToLoad(mainWindow, 'Missing map name');
						break;
					}
					LoadMap(mainWindow, args[0])
						.then(() => {
							console.log('Loaded map');
						})
						.catch((error) => FailedToLoad(mainWindow, error));
					break;
				default:
					dialog.showErrorBox('URL', 'default');
					FailedToLoad(mainWindow, 'Unknown execution type');
					break;
			}
		}

		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	});

	app.whenReady().then(() => {
		createWindow();
	});
}

function createWindow() {
	mainWindow = new BrowserWindow({
		height: 800,
		width: 1200,
		titleBarStyle: 'hidden',
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			nodeIntegration: true,
		},
	});

	ipcMain.on('quit', () => {
		app.quit();
	});

	ipcMain.on('maximise', () => {
		mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
	});

	ipcMain.on('minimise', () => {
		mainWindow.minimize();
	});

	Setup();
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
